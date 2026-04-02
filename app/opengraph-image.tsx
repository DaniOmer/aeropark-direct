import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ParkAero Direct — Parking sécurisé près d'Orly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c1821 0%, #122336 50%, #0e3654 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(14, 165, 233, 0.15)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: "20px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#67e8f9",
            }}
          />
          <span style={{ color: "#a5f3fc", fontSize: "16px", fontWeight: 600 }}>
            Navette gratuite 24h/24
          </span>
        </div>

        <h1
          style={{
            color: "white",
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 16px 0",
            letterSpacing: "-1px",
          }}
        >
          ParkAero{" "}
          <span style={{ color: "#67e8f9" }}>Direct</span>
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "28px",
            lineHeight: 1.4,
            margin: "0 0 40px 0",
            maxWidth: "700px",
          }}
        >
          Parking sécurisé à 10 min d&apos;Orly. Navette gratuite incluse.
          Tarifs imbattables.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#67e8f9" }}>
              4.8
            </span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
              sur 5 — 1 450+ avis
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#67e8f9" }}>
              10 min
            </span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
              d&apos;Orly
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#67e8f9" }}>
              24/7
            </span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
              surveillance
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
