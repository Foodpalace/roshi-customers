import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/refunds-BkkOl2cU.js
var import_jsx_runtime = require_jsx_runtime();
function RefundsPage() {
	const { t } = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "px-4 py-5 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-fg",
			children: t("legal.refunds")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4",
			children: "You may cancel until the kitchen starts preparing. After that, cancellation depends on the kitchen. Refunds are not automatic. Support tickets record the request. COD orders have nothing to refund unless already paid to a rider. This policy is a development draft."
		})]
	}) });
}
//#endregion
export { RefundsPage as component };
