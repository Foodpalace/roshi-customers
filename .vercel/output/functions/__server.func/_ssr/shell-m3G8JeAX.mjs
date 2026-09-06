import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogTitle, i as DialogPortal, n as DialogContent, r as DialogOverlay, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { c as House, d as ClipboardList, i as Search, r as ShoppingBag, t as UserRound } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { i as cn, n as Input, r as Wordmark, t as Button } from "./input-ijR1xX1-.mjs";
import { i as signOut, t as authClient } from "./client-CVqXY6bk.mjs";
import { t as distanceKm } from "./geo-VuaDxie_.mjs";
import { r as trackAnalytics } from "./quote-Clw5othl.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-m3G8JeAX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listZones = createServerFn({ method: "GET" }).handler(createSsrRpc("54020ec2d54f74887dbac2468d373b9c4d9a7ba5cc3449457c4dd71e48c6b697"));
var listCategories = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("599f6ef157822c87192cc0213fef3f49c7a84d058a3039012c70ae9f73b7e713"));
var listRestaurants = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4ca646786be2f0e1a862acf8879f6e338fb929dc92da415872ec15bf04aa0a3f"));
var getRestaurant = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("dcf312928525099f8b792af3d56ce0d707c4a03392b5cabb690055496ce68271"));
var DEFAULT_LOCATION = {
	cityId: "city_sribhumi",
	cityName: "Sribhumi",
	zoneId: "zone_bazaar",
	zoneName: "Central Bazaar",
	label: "Central Bazaar",
	line1: "Central Bazaar, Sribhumi",
	lat: 24.8688,
	lng: 92.3511
};
var useLocationStore = create()(persist((set) => ({
	location: DEFAULT_LOCATION,
	setLocation: (location) => set({ location })
}), { name: "marketplace-location" }));
function LocationDialog({ open, onOpenChange }) {
	const { t } = useT();
	const setLocation = useLocationStore((s) => s.setLocation);
	const { data, isError, refetch } = useQuery({
		queryKey: ["zones"],
		queryFn: () => listZones()
	});
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [line1, setLine1] = (0, import_react.useState)("");
	const [landmark, setLandmark] = (0, import_react.useState)("");
	const pick = (loc) => {
		setLocation(loc);
		trackAnalytics({ data: {
			name: "location_selected",
			payload: { zoneId: loc.zoneId }
		} });
		onOpenChange(false);
	};
	const useGeo = async () => {
		if (!navigator.geolocation) {
			toast.error(t("location.geoDenied"));
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			setLocating(false);
			const here = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			};
			const zones = data?.zones ?? [];
			if (!zones.length) return;
			const nearest = [...zones].sort((a, b) => distanceKm(here, {
				lat: a.lat,
				lng: a.lng
			}) - distanceKm(here, {
				lat: b.lat,
				lng: b.lng
			}))[0];
			if (distanceKm(here, {
				lat: nearest.lat,
				lng: nearest.lng
			}) > 12) toast.message(t("location.outside"));
			pick({
				cityId: nearest.cityId,
				cityName: nearest.cityName,
				zoneId: nearest.id,
				zoneName: nearest.name,
				label: nearest.name,
				line1: line1 || nearest.name,
				lat: here.lat,
				lng: here.lng
			});
		}, () => {
			setLocating(false);
			toast.error(t("location.geoDenied"));
		}, {
			enableHighAccuracy: true,
			timeout: 8e3
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-fg/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[var(--radius-2xl)] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:inset-auto md:left-1/2 md:top-1/2 md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-xl)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl",
					children: t("location.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: t("location.simulatedPin")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-4 w-full",
					onClick: () => void useGeo(),
					disabled: locating,
					children: locating ? t("location.locating") : t("location.useCurrent")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-5 text-sm font-medium text-muted",
					children: t("location.areas")
				}),
				isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 text-sm text-primary",
					onClick: () => void refetch(),
					children: t("common.retry")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: (data?.zones ?? []).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex min-h-12 w-full items-center justify-between rounded-[var(--radius-lg)] bg-bg px-3 text-left",
						onClick: () => pick({
							cityId: z.cityId,
							cityName: z.cityName,
							zoneId: z.id,
							zoneName: z.name,
							label: z.name,
							line1: line1 || z.name,
							lat: z.lat,
							lng: z.lng
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: z.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: z.cityName
						})] })
					}) }, z.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-5 text-sm font-medium text-muted",
					children: t("location.manual")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: line1,
						onChange: (e) => setLine1(e.target.value),
						placeholder: t("location.line1"),
						"aria-label": t("location.line1")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: landmark,
						onChange: (e) => setLandmark(e.target.value),
						placeholder: t("location.landmark"),
						"aria-label": t("location.landmark")
					})]
				})
			]
		})] })
	});
}
function mergeItem(items, item) {
	if (!items.find((i) => i.key === item.key)) return [...items, item];
	return items.map((i) => i.key === item.key ? {
		...i,
		quantity: Math.min(20, i.quantity + item.quantity)
	} : i);
}
var useCartStore = create()(persist((set, get) => ({
	restaurantId: null,
	restaurantName: "",
	coupon: "",
	items: [],
	setRestaurant: (id, name) => set({
		restaurantId: id,
		restaurantName: name
	}),
	addItem: (restaurantId, restaurantName, item) => {
		const cur = get();
		if (cur.restaurantId && cur.restaurantId !== restaurantId && cur.items.length) return "replace";
		set({
			restaurantId,
			restaurantName,
			items: mergeItem(cur.restaurantId === restaurantId ? cur.items : [], item)
		});
		return "ok";
	},
	replaceAndAdd: (restaurantId, restaurantName, item) => {
		set({
			restaurantId,
			restaurantName,
			items: [item],
			coupon: ""
		});
	},
	updateQty: (key, quantity) => {
		if (quantity <= 0) {
			set({ items: get().items.filter((i) => i.key !== key) });
			return;
		}
		set({ items: get().items.map((i) => i.key === key ? {
			...i,
			quantity
		} : i) });
	},
	remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
	setCoupon: (code) => set({ coupon: code }),
	clear: () => set({
		restaurantId: null,
		restaurantName: "",
		items: [],
		coupon: ""
	})
}), { name: "marketplace-cart" }));
function cartKey(item) {
	return [
		item.itemId,
		item.variantId ?? "",
		[...item.addonIds].sort().join(","),
		item.instructions
	].join("|");
}
function cartCount(items) {
	return items.reduce((s, i) => s + i.quantity, 0);
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function CustomerShell({ children, onSearch }) {
	const { t } = useT();
	const { brand } = useBrand();
	const location = useLocationStore((s) => s.location);
	const count = cartCount(useCartStore((s) => s.items));
	const path = useRouterState({ select: (s) => s.location.pathname });
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [locOpen, setLocOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg pb-24 md:max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2",
				children: t("a11y.skip")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-bg/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-full bg-surface-2" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-sm font-medium text-primary",
								children: t("common.signIn")
							}) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setLocOpen(true),
						className: "mt-3 flex min-h-11 w-full items-center justify-between rounded-[var(--radius-lg)] bg-surface px-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs uppercase tracking-wide text-muted",
							children: t("home.deliveringTo")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: location.label
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-primary",
							children: t("home.changeLocation")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSearch ? onSearch() : void navigate({ to: "/search" }),
						className: "mt-2 flex min-h-11 w-full items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface px-3 text-left text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-4",
							"aria-hidden": true
						}), t("home.searchPlaceholder")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "flex-1",
				children
			}),
			count > 0 && path !== "/cart" && path !== "/checkout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cart",
					className: "pointer-events-auto flex min-h-12 w-full max-w-lg items-center justify-between rounded-[var(--radius-xl)] bg-primary px-4 text-primary-fg no-underline shadow-md md:max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						count,
						" ",
						count === 1 ? t("cart.item") : t("cart.items")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
							className: "size-4",
							"aria-hidden": true
						}), t("cart.view")]
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": brand.appName,
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mx-auto grid max-w-lg grid-cols-4 md:max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/",
							icon: House,
							label: t("common.home"),
							active: path === "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/search",
							icon: Search,
							label: t("common.search"),
							active: path.startsWith("/search")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/orders",
							icon: ClipboardList,
							label: t("common.orders"),
							active: path.startsWith("/orders")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							to: "/account",
							icon: UserRound,
							label: t("common.account"),
							active: path.startsWith("/account")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationDialog, {
				open: locOpen,
				onOpenChange: setLocOpen
			})
		]
	});
}
function NavItem({ to, icon: Icon, label, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs no-underline", active ? "text-primary" : "text-muted"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			"aria-hidden": true
		}), label]
	}) });
}
//#endregion
export { listCategories as a, useCurrentUser as c, getRestaurant as i, useCurrentUserState as l, RedirectToSignIn as n, listRestaurants as o, cartKey as r, useCartStore as s, CustomerShell as t, useLocationStore as u };
