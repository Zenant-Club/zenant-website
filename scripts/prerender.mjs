// Runs after `vite build`. Renders every page in PAGE_META, plus the budget pages the current homes
// justify, to its own HTML file, so search engines and link previews get the real title, text and
// listings instead of an empty <div id="root">. The browser then hydrates the page as usual.
// Also writes the 404 page and the sitemap.
//
// Listings are fetched from the API now and baked in, so rebuild the site to refresh them.
// If the API can't be reached the build fails, and Vercel keeps serving the last good deploy.

import { build } from "vite";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OUT_DIR = "build";
const SSR_DIR = "build-ssr";
const API_ORIGIN = (
  process.env.PRERENDER_API_ORIGIN || "https://zenant-whatsapp-26342061489.asia-south1.run.app"
).replace(/\/$/, "");
// Matches PAGE_SIZE on the Explore page; the API caps a page at 36
const PAGE_SIZE = 36;
// Warn when an area page has fewer homes than this: thin pages rank poorly
const MIN_AREA_HOMES = 2;
// Per request; without a limit a stalled API would hang the build until the host kills it
const API_TIMEOUT_MS = 30_000;

async function fetchListings() {
  const loadPage = async (page) => {
    const res = await fetch(`${API_ORIGIN}/api/public/properties?limit=${PAGE_SIZE}&page=${page}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`page ${page} returned HTTP ${res.status}`);
    return res.json();
  };
  const first = await loadPage(1);
  const perPage = first.pagination?.limit || PAGE_SIZE;
  const pageCount = Math.ceil((first.pagination?.total || 0) / perPage);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => loadPage(i + 2))
  );
  // A listing added mid-load can shift onto the next page, so keep each home once
  const byId = new Map([first, ...rest].flatMap((page) => page.data || []).map((p) => [p.id, p]));
  return [...byId.values()];
}

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Tags index.html sets for development, replaced on each page with that page's own
const PAGE_HEAD_TAGS = [
  /^[ \t]*<title>[\s\S]*?<\/title>\r?\n/gm,
  /^[ \t]*<meta\s[^>]*?(?:name="(?:description|robots)"|property="og:(?:title|description|url)")[^>]*>\r?\n/gm,
  /^[ \t]*<link\s[^>]*?rel="canonical"[^>]*>\r?\n/gm,
];

// Escapes "<" so no text inside can close the script tag
const jsonScript = (attrs, value) =>
  `<script ${attrs}>${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`;

function pageHtml(template, { title, description, url, indexable, appHtml, dataScript, headExtra }) {
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    url && `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${indexable ? "index, follow" : "noindex"}" />`,
    headExtra,
  ].filter(Boolean);
  const stripped = PAGE_HEAD_TAGS.reduce((html, tag) => html.replace(tag, ""), template);
  // Function replacements, so "$" in the page text isn't read as a replacement pattern
  return stripped
    .replace(/([ \t]*)<\/head>/, (_, indent) =>
      head.map((tag) => `${indent}  ${tag}\n`).join("") + `${indent}</head>`
    )
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>${dataScript}`);
}

async function main() {
  const template = await readFile(path.join(OUT_DIR, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>') || !template.includes("<title>")) {
    throw new Error(`${OUT_DIR}/index.html doesn't look like the app shell; run vite build first`);
  }

  await build({
    logLevel: "warn",
    ssr: { noExternal: true },
    build: {
      ssr: "src/entry-server.tsx",
      outDir: SSR_DIR,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
  });
  const server = await import(pathToFileURL(path.resolve(SSR_DIR, "entry-server.mjs")).href);
  const { LISTINGS_SCRIPT_ID, NOT_FOUND_META, PAGE_META, RENT_PAGES, SITE_URL } = server;

  let listings;
  try {
    listings = await fetchListings();
  } catch (err) {
    throw new Error(`Couldn't load listings from ${API_ORIGIN}: ${err.message}`);
  }
  console.log(`prerender: ${listings.length} listings from ${API_ORIGIN}`);

  for (const page of RENT_PAGES) {
    const count = listings.filter((home) => server.isInRentPage(page, home)).length;
    if (count < MIN_AREA_HOMES) {
      console.warn(`prerender: warning: /rent/${page.slug} has ${count} homes; consider removing it`);
    }
  }

  // Listings go into the page as JSON the Explore page reads on load. Like the structured data
  // below, it isn't executed, so the Content-Security-Policy allows it.
  const listingsScript = jsonScript(`type="application/json" id="${LISTINGS_SCRIPT_ID}"`, listings);
  const showsListings = (route) => route === "/explore" || route.startsWith("/rent/");

  // e.g. /rent/1bhk-in-btm-layout-under-30000; which ones exist depends on the homes listed
  const budgetPages = server.budgetPagesFor(listings);
  const routes = [
    ...Object.entries(PAGE_META),
    ...budgetPages.map((page) => [
      server.rentPath(page),
      { title: page.title, description: page.description },
    ]),
  ];

  const rentPageAt = new Map(
    [...RENT_PAGES, ...budgetPages].map((page) => [server.rentPath(page), page])
  );

  // The page's breadcrumbs as structured data, which Google can show in place of the URL
  const breadcrumbData = (page) =>
    jsonScript('type="application/ld+json"', {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: server.rentBreadcrumbs(page).map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: `${SITE_URL}${crumb.path}`,
      })),
    });

  for (const [route, meta] of routes) {
    // Google cuts titles off after about 60 characters and shows roughly 120-150 of a description
    if (meta.title.length > 60) {
      console.warn(`prerender: warning: ${route} title is ${meta.title.length} characters; keep to 60`);
    }
    if (meta.description.length < 120 || meta.description.length > 150) {
      console.warn(
        `prerender: warning: ${route} description is ${meta.description.length} characters; keep to 120-150`
      );
    }
    const withListings = showsListings(route);
    const rentPage = rentPageAt.get(route);
    const html = pageHtml(template, {
      ...meta,
      url: `${SITE_URL}${route}`,
      indexable: true,
      appHtml: server.render(route, withListings ? listings : null),
      dataScript: withListings ? listingsScript : "",
      headExtra: [
        rentPage && breadcrumbData(rentPage),
        // The homepage's biggest image is a CSS background, which browsers otherwise only find
        // after the stylesheet has loaded
        route === "/" &&
          `<link rel="preload" as="image" href="${server.HERO_IMAGE}" fetchpriority="high" />`,
      ]
        .filter(Boolean)
        .join("\n    "),
    });
    const file = path.join(OUT_DIR, route === "/" ? "index.html" : `${route.slice(1)}.html`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  // Vercel serves 404.html, with a 404 status, for any path that isn't a file
  await writeFile(
    path.join(OUT_DIR, "404.html"),
    pageHtml(template, {
      ...NOT_FOUND_META,
      indexable: false,
      appHtml: server.render("/404", null),
      dataScript: "",
    })
  );

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(([route]) => `  <url><loc>${SITE_URL}${route}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
  await writeFile(path.join(OUT_DIR, "sitemap.xml"), sitemap);

  console.log(
    `prerender: wrote ${routes.length} pages (${budgetPages.length} budget pages), 404.html and sitemap.xml`
  );
}

try {
  await main();
} finally {
  await rm(SSR_DIR, { recursive: true, force: true });
}
