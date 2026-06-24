"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box } from "@mui/material";
import * as topojson from "topojson-client";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

type Location = {
  name: string;
  coords: [number, number];
};

const COUNTRY_LOCATIONS: Location[] = [
  { name: "India", coords: [78, 22] },
  { name: "UAE", coords: [54, 24] },
  { name: "New Zealand", coords: [174, -41] },
  { name: "Oman", coords: [57, 21] },
  { name: "Romania", coords: [25, 45] },
  { name: "Madagascar", coords: [47, -20] },
  { name: "Nigeria", coords: [8, 9] },
  { name: "Canada", coords: [-106, 56] },
  { name: "Mexico", coords: [-102, 23] },
  { name: "Germany", coords: [10, 51] },
  { name: "France", coords: [2, 46] },
  { name: "Ireland", coords: [-8, 53] },
  { name: "Denmark", coords: [10, 56] },
  { name: "Ukraine", coords: [31, 49] },
];

const CITY_LOCATIONS: Location[] = [
  { name: "Sydney", coords: [151, -33] },
  { name: "Dubai", coords: [55, 25] },
  { name: "London", coords: [-0.1, 51.5] },
  { name: "Bali", coords: [115, -8] },
  { name: "Delaware", coords: [-75, 39] },
  { name: "Florida", coords: [-81, 27] },
  { name: "California", coords: [-119, 36] },
  { name: "New York", coords: [-74, 40] },
];

const ALL_LOCATIONS = [...COUNTRY_LOCATIONS, ...CITY_LOCATIONS];

const HIGHLIGHTED_COUNTRY_IDS = new Set([
  "356", // India
  "784", // UAE
  "554", // New Zealand
  "512", // Oman
  "642", // Romania
  "450", // Madagascar
  "566", // Nigeria
  "124", // Canada
  "484", // Mexico
  "276", // Germany
  "250", // France
  "372", // Ireland
  "208", // Denmark
  "804", // Ukraine
]);

export default function GlobalMap() {
  const globeRef = useRef<HTMLDivElement | null>(null);
  const globeInstanceRef = useRef<any>(null);
  // Track if user is interacting — resume auto-rotate after idle
  const interactingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    const container = globeRef.current;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const GlobeConstructor = require("globe.gl").default ?? require("globe.gl");
    const globe = new GlobeConstructor(container) as any;
    globe
      .width(container.clientWidth)
      .height(container.clientHeight)
      .globeImageUrl(null)
      .backgroundColor("rgba(0,0,0,0)")
      .globeMaterial(
        new THREE.MeshPhongMaterial({
          color: "#000000", // pure black
          emissive: "#000000", // no emissive glow
          emissiveIntensity: 0,
          shininess: 0, // no shine
          specular: new THREE.Color("#000000"), // no specular highlight
        }),
      );

    globeInstanceRef.current = globe;

    // Subtle deep-blue atmosphere
    globe.atmosphereColor("#000000");
    globe.atmosphereAltitude(0);
    globe.showGraticules(true);

    // ── Lighting ──────────────────────────────────────────────
    const scene = globe.scene();

    // Remove default lights and add cinematic ones
    scene.children
      .filter((c: any) => c.isLight)
      .forEach((l: any) => scene.remove(l));

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.08); // very dim
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#ffffff", 0.15); // barely visible
    sunLight.position.set(200, 100, 200);
    scene.add(sunLight);
    // ── Controls ──────────────────────────────────────────────
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.enableZoom = false; // no zoom
      controls.enablePan = false; // no pan
      controls.enableRotate = true; // allow drag-rotate
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.6;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.8;

      // Pause auto-rotate while dragging, resume after 2s idle
      const resumeAutoRotate = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          controls.autoRotate = true;
          interactingRef.current = false;
        }, 2000);
      };

      controls.addEventListener("start", () => {
        interactingRef.current = true;
        controls.autoRotate = false;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      });

      controls.addEventListener("end", resumeAutoRotate);
    }

    // ── Block wheel from zooming / hijacking page scroll ──────
    const canvasEl = container.querySelector("canvas");
    const blockWheel = (e: WheelEvent) => {
      // Only block when user is actively interacting with the globe
      if (interactingRef.current) e.stopPropagation();
    };
    if (canvasEl) {
      canvasEl.addEventListener("wheel", blockWheel as EventListener, {
        passive: true,
      });
    }

    // ── Responsive resize ─────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      globe.width(container.clientWidth).height(container.clientHeight);
    });
    resizeObserver.observe(container);

    // ── Country polygons ──────────────────────────────────────
    fetch("https://unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((data: any) => {
        const countries = (
          topojson.feature(
            data,
            data.objects.countries,
          ) as unknown as FeatureCollection<Geometry, GeoJsonProperties>
        ).features;

        const isHighlighted = (feat: any) =>
          HIGHLIGHTED_COUNTRY_IDS.has(
            feat.id?.toString().padStart(3, "0") ?? "",
          );

        globe
          .polygonsData(countries)
          .polygonCapColor(
            (feat: any) =>
              isHighlighted(feat)
                ? "rgba(120, 160, 255, 0.20)"
                : "rgba(255,255,255,0.08)", // was 0.03
          )
          .polygonSideColor(() => "rgba(0,0,0,0)")
          .polygonStrokeColor(
            (feat: any) =>
              isHighlighted(feat)
                ? "rgba(180, 210, 255, 0.95)"
                : "rgba(255,255,255,0.6)", // was 0.25
          )
          .polygonAltitude(
            (feat: any) => (isHighlighted(feat) ? 0.012 : 0.003), // was 0.001 — too flat to see edges
          );
      });

    // ── Points ────────────────────────────────────────────────
    const allPoints = ALL_LOCATIONS.map((loc) => ({
      lat: loc.coords[1],
      lng: loc.coords[0],
      name: loc.name,
    }));

    globe
      .pointsData(allPoints)
      .pointColor(() => "#93c5fd")
      .pointAltitude(0.03)
      .pointRadius(0.3)
      .pointsMerge(false)
      .onPointHover(null);

    // ── Rings (cities only) ───────────────────────────────────
    const cityPoints = CITY_LOCATIONS.map((loc) => ({
      lat: loc.coords[1],
      lng: loc.coords[0],
      name: loc.name,
    }));

    globe
      .ringsData(cityPoints)
      .ringColor(() => (t: number) => `rgba(147,197,253,${1 - t})`)
      .ringMaxRadius(2.5)
      .ringPropagationSpeed(1.2)
      .ringRepeatPeriod(900);

    // ── Labels ────────────────────────────────────────────────
    globe
      .labelsData(allPoints)
      .labelText((d: any) => d.name)
      .labelSize(1.2)
      .labelColor(() => "rgba(219,234,254,0.92)")
      .labelDotRadius(0.25)
      .labelDotOrientation(() => "bottom")
      .labelAltitude(0.032)
      .labelResolution(3);

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      resizeObserver.disconnect();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (canvasEl) {
        canvasEl.removeEventListener("wheel", blockWheel as EventListener);
      }
      document.body.style.cursor = "default";
      globeInstanceRef.current = null;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "78vh",
        overflow: "hidden",
        background: "transparent", // no background at all
        "& canvas": {
          pointerEvents: "auto",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
        },
      }}
    >
      <div ref={globeRef} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
