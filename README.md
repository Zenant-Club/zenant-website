
  # Landing page prototype for Zenant

  This is a code bundle for Landing page prototype for Zenant. The original project is available at https://www.figma.com/design/GbWEXQd1W8meFQA2gScOQ0/Landing-page-prototype-for-Zenant.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Building and area pages

  `npm run build` builds the site, then `scripts/prerender.mjs` renders every page to its own HTML file with the current listings from the API, so search engines see real content. The build fails if the API can't be reached.

  Listings in the HTML only change when the site is rebuilt (visitors always get fresh listings from the API), so redeploy regularly to keep search results current.

  Area pages such as `/rent/1bhk-in-btm-layout` are defined in `src/components/rentPages.ts`. Add an entry there to create a new one; it's added to the sitemap, footer and Explore page links automatically. Only add areas we have homes in.

  Budget pages such as `/rent/1bhk-in-btm-layout-under-30000` are made automatically from each area page (and from Bengaluru as a whole) at the limits in `BUDGETS`. Each build publishes only those with at least 3 homes that show a different set of homes from the area page and from the budget below, so they come and go with the listings.

  >> project live
  
