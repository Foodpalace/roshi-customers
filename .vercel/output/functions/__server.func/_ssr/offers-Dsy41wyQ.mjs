import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatPaise } from "./pricing-CnXKp7tT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { t as Button } from "./input-ijR1xX1-.mjs";
import { s as useCartStore, t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { i as listPromos } from "./account-kZN00YTD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/offers-Dsy41wyQ.js
var import_jsx_runtime = require_jsx_runtime();
function OffersPage() {
	const { t, lang } = useT();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const setCoupon = useCartStore((s) => s.setCoupon);
	const promos = useQuery({
		queryKey: ["promos"],
		queryFn: () => listPromos()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: t("offers.title")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3",
			children: (promos.data?.promos ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-[var(--radius-lg)] bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: p.name
					}),
					p.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm",
						children: p.code
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: p.fundedBy === "RESTAURANT" ? t("offers.fundedByRestaurant") : p.fundedBy === "PLATFORM" ? t("offers.fundedByPlatform") : t("offers.fundedByShared")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: t("offers.min", { amount: formatPaise(p.minOrderPaise, { locale }) })
					}),
					p.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						size: "sm",
						variant: "outline",
						onClick: () => {
							setCoupon(p.code);
							toast.success(t("cart.applied"));
						},
						children: t("cart.apply")
					}) : null
				]
			}, p.id))
		})]
	}) });
}
//#endregion
export { OffersPage as component };
