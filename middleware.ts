import { next } from "@vercel/edge";
import type { RequestContext } from "@vercel/edge";

export const config = {
  // Run on page navigations only: skip API, build assets, and any path with a
  // file extension (favicon, images, etc.).
  matcher: "/((?!api|assets|_next|.*\\..*).*)",
};

// Known AI-assistant referer hosts. Mirrors analytics-hub's canonical list
// (convex/lib/aiSources.ts) — keep in sync. Term must sit on a host-segment
// boundary so youtube.com doesn't match "you", etc.
const AI_REFERER_RE =
  /(^|\.)(chatgpt|openai|perplexity|copilot|claude\.ai|gemini\.google|bard\.google|you|grok|x\.ai|deepseek|mistral)(\.|$)/i;

// Skip crawlers/bots so the page-hit count reflects real visits.
const BOT_UA_RE =
  /bot|crawl|spider|slurp|gptbot|claudebot|ccbot|facebookexternalhit|embedly|preview|lighthouse|headless|monitor|pingdom|uptime/i;

// Skip vuln-scanner / asset probes (/wp-admin, /.env, /2000.php) so they don't
// inflate page hits. Mirrors analytics-hub convex/lib/pagePaths.ts — keep in sync.
const SCANNER_PREFIXES = [
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/wp-json",
  "/wp-login",
  "/xmlrpc",
  "/wp/",
];
function isRealPagePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  const p = path.toLowerCase();
  if (p.startsWith("/.")) return false;
  if (SCANNER_PREFIXES.some((prefix) => p.startsWith(prefix))) return false;
  const last = p.split("?")[0].replace(/\/+$/, "").split("/").pop() ?? "";
  return !last.includes(".");
}

// Consent-free page beacon (Vercel Edge Middleware, framework-agnostic). Counts
// every non-bot page load server-side and flags AI-referred ones — no cookie,
// no PII — so it's unaffected by GA consent gates and ad-blockers. Mirrors the
// Next-app middleware; the hub records pageviewHits (+ aiReferralHits when the
// referer is an AI host).
export default function middleware(request: Request, context: RequestContext) {
  const url = process.env.PAGE_BEACON_URL;
  const secret = process.env.AI_BEACON_SECRET;
  if (url && secret) {
    const ua = request.headers.get("user-agent") ?? "";
    if (!BOT_UA_RE.test(ua)) {
      const u = new URL(request.url);
      let referer: string | undefined;
      const ref = request.headers.get("referer");
      if (ref) {
        try {
          const host = new URL(ref).hostname;
          if (host !== u.hostname && AI_REFERER_RE.test(host)) referer = host;
        } catch {
          // ignore unparseable Referer
        }
      }
      if (isRealPagePath(u.pathname)) {
        context.waitUntil(
          fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json", "x-beacon-secret": secret },
            body: JSON.stringify({ domain: u.hostname, path: u.pathname, referer }),
          }).catch(() => {}),
        );
      }
    }
  }
  return next();
}
