// Landing pages for searches like "1BHK in BTM Layout", "flats for rent in Koramangala" or
// "1BHK in BTM Layout under 30000". Each one is the Explore page narrowed to the homes that match
// (area, home type and budget, whichever are set), with its own title, heading and intro so search
// engines have a page that matches the search.
//
// Area pages are listed by hand below; only add one we have homes for, as an empty page does more
// harm than good. Budget pages ("...-under-30000") are made from them automatically, and only the
// ones the current homes justify are published (see budgetPagesFor).

import { type Property, knownListings, money } from "./exploreShared";

export type RentPage = {
  slug: string;
  // Heading and link text is `${lead} ${place}`, e.g. "1BHK flats for rent in" + "BTM Layout"
  lead: string;
  place: string;
  // A home belongs here when its area contains one of these, ignoring case, spaces and
  // punctuation. Leave out for a page covering all of Bengaluru.
  areas?: string[];
  type?: string;
  // Only homes with rent below this; set on budget pages
  maxRent?: number;
  // The page a budget page narrows
  base?: RentPage;
  // Slug of the broader area page above this one in breadcrumbs; otherwise it sits under all homes
  parent?: string;
  title: string;
  description: string;
  intro: string;
};

export const RENT_PAGES: RentPage[] = [
  {
    slug: "btm-layout",
    lead: "Flats for rent in",
    place: "BTM Layout",
    areas: ["BTM"],
    title: "Flats for Rent in BTM Layout, Bangalore | Zenant",
    description:
      "Browse flats for rent in BTM Layout, Bangalore, across BTM 1st and 2nd Stage. See rent, deposit and photos for every home, then book visits online.",
    intro:
      "BTM Layout is a busy residential area in south Bengaluru, close to Koramangala, HSR Layout, Jayanagar and JP Nagar. The Yellow Line metro stops at BTM Layout and Central Silk Board, with a direct ride to Electronic City.",
  },
  {
    slug: "1bhk-in-btm-layout",
    parent: "btm-layout",
    lead: "1BHK flats for rent in",
    place: "BTM Layout",
    areas: ["BTM"],
    type: "1BHK",
    title: "1BHK Flats for Rent in BTM Layout, Bangalore | Zenant",
    description:
      "Find 1BHK flats for rent in BTM Layout, Bangalore, from BTM 1st Stage to 2nd Stage. Compare rents and deposits, see photos and book visits online.",
    intro:
      "A 1BHK in BTM Layout puts you close to Koramangala, HSR Layout and Silk Board, with metro stations at BTM Layout and Central Silk Board on the Yellow Line. It's a popular choice for working professionals who want a place of their own.",
  },
  {
    slug: "2bhk-in-btm-layout",
    parent: "btm-layout",
    lead: "2BHK flats for rent in",
    place: "BTM Layout",
    areas: ["BTM"],
    type: "2BHK",
    title: "2BHK Flats for Rent in BTM Layout, Bangalore | Zenant",
    description:
      "Find 2BHK flats for rent in BTM Layout, Bangalore. Compare rents and deposits, see photos of every home and book visits online with Zenant.",
    intro:
      "A 2BHK in BTM Layout suits couples, small families and friends sharing a flat, with Koramangala, HSR Layout and Silk Board close by and metro stations at BTM Layout and Central Silk Board on the Yellow Line.",
  },
  {
    slug: "btm-2nd-stage",
    parent: "btm-layout",
    lead: "Flats for rent in",
    place: "BTM 2nd Stage",
    areas: ["BTM 2nd Stage", "BTM Layout 2nd Stage"],
    title: "Flats for Rent in BTM 2nd Stage, Bangalore | Zenant",
    description:
      "Browse flats for rent in BTM 2nd Stage, Bangalore, near Jayadeva and the BTM Layout metro station. See rent, deposit and photos, then book visits online.",
    intro:
      "BTM 2nd Stage is the part of BTM Layout closest to JP Nagar and Jayanagar, with the BTM Layout and Jayadeva Hospital metro stations on the Yellow Line nearby, and Silk Board and Koramangala a short ride away.",
  },
  {
    slug: "koramangala",
    lead: "Flats for rent in",
    place: "Koramangala",
    areas: ["Koramangala"],
    title: "Flats for Rent in Koramangala, Bangalore | Zenant",
    description:
      "Browse flats for rent in Koramangala, Bangalore, near Christ University, St. John's and Nexus Mall. See rent, deposit and photos, then book visits online.",
    intro:
      "Koramangala is one of Bengaluru's best-known neighbourhoods, full of startups, cafés and restaurants. Christ University, St. John's Medical College and Nexus Mall Koramangala are all close by, as are BTM Layout and HSR Layout.",
  },
  {
    slug: "hsr-layout",
    lead: "Flats for rent in",
    place: "HSR Layout",
    areas: ["HSR"],
    title: "Flats for Rent in HSR Layout, Bangalore | Zenant",
    description:
      "Browse flats for rent in HSR Layout, Bangalore, near Silk Board and the Outer Ring Road. See rent, deposit and photos, then book visits online.",
    intro:
      "HSR Layout is a planned neighbourhood in south-east Bengaluru, next to Silk Board junction and the Outer Ring Road, and close to the tech parks along the Outer Ring Road and Sarjapur Road.",
  },
  {
    slug: "silk-board",
    lead: "Flats for rent near",
    place: "Silk Board",
    areas: ["Silk Board"],
    title: "Flats for Rent near Silk Board, Bangalore | Zenant",
    description:
      "Browse flats for rent near Silk Board, Bangalore, between BTM Layout and HSR Layout. See rent, deposit and photos, then book visits online.",
    intro:
      "Central Silk Board junction, where Hosur Road meets the Outer Ring Road, sits between BTM Layout and HSR Layout. Central Silk Board metro station on the Yellow Line runs to Electronic City, and Koramangala is a short ride away.",
  },
  {
    slug: "madiwala",
    lead: "Flats for rent in",
    place: "Madiwala & Maruti Nagar",
    areas: ["Madiwala", "Maruti Nagar", "Maruthi Nagar"],
    title: "Flats for Rent in Madiwala & Maruti Nagar, Bangalore",
    description:
      "Browse flats for rent in Madiwala and Maruti Nagar, Bangalore, near Koramangala, BTM Layout and Silk Board. See rent, deposit and photos, then book visits.",
    intro:
      "Madiwala and neighbouring Maruti Nagar sit along Hosur Road between Koramangala, BTM Layout and Silk Board, with St. John's Medical College and Christ University a short ride away.",
  },
  {
    // Christ University's main campus is in SG Palya, next to Tavarekere
    slug: "near-christ-university",
    lead: "Flats for rent near",
    place: "Christ University",
    areas: ["SG Palya", "SG Palaya", "Tavarekere"],
    title: "Flats for Rent near Christ University, Bangalore | Zenant",
    description:
      "Find flats for rent near Christ University, Bangalore, in SG Palya and Tavarekere. See rent, deposit and photos of every home, then book visits online.",
    intro:
      "Christ University's main campus is on Hosur Road in SG Palya, next to Tavarekere and close to Dairy Circle, Koramangala and BTM Layout. The homes here are in SG Palya and Tavarekere, the neighbourhoods right around the campus.",
  },
  {
    slug: "jp-nagar",
    lead: "Flats for rent in",
    place: "JP Nagar",
    areas: ["JP Nagar"],
    title: "Flats for Rent in JP Nagar, Bangalore | Zenant",
    description:
      "Browse flats for rent in JP Nagar, Bangalore, close to Jayanagar, BTM Layout and Bannerghatta Road. See rent, deposit and photos, then book visits online.",
    intro:
      "JP Nagar is a large, mostly residential neighbourhood in south Bengaluru, next to Jayanagar, BTM Layout and Bannerghatta Road, with markets, schools and hospitals close by.",
  },
];

// All of Bengaluru. Its own page is /explore, so only its budget pages are published under /rent/.
export const CITY_PAGE: RentPage = {
  slug: "flats-in-bengaluru",
  lead: "Flats for rent in",
  place: "Bengaluru",
  title: "Flats for Rent in Bengaluru | Zenant",
  description:
    "Browse rental flats in Koramangala, BTM Layout, HSR Layout, Silk Board and nearby areas. Compare rents and amenities, then schedule a visit online.",
  intro:
    "Rent and deposit are listed on every home, so you can compare them and book your visits in one go.",
};

// Monthly rent limits for budget pages, e.g. /rent/1bhk-in-btm-layout-under-30000
const BUDGETS = [20_000, 25_000, 30_000, 35_000, 40_000, 50_000];

// Fewest homes a budget page needs before it's published
const MIN_BUDGET_HOMES = 3;
// Fewest extra homes a budget page must show over the next budget down for the same page
const MIN_BUDGET_STEP = 2;

export const rentPath = (page: RentPage) => `/rent/${page.slug}`;

export const rentLabel = (page: RentPage) => `${page.lead} ${page.place}`;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// "1BHK flats for rent in" + ₹30,000 -> "1BHK flats for rent under ₹30,000 in"
function budgetPage(base: RentPage, maxRent: number): RentPage {
  const preposition = base.lead.split(" ").pop() || "in";
  const lead = `${base.lead.slice(0, -preposition.length)}under ${money(maxRent)} ${preposition}`;
  const label = `${lead} ${base.place}`;
  const homes = base.type ? `${base.type} we have` : "home we have";
  return {
    ...base,
    slug: `${base.slug}-under-${maxRent}`,
    lead,
    maxRent,
    base,
    title: `${capitalize(label).replace(/flats for rent/i, "Flats for Rent")} | Zenant`,
    description: `Browse ${label.charAt(0).toLowerCase()}${label.slice(1)}${
      base.areas ? ", Bangalore" : ""
    }. See rent, deposit and photos for every home, then book your visits online.`,
    intro: `Every ${homes} ${preposition} ${base.place} with rent under ${money(maxRent)} a month. ${
      base.intro
    }`,
  };
}

// Every budget page worth publishing, given the current homes. Each must have at least
// MIN_BUDGET_HOMES homes, leave out at least a tenth of its area page's homes (or it's that page
// again), show MIN_BUDGET_STEP more homes than the budget below it, and not show exactly the same
// homes as any other page.
export function budgetPagesFor(homes: Property[]): RentPage[] {
  const homesOn = (page: RentPage) => homes.filter((home) => isInRentPage(page, home));
  const key = (matching: Property[]) => matching.map((home) => home.id).sort().join(",");
  const taken = new Set(RENT_PAGES.map((page) => key(homesOn(page))));
  // Home-type pages go first, so when "BTM Layout under ₹25,000" would show the same homes as
  // "1BHK in BTM Layout under ₹25,000", the more specific page is the one kept
  const bases = [
    ...RENT_PAGES.filter((page) => page.type),
    ...RENT_PAGES.filter((page) => !page.type),
    CITY_PAGE,
  ];
  const pages: RentPage[] = [];
  for (const base of bases) {
    const baseCount = homesOn(base).length;
    let previousCount = 0;
    for (const maxRent of BUDGETS) {
      const page = budgetPage(base, maxRent);
      const matching = homesOn(page);
      const count = matching.length;
      if (count < MIN_BUDGET_HOMES || count > baseCount * 0.9) continue;
      if (taken.has(key(matching))) {
        previousCount = count; // another page already shows these homes
        continue;
      }
      if (count < previousCount + MIN_BUDGET_STEP) continue;
      pages.push(page);
      taken.add(key(matching));
      previousCount = count;
    }
  }
  return pages;
}

// The page for a /rent/ slug: an area page, or a budget page the latest homes justify. The build
// makes the same check, so a budget page it dropped is "not found" here too.
export function findRentPage(slug: string): RentPage | undefined {
  return (
    RENT_PAGES.find((page) => page.slug === slug) ||
    budgetPagesFor(knownListings() || []).find((page) => page.slug === slug)
  );
}

// Heading for the page's rent table: "1BHK rent in BTM Layout", "Rent near Silk Board"
export const rentTableHeading = (page: RentPage) => {
  const phrase = page.lead.replace(/flats for rent/i, "rent");
  return `${capitalize(phrase)} ${page.place}`;
};

// Breadcrumbs, e.g. Home › Rentals in Bengaluru › BTM Layout › 1BHK › Under ₹30,000
export type Crumb = { label: string; path: string };

const parentOf = (page: RentPage): RentPage | undefined =>
  page === CITY_PAGE
    ? undefined
    : page.base || RENT_PAGES.find((other) => other.slug === page.parent) || CITY_PAGE;

const crumbFor = (page: RentPage): Crumb => {
  if (page === CITY_PAGE) return { label: "Rentals in Bengaluru", path: "/explore" };
  const label = page.maxRent
    ? `Under ${money(page.maxRent)}`
    : page.type || (page.lead.endsWith("near") ? `Near ${page.place}` : page.place);
  return { label, path: rentPath(page) };
};

export function rentBreadcrumbs(page: RentPage): Crumb[] {
  const trail: Crumb[] = [];
  for (let step: RentPage | undefined = page; step; step = parentOf(step)) {
    trail.unshift(crumbFor(step));
  }
  return [{ label: "Home", path: "/" }, ...trail];
}

// Neighbourhood names in an intro, each linked (first mention only) to its own area page
const PLACE_NAMES = RENT_PAGES.filter((page) => !page.type)
  .flatMap((page) => page.place.split(" & ").map((name) => ({ name, page })))
  .sort((a, b) => b.name.length - a.name.length);
const PLACE_PATTERN = new RegExp(`\\b(${PLACE_NAMES.map((p) => p.name).join("|")})\\b`);

export function linkPlaces(text: string, current: RentPage) {
  const linked = new Set<string>([current.slug]);
  return text.split(PLACE_PATTERN).map((part, index) => {
    const target = index % 2 ? PLACE_NAMES.find((p) => p.name === part)?.page : undefined;
    if (!target || linked.has(target.slug)) return part;
    linked.add(target.slug);
    return { text: part, path: rentPath(target) };
  });
}

const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

export const isInRentPage = (page: RentPage, home: Property) =>
  (!page.areas || page.areas.some((area) => squash(home.area || "").includes(squash(area)))) &&
  (!page.type || squash(home.type || "") === squash(page.type)) &&
  (!page.maxRent || (home.rent > 0 && home.rent < page.maxRent));
