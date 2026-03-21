import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const CONVEX_URL = process.env.VITE_CONVEX_URL;

const FALLBACK = {
  name: "Francisco Catarro",
  title: "Guitar | Keys | Musical Direction | Production",
};

// Font URLs from Google Fonts
const FONTS = {
  syne: "https://fonts.gstatic.com/s/syne/v24/8vIS7w4qzmVxsWxjBZRjr0FKM_3fvj6k.ttf",
  dmSerif: "https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFhOHM81r4j6k0gjAW3mujVU2B2G_Vx1w.ttf",
  instrumentSerif: "https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf",
};

async function fetchConvexData() {
  if (!CONVEX_URL) return { name: FALLBACK.name, title: FALLBACK.title, photoUrl: null, ogStyle: null };

  try {
    const query = async (path, args = {}) => {
      const res = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, args, format: "json" }),
      });
      if (!res.ok) throw new Error(`Convex query failed: ${res.status}`);
      const data = await res.json();
      return data.value;
    };

    const [bio, settings] = await Promise.all([
      query("bio:get"),
      query("settings:get"),
    ]);

    return {
      name: bio?.name ?? FALLBACK.name,
      title: settings?.heroSubtitle ?? bio?.title ?? FALLBACK.title,
      photoUrl: bio?.profilePhotoUrl ?? null,
      ogStyle: settings?.ogStyle ?? null,
    };
  } catch {
    return { name: FALLBACK.name, title: FALLBACK.title, photoUrl: null, ogStyle: null };
  }
}

function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

// ── Layout builders ──────────────────────────────────────────

function buildElectric(firstName, lastName, title, photoUrl, fontName) {
  // Brutalist: full-bleed name, photo small in corner, red accent bar
  return h("div", { style: { width: "100%", height: "100%", display: "flex", backgroundColor: "#0c0c14", position: "relative", overflow: "hidden" } },
    // Red accent bar left edge
    h("div", { style: { position: "absolute", top: 0, left: 0, width: "6px", height: "100%", backgroundColor: "#dc2828", display: "flex" } }),
    // Huge name
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", padding: "50px 80px 50px 60px", width: "100%", height: "100%" } },
      h("span", { style: { fontFamily: fontName, fontWeight: 700, fontSize: "96px", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.9 } }, firstName),
      h("span", { style: { fontFamily: fontName, fontWeight: 700, fontSize: "96px", color: "#dc2828", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.9 } }, lastName),
      h("div", { style: { display: "flex", alignItems: "center", gap: "16px", marginTop: "28px" } },
        h("div", { style: { width: "40px", height: "2px", backgroundColor: "#dc2828", display: "flex" } }),
        h("span", { style: { fontSize: "18px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase" } }, title),
      ),
    ),
    // Photo in bottom-right
    photoUrl
      ? h("div", { style: { position: "absolute", bottom: "40px", right: "60px", width: "160px", height: "160px", borderRadius: "0", border: "2px solid #dc2828", overflow: "hidden", display: "flex" } },
          h("img", { src: photoUrl, width: 160, height: 160, style: { objectFit: "cover", width: "100%", height: "100%" } }),
        )
      : null,
    // URL
    h("div", { style: { position: "absolute", top: "40px", right: "60px", display: "flex", fontSize: "13px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" } }, "franciscocatarro.com"),
  );
}

function buildAnalog(firstName, lastName, title, photoUrl, fontName) {
  // Warm split layout: big photo left, text right, cream background, offset shadow
  return h("div", { style: { width: "100%", height: "100%", display: "flex", backgroundColor: "#ede4d3", position: "relative", overflow: "hidden" } },
    // Photo left half
    photoUrl
      ? h("div", { style: { width: "420px", height: "100%", flexShrink: 0, display: "flex", position: "relative" } },
          h("img", { src: photoUrl, width: 420, height: 630, style: { objectFit: "cover", width: "100%", height: "100%" } }),
          // Offset shadow overlay on right edge
          h("div", { style: { position: "absolute", top: 0, right: 0, width: "60px", height: "100%", background: "linear-gradient(90deg, transparent, rgba(237,228,211,0.6))", display: "flex" } }),
        )
      : h("div", { style: { width: "420px", height: "100%", flexShrink: 0, backgroundColor: "#d4c8b0", display: "flex" } }),
    // Text right
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 60px 60px 50px", flex: 1 } },
      h("span", { style: { fontFamily: fontName, fontWeight: 400, fontStyle: "italic", fontSize: "68px", color: "#2a1a0a", letterSpacing: "-0.01em", lineHeight: 1 } }, firstName),
      h("span", { style: { fontFamily: fontName, fontWeight: 400, fontStyle: "italic", fontSize: "68px", color: "#8b3a2a", letterSpacing: "-0.01em", lineHeight: 1 } }, lastName),
      h("div", { style: { width: "50px", height: "3px", backgroundColor: "#8b3a2a", marginTop: "24px", marginBottom: "18px", display: "flex" } }),
      h("span", { style: { fontSize: "17px", color: "rgba(42,26,10,0.55)", lineHeight: 1.5, fontStyle: "italic" } }, title),
    ),
    // Bottom bar
    h("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", backgroundColor: "#8b3a2a", display: "flex" } }),
    h("div", { style: { position: "absolute", bottom: "20px", right: "50px", display: "flex", fontSize: "12px", color: "rgba(42,26,10,0.3)", letterSpacing: "0.08em" } }, "franciscocatarro.com"),
  );
}

function buildEditorial(firstName, lastName, title, photoUrl, fontName) {
  // Centered, magazine-style, generous space, gold accents
  return h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1610", position: "relative", overflow: "hidden" } },
    // Top gold line
    h("div", { style: { position: "absolute", top: "60px", left: "50%", transform: "translateX(-50%)", width: "1px", height: "40px", backgroundColor: "rgba(196,163,90,0.4)", display: "flex" } }),
    // Centered photo
    photoUrl
      ? h("div", { style: { width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(196,163,90,0.3)", overflow: "hidden", marginBottom: "28px", display: "flex" } },
          h("img", { src: photoUrl, width: 120, height: 120, style: { objectFit: "cover", width: "100%", height: "100%" } }),
        )
      : null,
    // Name centered
    h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
      h("span", { style: { fontFamily: fontName, fontWeight: 400, fontSize: "72px", color: "#e5ddd0", letterSpacing: "-0.03em", lineHeight: 1 } }, `${firstName} ${lastName}`),
    ),
    // Gold divider
    h("div", { style: { width: "60px", height: "1px", backgroundColor: "#c4a35a", marginTop: "22px", marginBottom: "18px", display: "flex" } }),
    // Subtitle
    h("span", { style: { fontSize: "16px", color: "rgba(196,163,90,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" } }, title),
    // Bottom
    h("div", { style: { position: "absolute", bottom: "30px", display: "flex", fontSize: "12px", color: "rgba(229,221,208,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" } }, "franciscocatarro.com"),
  );
}

function buildParallax(firstName, lastName, title, photoUrl, fontName) {
  // Cinematic widescreen: deep black, layered depth feel, thin lines
  return h("div", { style: { width: "100%", height: "100%", display: "flex", backgroundColor: "#080810", position: "relative", overflow: "hidden" } },
    // Cinematic letterbox bars
    h("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to bottom, #000000, transparent)", display: "flex" } }),
    h("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", background: "linear-gradient(to top, #000000, transparent)", display: "flex" } }),
    // Thin horizontal lines for depth
    h("div", { style: { position: "absolute", top: "180px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255,255,255,0.04)", display: "flex" } }),
    h("div", { style: { position: "absolute", top: "440px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255,255,255,0.04)", display: "flex" } }),
    // Large background text (depth layer)
    h("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", fontSize: "220px", fontFamily: fontName, fontWeight: 700, color: "rgba(255,255,255,0.02)", textTransform: "uppercase", letterSpacing: "-0.05em", lineHeight: 1 } }, firstName.charAt(0) + lastName.charAt(0)),
    // Content
    h("div", { style: { display: "flex", flexDirection: "row", alignItems: "center", padding: "80px 100px", width: "100%", height: "100%", position: "relative" } },
      photoUrl
        ? h("div", { style: { width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", marginRight: "60px", flexShrink: 0, display: "flex" } },
            h("img", { src: photoUrl, width: 180, height: 180, style: { objectFit: "cover", width: "100%", height: "100%" } }),
          )
        : null,
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("span", { style: { fontFamily: fontName, fontWeight: 700, fontSize: "64px", color: "#ffffff", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 } }, firstName),
        h("span", { style: { fontFamily: fontName, fontWeight: 700, fontSize: "64px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 } }, lastName),
        h("span", { style: { fontSize: "16px", color: "rgba(255,255,255,0.3)", marginTop: "20px", letterSpacing: "0.08em" } }, title),
      ),
    ),
    h("div", { style: { position: "absolute", bottom: "20px", right: "100px", display: "flex", fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase" } }, "franciscocatarro.com"),
  );
}

function buildPiano(firstName, lastName, title, photoUrl, fontName) {
  // Light, elegant: near-white bg, warm brown text, centered, sheet-music feel
  return h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f2ed", position: "relative", overflow: "hidden" } },
    // Staff lines (like sheet music)
    ...[180, 200, 220, 240, 260].map(y =>
      h("div", { key: y, style: { position: "absolute", top: `${y}px`, left: "100px", right: "100px", height: "1px", backgroundColor: "rgba(20,15,10,0.06)", display: "flex" } })
    ),
    // Photo
    photoUrl
      ? h("div", { style: { width: "110px", height: "110px", borderRadius: "50%", border: "1px solid rgba(20,15,10,0.12)", overflow: "hidden", marginBottom: "24px", display: "flex" } },
          h("img", { src: photoUrl, width: 110, height: 110, style: { objectFit: "cover", width: "100%", height: "100%" } }),
        )
      : null,
    // Name
    h("span", { style: { fontFamily: fontName, fontWeight: 400, fontSize: "64px", color: "#1a1208", letterSpacing: "-0.03em", lineHeight: 1 } }, `${firstName} ${lastName}`),
    // Divider
    h("div", { style: { width: "40px", height: "1px", backgroundColor: "rgba(20,15,10,0.2)", marginTop: "20px", marginBottom: "16px", display: "flex" } }),
    // Subtitle
    h("span", { style: { fontSize: "15px", color: "#7a6e5a", letterSpacing: "0.08em" } }, title),
    // Bottom
    h("div", { style: { position: "absolute", bottom: "28px", display: "flex", fontSize: "11px", color: "rgba(20,15,10,0.2)", letterSpacing: "0.12em" } }, "franciscocatarro.com"),
  );
}

function buildGuitar(firstName, lastName, title, photoUrl, fontName) {
  // Dark rosewood: 6 vertical string lines, fretboard aesthetic
  const stringPositions = [15, 29, 43, 57, 71, 85];
  const stringWidths = [2.5, 2, 1.5, 1.2, 1, 0.8];
  return h("div", { style: { width: "100%", height: "100%", display: "flex", backgroundColor: "#140e08", position: "relative", overflow: "hidden" } },
    // Rosewood grain gradient
    h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(200,117,51,0.04) 0%, transparent 40%, rgba(200,117,51,0.03) 100%)", display: "flex" } }),
    // 6 strings
    ...stringPositions.map((pos, i) =>
      h("div", { key: i, style: { position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: `${stringWidths[i]}px`, backgroundColor: `rgba(255,255,255,${0.06 + i * 0.01})`, display: "flex" } })
    ),
    // Fret wire (horizontal)
    h("div", { style: { position: "absolute", top: "50%", left: 0, right: 0, height: "2px", backgroundColor: "rgba(200,117,51,0.15)", display: "flex" } }),
    // Content
    h("div", { style: { display: "flex", flexDirection: "row", alignItems: "center", padding: "60px 80px", width: "100%", height: "100%", position: "relative" } },
      photoUrl
        ? h("div", { style: { width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(200,117,51,0.4)", overflow: "hidden", marginRight: "50px", flexShrink: 0, display: "flex" } },
            h("img", { src: photoUrl, width: 200, height: 200, style: { objectFit: "cover", width: "100%", height: "100%" } }),
          )
        : null,
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("span", { style: { fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "68px", color: "#f0e6d8", letterSpacing: "-0.02em", lineHeight: 1 } }, firstName),
        h("span", { style: { fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "68px", color: "#c87533", letterSpacing: "-0.02em", lineHeight: 1 } }, lastName),
        h("div", { style: { width: "60px", height: "2px", backgroundColor: "#c87533", marginTop: "22px", marginBottom: "16px", display: "flex" } }),
        h("span", { style: { fontSize: "17px", color: "rgba(240,230,216,0.45)", letterSpacing: "0.04em" } }, title),
      ),
    ),
    h("div", { style: { position: "absolute", bottom: "24px", right: "80px", display: "flex", fontSize: "12px", color: "rgba(240,230,216,0.15)", letterSpacing: "0.08em" } }, "franciscocatarro.com"),
  );
}

const LAYOUT_BUILDERS = {
  "dark-electric": buildElectric,
  "raw-textured": buildAnalog,
  hybrid: buildEditorial,
  parallax: buildParallax,
  piano: buildPiano,
  guitar: buildGuitar,
};

const FONT_MAP = {
  "dark-electric": { key: "syne", name: "Syne", weight: 700, style: "normal" },
  "raw-textured": { key: "dmSerif", name: "DM Serif Display", weight: 400, style: "italic" },
  hybrid: { key: "instrumentSerif", name: "Instrument Serif", weight: 400, style: "normal" },
  parallax: { key: "syne", name: "Syne", weight: 700, style: "normal" },
  piano: { key: "instrumentSerif", name: "Instrument Serif", weight: 400, style: "normal" },
  guitar: { key: "instrumentSerif", name: "Instrument Serif", weight: 400, style: "normal" },
};

export default async function handler(req) {
  const url = new URL(req.url);
  const styleParam = url.searchParams.get("style");

  const data = await fetchConvexData();
  const { name, title, photoUrl } = data;

  const style = styleParam || data.ogStyle || "dark-electric";
  const fontConfig = FONT_MAP[style] || FONT_MAP["dark-electric"];
  const fontUrl = FONTS[fontConfig.key];

  const fontData = await fetch(fontUrl).then((r) => r.arrayBuffer());

  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const builder = LAYOUT_BUILDERS[style] || LAYOUT_BUILDERS["dark-electric"];
  const element = builder(firstName, lastName, title, photoUrl, fontConfig.name);

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: fontConfig.name, data: fontData, weight: fontConfig.weight, style: fontConfig.style },
    ],
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
