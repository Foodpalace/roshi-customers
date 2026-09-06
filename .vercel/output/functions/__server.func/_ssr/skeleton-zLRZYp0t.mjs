import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./input-ijR1xX1-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-zLRZYp0t.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", {
			neutral: "bg-surface-2 text-muted",
			primary: "bg-primary/10 text-primary",
			warn: "bg-warn/15 text-warn",
			danger: "bg-danger/10 text-danger"
		}[tone], className),
		...props
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-[var(--radius-md)] bg-surface-2", className) });
}
//#endregion
export { Skeleton as n, Badge as t };
