"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

// SVG viewBox: 0 0 2000 857
// Convert lat/lng to SVG x/y percentage using equirectangular projection
// tuned to match the simplemaps world SVG
function latLngToPercent(lat: number, lng: number): { x: number; y: number } {
  // X: lng -180..180 → 0..100%
  const x = ((lng + 180) / 360) * 100;
  // Y: lat 90..-90 → 0..100% (Mercator approximation, tuned for simplemaps)
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const mercMax = Math.log(Math.tan(Math.PI / 4 + (85 * Math.PI) / 180 / 2));
  const y = ((mercMax - mercN) / (2 * mercMax)) * 100;
  return { x, y };
}

interface Country {
  name: string;
  lat: number;
  lng: number;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: "India",                  lat: 20.5937,  lng: 78.9629,   flag: "🇮🇳" },
  { name: "UAE",                    lat: 23.4241,  lng: 53.8478,   flag: "🇦🇪" },
  { name: "Australia",              lat: -25.2744, lng: 133.7751,  flag: "🇦🇺" },
  { name: "New Zealand",            lat: -40.9006, lng: 174.886,   flag: "🇳🇿" },
  { name: "Oman",                   lat: 21.4735,  lng: 55.9754,   flag: "🇴🇲" },
  { name: "Romania",                lat: 45.9432,  lng: 24.9668,   flag: "🇷🇴" },
  { name: "United States",          lat: 37.0902,  lng: -95.7129,  flag: "🇺🇸" },
  { name: "Madagascar",             lat: -18.7669, lng: 46.8691,   flag: "🇲🇬" },
  { name: "Nigeria",                lat: 9.082,    lng: 8.6753,    flag: "🇳🇬" },
  { name: "Canada",                 lat: 56.1304,  lng: -106.3468, flag: "🇨🇦" },
  { name: "Mexico",                 lat: 23.6345,  lng: -102.5528, flag: "🇲🇽" },
  { name: "Germany",                lat: 51.1657,  lng: 10.4515,   flag: "🇩🇪" },
  { name: "France",                 lat: 46.2276,  lng: 2.2137,    flag: "🇫🇷" },
  { name: "Ireland",                lat: 53.4129,  lng: -8.2439,   flag: "🇮🇪" },
  { name: "Indonesia",              lat: -0.7893,  lng: 113.9213,  flag: "🇮🇩" },
  { name: "Denmark",                lat: 56.2639,  lng: 9.5018,    flag: "🇩🇰" },
  { name: "Ukraine",                lat: 48.3794,  lng: 31.1656,   flag: "🇺🇦" },
  { name: "United Kingdom",         lat: 55.3781,  lng: -3.436,    flag: "🇬🇧" },
];

function Pin({ country, index }: { country: Country; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { x, y } = latLngToPercent(country.lat, country.lng);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -100%)",
        zIndex: hovered ? 20 : 10,
        cursor: "pointer",
        // stagger entrance animation
        animation: `pinDrop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "5px 10px",
            whiteSpace: "nowrap",
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            color: "#253957",
            boxShadow: "0 4px 16px rgba(37,57,87,0.14)",
            pointerEvents: "none",
          }}
        >
          {country.flag} {country.name}
          {/* Arrow */}
          <div style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
            height: 8,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderTop: "none",
            borderLeft: "none",
          }} />
        </div>
      )}

      {/* Pin body */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Flag bubble */}
        <div
          style={{
            width: hovered ? 36 : 28,
            height: hovered ? 36 : 28,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: hovered ? "#253957" : "#fff",
            border: `2px solid #253957`,
            boxShadow: hovered
              ? "0 6px 20px rgba(37,57,87,0.35)"
              : "0 2px 8px rgba(37,57,87,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <span
            style={{
              transform: "rotate(45deg)",
              fontSize: hovered ? 16 : 13,
              lineHeight: 1,
              transition: "font-size 0.2s ease",
            }}
          >
            {country.flag}
          </span>
        </div>
        {/* Pin tip */}
        <div
          style={{
            width: 2,
            height: hovered ? 10 : 7,
            background: "#253957",
            borderRadius: 1,
            marginTop: -1,
            transition: "height 0.2s ease",
          }}
        />
        {/* Dot shadow */}
        <div
          style={{
            width: hovered ? 8 : 6,
            height: 3,
            borderRadius: "50%",
            background: "rgba(37,57,87,0.25)",
            marginTop: 1,
            transition: "all 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function GlobalTrustSection() {
  return (
    <>
      <style>{`
        @keyframes pinDrop {
          from { opacity: 0; transform: translate(-50%, -140%) scale(0.6); }
          to   { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        }
      `}</style>

      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 10 },
          px: 3,
          textAlign: "center",
          background: "#F5F7FB",
          overflow: "hidden",
        }}
      >
        {/* Heading */}
        <Typography
          component="h2"
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            color: "#253957",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            fontSize: { xs: "2rem", sm: "2.75rem", md: "4rem", lg: "5rem" },
          }}
        >
          Trusted by founders across the globe
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            mt: 2,
            color: "#253957",
            opacity: 0.85,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: { xs: "1rem", md: "1.35rem" },
          }}
        >
          Merraki has helped 300+ founders with their financial decisions
        </Typography>

        <Box sx={{ height: { xs: 32, md: 48 } }} />

        {/* Map + Pins */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: 700, sm: 850, md: 900, lg: 1100 },
            }}
          >
            {/* World map image */}
            <Image
              src="/world-map.svg"
              alt="Global Founder Network"
              width={2000}
              height={857}
              priority
              draggable={false}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />

            {/* Pin overlay — positioned absolutely over the map */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                "& > *": { pointerEvents: "all" },
              }}
            >
              {COUNTRIES.map((country, i) => (
                <Pin key={country.name} country={country} index={i} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Country pill list below map */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mt: 5,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {COUNTRIES.map((c) => (
            <Box
              key={c.name}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: "12px",
                py: "5px",
                borderRadius: "999px",
                background: "#fff",
                border: "1px solid rgba(37,57,87,0.12)",
                fontFamily: SANS,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#253957",
                boxShadow: "0 1px 4px rgba(37,57,87,0.07)",
              }}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}