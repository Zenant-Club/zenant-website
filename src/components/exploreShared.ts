// Types and helpers shared by the Explore page and its visit list.

export type Property = {
  id: string;
  title: string;
  area: string;
  type: string;
  rent: number;
  deposit: number;
  furnishing: string;
  image: string | null;
  // Card-sized copy of `image` served by the API; absent from older API responses
  thumb?: string | null;
  imageCount: number;
  amenities?: string[];
};

export type PropertyDetail = Property & {
  images: string[];
  description: string;
};

// Homes the build baked into the page (scripts/prerender.mjs), so visitors and search engines see
// listings straight away. The Explore page still refreshes them from the API after it loads.
export const LISTINGS_SCRIPT_ID = "zenant-listings";

let buildListings: Property[] | null = null;
let pageListings: Property[] | null | undefined;

// Called by the build before rendering a page
export const setBuildListings = (listings: Property[] | null) => {
  buildListings = listings;
};

export function prerenderedListings(): Property[] | null {
  if (typeof document === "undefined") return buildListings;
  if (pageListings === undefined) {
    try {
      const parsed = JSON.parse(document.getElementById(LISTINGS_SCRIPT_ID)?.textContent || "null");
      pageListings = Array.isArray(parsed) ? parsed : null;
    } catch {
      pageListings = null;
    }
  }
  return pageListings;
}

let fetchedListings: Property[] | null = null;

// The latest homes this visit has seen: from the API once fetched, else those baked into the page
export const rememberListings = (listings: Property[]) => {
  fetchedListings = listings;
};
export const knownListings = () => fetchedListings || prerenderedListings();

export const API_BASE = (
  ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_PUBLIC_API_BASE) || ""
).replace(/\/$/, "");

// The small cover photo for cards and the cart. Catalogue originals are full camera
// size (often 4032x3024, over 1 MB), which made the property grid slow to scroll.
export const cardPhoto = (p: Property) => (p.thumb ? `${API_BASE}${p.thumb}` : p.image);

// Alt text for a home's photos, from its details rather than its title (titles are internal
// codes like "KP - BTM2- 1BHK"): "Furnished 1BHK for rent in BTM Layout"
export function homePhotoAlt(p: Property) {
  const type = /^\d/.test(p.type || "") ? p.type : (p.type || "home").toLowerCase();
  const furnishing = p.furnishing ? `${p.furnishing.toLowerCase()} ` : "";
  const text = `${furnishing}${type} for rent in ${p.area || "Bengaluru"}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// If the resized copy can't load, show the full-size original rather than a broken photo
export const fallBackToOriginal =
  (p: Property) => (e: { currentTarget: HTMLImageElement }) => {
    if (p.image && e.currentTarget.src !== p.image) e.currentTarget.src = p.image;
  };

// Matches MAX_VISITS_PER_BOOKING in the booking API
export const MAX_VISIT_LIST = 10;

// Every 30 minutes from 9:00 AM to 8:00 PM
export const TIME_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const dateKey = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

export const fromDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatSlot = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour, minute));
};

export const isSlotAvailable = (targetDate: Date, value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  const slot = new Date(targetDate);
  slot.setHours(hour, minute, 0, 0);
  return slot.getTime() > Date.now() + 60 * 60 * 1000;
};

// Today if it still has a bookable slot, otherwise tomorrow
export const firstBookableDate = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  if (!TIME_SLOTS.some((slot) => isSlotAvailable(day, slot))) day.setDate(day.getDate() + 1);
  return day;
};

// The next 14 bookable days, starting today
export const bookingDates = () =>
  Array.from({ length: 14 }, (_, index) => {
    const next = new Date();
    next.setHours(0, 0, 0, 0);
    next.setDate(next.getDate() + index);
    return next;
  });
