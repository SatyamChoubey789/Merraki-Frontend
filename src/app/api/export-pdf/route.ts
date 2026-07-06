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

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
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
      width: 1240,
      height: 1754,
      deviceScaleFactor: 1.5,
    });

    // Capture console messages from the preview page to help debug
    page.on("console", (msg) =>
      console.log("[preview-page]", msg.type(), msg.text()),
    );
    page.on("pageerror", (err: unknown) =>
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

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "16mm", bottom: "20mm", left: "16mm" },
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
