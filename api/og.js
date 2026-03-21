import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const CONVEX_URL = process.env.VITE_CONVEX_URL;

const FALLBACK = {
  name: "Francisco Catarro",
  title: "Guitar | Keys | Musical Direction | Production",
};

async function fetchConvexData() {
  if (!CONVEX_URL) return { name: FALLBACK.name, title: FALLBACK.title, photoUrl: null };

  try {
    const url = CONVEX_URL.replace(/\.cloud$/, ".convex.cloud");
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
    };
  } catch {
    return { name: FALLBACK.name, title: FALLBACK.title, photoUrl: null };
  }
}

function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

export default async function handler(req) {
  const [fontData, data] = await Promise.all([
    fetch("https://fonts.gstatic.com/s/syne/v24/8vIS7w4qzmVxsWxjBZRjr0FKM_3fvj6k.ttf").then(
      (r) => r.arrayBuffer()
    ),
    fetchConvexData(),
  ]);

  const { name, title, photoUrl } = data;
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const photoElement = photoUrl
    ? h("div", {
        style: {
          display: "flex",
          flexShrink: 0,
          marginRight: "60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: "3px solid #dc2828",
          boxShadow: "0 0 60px rgba(220,40,40,0.3)",
          overflow: "hidden",
        },
      },
        h("img", {
          src: photoUrl,
          width: 220,
          height: 220,
          style: { objectFit: "cover", width: "100%", height: "100%" },
        })
      )
    : h("div", {
        style: {
          display: "flex",
          flexShrink: 0,
          marginRight: "60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: "3px solid #dc2828",
          boxShadow: "0 0 60px rgba(220,40,40,0.3)",
          background: "linear-gradient(135deg, #1a1a24, #0a0a0f)",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "72px",
          color: "#dc2828",
          fontFamily: "Syne",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
      }, "FC");

  const element = h("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      backgroundColor: "#0a0a0f",
      position: "relative",
      overflow: "hidden",
    },
  },
    // Red gradient in corner
    h("div", {
      style: {
        position: "absolute",
        bottom: "-200px",
        right: "-200px",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,40,40,0.15) 0%, transparent 70%)",
        display: "flex",
      },
    }),
    // Top accent line
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #dc2828, #dc2828 40%, transparent)",
        display: "flex",
      },
    }),
    // Main content
    h("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
      },
    },
      photoElement,
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        },
      },
        h("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          },
        },
          h("span", {
            style: {
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "72px",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            },
          }, firstName),
          h("span", {
            style: {
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "72px",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            },
          }, lastName),
        ),
        // Red divider
        h("div", {
          style: {
            width: "80px",
            height: "3px",
            backgroundColor: "#dc2828",
            marginTop: "24px",
            marginBottom: "20px",
            display: "flex",
          },
        }),
        h("span", {
          style: {
            fontSize: "22px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.4,
          },
        }, title),
      ),
    ),
    // Bottom URL
    h("div", {
      style: {
        position: "absolute",
        bottom: "28px",
        right: "80px",
        display: "flex",
        fontSize: "16px",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.05em",
      },
    }, "franciscocatarro.com"),
  );

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Syne", data: fontData, weight: 700, style: "normal" },
    ],
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
