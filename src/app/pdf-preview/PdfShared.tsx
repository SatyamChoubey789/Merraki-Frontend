"use client";

export function formatDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date());
}

export function fmtINR(n: number) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

export function fmtV(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

interface PDFHeaderProps {
  title: string;
  company: string;
  accent: string;
}

export function PDFHeader({ title, company, accent }: PDFHeaderProps) {
  return (
    <div className="pdf-header">
      <div className="pdf-header-title" style={{ color: accent }}>
        {title}
      </div>
      <div className="pdf-header-right">
        <div className="pdf-header-date">{formatDate()}</div>
        <div className="pdf-header-company">{company}</div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  accent: string;
  highlight?: boolean;
}

export function PDFMetricCard({ label, value, accent, highlight }: MetricCardProps) {
  return (
    <div className="pdf-metric-card">
      <div className="pdf-metric-label">{label}</div>
      <div
        className={`pdf-metric-value ${highlight ? "highlight" : ""}`}
        style={highlight ? { color: accent } : {}}
      >
        {value}
      </div>
    </div>
  );
}

export function PDFFooter() {
  return (
    <div className="pdf-footer">
      <div className="pdf-footer-site">www.merrakisolutions.com</div>
      <div className="pdf-footer-disclaimer">
        This report is auto generated – based on provided assumptions.
      </div>
    </div>
  );
}