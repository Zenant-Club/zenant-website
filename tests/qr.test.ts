// Run: npm test
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import qr, { isBot, parseUserAgent, recordScan } from "../api/qr.mts";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36";
const SAMSUNG =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36";
const INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 389.0.0.0.0";
const ANDROID_TABLET =
  "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const WINDOWS_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const WHATSAPP_PREVIEW = "WhatsApp/2.24.21.84 A";

type Call = { url: string; init: RequestInit };
let calls: Call[];
const realFetch = globalThis.fetch;

function scanRequest(code: string, init: RequestInit = {}, ua = IPHONE) {
  return new Request(`https://www.zenant.club/api/qr?code=${code}`, {
    ...init,
    headers: {
      "user-agent": ua,
      "x-real-ip": "203.0.113.7",
      "x-vercel-ip-country": "IN",
      "x-vercel-ip-country-region": "HR",
      "x-vercel-ip-city": "Gurugram",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

const settle = () => new Promise((r) => setTimeout(r, 50));

beforeEach(() => {
  calls = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(null, { status: 201 });
  }) as typeof fetch;
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  process.env.QR_HASH_SALT = "test-salt";
});

afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
  delete process.env.QR_HASH_SALT;
});

describe("redirect", () => {
  it("sends a /card scan to the owners page with the owner card's tracking tag", async () => {
    const res = await qr.fetch(scanRequest("card"));
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), "/owners?utm_source=owner_card&utm_medium=qr");
    assert.equal(res.headers.get("cache-control"), "no-store");
    await settle(); // let the background write finish inside this test
  });

  it("sends an unknown code to the home page instead of a dead end", async () => {
    const res = await qr.fetch(scanRequest("nope"));
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), "/");
    await settle();
    assert.equal(calls.length, 0);
  });

  it("treats built-in object names as unknown codes", async () => {
    for (const code of ["constructor", "__proto__", "toString"]) {
      const res = await qr.fetch(scanRequest(code));
      assert.equal(res.headers.get("location"), "/");
    }
    await settle();
    assert.equal(calls.length, 0);
  });

  it("still redirects when the database write fails", async () => {
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    const res = await qr.fetch(scanRequest("card"));
    assert.equal(res.status, 302);
    await settle();
  });

  it("still redirects, without logging, when Supabase isn't configured", async () => {
    delete process.env.SUPABASE_URL;
    const res = await qr.fetch(scanRequest("card"));
    assert.equal(res.status, 302);
    await settle();
    assert.equal(calls.length, 0);
  });

  it("does not log HEAD requests", async () => {
    const res = await qr.fetch(scanRequest("card", { method: "HEAD" }));
    assert.equal(res.status, 302);
    await settle();
    assert.equal(calls.length, 0);
  });

  it("logs a GET scan in the background", async () => {
    await qr.fetch(scanRequest("card"));
    await settle();
    assert.equal(calls.length, 1);
  });
});

describe("recordScan", () => {
  it("inserts one row with location, device and a hashed visitor id", async () => {
    await recordScan(scanRequest("card"), "card");
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    assert.equal(url, "https://example.supabase.co/rest/v1/qr_scans");
    assert.equal(init.method, "POST");
    const headers = init.headers as Record<string, string>;
    assert.equal(headers.apikey, "sb_publishable_test");
    assert.equal(headers.Authorization, undefined);
    assert.equal(headers.Prefer, "return=minimal");

    const row = JSON.parse(String(init.body));
    assert.deepEqual(
      { ...row, visitor_id: undefined },
      {
        code: "card",
        country: "IN",
        region: "HR",
        city: "Gurugram",
        device_type: "mobile",
        os: "iOS",
        browser: "Safari",
        is_bot: false,
        visitor_id: undefined,
        user_agent: IPHONE,
      },
    );
    assert.match(row.visitor_id, /^[0-9a-f]{32}$/);
    assert.ok(!String(init.body).includes("203.0.113.7"), "raw IP must not be stored");
  });

  it("accepts the project URL with /rest/v1/ on the end", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co/rest/v1/";
    await recordScan(scanRequest("card"), "card");
    assert.equal(calls[0].url, "https://example.supabase.co/rest/v1/qr_scans");
  });

  it("gives the same visitor the same id, and a different visitor a different one", async () => {
    await recordScan(scanRequest("card"), "card");
    await recordScan(scanRequest("card"), "card");
    await recordScan(scanRequest("card", { headers: { "x-real-ip": "198.51.100.4" } }), "card");
    const ids = calls.map((c) => JSON.parse(String(c.init.body)).visitor_id);
    assert.equal(ids[0], ids[1]);
    assert.notEqual(ids[0], ids[2]);
  });

  it("leaves visitor_id empty when no salt is set", async () => {
    delete process.env.QR_HASH_SALT;
    await recordScan(scanRequest("card"), "card");
    assert.equal(JSON.parse(String(calls[0].init.body)).visitor_id, null);
  });

  it("decodes city names Vercel sends URL-encoded", async () => {
    await recordScan(scanRequest("card", { headers: { "x-vercel-ip-city": "S%C3%A3o%20Paulo" } }), "card");
    assert.equal(JSON.parse(String(calls[0].init.body)).city, "São Paulo");
  });

  it("flags link-preview bots instead of counting them as people", async () => {
    await recordScan(scanRequest("card", {}, WHATSAPP_PREVIEW), "card");
    assert.equal(JSON.parse(String(calls[0].init.body)).is_bot, true);
  });

  it("sends a legacy anon JWT key as a bearer token too", async () => {
    process.env.SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiJ9.e30.sig";
    await recordScan(scanRequest("card"), "card");
    const headers = calls[0].init.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer eyJhbGciOiJIUzI1NiJ9.e30.sig");
  });
});

describe("parseUserAgent", () => {
  const cases: [string, string, ReturnType<typeof parseUserAgent>][] = [
    ["iPhone Safari", IPHONE, { deviceType: "mobile", os: "iOS", browser: "Safari" }],
    ["Android Chrome", ANDROID_CHROME, { deviceType: "mobile", os: "Android", browser: "Chrome" }],
    ["Samsung Internet", SAMSUNG, { deviceType: "mobile", os: "Android", browser: "Samsung Internet" }],
    ["Instagram in-app", INSTAGRAM, { deviceType: "mobile", os: "iOS", browser: "Instagram app" }],
    ["Android tablet", ANDROID_TABLET, { deviceType: "tablet", os: "Android", browser: "Chrome" }],
    ["Windows Chrome", WINDOWS_CHROME, { deviceType: "desktop", os: "Windows", browser: "Chrome" }],
    ["empty", "", { deviceType: null, os: null, browser: null }],
  ];
  for (const [name, ua, expected] of cases) {
    it(name, () => assert.deepEqual(parseUserAgent(ua), expected));
  }
});

describe("isBot", () => {
  for (const ua of [
    WHATSAPP_PREVIEW,
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "TelegramBot (like TwitterBot)",
    "curl/8.7.1",
    "",
  ]) {
    it(`bot: ${ua || "(empty)"}`, () => assert.equal(isBot(ua), true));
  }
  for (const ua of [IPHONE, ANDROID_CHROME, SAMSUNG, INSTAGRAM, WINDOWS_CHROME]) {
    it(`person: ${ua.slice(0, 40)}…`, () => assert.equal(isBot(ua), false));
  }
});
