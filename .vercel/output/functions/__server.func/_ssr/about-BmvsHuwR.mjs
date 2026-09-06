import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useBrand } from "./router-C2RzFU3r.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BmvsHuwR.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	const { brand, marketplace, invoice } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "px-4 py-5 text-sm text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-fg",
				children: brand.appName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-fg",
				children: brand.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4",
				children: brand.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-xl text-fg",
				children: "How this marketplace works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 list-disc space-y-1 pl-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Location first, then kitchens, then a server-priced cart." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Every rupee line has a name and a reason. No miscellaneous fees." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Commission defaults to ",
						marketplace.defaultCommissionBps / 100,
						"% and is stored on the order."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sample kitchens are labelled. Ratings are omitted until real reviews exist." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "English and Bengali strings come from a dictionary, not from hardcoded UI copy." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Brand, colours, fees and city come from central configuration." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-xl text-fg",
				children: "UX choices"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Public food apps put search, location and a persistent cart within one thumb-reach. We kept that pattern and cut membership upsells, hidden charges and fake social proof. Tracking does not invent GPS."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs",
				children: [
					"Invoice entity: ",
					invoice.companyName,
					". GSTIN ",
					invoice.gstin,
					". FSSAI ",
					invoice.fssai,
					"."
				]
			})
		]
	}) });
}
//#endregion
export { AboutPage as component };
