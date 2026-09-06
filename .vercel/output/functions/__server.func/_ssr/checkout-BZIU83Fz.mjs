import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatPaise } from "./pricing-CnXKp7tT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { n as Input, t as Button } from "./input-ijR1xX1-.mjs";
import { n as quoteCart, r as trackAnalytics } from "./quote-Clw5othl.mjs";
import { l as useCurrentUserState, n as RedirectToSignIn, s as useCartStore, t as CustomerShell, u as useLocationStore } from "./shell-m3G8JeAX.mjs";
import { t as QuoteLines } from "./quote-lines-CNgP_tXX.mjs";
import { a as placeOrder } from "./orders-zazn1Q7j.mjs";
import { t as newId } from "./ids-BXI880_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BZIU83Fz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const { t, lang } = useT();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const { user, isPending } = useCurrentUserState();
	const { restaurantId, items, coupon, clear } = useCartStore();
	const location = useLocationStore((s) => s.location);
	const [method, setMethod] = (0, import_react.useState)("COD");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const quote = useQuery({
		queryKey: [
			"quote",
			restaurantId,
			items,
			coupon,
			location
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
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const submit = async () => {
		if (!restaurantId || !quote.data) return;
		if (!location.line1.trim()) {
			toast.error(t("checkout.needAddress"));
			return;
		}
		setBusy(true);
		try {
			trackAnalytics({ data: { name: "checkout_started" } });
			const result = await placeOrder({ data: {
				restaurantId,
				zoneId: location.zoneId,
				lat: location.lat,
				lng: location.lng,
				coupon,
				lines: items,
				address: {
					line1: location.line1,
					area: location.zoneName,
					label: location.label
				},
				paymentMethod: method,
				notes,
				idempotencyKey: newId("idem")
			} });
			clear();
			toast.success(t("orders.placed"));
			navigate({
				to: "/orders/$id",
				params: { id: result.orderId }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("checkout.failed"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("checkout.title")
			}),
			!items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted",
				children: t("cart.empty")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-muted",
							children: t("checkout.address")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: location.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: location.line1
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-muted",
							children: t("checkout.pay")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 flex min-h-14 items-start gap-3 rounded-[var(--radius-lg)] bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "pay",
								checked: method === "COD",
								onChange: () => setMethod("COD")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: t("checkout.cod")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: t("checkout.codHint")
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 flex min-h-14 items-start gap-3 rounded-[var(--radius-lg)] bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "pay",
								checked: method === "UPI_SANDBOX",
								onChange: () => setMethod("UPI_SANDBOX")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: t("checkout.upiSandbox")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-muted",
									children: t("checkout.upiSandboxHint")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs text-warn",
									children: t("checkout.upiUnavailable")
								})
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-6 block text-sm",
					children: [t("checkout.notes"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-[var(--radius-xl)] bg-surface p-4",
					children: quote.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteLines, {
						lines: quote.data.quote.lines,
						locale
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("common.loading") })
				}),
				quote.data?.quote.blockers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-warn",
					children: quote.data.quote.blockers.includes("MIN_ORDER") ? t("cart.minOrder", { amount: formatPaise(quote.data.quote.minOrderPaise, { locale }) }) : t("checkout.blocked")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					disabled: busy || !quote.data || Boolean(quote.data.quote.blockers.length),
					onClick: () => void submit(),
					children: busy ? t("checkout.placing") : t("checkout.place", { amount: formatPaise(quote.data?.quote.totalPaise ?? 0, { locale }) })
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cart",
					className: "text-muted",
					children: ["← ", t("cart.title")]
				})
			})
		]
	}) });
}
//#endregion
export { CheckoutPage as component };
