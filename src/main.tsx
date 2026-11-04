import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./styles/propertiesGallery.css";
import "./styles/explorePage.css";
import "./styles/customUtils.css";

const root = document.getElementById("root")!;
const app = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

// Built pages arrive already rendered (scripts/prerender.mjs); the dev server sends an empty root
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
