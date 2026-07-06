/**
 * app/api/export-pdf/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

const PREVIEW_PATHS: Record<string, string> = {
  breakeven: "/pdf-preview/breakeven",
  valuation: "/pdf-preview/valuation",
  margins: "/pdf-preview/margins",
  runway: "/pdf-preview/runway",
};

export async function POST(req: NextRequest) {
  let body: { calculatorSlug: string; result: unknown; companyName: string };

  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const { calculatorSlug, result, companyName } = body;

  if (!calculatorSlug || !PREVIEW_PATHS[calculatorSlug]) {
    return new NextResponse(`Unknown calculator slug: ${calculatorSlug}`, {
      status: 400,
    });
  }

  if (!result) {
    return new NextResponse("No result data provided", { status: 400 });
  }

  // PDF_PREVIEW_BASE_URL must always point to the local dev/prod server
  // so Puppeteer can reach the /pdf-preview/* pages internally.
  // NEVER use NEXT_PUBLIC_APP_URL here — that points to the public domain
  // which won't have the preview pages until they are deployed.
  const baseUrl =
    process.env.PDF_PREVIEW_BASE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  const resultB64 = Buffer.from(JSON.stringify(result)).toString("base64");
  const companyEncoded = encodeURIComponent(companyName.trim());
  const ts = Date.now();

  const previewUrl = `${baseUrl}${PREVIEW_PATHS[calculatorSlug]}?company=${companyEncoded}&ts=${ts}&data=${resultB64}`;

  console.log("[export-pdf] Opening:", previewUrl.slice(0, 120) + "…");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1024, // wider canvas for real 2-column layouts
      height: 1448, // A4 height at 96dpi
      deviceScaleFactor: 1.5, // crisp after zoom-out
    });

    await page.emulateMediaType("screen");
    // Capture console messages from the preview page to help debug
    page.on("console", (msg) =>
      console.log("[preview-page]", msg.type(), msg.text()),
    );
    page.on("pageerror", (err) =>
      console.error(
        "[preview-page] JS error:",
        err instanceof Error ? err.message : String(err),
      ),
    );

    const response = await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });

    console.log("[export-pdf] Page status:", response?.status());
    console.log("[export-pdf] Page URL:", page.url());
    console.log("[export-pdf] Page title:", await page.title());

    // Log the page HTML so we can see what actually rendered
    const bodyText = await page.evaluate(
      () => document.body?.innerText?.slice(0, 300) ?? "(empty body)",
    );
    console.log("[export-pdf] Body preview:", bodyText);

    // Check if sentinel was already set by SSR/early render
    const alreadyHydrated = await page.evaluate(
      () => document.documentElement.dataset.hydrated === "true",
    );
    console.log("[export-pdf] Already hydrated:", alreadyHydrated);

    if (!alreadyHydrated) {
      console.log("[export-pdf] Waiting for hydration sentinel…");
      try {
        await page.waitForFunction(
          () => document.documentElement.dataset.hydrated === "true",
          { timeout: 15_000 },
        );
        console.log("[export-pdf] Sentinel detected.");
      } catch (sentinelErr) {
        // Sentinel never fired — log DOM state and fall back to a small delay
        const html = await page.evaluate(() =>
          document.documentElement.outerHTML.slice(0, 600),
        );
        console.error(
          "[export-pdf] Sentinel timeout. DOM snapshot:",
          html,
          sentinelErr,
        );
        console.log("[export-pdf] Falling back to 3s delay…");
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    // Inject CSS to hide global site UI (navbar, footer, chatbot)
    // This works regardless of layout structure — Puppeteer hides them before capture.
    await page.addStyleTag({
      content: `
        /* Hide site navbar */
        header,
        nav,
        [class*="navbar"],
        [class*="Navbar"],
        [class*="nav-"],
        [class*="Nav"],
        [class*="header"],
        [class*="Header"],
        [data-testid="navbar"],
        [data-testid="header"] { display: none !important; }

        /* Hide site footer */
        footer,
        [class*="footer"],
        [class*="Footer"],
        [data-testid="footer"] { display: none !important; }

        /* Hide chatbot / live chat widgets */
        [id*="chat"],
        [class*="chat"],
        [class*="Chat"],
        [id*="crisp"],
        [class*="crisp"],
        [id*="intercom"],
        [class*="intercom"],
        [id*="tawk"],
        [class*="tawk"],
        [id*="tidio"],
        [class*="tidio"],
        [class*="widget"],
        [class*="Widget"],
        iframe[src*="chat"],
        iframe[src*="widget"] { display: none !important; }

        /* Hide newsletter / subscribe sections */
        [class*="newsletter"],
        [class*="Newsletter"],
        [class*="subscribe"],
        [class*="Subscribe"] { display: none !important; }

        /* Remove top padding added for fixed navbar */
        body > *:first-child { padding-top: 0 !important; margin-top: 0 !important; }
      `,
    });

    await page.evaluate(() => {
      document.querySelector("[data-nextjs-toast], nextjs-portal")?.remove();
    });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      scale: 0.85, // zoom out to fit more content on page
      margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
    });

    const pdf = Buffer.from(pdfUint8);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${calculatorSlug}-report.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(
      "[export-pdf] Puppeteer error:",
      err instanceof Error ? err.message : String(err),
    );
    return new NextResponse("PDF generation failed", { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
