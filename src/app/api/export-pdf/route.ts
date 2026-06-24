import { NextRequest, NextResponse } from "next/server";

function getLocalChromePath(): string {
  const { platform } = process;

  if (platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  if (platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  return "/usr/bin/google-chrome";
}

export async function POST(req: NextRequest) {
  try {
    const { calculatorSlug, result, companyName } = await req.json();

    const puppeteer = (await import("puppeteer-core")).default;

    const isDev = process.env.NODE_ENV === "development";

    let browser;

    if (isDev) {
      browser = await puppeteer.launch({
        executablePath: getLocalChromePath(),
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    } else {
      const chromium = (await import("@sparticuz/chromium-min")).default;

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar",
        ),
        headless: true,
      });
    }

    const page = await browser.newPage();

    await page.setViewport({
      width: 1400,
      height: 900,
    });

    await page.evaluateOnNewDocument(
      (data: any) => {
        (window as any).__PDF_DATA__ = data;
      },
      {
        result,
        companyName,
      },
    );

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    await page.goto(`${baseUrl}/pdf-preview/${calculatorSlug}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector(".pdf-header", {
      timeout: 10000,
    });
    try {
      await page.waitForSelector(".recharts-surface", {
        timeout: 8000,
      });
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 800));

    const contentHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });

    await page.setViewport({
      width: 1400,
      height: contentHeight,
    });

    // Generate PDF
    const pdfUint8 = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdfUint8);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${calculatorSlug}-${companyName
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
      },
      {
        status: 500,
      },
    );
  }
}
