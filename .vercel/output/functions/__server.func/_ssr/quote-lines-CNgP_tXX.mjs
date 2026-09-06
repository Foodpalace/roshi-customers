import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatPaise } from "./pricing-CnXKp7tT.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quote-lines-CNgP_tXX.js
var import_jsx_runtime = require_jsx_runtime();
function QuoteLines({ lines, locale }) {
	const { t } = useT();
	const visible = lines.filter((l) => l.code !== "TOTAL" && (l.amountPaise !== 0 || l.code === "DELIVERY"));
	const total = lines.find((l) => l.code === "TOTAL");
	const label = (code, fallback) => {
		const key = `quote.${code}`;
		const translated = t(key);
		return translated === key ? fallback : translated;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 text-sm",
		children: [
			visible.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-fg",
					children: label(line.code, line.name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: line.reason
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tabular-nums text-fg",
					children: formatPaise(line.amountPaise, { locale })
				})]
			}, line.code)),
			total ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border pt-2 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("cart.toPay") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: formatPaise(total.amountPaise, { locale })
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: t("cart.includesTax")
			})
		]
	});
}
//#endregion
export { QuoteLines as t };
