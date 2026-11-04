// Renders a page to HTML at build time; used by scripts/prerender.mjs, not shipped to browsers.

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { Property, setBuildListings } from "./components/exploreShared";

export { LISTINGS_SCRIPT_ID } from "./components/exploreShared";
export { NOT_FOUND_META, PAGE_META, SITE_URL } from "./components/pageMeta";
export {
  RENT_PAGES,
  budgetPagesFor,
  isInRentPage,
  rentBreadcrumbs,
  rentPath,
} from "./components/rentPages";

export function render(url: string, listings: Property[] | null) {
  setBuildListings(listings);
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
