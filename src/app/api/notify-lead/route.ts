// app/api/notify-lead/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Sends a lead notification email to the site owner whenever someone:
 *  - submits the contact form on the Founder Financial DNA test ("visit"), or
 *  - downloads their PDF report ("pdf_export").
 *
 * No database write happens here yet — this is purely a notification.
 * Swap this out / extend it later to also persist to the Go backend.
 *
 * Required env vars:
 *  - RESEND_API_KEY      → from https://resend.com (free tier is enough to start)
 *  - LEAD_NOTIFY_FROM    → a verified sender, e.g. "Merraki <leads@yourdomain.com>"
 *  - LEAD_NOTIFY_TO      → owner's inbox, e.g. "owner@yourdomain.com" (comma-separate for multiple)
 */

interface LeadPayload {
  event: "visit" | "pdf_export";
  name: string;
  email: string;
  company?: string;
  role?: string;
  // Optional — present once the test is scored (always present for pdf_export)
  personalityTitle?: string;
  totalScore?: number;
  totalMax?: number;
}

function isValidPayload(body: any): body is LeadPayload {
  return (
    body &&
    (body.event === "visit" || body.event === "pdf_export") &&
    typeof body.name === "string" &&
    body.name.trim().length > 0 &&
    typeof body.email === "string" &&
    body.email.includes("@")
  );
}

function buildEmailHtml(payload: LeadPayload): string {
  const eventLabel =
    payload.event === "pdf_export"
      ? "📄 Downloaded their PDF report"
      : "👋 Completed the contact form (new lead)";

  const scoreRow =
    payload.totalScore !== undefined && payload.totalMax !== undefined
      ? `<tr><td style="padding:6px 0;color:#5A6478;">Score</td><td style="padding:6px 0;font-weight:600;">${payload.totalScore} / ${payload.totalMax}</td></tr>`
      : "";

  const personalityRow = payload.personalityTitle
    ? `<tr><td style="padding:6px 0;color:#5A6478;">Personality</td><td style="padding:6px 0;font-weight:600;">${payload.personalityTitle}</td></tr>`
    : "";

  return `
  <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:480px;margin:0 auto;">
    <div style="background:#0D1B2E;border-radius:10px;padding:24px;margin-bottom:16px;">
      <p style="color:#A5B4FC;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px;">
        Founder Financial DNA Test
      </p>
      <p style="color:#fff;font-size:18px;font-weight:700;margin:0;">${eventLabel}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0A0A0F;">
      <tr><td style="padding:6px 0;color:#5A6478;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${payload.name}</td></tr>
      <tr><td style="padding:6px 0;color:#5A6478;">Email</td><td style="padding:6px 0;font-weight:600;">${payload.email}</td></tr>
      ${payload.company ? `<tr><td style="padding:6px 0;color:#5A6478;">Company</td><td style="padding:6px 0;font-weight:600;">${payload.company}</td></tr>` : ""}
      ${payload.role ? `<tr><td style="padding:6px 0;color:#5A6478;">Role</td><td style="padding:6px 0;font-weight:600;">${payload.role}</td></tr>` : ""}
      ${scoreRow}
      ${personalityRow}
    </table>
    <p style="color:#A0A0AE;font-size:11px;margin-top:20px;">
      Sent automatically from the Founder Financial DNA test on Merraki.
    </p>
  </div>`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Missing or invalid fields. Required: event, name, email." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFY_FROM;
  const to = process.env.LEAD_NOTIFY_TO;

  if (!apiKey || !from || !to) {
    // Fail soft — we never want a missing env var to break the user's
    // PDF download or break the contact-form flow.
    console.error(
      "[notify-lead] Missing RESEND_API_KEY / LEAD_NOTIFY_FROM / LEAD_NOTIFY_TO env vars. Skipping email send.",
    );
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const subject =
      body.event === "pdf_export"
        ? `📄 PDF downloaded — ${body.name}`
        : `🆕 New lead — ${body.name}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: body.email,
        subject,
        html: buildEmailHtml(body),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[notify-lead] Resend API error:", res.status, errText);
      // Still return ok:true to the client — a failed notification email
      // should never block the user's PDF download experience.
      return NextResponse.json({ ok: true, emailFailed: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify-lead] Unexpected error:", err);
    return NextResponse.json({ ok: true, emailFailed: true });
  }
}
