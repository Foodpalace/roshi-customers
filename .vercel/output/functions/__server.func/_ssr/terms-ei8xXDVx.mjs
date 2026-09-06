import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-ei8xXDVx.js
var import_jsx_runtime = require_jsx_runtime();
function TermsPage() {
	const { t } = useT();
	const { brand, marketplace } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "px-4 py-5 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-fg",
			children: t("legal.terms")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4",
			children: [
				brand.companyName,
				" is a local marketplace. Sample kitchens are not live vendors. Prices, delivery fees and commissions are calculated on the server. Default kitchen commission is ",
				marketplace.defaultCommissionBps / 100,
				"% and is snapshotted per order. Cash on delivery is available. Online UPI is sandbox-only until a licensed payment aggregator is activated. These terms are a development draft, not a filed contract."
			]
		})]
	}) });
}
//#endregion
export { TermsPage as component };
