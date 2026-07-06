// components/pdf/PdfReportFooter.tsx
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

export default function PdfReportFooter() {
  return (
    <div
      style={{
        marginTop: 32,
        paddingTop: 14,
        borderTop: "1.5px solid #ECECF2",
        textAlign: "center",
        fontFamily: SANS,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#3B7BF6",
          textDecoration: "underline",
          marginBottom: 4,
        }}
      >
        www.merrakisolutions.com
      </div>
      <div style={{ fontSize: 9.5, color: "#9898AE" }}>
        This report is auto generated - based on provided assumptions.
      </div>
    </div>
  );
}
