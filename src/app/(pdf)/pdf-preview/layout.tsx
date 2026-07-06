/**
 * app/pdf-preview/layout.tsx
 *
 * Bare layout for all /pdf-preview/* pages.
 * Puppeteer captures these — no navbar, footer, chatbot, or any global UI.
 */

export default function PdfPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#ffffff" }}>
        {children}
      </body>
    </html>
  );
}