import { ImageResponse } from "next/og";
import { identity } from "@/content/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#0a0b0d",
          padding: "80px",
          fontFamily: "ui-monospace, 'Cascadia Code', monospace",
          position: "relative",
        }}
      >
        {/* top rule */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "48px" }}>
          {["#697180", "#9aa1ad", "#eceef2"].map((c, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, height: "1px", background: "#242933", alignSelf: "center", marginLeft: "8px" }} />
        </div>

        {/* eyebrow */}
        <div style={{ color: "#697180", fontSize: "14px", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "20px", display: "flex" }}>
          {identity.role}&nbsp;&nbsp;·&nbsp;&nbsp;{identity.location}
        </div>

        {/* name */}
        <div style={{ color: "#eceef2", fontSize: "80px", fontWeight: "600", lineHeight: 1.0, letterSpacing: "-0.02em", display: "flex" }}>
          {identity.name}
        </div>

        {/* tagline */}
        <div style={{ color: "#9aa1ad", fontSize: "20px", lineHeight: 1.55, maxWidth: "640px", marginTop: "28px", display: "flex" }}>
          Quality strategy, release ownership, and test automation — desktop, console, mobile, browser, VR.
        </div>

        {/* bottom bar */}
        <div style={{
          position: "absolute",
          bottom: "80px",
          left: "80px",
          right: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #242933",
          paddingTop: "24px",
        }}>
          <div style={{ color: "#697180", fontSize: "13px", letterSpacing: "0.12em", display: "flex" }}>
            bogdan-carcadea.ro
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["PC", "PlayStation", "Xbox", "Mobile", "VR"].map((p) => (
              <div key={p} style={{
                color: "#697180",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "1px solid #242933",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "flex",
              }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
