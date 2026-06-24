export default function PDFPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide global navbar, footer, and any site chrome */
        header,
        footer,
        nav,
        [class*="navbar"],
        [class*="Navbar"],
        [class*="nav-"],
        [class*="footer"],
        [class*="Footer"],
        [class*="header"],
        [class*="Header"],
        [class*="layout"],
        [class*="Layout"],
        [class*="sidebar"],
        [class*="Sidebar"] {
          display: none !important;
        }

        /* Reset body so no extra padding/margin from global layout */
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          min-height: unset !important;
        }

        /* Remove any main content wrappers that add padding */
        main {
          padding: 0 !important;
          margin: 0 !important;
          min-height: unset !important;
        }
      `}</style>
      {children}
    </>
  );
}