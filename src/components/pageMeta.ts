// Title and description for each route, for search results and link previews.
// Keep titles to 60 characters or fewer (Google cuts longer ones off) and descriptions between
// 120 and 150; the build warns about any that aren't (scripts/prerender.mjs).
// Every route listed here is prerendered and goes in the sitemap (scripts/prerender.mjs), along
// with the budget pages the current homes justify.

import { RENT_PAGES, findRentPage, rentPath } from "./rentPages";

export const SITE_URL = "https://www.zenant.club";

type PageMeta = { title: string; description: string };

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Zenant | Rental Homes and Flats for Rent in Bengaluru",
    description:
      "Find verified rental homes in Bengaluru: HSR Layout, Koramangala, BTM Layout, Madiwala and Silk Board. Compare rents, book visits and move in.",
  },
  "/explore": {
    title: "Flats for Rent in Bengaluru | Zenant",
    description:
      "Browse rental flats in Koramangala, BTM Layout, HSR Layout, Silk Board and nearby areas. Compare rents and amenities, then schedule a visit online.",
  },
  "/about": {
    title: "About Zenant | Rental Brokerage in Bengaluru",
    description:
      "Zenant is a rental brokerage in Bengaluru that helps tenants find homes and landlords find the right tenants, from first enquiry to move-in.",
  },
  "/contact": {
    title: "Contact Zenant | Rental Homes in Bengaluru",
    description:
      "Get in touch with Zenant to find a rental home or list your property in Bengaluru. Call us, or chat with our team on WhatsApp.",
  },
  "/careers": {
    title: "Careers at Zenant | Jobs in Bengaluru",
    description:
      "Join Zenant and help build a tenant-first rental experience in Bengaluru. See our open roles, read the job details and find out how to apply.",
  },
  ...Object.fromEntries(
    RENT_PAGES.map((page) => [rentPath(page), { title: page.title, description: page.description }])
  ),
};

// Budget pages depend on the homes listed, so they're looked up rather than listed above
export function pageMetaFor(path: string): PageMeta | undefined {
  if (PAGE_META[path]) return PAGE_META[path];
  const page = path.startsWith("/rent/") ? findRentPage(path.slice("/rent/".length)) : undefined;
  return page && { title: page.title, description: page.description };
}

// For any path not listed above; such pages are also kept out of search
export const NOT_FOUND_META: PageMeta = {
  title: "Page not found | Zenant",
  description: PAGE_META["/"].description,
};
