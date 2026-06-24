"use client";

import { Box, Typography, Button } from "@mui/material";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const SERIF = `"Georgia","Times New Roman",serif`;

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
  fontSize: { xs: "1rem", md: "1.05rem" },
  lineHeight: 1.9,
  color: "#111",
  mb: 4,
  textAlign: "center" as const,
};

export function AboutPageClient() {
  return (
    <Box sx={{ background: "#f5f7fb" }}>
      {/* ================= HERO ================= */}
      <Box sx={{ pt: 0, pb: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            position: "relative",
            height: { xs: "75vh", md: "85vh" },
            maxWidth: "1400px",
            mx: "auto",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/about_gmkbxe.png"
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(270deg, rgba(37,57,87,0.7) 0%, rgba(37,57,87,0.35) 40%, rgba(37,57,87,0.05) 100%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 40, md: 64 },
              right: { xs: 24, md: 56 },
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              maxWidth: { xs: "90%", md: 480 },
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: { xs: "2.2rem", md: "3.5rem" },
                color: "#fff",
                lineHeight: 1.15,
                textAlign: "right",
                mb: 2,
                "& span": { fontWeight: 700 },
              }}
            >
              Hi, We&apos;re <span>Merraki</span>
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.7,
                textAlign: "center",
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
          py: { xs: 8, md: 12 },
          px: 3,
          textAlign: "center",
          background: "#f5f7fb",
        }}
      >
        {/* "Our Story" — serif, regular weight, matching screenshot */}
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: { xs: "2.8rem", md: "4rem" },
            color: "#000",
            mb: 6,
            letterSpacing: "-0.01em",
          }}
        >
          Our Story
        </Typography>

        <Box sx={{ maxWidth: "780px", mx: "auto" }}>
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
      <Box sx={{ py: { xs: 8, md: 12 }, px: 3 }}>
        <Typography sx={sectionTitle}>Our Leadership</Typography>

        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 8, md: 6 },
          }}
        >
          {FOUNDERS.map((f, i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={f.photo}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  mx: "auto",
                  mb: 3,
                }}
              />
              <Typography sx={nameStyle}>{f.name}</Typography>
              <Typography sx={roleStyle}>{f.role}</Typography>
              <Typography sx={bioStyle}>{f.bio}</Typography>
              <Button href={f.linkedIn} target="_blank" sx={buttonStyle}>
                LinkedIn
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* STYLES */
const sectionTitle = {
  textAlign: "center",
  fontFamily: SANS,
  fontWeight: 600,
  fontSize: { xs: "2.2rem", md: "3.5rem" },
  color: "#000",
  mb: 8,
};

const nameStyle = {
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: "1.6rem",
};

const roleStyle = {
  fontFamily: SANS,
  color: "#666",
  mb: 3,
};

const bioStyle = {
  fontFamily: SANS,
  fontSize: "1rem",
  lineHeight: 1.8,
  color: "#222",
  maxWidth: 420,
  mx: "auto",
  mb: 4,
};

const buttonStyle = {
  background: "#253957",
  color: "#fff",
  textTransform: "none",
  px: 4,
  py: 1.2,
  borderRadius: "4px",
  "&:hover": { background: "#1e2f47" },
};

export default AboutPageClient;
