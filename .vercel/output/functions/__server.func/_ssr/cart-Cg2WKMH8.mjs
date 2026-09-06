import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatPaise } from "./pricing-CnXKp7tT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { n as Input, t as Button } from "./input-ijR1xX1-.mjs";
import { n as quoteCart, r as trackAnalytics } from "./quote-Clw5othl.mjs";
import { s as useCartStore, t as CustomerShell, u as useLocationStore } from "./shell-m3G8JeAX.mjs";
import { t as QuoteLines } from "./quote-lines-CNgP_tXX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-Cg2WKMH8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { t, lang } = useT();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const { restaurantId, restaurantName, items, coupon, updateQty, remove, setCoupon, clear } = useCartStore();
	const location = useLocationStore((s) => s.location);
	const [code, setCode] = (0, import_react.useState)(coupon);
	const navigate = useNavigate();
	const quote = useQuery({
		queryKey: [
			"quote",
			restaurantId,
			items,
			coupon,
			location.lat,
			location.lng,
			location.zoneId
		],
		enabled: Boolean(restaurantId && items.length),
		queryFn: () => quoteCart({ data: {
			restaurantId,
			zoneId: location.zoneId,
			lat: location.lat,
			lng: location.lng,
			coupon,
			lines: items
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: t("cart.title")
		}), !items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: t("cart.empty")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: t("cart.emptyHint")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: t("cart.browse")
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: t("cart.from", { name: restaurantName })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: items.map((item) => {
					const priced = quote.data?.pricedLines.find((p) => p.key === item.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-[var(--radius-lg)] bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: priced?.name ?? item.itemId
								}),
								item.instructions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: item.instructions
								}) : null,
								priced ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 tabular-nums text-sm",
									children: formatPaise(priced.unitPaise * item.quantity, { locale })
								}) : null
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "size-11 rounded-full bg-bg",
										onClick: () => updateQty(item.key, item.quantity - 1),
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-center tabular-nums",
										children: item.quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "size-11 rounded-full bg-bg",
										onClick: () => updateQty(item.key, item.quantity + 1),
										children: "+"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 text-xs text-danger",
							onClick: () => remove(item.key),
							children: t("common.remove")
						})]
					}, item.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					const next = code.trim().toUpperCase();
					setCoupon(next);
					if (next) trackAnalytics({ data: {
						name: "coupon_applied",
						payload: { code: next }
					} });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: code,
					onChange: (e) => setCode(e.target.value),
					placeholder: t("cart.coupon"),
					"aria-label": t("cart.coupon")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					children: t("cart.apply")
				})]
			}),
			quote.data?.promoName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-primary",
				children: quote.data.promoName
			}) : null,
			coupon && quote.data && !quote.data.promoName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: t("cart.invalidCoupon")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 rounded-[var(--radius-xl)] bg-surface p-4",
				children: quote.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("common.loading")
				}) : quote.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-primary",
					onClick: () => void quote.refetch(),
					children: t("common.retry")
				}) : quote.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteLines, {
					lines: quote.data.quote.lines,
					locale
				}) : null
			}),
			quote.data?.quote.savingsPaise ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-primary",
				children: t("cart.savings", { amount: formatPaise(quote.data.quote.savingsPaise, { locale }) })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => clear(),
					children: t("cart.clear")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					disabled: !quote.data || quote.data.quote.blockers.includes("MIN_ORDER"),
					onClick: () => void navigate({ to: "/checkout" }),
					children: t("cart.checkout")
				})]
			}),
			quote.data?.quote.blockers.includes("MIN_ORDER") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-warn",
				children: t("cart.minOrder", { amount: formatPaise(quote.data.quote.minOrderPaise, { locale }) })
			}) : null
		] })]
	}) });
}
//#endregion
export { CartPage as component };
