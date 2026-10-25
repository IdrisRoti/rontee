import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card: warm paper, dot grid, two-tone headline, one ember dot. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f7f2e8",
          backgroundImage: "radial-gradient(circle at center, #e3d9c5 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          color: "#1e1b16",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#1e1b16" />
            <path
              d="M11.5 23V10.5M11.5 16c0-3.4 2.3-5.6 6-5.6"
              stroke="#fffdf8"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx="22.4" cy="10.6" r="2.5" fill="#e8573a" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.05em" }}>rontee</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: "-0.05em", color: "#a69d8f" }}>
            Never forget
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", fontSize: 104, lineHeight: 1.05, letterSpacing: "-0.05em" }}>
            what matters
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: "#e8573a",
                marginLeft: 10,
                marginBottom: 18,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b6358" }}>
          <div>Birthdays · Renewals · Subscriptions · Deadlines</div>
          <div>{new URL(site.url).host}</div>
        </div>
      </div>
    ),
    size,
  );
}
