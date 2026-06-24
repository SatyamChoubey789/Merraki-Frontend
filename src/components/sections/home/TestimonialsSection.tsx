"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

const DATA: {
  quote: string;
  name: string;
  company: string;
  role: string;
  image: string;
  accent: string;
  tags: string[];
}[] = [
  {
  quote:
    "Merraki Solutions is incredibly professional and reliable - the team consistently delivers high-quality work ahead of timelines. Their expertise in building powerful financial models, visually compelling pitch decks, and intuitive dashboards truly stands out.",
  name: "Anita",
  company: "Nigeria",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775508920/anita_u5ivcf.jpg",
  accent: "#2D5BE3",
  tags: [],
},
{
  quote:
    "Parag was very helpful in creating an online portfolio and enhancing my dashboards to be more visually appealing. His expertise in design and Excel made a significant impact on improving usability and presentation. I would definitely hire him again for future Excel projects.",
  name: "Omari Timmerman",
  company: "United States",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775508920/omari_wh5kah.jpg",
  accent: "#0D7A5F",
  tags: [],
},
{
  quote:
    "Throughout our work together, Parag & Khyati has been professional, reliable, and committed to delivering good-quality work. They understand the requirements quickly, complete tasks accurately, and keep the communication clear, which makes the process smooth. If you're someone who is stuck with their finances, I would strongly recommend Merraki.",
  name: "Mahender Punhani",
  company: "India",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1775508920/mahender_tfco5f.jpg",
  accent: "#0057CC",
  tags: [],
},
{
  quote:
    "I’ve worked with Khyati on multiple financial models across different industries, and the experience has been exceptional. Her approach, attention to detail, and ability to bring clarity to complex structures truly stand out. The fire and zeal she brings to every project is rare and highly commendable.",
  name: "Vajra Kulkarni",
  company: "India",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273575/vajra_zc6fp0.jpg",
  accent: "#3B7BF6",
  tags: [],
},
{
  quote:
    "Parag is always available to take on tasks with utmost sincerity and discipline. He understands requirements clearly, asks the right questions, and consistently delivers exactly what’s needed - on time and to the mark. A very dependable professional to work with.",
  name: "Andrew Han",
  company: "United States",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273575/Andrew_pv5b8m.jpg",
  accent: "#065F46",
  tags: [],
},
{
  quote:
    "I’ve worked with Merraki Solutions on budgeting and financial modeling projects, and I absolutely loved their approach. The team is structured, responsive, and deeply understands financial nuances. They make complex things feel simple and actionable.",
  name: "Roxana Gherghelescu",
  company: "Romania",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273575/Roxana_xovslo.jpg",
  accent: "#1E40AF",
  tags: [],
},
{
  quote:
    "I collaborated with the team on building Excel calculators and financial templates, and the quality of work was outstanding. Everything was clean, dynamic, and user-friendly. Merraki truly knows how to translate requirements into powerful financial tools.",
  name: "Timothy Shue",
  company: "New Zealand",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273574/Timothy_sjojem.jpg",
  accent: "#0D7A5F",
  tags: [],
},
{
  quote:
    "I’ve been working with Merraki to build financial models, and the experience has been amazing. Their way of understanding finance, structuring models, and explaining real-world applications is practical. Truly impressed with their work and depth of knowledge.",
  name: "Rayan Garg",
  company: "United States",
  role: "",
  image:
    "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273575/Rayan_tn79uh.jpg",
  accent: "#1D4ED8",
  tags: [],
},
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % DATA.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  const handleHover = (i: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIndex(i);
    }, 120);
  };

  const next = () => setIndex((i) => (i + 1) % DATA.length);
  const prev = () => setIndex((i) => (i === 0 ? DATA.length - 1 : i - 1));

  const current = DATA[index];

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        background: "#f5f7fb", // single unified surface
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: "24px",
          py: { xs: 8, md: 10 },
          px: { xs: 3, md: 6 },
          textAlign: "center",

          // soft depth instead of harsh white card
          background: "rgba(245,247,251,0.9)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(37,57,87,0.06)",
        }}
      >
        {/* TITLE */}
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: { xs: "1.8rem", md: "2.8rem" },
            mb: 1,
            color: "#253957",
          }}
        >
          Our success stories
        </Typography>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "rgba(37,57,87,0.6)",
            mb: 6,
          }}
        >
          Real leaders share how they crushed dead-end leads
        </Typography>

        {/* AVATARS */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            justifyContent: "center",
            mb: 6,
            px: 2,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {DATA.map((item, i) => (
            <Box
              key={i}
              onMouseEnter={() => handleHover(i)}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 72 : 52,
                height: i === index ? 72 : 52,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
                border:
                  i === index ? "2px solid #3B7BF6" : "2px solid transparent",
                transition: "all 0.25s ease",
                opacity: i === index ? 1 : 0.55,

                "&:hover": {
                  transform: "scale(1.08)",
                },
              }}
            >
              <img
                src={item.image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* TESTIMONIAL CARD */}
        <Box
          key={index}
          sx={{
            maxWidth: 720,
            mx: "auto",
            p: { xs: 3, md: 4 },
            borderRadius: "16px",

            // no white — soft embedded card
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(37,57,87,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",

            animation: "fadeIn 0.45s ease",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#253957" }}>
            {current.name}
          </Typography>

          <Typography sx={{ opacity: 0.6, mb: 2 }}>
            {current.company}
          </Typography>

          <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
            "{current.quote}"
          </Typography>
        </Box>

        {/* NAV */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton onClick={prev} sx={{ color: "#253957" }}>
            <ArrowBack />
          </IconButton>

          <IconButton onClick={next} sx={{ color: "#253957" }}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
