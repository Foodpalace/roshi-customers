import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as CUSTOMER_TRACK_STEPS } from "./_ssr/state-1rAkgEsW.mjs";
import { n as formatPaise } from "./_ssr/pricing-CnXKp7tT.mjs";
import { n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { o as useT, r as Route$2 } from "./_ssr/router-C2RzFU3r.mjs";
import { t as Button } from "./_ssr/input-ijR1xX1-.mjs";
import { l as useCurrentUserState, n as RedirectToSignIn, t as CustomerShell } from "./_ssr/shell-m3G8JeAX.mjs";
import { t as QuoteLines } from "./_ssr/quote-lines-CNgP_tXX.mjs";
import { n as cancelMyOrder, r as getMyOrder, t as advanceSimulatedOrder } from "./_ssr/orders-zazn1Q7j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CkUOavPA.js
var import_jsx_runtime = require_jsx_runtime();
function OrderDetailPage() {
	const { id } = Route$2.useParams();
	const { t, lang } = useT();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const { user, isPending } = useCurrentUserState();
	const detail = useQuery({
		queryKey: ["order", id],
		queryFn: () => getMyOrder({ data: { orderId: id } }),
		enabled: Boolean(user),
		refetchInterval: 4e3
	});
	const cancel = useMutation({
		mutationFn: () => cancelMyOrder({ data: { orderId: id } }),
		onSuccess: () => void detail.refetch()
	});
	const advance = useMutation({
		mutationFn: () => advanceSimulatedOrder({ data: { orderId: id } }),
		onSuccess: () => void detail.refetch()
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const order = detail.data?.order;
	if (detail.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: t("common.loading")
	}) });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6",
		children: t("common.empty")
	}) });
	const idx = CUSTOMER_TRACK_STEPS.indexOf(order.status);
	const labels = {
		PLACED: t("orders.placed"),
		ACCEPTED: t("orders.accepted"),
		PREPARING: t("orders.preparing"),
		READY: t("orders.ready"),
		RIDER_ASSIGNED: t("orders.riderAssigned"),
		PICKED_UP: t("orders.pickedUp"),
		ON_THE_WAY: t("orders.onTheWay"),
		DELIVERED: t("orders.delivered")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("orders.copyId", { id: order.summary.publicId })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: order.summary.restaurantName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 space-y-3",
				children: CUSTOMER_TRACK_STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: i <= idx || order.status === step ? "text-fg" : "text-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: labels[step]
					})
				}, step))
			}),
			order.status === "CANCELLED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-danger",
				children: t("orders.cancelled")
			}) : null,
			order.deliveryOtp && !["DELIVERED", "CANCELLED"].includes(order.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-[var(--radius-lg)] bg-surface p-3 font-medium",
				children: [t("orders.otp", { code: order.deliveryOtp }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm font-normal text-muted",
					children: t("orders.otpHint")
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: t("orders.noGps")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-[var(--radius-xl)] bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-medium",
						children: t("orders.invoice")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mb-3 space-y-1 text-sm",
						children: order.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								it.quantity,
								" × ",
								it.name
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatPaise(it.lineTotalPaise, { locale })
							})]
						}, it.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteLines, {
						lines: order.lines,
						locale
					})
				]
			}),
			order.restaurantSimulated && ![
				"DELIVERED",
				"CANCELLED",
				"REJECTED"
			].includes(order.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-[var(--radius-lg)] border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("orders.simulateHint")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-2",
					variant: "outline",
					disabled: advance.isPending,
					onClick: () => advance.mutate(),
					children: t("orders.simulate")
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					order.canCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						disabled: cancel.isPending,
						onClick: () => cancel.mutate(),
						children: t("orders.cancelOrder")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/r/$slug",
							params: { slug: order.summary.restaurantSlug },
							children: t("orders.reorder")
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/support",
							children: t("orders.help")
						})
					})
				]
			})
		]
	}) });
}
//#endregion
export { OrderDetailPage as component };
