"use client";

import { Box, Typography, Button } from "@mui/material";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

const FOUNDERS = [
  {
    name: "Parag Bhutani",
    role: "Co-Founder",
    bio: (
      <>
        Calm at heart, sharp in mind - that's Parag.
        <br />
        <br />
        He brings a sense of clarity and depth to everything he works on.
        Whether it's building complex financial models or structuring
        spreadsheets, he has a natural instinct for simplifying what seems
        complicated. Outside of work, Parag finds joy in traveling, writing, and
        consciously making time for himself and his family.
      </>
    ),
    linkedIn: "https://www.linkedin.com/in/parag-bhutani-83a980198/",
    photo:
      "https://res.cloudinary.com/dalsvy7qk/image/upload/v1776930517/12._Parag_Profile_Image_ppmnnx.jpg",
  },
  {
    name: "Khyati Gupta",
    role: "Co-Founder",
    bio: (
      <>
        Impulsive in action, creative by instinct - that's Khyati.
        <br />
        <br />
        She thrives on conversations, ideas, and the energy of meeting new
        people. A naturally hardworking problem-solver, she enjoys taking
        ownership and seeing things through - especially when there's a deadline
        to chase. When she's not working, you'll find her traveling or immersed
        in a good book.
      </>
    ),
    linkedIn: "https://www.linkedin.com/in/khyati-gupta14/",
    photo:
      "https://res.cloudinary.com/dalsvy7qk/image/upload/v1773772968/khyati_pic_vbkp1u.jpg",
  },
];

const para = {
  fontFamily: SANS,
  fontSize: {
    xs: "0.92rem",
    sm: "0.98rem",
    md: "1.05rem",
  },
  lineHeight: {
    xs: 1.75,
    sm: 1.8,
    md: 1.9,
  },
  color: "#111",
  mb: {
    xs: 3,
    sm: 3.5,
    md: 4,
  },
  textAlign: "center" as const,
};

const sectionTitle = {
  textAlign: "center",
  fontFamily: SANS,
  fontWeight: 600,
  fontSize: {
    xs: "2rem",
    sm: "2.5rem",
    md: "3.5rem",
    lg: "4rem",
  },
  lineHeight: 1.15,
  color: "#000",
  mb: {
    xs: 5,
    sm: 6,
    md: 8,
  },
};

const nameStyle = {
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: {
    xs: "1.3rem",
    sm: "1.45rem",
    md: "1.6rem",
  },
  lineHeight: 1.3,
};

const roleStyle = {
  fontFamily: SANS,
  color: "#666",
  fontSize: {
    xs: "0.9rem",
    sm: "0.95rem",
    md: "1rem",
  },
  mt: 0.5,
  mb: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
};

const bioStyle = {
  fontFamily: SANS,
  fontSize: {
    xs: "0.9rem",
    sm: "0.95rem",
    md: "1rem",
  },
  lineHeight: {
    xs: 1.7,
    sm: 1.75,
    md: 1.8,
  },
  color: "#222",
  width: "100%",
  maxWidth: 420,
  mx: "auto",
  mb: {
    xs: 3,
    sm: 3.5,
    md: 4,
  },
};

const buttonStyle = {
  background: "#253957",
  color: "#fff",
  textTransform: "none",
  fontFamily: SANS,
  fontSize: {
    xs: "0.85rem",
    sm: "0.9rem",
    md: "0.95rem",
  },
  px: {
    xs: 3,
    sm: 3.5,
    md: 4,
  },
  py: {
    xs: 1,
    sm: 1.1,
    md: 1.2,
  },
  minWidth: 110,
  borderRadius: "4px",
  "&:hover": {
    background: "#1e2f47",
  },
};

export function AboutPageClient() {
  return (
    <Box
      sx={{
        background: "#f5f7fb",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ================= HERO ================= */}
      <Box
        sx={{
          width: "100%",
          pt: {
            xs: 0,
            sm: 1,
            md: 2,
          },
          pb: {
            xs: 1,
            sm: 2,
            md: 4,
          },
          px: {
            xs: 0.75,
            sm: 1.5,
            md: 2,
            lg: 3,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1600px",
            mx: "auto",

            // More reliable than vh on mobile browsers.
            height: {
              xs: "clamp(420px, 72svh, 620px)",
              sm: "clamp(500px, 75svh, 700px)",
              md: "clamp(580px, 82svh, 820px)",
              lg: "clamp(650px, 84svh, 900px)",
            },

            minHeight: {
              xs: 420,
              sm: 500,
              md: 580,
            },

            borderRadius: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            overflow: "hidden",
            boxShadow: {
              xs: "0 10px 30px rgba(0,0,0,0.07)",
              md: "0 20px 60px rgba(0,0,0,0.08)",
            },

            display: "flex",
            alignItems: "center",
          }}
        >
          {/* HERO IMAGE */}
          <Box
            component="img"
            src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/about_gmkbxe.png"
            alt="Merraki"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: {
                xs: "center center",
                sm: "center center",
                md: "center center",
              },
            }}
          />

          {/* OVERLAY */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: {
                xs: `
                  linear-gradient(
                    180deg,
                    rgba(37,57,87,0.05) 0%,
                    rgba(37,57,87,0.25) 45%,
                    rgba(37,57,87,0.78) 100%
                  )
                `,
                md: `
                  linear-gradient(
                    270deg,
                    rgba(37,57,87,0.7) 0%,
                    rgba(37,57,87,0.35) 40%,
                    rgba(37,57,87,0.05) 100%
                  )
                `,
              },
            }}
          />

          {/* HERO CONTENT */}
          <Box
            sx={{
              position: "absolute",
              bottom: {
                xs: 24,
                sm: 32,
                md: 52,
                lg: 64,
              },
              right: {
                xs: 16,
                sm: 24,
                md: 48,
                lg: 64,
              },
              left: {
                xs: 16,
                sm: "auto",
              },

              zIndex: 2,

              display: "flex",
              flexDirection: "column",
              alignItems: {
                xs: "center",
                sm: "flex-end",
              },

              width: {
                xs: "calc(100% - 32px)",
                sm: "auto",
              },

              maxWidth: {
                xs: "100%",
                sm: 430,
                md: 480,
                lg: 520,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "3.2rem",
                  lg: "3.5rem",
                },
                lineHeight: {
                  xs: 1.15,
                  md: 1.15,
                },
                color: "#fff",
                textAlign: {
                  xs: "center",
                  sm: "right",
                },
                mb: {
                  xs: 1.5,
                  sm: 1.75,
                  md: 2,
                },

                // Prevent text from becoming too large
                // on very wide screens.
                maxWidth: "100%",

                "& span": {
                  fontWeight: 700,
                },
              }}
            >
              Hi, We&apos;re <span>Merraki</span>
            </Typography>

            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.9rem",
                  md: "1.02rem",
                  lg: "1.05rem",
                },
                color: "rgba(255,255,255,0.94)",
                lineHeight: {
                  xs: 1.6,
                  sm: 1.65,
                  md: 1.7,
                },
                textAlign: "center",
                width: "100%",
              }}
            >
              &lsquo;Meraki&rsquo; means{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                doing something with soul
              </Box>
              <br />
              And we bring that same intent to your
              <br />
              finances — helping you make better
              <br />
              decisions and stay in control.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= STORY ================= */}
      <Box
        sx={{
          py: {
            xs: 6,
            sm: 8,
            md: 11,
            lg: 13,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          textAlign: "center",
          background: "#f5f7fb",
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: {
              xs: "2rem",
              sm: "2.6rem",
              md: "3.5rem",
              lg: "4rem",
            },
            lineHeight: 1.15,
            color: "#000",
            mb: {
              xs: 4,
              sm: 5,
              md: 6,
            },
            letterSpacing: "-0.01em",
          }}
        >
          Our Story
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: {
              xs: "100%",
              sm: 680,
              md: 780,
              lg: 820,
            },
            mx: "auto",
          }}
        >
          <Typography sx={para}>
            Merraki didn&apos;t begin in a boardroom. It began in conversations.
            <br />
            Parag and Khyati met as colleagues and they were opposites in the
            best way. Parag: calm, innovative, and visionary. Khyati: impulsive,
            creative, with a mischievous spark.
          </Typography>

          <Typography sx={para}>
            Until one day, in the middle of a conversation, something clicked.
            Their ideas matched, and for the first time, instead of overthinking
            every possibility, they jumped into it. Post-office hours turned
            into brainstorming sessions. A table at McDonald&apos;s became their
            unofficial office filling Google Docs and making pitches.
          </Typography>

          <Typography sx={para}>
            That&apos;s where Merraki bloomed. The name comes from doing
            something with soul, creativity, or love and that&apos;s exactly how
            they approach every cell in a spreadsheet and every slide in a deck.
          </Typography>

          <Typography sx={para}>
            Here to help founders make sense of their numbers. Let&apos;s
            connect.
          </Typography>
        </Box>
      </Box>

      {/* ================= FOUNDERS ================= */}
      <Box
        sx={{
          py: {
            xs: 6,
            sm: 8,
            md: 11,
            lg: 13,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
          width: "100%",
        }}
      >
        <Typography sx={sectionTitle}>Our Leadership</Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: "1100px",
            mx: "auto",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },

            columnGap: {
              md: 5,
              lg: 8,
            },

            rowGap: {
              xs: 7,
              sm: 8,
              md: 6,
            },
          }}
        >
          {FOUNDERS.map((f, i) => (
            <Box
              key={i}
              sx={{
                textAlign: "center",
                width: "100%",
                minWidth: 0,
                px: {
                  xs: 0,
                  sm: 2,
                  md: 1,
                },
              }}
            >
              <Box
                component="img"
                src={f.photo}
                alt={f.name}
                sx={{
                  width: {
                    xs: 90,
                    sm: 105,
                    md: 120,
                  },
                  height: {
                    xs: 90,
                    sm: 105,
                    md: 120,
                  },
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                  mx: "auto",
                  mb: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },
                }}
              />

              <Typography sx={nameStyle}>{f.name}</Typography>

              <Typography sx={roleStyle}>{f.role}</Typography>

              <Typography sx={bioStyle}>{f.bio}</Typography>

              <Button
                href={f.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                sx={buttonStyle}
              >
                LinkedIn
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default AboutPageClient;
