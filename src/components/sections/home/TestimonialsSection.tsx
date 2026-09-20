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

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % DATA.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const handleHover = (i: number) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    hoverTimeout.current = setTimeout(() => {
      setIndex(i);
    }, 120);
  };

  const next = () => {
    setIndex((i) => (i + 1) % DATA.length);
  };

  const prev = () => {
    setIndex((i) =>
      i === 0 ? DATA.length - 1 : i - 1,
    );
  };

  const current = DATA[index];

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        width: "100%",
        overflow: "hidden",

        py: {
          xs: 6,
          sm: 8,
          md: 10,
          lg: 12,
        },

        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },

        background: "#f5f7fb",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",

          boxSizing: "border-box",

          borderRadius: {
            xs: "16px",
            sm: "20px",
            md: "24px",
          },

          py: {
            xs: 5,
            sm: 7,
            md: 9,
            lg: 10,
          },

          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
            lg: 6,
          },

          textAlign: "center",

          background:
            "rgba(245,247,251,0.9)",

          backdropFilter: "blur(6px)",

          border:
            "1px solid rgba(37,57,87,0.06)",

          /*
           * Prevent content from creating horizontal overflow.
           */
          overflow: "hidden",
        }}
      >
        {/* ================= TITLE ================= */}

        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,

            fontSize: {
              xs: "1.45rem",
              sm: "1.8rem",
              md: "2.35rem",
              lg: "2.8rem",
            },

            lineHeight: {
              xs: 1.3,
              sm: 1.3,
              md: 1.25,
            },

            mb: {
              xs: 1.25,
              sm: 1.5,
              md: 1,
            },

            color: "#253957",

            width: "100%",

            maxWidth: {
              xs: "330px",
              sm: "560px",
              md: "800px",
              lg: "900px",
            },

            mx: "auto",
          }}
        >
          What clients say after working with Merraki Solutions
        </Typography>

        {/* ================= SUBTITLE ================= */}

        <Typography
          sx={{
            fontFamily: SANS,

            fontSize: {
              xs: "0.78rem",
              sm: "0.84rem",
              md: "0.9rem",
            },

            lineHeight: 1.5,

            color: "rgba(37,57,87,0.6)",

            mb: {
              xs: 4,
              sm: 5,
              md: 6,
            },

            px: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          Real leaders share how they crushed dead-end leads
        </Typography>

        {/* ================= AVATARS ================= */}

        <Box
          sx={{
            width: "100%",

            display: "flex",

            gap: {
              xs: 1.25,
              sm: 1.5,
              md: 2,
            },

            /*
             * Important:
             * Mobile gets horizontal scrolling rather
             * than trying to squeeze all 8 avatars.
             */
            overflowX: {
              xs: "auto",
              sm: "auto",
              md: "visible",
            },

            justifyContent: {
              xs: "flex-start",
              sm: "center",
              md: "center",
            },

            mb: {
              xs: 4,
              sm: 5,
              md: 6,
            },

            px: {
              xs: 1,
              sm: 2,
              md: 0,
            },

            pb: {
              xs: 1,
              sm: 1,
              md: 0,
            },

            scrollSnapType: {
              xs: "x proximity",
              sm: "x proximity",
              md: "none",
            },

            WebkitOverflowScrolling: "touch",

            "&::-webkit-scrollbar": {
              display: "none",
            },

            scrollbarWidth: "none",
          }}
        >
          {DATA.map((item, i) => (
            <Box
              key={i}
              onMouseEnter={() => handleHover(i)}
              onClick={() => setIndex(i)}
              role="button"
              tabIndex={0}
              aria-label={`View testimonial from ${item.name}`}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  setIndex(i);
                }
              }}
              sx={{
                width: {
                  xs: i === index ? 58 : 46,
                  sm: i === index ? 66 : 50,
                  md: i === index ? 72 : 52,
                },

                height: {
                  xs: i === index ? 58 : 46,
                  sm: i === index ? 66 : 50,
                  md: i === index ? 72 : 52,
                },

                borderRadius: "50%",

                overflow: "hidden",

                flexShrink: 0,

                cursor: "pointer",

                scrollSnapAlign: "center",

                border:
                  i === index
                    ? {
                        xs: "2px solid #3B7BF6",
                        md: "2px solid #3B7BF6",
                      }
                    : "2px solid transparent",

                transition:
                  "width 0.25s ease, height 0.25s ease, transform 0.25s ease, opacity 0.25s ease",

                opacity:
                  i === index ? 1 : 0.55,

                outline: "none",

                "&:hover": {
                  transform:
                    "scale(1.08)",
                  opacity: 1,
                },

                "&:focus-visible": {
                  boxShadow:
                    "0 0 0 3px rgba(59,123,246,0.3)",
                },
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* ================= TESTIMONIAL ================= */}

        <Box
          key={index}
          sx={{
            width: "100%",

            maxWidth: {
              xs: "100%",
              sm: 620,
              md: 720,
              lg: 760,
            },

            mx: "auto",

            /*
             * Give the card comfortable padding
             * without letting it become cramped.
             */
            p: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },

            boxSizing: "border-box",

            borderRadius: {
              xs: "12px",
              sm: "14px",
              md: "16px",
            },

            background:
              "rgba(255,255,255,0.55)",

            border:
              "1px solid rgba(37,57,87,0.08)",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)",

            animation:
              "fadeIn 0.45s ease",

            /*
             * Prevent very long testimonial text
             * from becoming too wide.
             */
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {/* NAME */}

          <Typography
            sx={{
              fontFamily: SANS,

              fontWeight: 600,

              fontSize: {
                xs: "0.95rem",
                sm: "1rem",
                md: "1.05rem",
              },

              lineHeight: 1.4,

              color: "#253957",
            }}
          >
            {current.name}
          </Typography>

          {/* COUNTRY */}

          <Typography
            sx={{
              fontFamily: SANS,

              fontSize: {
                xs: "0.78rem",
                sm: "0.82rem",
                md: "0.85rem",
              },

              lineHeight: 1.5,

              opacity: 0.6,

              mb: {
                xs: 1.75,
                sm: 2,
                md: 2,
              },
            }}
          >
            {current.company}
          </Typography>

          {/* QUOTE */}

          <Typography
            sx={{
              fontFamily: SANS,

              fontSize: {
                xs: "0.88rem",
                sm: "0.92rem",
                md: "0.95rem",
              },

              lineHeight: {
                xs: 1.65,
                sm: 1.7,
                md: 1.7,
              },

              color: "#253957",

              maxWidth: "100%",

              mx: "auto",
            }}
          >
            "{current.quote}"
          </Typography>
        </Box>

        {/* ================= NAVIGATION ================= */}

        <Box
          sx={{
            mt: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          }}
        >
          <IconButton
            onClick={prev}
            aria-label="Previous testimonial"
            sx={{
              color: "#253957",

              width: {
                xs: 42,
                sm: 46,
                md: 48,
              },

              height: {
                xs: 42,
                sm: 46,
                md: 48,
              },

              "&:hover": {
                background:
                  "rgba(37,57,87,0.08)",
              },

              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <ArrowBack
              sx={{
                fontSize: {
                  xs: 19,
                  sm: 21,
                  md: 22,
                },
              }}
            />
          </IconButton>

          <IconButton
            onClick={next}
            aria-label="Next testimonial"
            sx={{
              color: "#253957",

              width: {
                xs: 42,
                sm: 46,
                md: 48,
              },

              height: {
                xs: 42,
                sm: 46,
                md: 48,
              },

              "&:hover": {
                background:
                  "rgba(37,57,87,0.08)",
              },

              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <ArrowForward
              sx={{
                fontSize: {
                  xs: 19,
                  sm: 21,
                  md: 22,
                },
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* ================= ANIMATION ================= */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default TestimonialsSection;
