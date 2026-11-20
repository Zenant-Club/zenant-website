// Scan tracker for printed QR codes.
//
// A printed QR code holds a short link on our own domain (www.zenant.club/card),
// so it never depends on a QR service and never expires. vercel.json rewrites
// that path here. We send the visitor on to the site straight away and record
// the scan in Supabase in the background: a slow or failing database write can
// never stop a scan from reaching the site.
//
// Env (Vercel project settings): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (the
// publishable/anon key; it can only insert into qr_scans, see
// supabase/qr_scans.sql), QR_HASH_SALT (any long random string). Without them
// scans still redirect, they just aren't recorded.

import { geolocation, ipAddress, waitUntil } from "@vercel/functions";

// Printed code -> where it lands. To add one (a flyer, an event), add it here
// and to the "/:code(card)" rewrite in vercel.json. Never remove a code that
// has been printed.
const DESTINATIONS = new Map<string, string>([
  // The owner card handed to landlords and property owners
  ["card", "/owners?utm_source=owner_card&utm_medium=qr"],
]);

export default {
  fetch(request: Request): Response {
    const code = new URL(request.url).searchParams.get("code") ?? "";
    const destination = DESTINATIONS.get(code);

    if (destination && request.method === "GET") {
      waitUntil(
        recordScan(request, code).catch((error) => console.error("qr: scan not recorded", error)),
      );
    }

    return new Response(null, {
      status: 302,
      headers: { Location: destination ?? "/", "Cache-Control": "no-store" },
    });
  },
};

export async function recordScan(request: Request, code: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !key) return;

  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 512);
  const geo = geolocation(request);
  const { deviceType, os, browser } = parseUserAgent(userAgent);

  const row = {
    code,
    country: geo.country ?? null,
    region: geo.countryRegion ?? null,
    city: geo.city ?? null,
    device_type: deviceType,
    os,
    browser,
    is_bot: isBot(userAgent),
    visitor_id: await visitorId(ipAddress(request), userAgent),
    user_agent: userAgent || null,
  };

  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Legacy anon keys are JWTs and go in Authorization too; new sb_publishable_ keys must not.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  // Accept the project URL with or without the "/rest/v1/" the dashboard sometimes shows
  const baseUrl = supabaseUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const response = await fetch(`${baseUrl}/rest/v1/qr_scans`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    console.error("qr: insert failed", response.status, await response.text());
  }
}

// Same phone on the same network -> same id, so repeat scans can be told
// apart from new people. The salt keeps the raw IP from being recoverable.
async function visitorId(ip: string | undefined, userAgent: string): Promise<string | null> {
  const salt = process.env.QR_HASH_SALT;
  if (!salt || !ip) return null;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}|${ip}|${userAgent}`),
  );
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Link previews (someone pastes the link into WhatsApp), crawlers and scripts.
// "\b" after bot keeps phone models like "CUBOT_X30" from matching.
const BOT_PATTERN =
  /(?:bot|crawler|spider)\b|WhatsApp|facebookexternalhit|Slack|preview|curl\/|wget|python-requests|Go-http-client|okhttp|HeadlessChrome/i;

export function isBot(userAgent: string): boolean {
  return userAgent === "" || BOT_PATTERN.test(userAgent);
}

// First match wins, so in-app and Chromium-based browsers come before Chrome,
// and Chrome before Safari (Chrome's user agent also says "Safari").
const BROWSERS: [RegExp, string][] = [
  [/Instagram/, "Instagram app"],
  [/FBAN|FBAV|FB_IAB/, "Facebook app"],
  [/LinkedInApp/, "LinkedIn app"],
  [/\bGSA\//, "Google app"],
  [/SamsungBrowser/, "Samsung Internet"],
  [/MiuiBrowser/, "Mi Browser"],
  [/HeyTapBrowser/, "HeyTap Browser"],
  [/VivoBrowser/, "Vivo Browser"],
  [/EdgA?\/|EdgiOS/, "Edge"],
  [/OPR\/|OPiOS|OPT\//, "Opera"],
  [/Firefox\/|FxiOS/, "Firefox"],
  [/CriOS|Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
];

// Coarse on purpose: browsers now freeze or hide OS versions and phone models
// in the user agent, so only what is still reliable is kept. The full user
// agent is stored too, in case more detail is wanted later.
export function parseUserAgent(userAgent: string): {
  deviceType: "mobile" | "tablet" | "desktop" | null;
  os: string | null;
  browser: string | null;
} {
  if (!userAgent) return { deviceType: null, os: null, browser: null };

  const deviceType = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent)
    ? "tablet"
    : /Mobi|iPhone|iPod|Android/i.test(userAgent)
      ? "mobile"
      : "desktop";

  const os = /iPhone|iPad|iPod/.test(userAgent)
    ? "iOS"
    : /Android/.test(userAgent)
      ? "Android"
      : /Windows/.test(userAgent)
        ? "Windows"
        : /CrOS/.test(userAgent)
          ? "ChromeOS"
          : /Mac OS X|Macintosh/.test(userAgent)
            ? "macOS"
            : /Linux/.test(userAgent)
              ? "Linux"
              : null;

  const browser = BROWSERS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null;

  return { deviceType, os, browser };
}
