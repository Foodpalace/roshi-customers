import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as DialogTitle, i as DialogPortal, n as DialogContent, r as DialogOverlay, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { n as formatPaise } from "./_ssr/pricing-CnXKp7tT.mjs";
import { a as Plus, l as Heart, o as Minus, s as Leaf } from "./_libs/lucide-react.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as useBrand, n as Route$1, o as useT } from "./_ssr/router-C2RzFU3r.mjs";
import { t as Button } from "./_ssr/input-ijR1xX1-.mjs";
import { r as trackAnalytics } from "./_ssr/quote-Clw5othl.mjs";
import { c as useCurrentUser, i as getRestaurant, r as cartKey, s as useCartStore, t as CustomerShell, u as useLocationStore } from "./_ssr/shell-m3G8JeAX.mjs";
import { s as toggleFavourite } from "./_ssr/account-kZN00YTD.mjs";
import { n as Skeleton, t as Badge } from "./_ssr/skeleton-zLRZYp0t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-jvcEAhUZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomizeDialog({ item, open, onOpenChange, onConfirm, locale }) {
	const { t } = useT();
	const defaultVariant = item?.variants.find((v) => v.isDefault) ?? item?.variants[0] ?? null;
	const [variantId, setVariantId] = (0, import_react.useState)(defaultVariant?.id ?? null);
	const [addonIds, setAddonIds] = (0, import_react.useState)([]);
	const [qty, setQty] = (0, import_react.useState)(1);
	const [note, setNote] = (0, import_react.useState)("");
	const reset = (next) => {
		const v = next?.variants.find((x) => x.isDefault) ?? next?.variants[0] ?? null;
		setVariantId(v?.id ?? null);
		setAddonIds([]);
		setQty(1);
		setNote("");
	};
	(0, import_react.useEffect)(() => {
		if (open) reset(item);
	}, [open, item?.id]);
	const variant = item?.variants.find((v) => v.id === variantId) ?? null;
	const unit = (0, import_react.useMemo)(() => {
		if (!item) return 0;
		return (variant ? variant.pricePaise : item.basePricePaise) + item.addonGroups.flatMap((g) => g.addons).filter((a) => addonIds.includes(a.id)).reduce((s, a) => s + a.pricePaise, 0);
	}, [
		item,
		variant,
		addonIds
	]);
	if (!item) return null;
	const toggleAddon = (id, groupMax, groupIds) => {
		setAddonIds((cur) => {
			if (cur.includes(id)) return cur.filter((x) => x !== id);
			if (cur.filter((x) => groupIds.includes(x)).length >= groupMax) return [...cur.filter((x) => !groupIds.includes(x)), id];
			return [...cur, id];
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (v) reset(item);
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-fg/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[var(--radius-2xl)] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl",
					children: item.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: item.description
				}),
				item.variants.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium",
						children: t("customize.size")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-2",
						children: item.variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center justify-between rounded-[var(--radius-md)] bg-bg px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "variant",
								className: "mr-2",
								checked: variantId === v.id,
								onChange: () => setVariantId(v.id),
								disabled: !v.available
							}), v.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-sm",
								children: formatPaise(v.pricePaise, { locale })
							})]
						}, v.id))
					})]
				}) : null,
				item.addonGroups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
						className: "text-sm font-medium",
						children: [
							g.name,
							" · ",
							g.required ? t("customize.required") : t("customize.optional")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-2",
						children: g.addons.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center justify-between rounded-[var(--radius-md)] bg-bg px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mr-2",
								checked: addonIds.includes(a.id),
								onChange: () => toggleAddon(a.id, g.maxSelect, g.addons.map((x) => x.id)),
								disabled: !a.available
							}), a.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-sm",
								children: formatPaise(a.pricePaise, { locale })
							})]
						}, a.id))
					})]
				}, g.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-sm font-medium",
					children: [t("customize.instructions"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: note,
						onChange: (e) => setNote(e.target.value.slice(0, 180)),
						placeholder: t("customize.instructionsPlaceholder"),
						className: "mt-1 min-h-20 w-full rounded-[var(--radius-md)] border border-border bg-bg p-3 text-base"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-full bg-bg",
								"aria-label": t("a11y.decreaseQty"),
								onClick: () => setQty((q) => Math.max(1, q - 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 text-center tabular-nums",
								children: qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-full bg-bg",
								"aria-label": t("a11y.increaseQty"),
								onClick: () => setQty((q) => Math.min(20, q + 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							const line = {
								itemId: item.id,
								variantId,
								addonIds,
								quantity: qty,
								instructions: note.trim()
							};
							onConfirm({
								...line,
								key: cartKey(line)
							});
							onOpenChange(false);
						},
						children: t("customize.addFor", { amount: formatPaise(unit * qty, { locale }) })
					})]
				})
			]
		})] })
	});
}
function RestaurantPage() {
	const { slug } = Route$1.useParams();
	const { t, lang } = useT();
	const { brand } = useBrand();
	const locale = lang === "bn" ? "bn-IN" : "en-IN";
	const location = useLocationStore((s) => s.location);
	const user = useCurrentUser();
	const addItem = useCartStore((s) => s.addItem);
	const replaceAndAdd = useCartStore((s) => s.replaceAndAdd);
	const [custom, setCustom] = (0, import_react.useState)(null);
	const [replaceWith, setReplaceWith] = (0, import_react.useState)(null);
	const [menuQ, setMenuQ] = (0, import_react.useState)("");
	const detail = useQuery({
		queryKey: [
			"restaurant",
			slug,
			location.lat,
			location.lng,
			lang
		],
		queryFn: () => getRestaurant({ data: {
			slug,
			lat: location.lat,
			lng: location.lng,
			lang
		} })
	});
	const restaurant = detail.data?.restaurant;
	(0, import_react.useEffect)(() => {
		if (restaurant) trackAnalytics({ data: {
			name: "restaurant_view",
			payload: { slug }
		} });
	}, [restaurant, slug]);
	const add = (restId, restName, line) => {
		if (addItem(restId, restName, line) === "replace") setReplaceWith({
			name: restName,
			line
		});
		else toast.success(t("common.added"));
	};
	const onAddClick = (item) => {
		if (!restaurant) return;
		trackAnalytics({ data: {
			name: "item_view",
			payload: { item: item.id }
		} });
		if (item.variants.length || item.addonGroups.length) {
			setCustom(item);
			return;
		}
		const line = {
			itemId: item.id,
			variantId: null,
			addonIds: [],
			quantity: 1,
			instructions: ""
		};
		add(restaurant.card.id, restaurant.card.name, {
			...line,
			key: cartKey(line)
		});
		trackAnalytics({ data: {
			name: "add_to_cart",
			payload: { item: item.id }
		} });
	};
	const jsonLd = restaurant ? {
		"@context": "https://schema.org",
		"@type": "Restaurant",
		name: restaurant.card.name,
		description: restaurant.description,
		address: {
			"@type": "PostalAddress",
			streetAddress: restaurant.addressLine,
			addressLocality: restaurant.area,
			addressCountry: "IN"
		},
		servesCuisine: restaurant.card.cuisineSummary,
		...restaurant.card.dataLabel === "REAL" ? {} : { additionalProperty: {
			"@type": "PropertyValue",
			name: "dataLabel",
			value: restaurant.card.dataLabel
		} }
	} : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CustomerShell, { children: [
		detail.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-8 w-2/3" })]
		}) : detail.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-primary",
				onClick: () => void detail.refetch(),
				children: t("common.retry")
			})
		}) : !restaurant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-4 text-muted",
			children: t("common.empty")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
			jsonLd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[16/9] bg-surface-2",
				children: [restaurant.card.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: restaurant.card.coverImage,
					alt: "",
					className: "h-full w-full object-cover"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-3 top-3 flex gap-1",
					children: [restaurant.card.dataLabel !== "REAL" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "warn",
						children: t("common.sample")
					}) : null, restaurant.card.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t("common.ad") }) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl",
							children: restaurant.card.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: restaurant.card.cuisineSummary
						})] }), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center rounded-full bg-surface",
							"aria-label": t("account.favourites"),
							onClick: () => void toggleFavourite({ data: { restaurantId: restaurant.card.id } }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" })
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: restaurant.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							t("restaurant.eta", { n: restaurant.card.etaMinutes }),
							" ·",
							" ",
							t("restaurant.delivery", { fee: formatPaise(restaurant.card.deliveryFeePaise, { locale }) }),
							" ·",
							" ",
							t("restaurant.minOrder", { amount: formatPaise(restaurant.card.minOrderPaise, { locale }) })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							restaurant.area,
							" · ",
							restaurant.hoursLabel
						]
					}),
					restaurant.card.dataLabel !== "REAL" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-warn",
						children: t("restaurant.sampleNotice")
					}) : null,
					!restaurant.card.open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-danger",
						children: t("restaurant.closedNotice")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: menuQ,
						onChange: (e) => setMenuQ(e.target.value),
						placeholder: t("restaurant.searchMenu"),
						className: "mt-4 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-2 overflow-x-auto border-y border-border bg-bg px-4 py-2",
				children: restaurant.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${c.id}`,
					className: "shrink-0 rounded-full bg-surface px-3 py-2 text-sm text-fg no-underline",
					children: c.name
				}, c.id))
			}),
			restaurant.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: c.id,
				className: "px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: c.items.filter((it) => !menuQ || it.name.toLowerCase().includes(menuQ.toLowerCase())).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 rounded-[var(--radius-lg)] bg-surface p-3",
						children: [
							it.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: it.imageUrl,
								alt: "",
								className: "size-20 rounded-[var(--radius-sm)] object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-20 rounded-[var(--radius-sm)] bg-surface-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											it.veg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
												className: "size-3.5 text-success",
												"aria-label": t("common.veg")
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: it.name
											}),
											it.bestseller ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t("restaurant.bestseller") }) : null
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-2 text-sm text-muted",
										children: it.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 tabular-nums text-sm",
										children: formatPaise(it.basePricePaise, { locale })
									})
								]
							}),
							it.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => onAddClick(it),
								children: it.variants.length || it.addonGroups.length ? t("restaurant.customise") : t("restaurant.add")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: t("restaurant.unavailable")
							})
						]
					}, it.id))
				})]
			}, c.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomizeDialog, {
				item: custom,
				open: Boolean(custom),
				onOpenChange: (v) => !v && setCustom(null),
				locale,
				onConfirm: (line) => {
					add(restaurant.card.id, restaurant.card.name, line);
					trackAnalytics({ data: {
						name: "add_to_cart",
						payload: { item: line.itemId }
					} });
				}
			})
		] }),
		replaceWith && restaurant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-end bg-fg/40 p-4 md:place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-[var(--radius-xl)] bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: t("cart.replaceTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: t("cart.replaceBody", { name: replaceWith.name })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => setReplaceWith(null),
							children: t("cart.keep")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => {
								replaceAndAdd(restaurant.card.id, restaurant.card.name, replaceWith.line);
								setReplaceWith(null);
								toast.success(t("common.added"));
							},
							children: t("cart.replace")
						})]
					})
				]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: brand.appName
		})
	] });
}
//#endregion
export { RestaurantPage as component };
