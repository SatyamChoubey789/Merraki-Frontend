"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

import {
  CheckCircle,
  Cancel,
  Phone,
  Description,
  Bookmark,
  BarChart,
} from "@mui/icons-material";

/* ── Font tokens ───────────────────────────────────────── */
const SANS = `"DM Sans", system-ui, sans-serif`;
const SERIF = `"Cormorant Garamond", "Georgia", serif`;

const SECTION_WIDTH = "1240px";

/* ── Inject Google Fonts once ───────────────────────────── */
function GoogleFonts() {
  useEffect(() => {
    const id = "merraki-gfonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

export default function PricingPage() {
  return (
    <Box sx={{ background: "#F5F7FB", fontFamily: SANS }}>
      <GoogleFonts />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <Box
        sx={{
          maxWidth: SECTION_WIDTH,
          mx: "auto",
          pt: { xs: "90px", md: "120px" },
          pb: { xs: "60px", md: "80px" },
          px: { xs: 3, md: 5 },
          textAlign: "center",
        }}
      >
        {/* BADGE */}
        <Typography
          sx={{
            fontFamily: SANS,
            border: "2px solid rgba(37,57,87,0.65)",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 1,
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#31476f",
            mb: 4,
          }}
        >
          WHAT YOU GET WITH EACH PLAN
        </Typography>

        {/* TITLE */}
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: { xs: "3rem", md: "4.8rem" },
            lineHeight: 1.02,
            fontWeight: 300,
            letterSpacing: "-3px",
            color: "#253957",
            maxWidth: "1100px",
            mx: "auto",
          }}
        >
          Everything you need.{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            Exactly when you need it.
          </Box>
        </Typography>

        {/* SUBTEXT */}
        <Typography
          sx={{
            fontFamily: SANS,
            mt: 2.5,
            fontSize: "1.08rem",
            color: "#2f2f2f",
          }}
        >
          From clarity to control to complete financial strategy — choose your
          level.
        </Typography>
      </Box>

      {/* ═══════════════════════ PRICING CARDS ═══════════════════════ */}
      <Box
        sx={{
          maxWidth: SECTION_WIDTH,
          mx: "auto",
          px: { xs: 3, md: 5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: "30px",
          alignItems: "end",
        }}
      >
        <PricingCard
          title="Launch Control"
          subtitle="for founders who want clarity on their numbers"
          features={[
            {
              title: "Clarity & Setup",
              items: [
                "Clean financial system setup",
                "Structured expense tracking",
                "Organized revenue tracking",
              ],
            },
            {
              title: "Monthly Visibility",
              items: [
                "Simple P&L + cash summary",
                "Basic dashboard",
                "Key metrics overview",
              ],
            },
            {
              title: "Cash Awareness",
              items: ["Expense tracking", "Runway visibility"],
            },
            { title: "Support", items: ["One monthly call"] },
          ]}
        />

        <PricingCard
          dark
          popular
          title="Growth Engine"
          subtitle="for growing businesses that need control, not just reports"
          features={[
            {
              title: "Deeper Insights",
              items: ["MIS insights", "Cost tracking", "Revenue analysis"],
            },
            {
              title: "Financial Control",
              items: [
                "Cash flow planning",
                "Receivables tracking",
                "Payment planning",
              ],
            },
            {
              title: "Planning & Tracking",
              items: ["Budget creation", "Tracking", "Variance analysis"],
            },
            { title: "Support", items: ["Two strategy calls/month"] },
          ]}
        />

        <PricingCard
          lightBlue
          title="CFO Partner"
          subtitle="for founders who need a financial brain inside their business."
          features={[
            {
              title: "Financial Strategy",
              items: [
                "3–5 year projections",
                "Scenario modelling",
                "Expansion strategy",
              ],
            },
            {
              title: "Fundraising Support",
              items: ["Investor models", "Valuation support"],
            },
            {
              title: "Advanced Metrics",
              items: ["Unit economics", "KPIs tracking"],
            },
            { title: "Support", items: ["Weekly strategy calls"] },
          ]}
        />
      </Box>

      {/* ═══════════════════════ CUSTOM PLAN ═══════════════════════ */}
      <Box
        sx={{
          maxWidth: SECTION_WIDTH,
          mx: "auto",
          textAlign: "center",
          py: { xs: "90px", md: "120px" },
          px: { xs: 3, md: 5 },
        }}
      >
        <Typography
          sx={{ fontFamily: SANS, fontSize: "2rem", color: "#111", mb: 1 }}
        >
          These doesn't suit you?
        </Typography>

        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: { xs: "3.2rem", md: "4.4rem" },
            lineHeight: 1.02,
            letterSpacing: "-2px",
            color: "#111",
            mb: 5,
          }}
        >
          Customize your plan
        </Typography>

        <Button
          component={Link}
          href="/book-consultation"
          sx={{
            fontFamily: SANS,
            background: "#31476f",
            color: "#fff",
            px: 5,
            py: 2,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": { background: "#253957" },
          }}
        >
          Book a Free Call
        </Button>
      </Box>

      {/* ═══════════════════════ COMPARISON TABLE ═══════════════════════ */}
      <Box
        sx={{
          maxWidth: SECTION_WIDTH,
          mx: "auto",
          px: { xs: 3, md: 5 },
          pb: "120px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
            pb: 2,
            borderBottom: "1px solid rgba(37,57,87,0.25)",
          }}
        >
          {["Feature", "Launch Control", "Growth Engine", "CFO Partner"].map(
            (h) => (
              <Typography
                key={h}
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#253957",
                }}
              >
                {h}
              </Typography>
            ),
          )}
        </Box>

        {/* Rows */}
        {comparisonRows.map((row, idx) => (
          <Box
            key={idx}
            sx={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
              py: 3,
              borderBottom: "1px solid rgba(37,57,87,0.08)",
            }}
          >
            <Typography
              sx={{ fontFamily: SANS, fontSize: "1rem", color: "#2f2f2f" }}
            >
              {row.feature}
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "1rem", color: "#2f2f2f" }}
            >
              {renderCell(row.launch)}
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "1rem", color: "#2f2f2f" }}
            >
              {renderCell(row.growth)}
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "1rem", color: "#2f2f2f" }}
            >
              {renderCell(row.cfo)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ═══════════════════════ HOW WE WORK ═══════════════════════ */}
      <Box
        sx={{
          background: "#F5F7FB",
          pt: { xs: "90px", md: "120px" },
          pb: { xs: "90px", md: "130px" },
          overflow: "hidden",
        }}
      >
        <Box sx={{ maxWidth: SECTION_WIDTH, mx: "auto", px: { xs: 3, md: 5 } }}>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: SANS,
              fontSize: { xs: "3.8rem", md: "5.8rem" },
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-3px",
              color: "#253957",
              mb: { xs: 8, md: 12 },
            }}
          >
            How We Work
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                lg: "repeat(4,1fr)",
              },
              gap: { xs: 8, md: 6 },
              alignItems: "start",
            }}
          >
            <WorkCard
              number="01."
              title="Onboarding"
              icon={<Phone sx={{ color: "#fff", fontSize: 42 }} />}
              text="We understand your needs, workload, and goals - no obligation, just a quick chat."
            />
            <WorkCard
              number="02."
              title="Data Collection"
              icon={<Description sx={{ color: "#fff", fontSize: 42 }} />}
              text="Based on your inputs, we organize your numbers into a clean, reliable financial system."
            />
            <WorkCard
              number="03."
              title="Deliver Insights"
              icon={<Bookmark sx={{ color: "#fff", fontSize: 50 }} />}
              text="We provide clear reports, insights and dashboards every month."
            />
            <WorkCard
              number="04."
              title="Guide Growth"
              icon={<BarChart sx={{ color: "#fff", fontSize: 42 }} />}
              text="We work alongside you to refine strategy, optimize performance, and scale with confidence."
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ═══════════════════════ PRICING CARD ═══════════════════════ */
function PricingCard({
  title,
  subtitle,
  features,
  dark,
  lightBlue,
  popular,
}: any) {
  return (
    <Box
      sx={{
        background: dark
          ? "linear-gradient(180deg, #4d5d7d 0%, #7e859c 100%)"
          : lightBlue
            ? "#d9e4ee"
            : "#d9d9df",
        borderRadius: "12px",
        border: dark
          ? "1px solid rgba(0,0,0,0.45)"
          : "1px solid rgba(0,0,0,0.18)",
        height: dark ? "650px" : "615px",
        transform: dark ? "translateY(-18px)" : "translateY(0)",
        px: "24px",
        pt: popular ? "76px" : "42px",
        pb: dark ? "88px" : "74px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Popular badge */}
      {popular && (
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#31476f",
            borderRadius: "999px",
            px: 3,
            py: 0.8,
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: SANS,
            whiteSpace: "nowrap",
          }}
        >
          ★ POPULAR
        </Box>
      )}

      {/* Title */}
      <Typography
        sx={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: "30px",
          lineHeight: 1,
          letterSpacing: "-1px",
          textAlign: "center",
          color: dark ? "#fff" : "#111",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontFamily: SANS,
          textAlign: "center",
          fontSize: "15px",
          lineHeight: 1.3,
          color: dark ? "#fff" : "#111",
          maxWidth: "240px",
          mx: "auto",
          mb: "20px",
        }}
      >
        {subtitle}
      </Typography>

      {/* Divider */}
      <Box
        sx={{
          height: "4px",
          background: dark ? "rgba(255,255,255,0.95)" : "#253957",
          mb: "20px",
        }}
      />

      {/* Features */}
      {features.map((f: any, idx: number) => (
        <Box key={idx} sx={{ mb: 2.2 }}>
          <Typography
            sx={{
              fontFamily: SANS,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "15px",
              fontWeight: 700,
              color: dark ? "#fff" : "#111",
              mb: "6px",
            }}
          >
            <CheckCircle sx={{ fontSize: 16, color: dark ? "#fff" : "#000" }} />
            {f.title}
          </Typography>

          <Box sx={{ pl: 4 }}>
            {f.items.map((item: string, i: number) => (
              <Typography
                key={i}
                sx={{
                  fontFamily: SANS,
                  fontSize: "13.5px",
                  lineHeight: 1.25,
                  color: dark ? "rgba(255,255,255,0.96)" : "#2f2f2f",
                }}
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}

      {/* CTA button */}
      <Button
        component={Link}
        href="/book-consultation"
        sx={{
          fontFamily: SANS,
          position: "absolute",
          left: "24px",
          right: "24px",
          bottom: "20px",
          height: "54px",
          borderRadius: "10px",
          background: dark
            ? "linear-gradient(180deg,#ffffff 0%, #bfc5d3 100%)"
            : "linear-gradient(90deg,#31476f 0%, #7c849b 100%)",
          color: dark ? "#253957" : "#fff",
          textTransform: "none",
          fontSize: "18px",
          fontWeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "24px",
        }}
      >
        Get Started
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: dark ? "#2f456d" : "#fff",
            color: dark ? "#fff" : "#7c849b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "34px",
            lineHeight: 0,
          }}
        >
          ›
        </Box>
      </Button>
    </Box>
  );
}

/* ═══════════════════════ WORK CARD ═══════════════════════ */
function WorkCard({ number, title, icon, text }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "2rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "#111",
          mb: 2,
        }}
      >
        {number}
      </Typography>

      <Typography
        sx={{
          fontFamily: SERIF,
          fontSize: { xs: "2rem", md: "2.35rem" },
          lineHeight: 1,
          fontWeight: 700,
          color: "#111",
          mb: 4,
          minHeight: "50px",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "240px",
          height: "136px",
          background: "#253957",
          clipPath: "polygon(0 0, 86% 0, 100% 50%, 86% 100%, 0 100%, 14% 50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontFamily: SERIF,
          fontSize: "1.05rem",
          lineHeight: 1.55,
          color: "#111",
          maxWidth: "260px",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

/* ═══════════════════════ HELPERS & DATA ═══════════════════════ */
function renderCell(value: string) {
  if (value === "yes") return <CheckCircle sx={{ color: "#18b26b" }} />;
  if (value === "no") return <Cancel sx={{ color: "#ef5b2a" }} />;
  return value;
}

const comparisonRows = [
  {
    feature: "Financial Reports",
    launch: "Basic",
    growth: "Detailed + Insights",
    cfo: "Advanced",
  },
  {
    feature: "Cash Flow",
    launch: "Awareness",
    growth: "Forecasting",
    cfo: "Weekly Control",
  },
  { feature: "Budgeting", launch: "no", growth: "yes", cfo: "yes" },
  { feature: "Strategy", launch: "no", growth: "Light", cfo: "Deep" },
  { feature: "Calls", launch: "1/month", growth: "2/month", cfo: "Weekly" },
  { feature: "Decision Support", launch: "no", growth: "Limited", cfo: "Full" },
];
