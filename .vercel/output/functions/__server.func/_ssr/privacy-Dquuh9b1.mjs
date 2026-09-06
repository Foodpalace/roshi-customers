import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-Dquuh9b1.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	const { t } = useT();
	const { brand, communication } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "prose-sm px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("legal.privacy")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					brand.companyName,
					" collects the minimum needed to deliver food: name, contact, delivery address, and order history. We do not sell personal data. Payment card numbers are never stored. Phone OTP, SMS and WhatsApp providers are adapters only — nothing is sent until a provider is connected. Account deletion can be requested from the account screen. Contact ",
					communication.grievanceEmail,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "This notice is a draft for development. It is not legal advice and must be reviewed before a public launch in India (DPDP Act, IT Rules). GSTIN and FSSAI numbers show as PENDING until registered."
			})
		]
	}) });
}
//#endregion
export { PrivacyPage as component };
