import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as formatPaiseCompact } from "./pricing-CnXKp7tT.mjs";
import { s as Leaf, u as Clock3 } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { a as listCategories, o as listRestaurants, u as useLocationStore } from "./shell-m3G8JeAX.mjs";
import { n as Skeleton, t as Badge } from "./skeleton-zLRZYp0t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-feed-1jN8RQWb.js
var import_jsx_runtime = require_jsx_runtime();
function KitchenCard({ restaurant }) {
	const { t, lang } = useT();
	const { business } = useBrand();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/r/$slug",
		params: { slug: restaurant.slug },
		className: "block overflow-hidden rounded-[var(--radius-xl)] bg-surface text-fg no-underline shadow-[0_1px_0_var(--color-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[16/10] overflow-hidden bg-surface-2",
			children: [restaurant.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: restaurant.coverImage,
				alt: "",
				className: "h-full w-full object-cover",
				loading: "lazy"
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-2 top-2 flex flex-wrap gap-1",
				children: [
					restaurant.dataLabel !== "REAL" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "warn",
						children: t("common.sample")
					}) : null,
					restaurant.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t("common.ad") }) : null,
					!restaurant.open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "danger",
						children: t("common.closed")
					}) : null
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg leading-tight",
						children: restaurant.name
					}), restaurant.vegOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 text-success",
						"aria-label": t("common.veg"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4" })
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: restaurant.cuisineSummary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex flex-wrap items-center gap-x-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
								className: "size-3.5",
								"aria-hidden": true
							}), t("home.etaMin", { n: restaurant.etaMinutes })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("home.deliveryFrom", { fee: formatPaiseCompact(restaurant.deliveryFeePaise, locale) }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("home.minOrder", { amount: formatPaiseCompact(restaurant.minOrderPaise, locale) }) })
					]
				}),
				restaurant.hasOffer && restaurant.offerLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-primary",
					children: restaurant.offerLabel
				}) : null,
				restaurant.ratingAvg == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: t("common.new")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-muted",
					children: [
						restaurant.ratingAvg.toFixed(1),
						" (",
						restaurant.ratingCount,
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: business.currency
				})
			]
		})]
	});
}
function HomeFeed({ q, veg, openNow, category }) {
	const { t, lang } = useT();
	const { marketplace, brand } = useBrand();
	const location = useLocationStore((s) => s.location);
	const cats = useQuery({
		queryKey: ["categories", lang],
		queryFn: () => listCategories({ data: { lang } })
	});
	const list = useQuery({
		queryKey: [
			"restaurants",
			location.zoneId,
			location.lat,
			location.lng,
			q,
			veg,
			openNow,
			category,
			lang
		],
		queryFn: () => listRestaurants({ data: {
			zoneId: location.zoneId,
			lat: location.lat,
			lng: location.lng,
			q,
			veg,
			openNow,
			category,
			lang
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 px-4 py-5",
		children: [
			!q && !veg && !openNow && !category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight",
				children: brand.tagline
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: brand.promotionalHeadline
			})] }) : null,
			marketplace.sampleCatalogueBanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-[var(--radius-lg)] bg-surface px-3 py-3 text-sm text-muted",
				children: t("home.sampleBanner")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": t("home.categories"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: t("home.categories")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-3 overflow-x-auto pb-1",
					children: cats.isPending ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-24 shrink-0" }, i)) : (cats.data?.categories ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/search",
						search: { category: c.id },
						className: "w-24 shrink-0 text-center text-fg no-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-surface-2",
							children: c.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.imageUrl,
								alt: "",
								className: "h-full w-full object-cover"
							}) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs font-medium",
							children: c.name
						})]
					}, c.id))
				})]
			}),
			list.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-primary",
				onClick: () => void list.refetch(),
				children: t("common.retry")
			}) : list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-52 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-52 w-full" })]
			}) : q || veg || openNow || category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: t("common.search"),
				items: list.data?.restaurants ?? [],
				empty: t("home.noResults")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("home.bestOffers"),
					items: list.data?.sections.offers ?? []
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("home.popular"),
					items: list.data?.sections.popular ?? []
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("home.fast"),
					items: list.data?.sections.fast ?? []
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("home.budget"),
					items: list.data?.sections.budget ?? []
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("home.newRestaurants"),
					items: list.data?.sections.newKitchens ?? []
				})
			] })
		]
	});
}
function Section({ title, items, empty }) {
	if (!items.length) return empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: empty
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-3 font-display text-xl",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitchenCard, { restaurant: r }, r.id))
	})] });
}
//#endregion
export { HomeFeed as t };
