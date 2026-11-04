import { Link } from "react-router-dom";
import { RENT_PAGES, rentLabel, rentPath } from "./rentPages";

// Homepage links to every area page. The homepage is the site's strongest page in search, and
// links in its content pass more of that on than footer links do.
export function BrowseByArea() {
  return (
    <section className="py-20 lg:py-28 bg-[#FEF2E2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          Find a home in your area
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-10 max-w-2xl mx-auto">
          Rental homes across south Bengaluru, by neighbourhood and home type
        </p>
        <ul className="zx-areas__list zx-areas__list--home font-lora">
          {RENT_PAGES.map((page) => (
            <li key={page.slug}>
              <Link to={rentPath(page)}>{rentLabel(page)}</Link>
            </li>
          ))}
          <li>
            <Link to="/explore">All homes in Bengaluru</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
