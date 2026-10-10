// Title and description for each route, for search results and link previews.
// Keep titles under ~60 characters and descriptions under ~160.

export const SITE_URL = "https://www.zenant.club";

type PageMeta = { title: string; description: string };

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Zenant | Rental Homes and Flats for Rent in Bengaluru",
    description:
      "Find verified rental homes in South Bengaluru: HSR Layout, Koramangala, BTM Layout, Madiwala and Silk Board. Compare rents, book visits and move in with Zenant.",
  },
  "/explore": {
    title: "Flats for Rent in South Bengaluru | Zenant",
    description:
      "Browse rental flats in Koramangala, BTM Layout, HSR Layout, Silk Board and nearby areas. Compare rents and amenities, then schedule a visit online.",
  },
  "/about": {
    title: "About Zenant | Rental Brokerage in Bengaluru",
    description:
      "Zenant is a full-service residential rental brokerage in Bengaluru, helping tenants find homes and landlords find the right tenants, from first enquiry to move-in.",
  },
  "/contact": {
    title: "Contact Zenant | Rental Homes in Bengaluru",
    description:
      "Get in touch with Zenant to find a rental home or list your property in Bengaluru. Call us or chat with us on WhatsApp.",
  },
  "/careers": {
    title: "Careers at Zenant | Jobs in Bengaluru",
    description:
      "Join Zenant and help build a tenant-first rental experience in Bengaluru. See open roles and how to apply.",
  },
};
