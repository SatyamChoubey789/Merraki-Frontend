"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const T = {
  bg: "#f5f7fb",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  inkFaint: "rgba(37,57,87,0.1)",
  border: "rgba(37,57,87,0.1)",
  surface: "#ffffff",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";

const SERVICES = [
  {
    num: "01",
    title: "Fractional CFO",
    href: "/VirtualCFO",
    desc: "Looking for strategic financial leadership without the cost of a full-time hire? Our Fractional CFO services give you access to experienced financial expertise to guide your business decisions, improve cash flow, and plan sustainable growth. From budgeting and forecasting to fundraising support and financial strategy, we act as your on-demand CFO - helping you stay investor-ready and financially sharp. Think of us as your finance partner in the room, every time a big decision is made.",
    tags: ["Strategy", "Growth", "Advisory"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502177/consult_ydfp2n.jpg",
  },
  {
    num: "02",
    title: "Financial Modelling",
    href: "/Financial-Modelling",
    desc: "Our financial modelling services help you turn ideas into structured, investor-ready numbers that actually make sense. We build dynamic 3-statement financial models that cover revenue projections, cost structures, cash flow planning, and scenario analysis—so you can plan growth, raise funding, and make confident decisions. Whether you’re a startup or scaling business, we create models that are simple to use, yet powerful enough to support real-world strategy. Because guessing your future is risky - modelling it isn’t.",
    tags: ["Financial Models", "Forecasting", "Planning"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502177/valuation_b3ygxj.jpg",
  },
  {
    num: "03",
    title: "Valuation",
    href: "/valuation",
    desc: "Not sure what your business is really worth? Our business valuation services provide accurate, data-driven insights to help you understand your company’s true value. Using methods like DCF analysis, comparable company benchmarking, and startup-focused valuation approaches, we deliver realistic and investor-aligned valuation ranges. Whether you’re raising funds, negotiating a deal, or planning your next move, we ensure your valuation is not just impressive - but believable. Because the right number doesn’t just look good—it closes deals.",
    tags: ["DCF", "Valuation", "Fundraising"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502177/valuation_b3ygxj.jpg",
  },
  {
    num: "04",
    title: "Pitch Decks",
    href: "/PitchDeck",
    desc: "We create investor-ready pitch decks that go beyond design - they tell a compelling story that gets attention and drives action. From structuring your narrative to presenting financials and traction clearly, our pitch deck services are built to resonate with investors and communicate your vision effectively. Whether you’re preparing for fundraising or refining your story, we make sure every slide works towards one goal: getting you funded. Because great ideas deserve great storytelling.",
    tags: ["Fundraising", "Storytelling", "Investor Ready"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502177/pitch_yn3wam.jpg",
  },
  {
    num: "05",
    title: "Data Analysis",
    href: "/DataAnalysis",
    desc: "Turn your raw data into meaningful insights with our data analysis and visualization services. We help businesses track performance, identify trends, and make smarter decisions through clear dashboards, reports, and KPI frameworks. Whether it’s sales data, financial metrics, or operational performance, we simplify complex datasets into actionable insights you can actually use. Because data is only powerful when you understand it.",
    tags: ["Analytics", "Dashboards", "Insights"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502177/data_ghlvfb.jpg",
  },
  {
    num: "06",
    title: "Templates & Calculators",
    href: "/TemplatesCalculators",
    desc: "Save time and make faster decisions with our financial templates and calculators, designed for simplicity and accuracy. From pricing models and breakeven analysis to financial planning tools, our plug-and-play resources help you get instant clarity without building everything from scratch. Perfect for founders, operators, and teams who need reliable tools - quickly. Because sometimes, the smartest solution is the simplest one.",
    tags: ["Templates", "Calculators", "Tools"],
    img: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775502176/t_c_dyxssr.jpg",
  },
];

export default function ServicesPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const rowObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            rowObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 },
    );

    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      row.style.opacity = "0";
      row.style.transform = "translateY(32px)";
      row.style.transition = `opacity 0.6s ${i * 0.07}s, transform 0.7s ${SPRING}`;
      rowObs.observe(row);
    });

    return () => rowObs.disconnect();
  }, []);

  const toggleRow = (i: number) => {
    setOpenIdx((prev) => (prev === i ? null : i));
  };

  return (
    <Box sx={{ background: T.bg, fontFamily: SANS }}>
      {/* HERO */}
      <Box
        sx={{
          pt: 0,
          pb: { xs: 2, md: 4 },
          px: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: { xs: "75vh", md: "85vh" },
            maxWidth: "1400px",
            mx: "auto",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          {/* IMAGE */}
          <Box
            component="img"
            src="/service.svg"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* OVERLAY — darker on right where text sits */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(270deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.02) 100%)",
            }}
          />

          {/* TEXT — top right */}
          <Box
            className="hero-text"
            sx={{
              position: "absolute",
              top: { xs: 32, md: 52 },
              right: { xs: 24, md: 56 },
              zIndex: 2,
              textAlign: "right",
              maxWidth: { xs: "80%", md: 560 },
            }}
          >
            {/* Line 1: "Stuck in your finances?" — mixed weight */}
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: { xs: "1.9rem", md: "3rem" },
                lineHeight: 1.15,
                color: "#fff",
                display: "block",
                mb: 0,
              }}
            >
              Stuck in your{" "}
              <Box component="span" sx={{ fontWeight: 800 }}>
                finances?
              </Box>
            </Typography>

            {/* Line 2: fully bold */}
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "1.9rem", md: "3rem" },
                lineHeight: 1.2,
                color: "#fff",
                display: "block",
              }}
            >
              We&apos;re here to save you!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* SERVICES */}
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          {SERVICES.map((s, i) => {
            const open = openIdx === i;

            return (
              <Box
                key={s.title}
                ref={(el) => {
                  rowRefs.current[i] = el as HTMLDivElement | null;
                }}
                sx={{
                  borderBottom: `1px solid ${T.border}`,
                  py: 3,
                }}
              >
                <Box onClick={() => toggleRow(i)} sx={{ cursor: "pointer" }}>
                  <Typography sx={{ fontWeight: 700 }}>{s.title}</Typography>
                </Box>

                {open && (
                  <Box sx={{ mt: 2 }}>
                    <Typography>{s.desc}</Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Container>
      </Box>
    </Box>
  );
}
