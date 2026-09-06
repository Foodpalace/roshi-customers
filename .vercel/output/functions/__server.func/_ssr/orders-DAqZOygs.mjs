import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatPaise } from "./pricing-CnXKp7tT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { t as Button } from "./input-ijR1xX1-.mjs";
import { l as useCurrentUserState, n as RedirectToSignIn, t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { i as listMyOrders } from "./orders-zazn1Q7j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DAqZOygs.js
var import_jsx_runtime = require_jsx_runtime();
function statusKey(status) {
	return {
		PLACED: "orders.placed",
		ACCEPTED: "orders.accepted",
		PREPARING: "orders.preparing",
		READY: "orders.ready",
		RIDER_ASSIGNED: "orders.riderAssigned",
		PICKED_UP: "orders.pickedUp",
		ON_THE_WAY: "orders.onTheWay",
		DELIVERED: "orders.delivered",
		REJECTED: "orders.rejected",
		CANCELLED: "orders.cancelled",
		REFUNDED: "orders.refunded",
		FAILED_PAYMENT: "orders.failed",
		DELIVERY_FAILED: "orders.deliveryFailed"
	}[status] ?? "orders.placed";
}
function OrdersPage() {
	const { t, lang } = useT();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const { user, isPending } = useCurrentUserState();
	const orders = useQuery({
		queryKey: ["orders"],
		queryFn: () => listMyOrders(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-muted",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const list = orders.data?.orders ?? [];
	const active = list.filter((o) => ![
		"DELIVERED",
		"CANCELLED",
		"REJECTED",
		"REFUNDED",
		"FAILED_PAYMENT"
	].includes(o.status));
	const past = list.filter((o) => !active.includes(o));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: t("orders.title")
		}), orders.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-4 text-primary",
			onClick: () => void orders.refetch(),
			children: t("common.retry")
		}) : !list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("orders.empty") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("orders.emptyHint")
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
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [active.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-muted",
				children: t("orders.active")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-3",
				children: active.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/orders/$id",
					params: { id: o.id },
					className: "block rounded-[var(--radius-lg)] bg-surface p-3 text-fg no-underline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: o.restaurantName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: t(statusKey(o.status))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums",
							children: formatPaise(o.totalPaise, { locale })
						})
					]
				}) }, o.id))
			})]
		}) : null, past.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-muted",
				children: t("orders.past")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-3",
				children: past.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/orders/$id",
					params: { id: o.id },
					className: "block rounded-[var(--radius-lg)] bg-surface p-3 text-fg no-underline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: o.restaurantName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: o.itemPreview
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums",
							children: formatPaise(o.totalPaise, { locale })
						})
					]
				}) }, o.id))
			})]
		}) : null] })]
	}) });
}
//#endregion
export { OrdersPage as component };
