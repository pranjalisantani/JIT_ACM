import { ImageResponse } from "next/og";

export const alt = "JIT ACM — A Living Computing Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#ffffff",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            JIT ACM STUDENT CHAPTER
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "96px",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#ffffff",
            }}
          >
            JIT ACM
          </h1>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          >
            A LIVING COMPUTING COMMUNITY
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: "24px",
            fontSize: "15px",
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.4)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>COMPUTATIONAL RIGOR & RESEARCH</span>
          <span>EST. 2026</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
