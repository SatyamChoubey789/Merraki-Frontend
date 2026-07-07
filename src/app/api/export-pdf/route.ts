/**
 * app/api/export-pdf/route.ts
 *
 * Vercel deployment notes:
 * - Uses puppeteer-core + @sparticuz/chromium in production (Vercel's
 *   filesystem/runtime can't handle full `puppeteer`'s bundled Chromium).
 * - Falls back to full `puppeteer` for local dev, so you don't need the
 *   sparticuz binary during development.
 * - Must run on the Node.js runtime (not Edge) and needs a longer timeout
 *   than the platform default — see `maxDuration` export below and the
 *   accompanying vercel.json.
 */

import { NextRequest, NextResponse } from "next/server";
import type { Browser } from "puppeteer-core";

export const runtime = "nodejs";
// Vercel's default function timeout (10s on Hobby) is too short for a full
// page render + PDF capture. Raise it; note the platform ceiling is 60s on
// Pro (unless you're on Fluid Compute), so tune this to your plan.
export const maxDuration = 60;

const PREVIEW_PATHS: Record<string, string> = {
  breakeven: "/pdf-preview/breakeven",
  valuation: "/pdf-preview/valuation",
  margins: "/pdf-preview/margins",
  runway: "/pdf-preview/runway",
};

// Keep this in sync with the viewport passed to page.setViewport() below.
const VIEWPORT = { width: 1240, height: 1754, deviceScaleFactor: 2 };

async function launchBrowser(): Promise<Browser> {
  // VERCEL is automatically set to "1" in Vercel's build/runtime environment,
  // including preview deployments — use it to branch, not NODE_ENV, since
  // NODE_ENV is "production" for local production builds too.
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = await import("puppeteer-core");

    // As of @sparticuz/chromium v121+, `defaultViewport` and a boolean
    // `headless` are no longer exposed on the module — args must be merged
    // via puppeteer's own defaultArgs(), headless is the literal "shell",
    // and viewport is supplied directly rather than read off chromium.
    return puppeteerCore.launch({
      args: await puppeteerCore.defaultArgs({ args: chromium.args, headless: "shell" }),
      defaultViewport: VIEWPORT,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    }) as unknown as Browser;
  }

  // Local dev: use full puppeteer (already downloads its own Chromium).
  const puppeteer = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    defaultViewport: VIEWPORT,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  }) as unknown as Browser;
}

function resolveBaseUrl(req: NextRequest): string {
  if (process.env.VERCEL) {
    // Derive the URL from the incoming request's own host so Puppeteer
    // always hits the SAME deployment (production or a specific preview)
    // that is currently handling this request. Don't use
    // NEXT_PUBLIC_APP_URL here: on a preview deployment it would point at
    // production instead of the preview's own /pdf-preview/* routes.
    const host = req.headers.get("host") ?? process.env.VERCEL_URL;
    if (!host) {
      throw new Error("Unable to resolve request host on Vercel");
    }
    return `https://${host}`;
  }

  return `https://www.merrakisolutions.com`;
}

export async function POST(req: NextRequest) {
  let body: { calculatorSlug: string; result: unknown; companyName?: string };

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

  const baseUrl = resolveBaseUrl(req);

  const resultB64 = Buffer.from(JSON.stringify(result)).toString("base64");
  const companyEncoded = encodeURIComponent((companyName ?? "").trim());
  const ts = Date.now();

  const previewUrl = `${baseUrl}${PREVIEW_PATHS[calculatorSlug]}?company=${companyEncoded}&ts=${ts}&data=${resultB64}`;

  console.log("[export-pdf] Opening:", previewUrl.slice(0, 120) + "…");

  let browser: Browser | undefined;
  try {
    browser = await launchBrowser();

    const page = await browser.newPage();
    // Redundant with `defaultViewport` at launch, but harmless and keeps
    // this explicit in case launch options change.
    await page.setViewport(VIEWPORT);

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

    const bodyText = await page.evaluate(
      () => document.body?.innerText?.slice(0, 300) ?? "(empty body)",
    );
    console.log("[export-pdf] Body preview:", bodyText);

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

    await page.addStyleTag({
      content: `
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

        footer,
        [class*="footer"],
        [class*="Footer"],
        [data-testid="footer"] { display: none !important; }

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

        [class*="newsletter"],
        [class*="Newsletter"],
        [class*="subscribe"],
        [class*="Subscribe"] { display: none !important; }

        body > *:first-child { padding-top: 0 !important; margin-top: 0 !important; }
      `,
    });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
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