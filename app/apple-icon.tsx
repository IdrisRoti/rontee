import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon: full-bleed ink tile (iOS applies its own mask). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0e",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path
            d="M11.5 23V10.5M11.5 16c0-3.4 2.3-5.6 6-5.6"
            stroke="#fafaf7"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="22.4" cy="10.6" r="2.5" fill="#e8572a" />
        </svg>
      </div>
    ),
    size,
  );
}
