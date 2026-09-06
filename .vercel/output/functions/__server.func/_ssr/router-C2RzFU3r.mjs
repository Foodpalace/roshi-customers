import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as __exportAll, r as createServerFn } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-CYBGq_QQ.mjs";
import { t as DEFAULT_CONFIG } from "./defaults-BTJwphDE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C2RzFU3r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var trees = {
	en: {
		brandFallback: "Marketplace",
		common: {
			search: "Search",
			cart: "Cart",
			account: "Account",
			orders: "Orders",
			home: "Home",
			offers: "Offers",
			support: "Support",
			signIn: "Sign in",
			signOut: "Sign out",
			save: "Save",
			cancel: "Cancel",
			close: "Close",
			add: "Add",
			added: "Added",
			remove: "Remove",
			next: "Continue",
			retry: "Try again",
			loading: "Loading",
			veg: "Veg",
			nonVeg: "Non-veg",
			sample: "Sample",
			closed: "Closed",
			open: "Open",
			new: "New",
			ad: "Ad",
			viewAll: "See all",
			language: "Language",
			english: "English",
			bengali: "বাংলা",
			offline: "You are offline. Some actions will wait until you reconnect.",
			error: "Something went wrong",
			empty: "Nothing here yet"
		},
		home: {
			deliveringTo: "Delivering to",
			changeLocation: "Change",
			searchPlaceholder: "Search biryani, momo, pizza…",
			categories: "Categories",
			bestOffers: "Best offers",
			popular: "Popular near you",
			bestRated: "Best rated",
			fast: "Fast delivery",
			budget: "Budget friendly",
			newRestaurants: "New kitchens",
			recommended: "Recommended",
			reorder: "Order again",
			favourites: "Your favourites",
			sampleBanner: "Sample catalogue. These kitchens are not live vendors. Every card is marked Sample until a real kitchen is verified.",
			noResults: "No kitchens match those filters.",
			etaMin: "{n} min",
			deliveryFrom: "Delivery {fee}",
			minOrder: "Min {amount}",
			openNow: "Open now",
			vegOnly: "Pure veg",
			hasOffer: "Offers"
		},
		location: {
			title: "Delivery location",
			useCurrent: "Use current location",
			locating: "Finding you…",
			saved: "Saved addresses",
			areas: "Service areas",
			manual: "Enter an address",
			line1: "House / street",
			landmark: "Landmark",
			area: "Area",
			instructions: "Delivery notes",
			labelHome: "Home",
			labelWork: "Work",
			labelOther: "Other",
			saveAddress: "Save address",
			outside: "That point is outside the current service area. You can still browse a listed area.",
			geoDenied: "Location permission was denied. Pick an area instead.",
			simulatedPin: "Sample map pin — not a live GPS track."
		},
		restaurant: {
			minOrder: "Minimum {amount}",
			delivery: "Delivery {fee}",
			eta: "{n} minutes",
			closedNotice: "This kitchen is closed right now. You can browse the menu.",
			sampleNotice: "Sample kitchen for development. Not a live vendor.",
			recommended: "Recommended",
			add: "Add",
			customise: "Customise",
			unavailable: "Not available",
			spicy: "Spicy",
			bestseller: "Bestseller",
			searchMenu: "Search this menu"
		},
		customize: {
			title: "Customise",
			required: "Required",
			optional: "Optional",
			size: "Choose",
			instructions: "Any kitchen note?",
			instructionsPlaceholder: "Less oil, no onion…",
			quantity: "Quantity",
			addFor: "Add {amount}",
			update: "Update item"
		},
		cart: {
			title: "Cart",
			empty: "Your cart is empty",
			emptyHint: "Add something from a kitchen to see the full price here.",
			browse: "Browse kitchens",
			replaceTitle: "Start a new cart?",
			replaceBody: "Your cart has items from {name}. Adding this will clear that cart.",
			replace: "Replace cart",
			keep: "Keep current cart",
			from: "From {name}",
			item: "item",
			items: "items",
			subtotal: "Subtotal",
			toPay: "To pay",
			view: "View cart",
			checkout: "Checkout",
			coupon: "Have a code?",
			apply: "Apply",
			applied: "Applied",
			invalidCoupon: "This code cannot be used on this order.",
			clear: "Clear cart",
			savings: "You save {amount}",
			includesTax: "Food prices include applicable kitchen taxes.",
			minOrder: "This kitchen needs a minimum of {amount}."
		},
		checkout: {
			title: "Checkout",
			address: "Deliver to",
			addAddress: "Add address",
			pay: "Pay",
			cod: "Cash on delivery",
			codHint: "Pay the rider in cash or UPI at the door. No card details collected.",
			upi: "UPI",
			upiUnavailable: "Online UPI is not live. A payment provider (Razorpay or Cashfree) still needs KYC and keys.",
			upiSandbox: "Sandbox UPI (not a real transfer)",
			upiSandboxHint: "Marks the order as paid in this development environment only. No money moves.",
			place: "Place order · {amount}",
			placing: "Placing order…",
			signInFirst: "Sign in to place this order.",
			needAddress: "Add a delivery address to continue.",
			failed: "Could not place the order. No charge was made.",
			notes: "Note for the kitchen",
			blocked: "This order cannot be placed yet."
		},
		orders: {
			title: "Orders",
			empty: "No orders yet",
			emptyHint: "When you place an order, it will show up here with live status.",
			active: "Active",
			past: "Past",
			reorder: "Order again",
			track: "Track",
			help: "Help",
			placed: "Order confirmed",
			accepted: "Kitchen accepted",
			preparing: "Preparing",
			ready: "Ready",
			riderAssigned: "Rider assigned",
			pickedUp: "Picked up",
			onTheWay: "On the way",
			delivered: "Delivered",
			rejected: "Kitchen declined",
			cancelled: "Cancelled",
			refunded: "Refunded",
			failed: "Payment failed",
			deliveryFailed: "Delivery failed",
			otp: "Delivery PIN {code}",
			otpHint: "Share this PIN only with the rider at your door.",
			simulate: "Advance sample kitchen status",
			simulateHint: "Sample kitchens can step forward so you can test tracking. This is not a live dispatch.",
			noGps: "Live rider GPS is not shown. Coordinates would only appear after a real rider app is connected.",
			cancelOrder: "Cancel order",
			cancelPolicy: "You can cancel until the kitchen starts preparing.",
			invoice: "Bill",
			total: "Total",
			copyId: "Order {id}"
		},
		quote: {
			FOOD: "Food",
			RESTAURANT_DISCOUNT: "Kitchen discount",
			PLATFORM_DISCOUNT: "Platform discount",
			PACKAGING: "Packaging",
			DELIVERY: "Delivery",
			SERVICE: "Service fee",
			TAX: "Tax",
			TOTAL: "To pay"
		},
		account: {
			title: "Account",
			guest: "Welcome",
			guestHint: "Sign in to save addresses, orders and offers.",
			profile: "Profile",
			name: "Name",
			phone: "Phone",
			email: "Email",
			addresses: "Addresses",
			favourites: "Favourites",
			offers: "Offers",
			loyalty: "{name} points",
			loyaltyHint: "Points are a loyalty ledger, not a stored-value wallet or cash.",
			points: "{n} points",
			notifications: "Notifications",
			privacy: "Privacy",
			terms: "Terms",
			refunds: "Refunds",
			about: "About {name}",
			delete: "Request account deletion",
			deleteHint: "We will record the request. A person still has to complete legal deletion after launch.",
			deleteDone: "Deletion request recorded.",
			language: "App language",
			saved: "Saved"
		},
		offers: {
			title: "Offers",
			empty: "No offers on this order yet",
			fundedByRestaurant: "Funded by the kitchen",
			fundedByPlatform: "Funded by the platform",
			fundedByShared: "Shared by kitchen and platform",
			min: "Min order {amount}"
		},
		support: {
			title: "Support",
			hint: "Tell us what happened. We will not auto-refund unless the policy for this order allows it.",
			topic: "Topic",
			topics: {
				where: "Where is my order?",
				issue: "Order issue",
				missing: "Missing item",
				wrong: "Wrong item",
				payment: "Payment issue",
				cancel: "Cancellation",
				refund: "Refund",
				restaurant: "Kitchen issue",
				delivery: "Delivery issue",
				other: "Other"
			},
			message: "Message",
			send: "Send",
			sent: "Request sent",
			tickets: "Your requests"
		},
		auth: {
			title: "Sign in to {name}",
			subtitle: "Use Google, X, or email. Phone OTP needs an SMS provider, which is not connected yet.",
			google: "Continue with Google",
			x: "Continue with X",
			email: "Email",
			password: "Password",
			name: "Name",
			emailSignIn: "Sign in with email",
			emailSignUp: "Create account",
			switchToSignUp: "Need an account? Create one",
			switchToSignIn: "Already have an account? Sign in",
			phoneSoon: "Phone OTP",
			phoneSoonHint: "Adapter is ready. MSG91 / DLT sender ID is an external activation step — not available in this environment.",
			error: "Sign-in failed. Try again.",
			disabled: "Sign-in is disabled in this environment."
		},
		legal: {
			privacy: "Privacy notice",
			terms: "Terms of use",
			refunds: "Refunds and cancellation",
			grievance: "Grievance"
		},
		a11y: {
			skip: "Skip to menu",
			openMenu: "Open menu",
			closeDialog: "Close dialog",
			decreaseQty: "Decrease quantity",
			increaseQty: "Increase quantity"
		}
	},
	bn: {
		brandFallback: "মার্কেটপ্লেস",
		common: {
			search: "খুঁজুন",
			cart: "কার্ট",
			account: "অ্যাকাউন্ট",
			orders: "অর্ডার",
			home: "হোম",
			offers: "অফার",
			support: "সহায়তা",
			signIn: "সাইন ইন",
			signOut: "সাইন আউট",
			save: "সেভ",
			cancel: "বাদ দিন",
			close: "বন্ধ",
			add: "যোগ",
			added: "যোগ হয়েছে",
			remove: "সরান",
			next: "এগোন",
			retry: "আবার চেষ্টা",
			loading: "লোড হচ্ছে",
			veg: "নিরামিষ",
			nonVeg: "আমিষ",
			sample: "নমুনা",
			closed: "বন্ধ",
			open: "খোলা",
			new: "নতুন",
			ad: "বিজ্ঞাপন",
			viewAll: "সব দেখুন",
			language: "ভাষা",
			english: "English",
			bengali: "বাংলা",
			offline: "আপনি অফলাইন। সংযোগ ফিরলে কাজগুলো হবে।",
			error: "কিছু গন্ডগোল হয়েছে",
			empty: "এখন কিছু নেই"
		},
		home: {
			deliveringTo: "ডেলিভারি",
			changeLocation: "বদলান",
			searchPlaceholder: "বিরিয়ানি, মোমো, পিজ্জা খুঁজুন…",
			categories: "ক্যাটাগরি",
			bestOffers: "সেরা অফার",
			popular: "আপনার কাছে জনপ্রিয়",
			bestRated: "সেরা রেটিং",
			fast: "দ্রুত ডেলিভারি",
			budget: "সাশ্রয়ী",
			newRestaurants: "নতুন কিচেন",
			recommended: "সুপারিশ",
			reorder: "আবার অর্ডার",
			favourites: "পছন্দের",
			sampleBanner: "নমুনা ক্যাটালগ। এই কিচেনগুলো এখন লাইভ ভেন্ডর নয়। যাচাই হওয়া পর্যন্ত প্রতিটি কার্ডে নমুনা লেখা থাকবে।",
			noResults: "এই ফিল্টারে কোনো কিচেন নেই।",
			etaMin: "{n} মিনিট",
			deliveryFrom: "ডেলিভারি {fee}",
			minOrder: "সর্বনিম্ন {amount}",
			openNow: "এখন খোলা",
			vegOnly: "শুধু নিরামিষ",
			hasOffer: "অফার"
		},
		location: {
			title: "ডেলিভারি ঠিকানা",
			useCurrent: "এখনকার লোকেশন",
			locating: "খোঁজা হচ্ছে…",
			saved: "সেভ করা ঠিকানা",
			areas: "সার্ভিস এলাকা",
			manual: "ঠিকানা লিখুন",
			line1: "বাড়ি / রাস্তা",
			landmark: "ল্যান্ডমার্ক",
			area: "এলাকা",
			instructions: "ডেলিভারি নোট",
			labelHome: "বাড়ি",
			labelWork: "কাজ",
			labelOther: "অন্য",
			saveAddress: "ঠিকানা সেভ",
			outside: "এই জায়গা এখনকার সার্ভিস এলাকার বাইরে। তালিকার একটি এলাকা বেছে নিতে পারেন।",
			geoDenied: "লোকেশন অনুমতি দেওয়া হয়নি। একটি এলাকা বেছে নিন।",
			simulatedPin: "নমুনা ম্যাপ পিন — লাইভ জিপিএস নয়।"
		},
		restaurant: {
			minOrder: "সর্বনিম্ন {amount}",
			delivery: "ডেলিভারি {fee}",
			eta: "{n} মিনিট",
			closedNotice: "কিচেন এখন বন্ধ। মেনু দেখতে পারেন।",
			sampleNotice: "ডেভেলপমেন্টের নমুনা কিচেন। লাইভ ভেন্ডর নয়।",
			recommended: "সুপারিশ",
			add: "যোগ",
			customise: "কাস্টমাইজ",
			unavailable: "পাওয়া যাচ্ছে না",
			spicy: "ঝাল",
			bestseller: "বেস্টসেলার",
			searchMenu: "এই মেনুতে খুঁজুন"
		},
		customize: {
			title: "কাস্টমাইজ",
			required: "আবশ্যক",
			optional: "ঐচ্ছিক",
			size: "বেছে নিন",
			instructions: "কিচেনের জন্য নোট?",
			instructionsPlaceholder: "কম তেল, পেঁয়াজ ছাড়া…",
			quantity: "পরিমাণ",
			addFor: "{amount} তে যোগ",
			update: "আপডেট"
		},
		cart: {
			title: "কার্ট",
			empty: "কার্ট খালি",
			emptyHint: "একটি কিচেন থেকে কিছু যোগ করলে এখানে পুরো দাম দেখাবে।",
			browse: "কিচেন দেখুন",
			replaceTitle: "নতুন কার্ট শুরু?",
			replaceBody: "কার্টে {name} থেকে আইটেম আছে। এটি যোগ করলে সেই কার্ট মুছে যাবে।",
			replace: "কার্ট বদলান",
			keep: "এখনকার কার্ট রাখুন",
			from: "{name} থেকে",
			item: "আইটেম",
			items: "আইটেম",
			subtotal: "সাবটোটাল",
			toPay: "মোট",
			view: "কার্ট দেখুন",
			checkout: "চেকআউট",
			coupon: "কোড আছে?",
			apply: "লাগান",
			applied: "লাগানো হয়েছে",
			invalidCoupon: "এই অর্ডারে কোডটি ব্যবহার করা যাবে না।",
			clear: "কার্ট খালি",
			savings: "সাশ্রয় {amount}",
			includesTax: "খাবারের দামে কিচেনের প্রযোজ্য কর অন্তর্ভুক্ত।",
			minOrder: "এই কিচেনের সর্বনিম্ন অর্ডার {amount}।"
		},
		checkout: {
			title: "চেকআউট",
			address: "ডেলিভারি",
			addAddress: "ঠিকানা যোগ",
			pay: "পেমেন্ট",
			cod: "ক্যাশ অন ডেলিভারি",
			codHint: "রাইডারকে দরজায় নগদ বা ইউপিআই দিন। কার্ড নম্বর নেওয়া হয় না।",
			upi: "ইউপিআই",
			upiUnavailable: "অনলাইন ইউপিআই এখন লাইভ নয়। রাজরপে/ক্যাশফ্রি কি এবং কেওয়াইসি এখনও বাকি।",
			upiSandbox: "স্যান্ডবক্স ইউপিআই (আসল লেনদেন নয়)",
			upiSandboxHint: "শুধু এই ডেভেলপমেন্ট পরিবেশে অর্ডার পেড দেখাবে। টাকা যায় না।",
			place: "অর্ডার করুন · {amount}",
			placing: "অর্ডার হচ্ছে…",
			signInFirst: "অর্ডার করতে সাইন ইন করুন।",
			needAddress: "এগোতে একটি ডেলিভারি ঠিকানা দিন।",
			failed: "অর্ডার হয়নি। কোনো টাকা কাটা হয়নি।",
			notes: "কিচেনের নোট",
			blocked: "এই অর্ডার এখন করা যাবে না।"
		},
		orders: {
			title: "অর্ডার",
			empty: "এখনও অর্ডার নেই",
			emptyHint: "অর্ডার করলে এখানে স্ট্যাটাস দেখাবে।",
			active: "চলমান",
			past: "আগে",
			reorder: "আবার অর্ডার",
			track: "ট্র্যাক",
			help: "সাহায্য",
			placed: "অর্ডার নিশ্চিত",
			accepted: "কিচেন রাজি",
			preparing: "তৈরি হচ্ছে",
			ready: "রেডি",
			riderAssigned: "রাইডার নিযুক্ত",
			pickedUp: "তুলে নিয়েছে",
			onTheWay: "পথে",
			delivered: "পৌঁছেছে",
			rejected: "কিচেন প্রত্যাখ্যান",
			cancelled: "বাতিল",
			refunded: "রিফান্ড",
			failed: "পেমেন্ট হয়নি",
			deliveryFailed: "ডেলিভারি হয়নি",
			otp: "ডেলিভারি পিন {code}",
			otpHint: "এই পিন শুধু দরজায় রাইডারকে বলুন।",
			simulate: "নমুনা কিচেনের স্ট্যাটাস এগোান",
			simulateHint: "নমুনা কিচেনে ট্র্যাকিং টেস্টের জন্য স্ট্যাটাস এগোানো যায়। এটি লাইভ ডিসপ্যাচ নয়।",
			noGps: "লাইভ রাইডার জিপিএস দেখানো হয় না। আসল রাইডার অ্যাপ যুক্ত হলেই স্থানাঙ্ক আসবে।",
			cancelOrder: "অর্ডার বাতিল",
			cancelPolicy: "কিচেন রান্না শুরু করার আগে বাতিল করতে পারেন।",
			invoice: "বিল",
			total: "মোট",
			copyId: "অর্ডার {id}"
		},
		quote: {
			FOOD: "খাবার",
			RESTAURANT_DISCOUNT: "কিচেনের ছাড়",
			PLATFORM_DISCOUNT: "প্ল্যাটফর্মের ছাড়",
			PACKAGING: "প্যাকেজিং",
			DELIVERY: "ডেলিভারি",
			SERVICE: "সার্ভিস ফি",
			TAX: "কর",
			TOTAL: "মোট"
		},
		account: {
			title: "অ্যাকাউন্ট",
			guest: "স্বাগতম",
			guestHint: "ঠিকানা, অর্ডার ও অফার সেভ করতে সাইন ইন করুন।",
			profile: "প্রোফাইল",
			name: "নাম",
			phone: "ফোন",
			email: "ইমেইল",
			addresses: "ঠিকানা",
			favourites: "পছন্দ",
			offers: "অফার",
			loyalty: "{name} পয়েন্ট",
			loyaltyHint: "পয়েন্ট একটি লয়্যালটি লেজার, ওয়ালেট বা নগদ নয়।",
			points: "{n} পয়েন্ট",
			notifications: "নোটিফিকেশন",
			privacy: "গোপনীয়তা",
			terms: "শর্তাবলি",
			refunds: "রিফান্ড",
			about: "{name} সম্পর্কে",
			delete: "অ্যাকাউন্ট মুছে ফেলার অনুরোধ",
			deleteHint: "অনুরোধ রেকর্ড হবে। লঞ্চের পর আইনানুগ মুছে ফেলা আলাদা ধাপ।",
			deleteDone: "মুছে ফেলার অনুরোধ রেকর্ড হয়েছে।",
			language: "অ্যাপের ভাষা",
			saved: "সেভ হয়েছে"
		},
		offers: {
			title: "অফার",
			empty: "এই অর্ডারে এখন অফার নেই",
			fundedByRestaurant: "কিচেনের খরচে",
			fundedByPlatform: "প্ল্যাটফর্মের খরচে",
			fundedByShared: "কিচেন ও প্ল্যাটফর্ম ভাগ করে",
			min: "সর্বনিম্ন {amount}"
		},
		support: {
			title: "সহায়তা",
			hint: "কী হয়েছে বলুন। পলিসি না থাকলে স্বয়ংক্রিয় রিফান্ড হবে না।",
			topic: "বিষয়",
			topics: {
				where: "আমার অর্ডার কোথায়?",
				issue: "অর্ডারে সমস্যা",
				missing: "আইটেম কম পড়েছে",
				wrong: "ভুল আইটেম",
				payment: "পেমেন্ট সমস্যা",
				cancel: "বাতিল",
				refund: "রিফান্ড",
				restaurant: "কিচেনের সমস্যা",
				delivery: "ডেলিভারি সমস্যা",
				other: "অন্য"
			},
			message: "বার্তা",
			send: "পাঠান",
			sent: "অনুরোধ গেছে",
			tickets: "আপনার অনুরোধ"
		},
		auth: {
			title: "{name} এ সাইন ইন",
			subtitle: "Google, X, বা ইমেইল ব্যবহার করুন। ফোন ওটিপির জন্য এসএমএস প্রোভাইডার এখন যুক্ত নয়।",
			google: "Google দিয়ে চালিয়ে যান",
			x: "X দিয়ে চালিয়ে যান",
			email: "ইমেইল",
			password: "পাসওয়ার্ড",
			name: "নাম",
			emailSignIn: "ইমেইলে সাইন ইন",
			emailSignUp: "অ্যাকাউন্ট খুলুন",
			switchToSignUp: "অ্যাকাউন্ট নেই? খুলুন",
			switchToSignIn: "অ্যাকাউন্ট আছে? সাইন ইন",
			phoneSoon: "ফোন ওটিপি",
			phoneSoonHint: "অ্যাডাপ্টার তৈরি। MSG91 / DLT সেন্ডার আইডি বাইরের অ্যাকটিভেশন — এই পরিবেশে নেই।",
			error: "সাইন ইন হয়নি। আবার চেষ্টা করুন।",
			disabled: "এই পরিবেশে সাইন ইন বন্ধ।"
		},
		legal: {
			privacy: "গোপনীয়তা",
			terms: "ব্যবহারের শর্ত",
			refunds: "রিফান্ড ও বাতিল",
			grievance: "অভিযোগ"
		},
		a11y: {
			skip: "মেনুতে যান",
			openMenu: "মেনু খুলুন",
			closeDialog: "ডায়ালগ বন্ধ",
			decreaseQty: "কমান",
			increaseQty: "বাড়ান"
		}
	}
};
function isLang(value) {
	return value === "en" || value === "bn";
}
function lookup(tree, path) {
	const parts = path.split(".");
	let cur = tree;
	for (const p of parts) {
		if (!cur || typeof cur !== "object") return void 0;
		cur = cur[p];
	}
	return typeof cur === "string" ? cur : void 0;
}
function translate(lang, path, vars) {
	const raw = lookup(trees[lang], path) ?? lookup(trees.en, path) ?? path;
	if (!vars) return raw;
	return raw.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 15e3,
	refetchOnWindowFocus: false
} } });
var BrandContext = (0, import_react.createContext)(DEFAULT_CONFIG);
function useBrand() {
	return (0, import_react.useContext)(BrandContext);
}
var I18nContext = (0, import_react.createContext)({
	lang: "en",
	setLang: () => void 0,
	t: (path, vars) => translate("en", path, vars)
});
function useT() {
	return (0, import_react.useContext)(I18nContext);
}
function AppProviders({ children, config }) {
	const [lang, setLangState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "en";
		const stored = window.localStorage.getItem("marketplace-lang");
		return isLang(stored) ? stored : "en";
	});
	(0, import_react.useEffect)(() => {
		document.title = config.brand.seoTitle;
		document.querySelector("link[rel=\"icon\"]")?.setAttribute("href", config.brand.faviconUrl || "/favicon.svg");
		document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", config.brand.primaryColor);
		document.documentElement.lang = lang === "bn" ? "bn" : "en";
		document.documentElement.style.setProperty("--radius-lg", `${config.brand.radiusPx}px`);
	}, [config, lang]);
	const setLang = (next) => {
		setLangState(next);
		if (typeof window !== "undefined") window.localStorage.setItem("marketplace-lang", next);
		if (typeof document !== "undefined") document.documentElement.lang = next === "bn" ? "bn" : "en";
	};
	const value = (0, import_react.useMemo)(() => ({
		lang,
		setLang,
		t: (path, vars) => translate(lang, path, vars)
	}), [lang]);
	const brandStyle = {
		["--color-primary"]: config.brand.primaryColor,
		["--color-accent"]: config.brand.accentColor,
		["--color-bg"]: config.brand.backgroundColor,
		["--color-surface"]: config.brand.surfaceColor,
		["--color-fg"]: config.brand.textColor,
		["--color-muted"]: config.brand.mutedColor
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandContext.Provider, {
			value: config,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(I18nContext.Provider, {
				value,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: brandStyle,
					className: "min-h-dvh bg-bg text-fg",
					children
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					richColors: false
				})]
			})
		})
	});
}
var styles_default = "/assets/styles-DvAqCveb.css";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var fetchConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("5386a935e17f79c3770d46a1393dbf6b85ce8fecbccf4551bdde029dda3f8e3a"));
var Route$17 = createRootRoute({
	beforeLoad: async () => {
		const [sessionUser, config] = await Promise.all([fetchSessionUser(), fetchConfig()]);
		return {
			sessionUser,
			config
		};
	},
	head: ({ loaderData, match }) => {
		const config = (match?.context)?.config ?? DEFAULT_CONFIG;
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1, viewport-fit=cover"
				},
				{ title: config.brand.seoTitle },
				{
					name: "description",
					content: config.brand.seoDescription
				},
				{
					name: "theme-color",
					content: config.brand.primaryColor
				}
			],
			links: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: config.brand.faviconUrl || "/favicon.svg"
				},
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "manifest",
					href: "/__grok/manifest.webmanifest"
				},
				{
					rel: "apple-touch-icon",
					href: "/apple-touch-icon.png"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap"
				}
			]
		};
	},
	component: Root
});
function Root() {
	const config = Route$17.useRouteContext().config ?? DEFAULT_CONFIG;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, {
				config,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$15 = () => import("./routes-C6Grib--.mjs");
var Route$16 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./about-BmvsHuwR.mjs");
var Route$15 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./cart-Cg2WKMH8.mjs");
var Route$14 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./checkout-BZIU83Fz.mjs");
var Route$13 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./login-s5g0QMmy.mjs");
var Route$12 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./offers-Dsy41wyQ.mjs");
var Route$11 = createFileRoute("/offers")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./search-HLs9J3ex.mjs");
var Route$10 = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : "",
		category: typeof raw.category === "string" ? raw.category : void 0,
		veg: raw.veg === true || raw.veg === "true",
		openNow: raw.openNow === true || raw.openNow === "true"
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./support-CZijWCNo.mjs");
var Route$9 = createFileRoute("/support")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./account-Dje_sBMn.mjs");
var Route$8 = createFileRoute("/account/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./brand-x2QDLbyY.mjs");
var Route$7 = createFileRoute("/dev/brand")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./privacy-Dquuh9b1.mjs");
var Route$6 = createFileRoute("/legal/privacy")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./refunds-BkkOl2cU.mjs");
var Route$5 = createFileRoute("/legal/refunds")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./terms-ei8xXDVx.mjs");
var Route$4 = createFileRoute("/legal/terms")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./orders-DAqZOygs.mjs");
var Route$3 = createFileRoute("/orders/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_id-CkUOavPA.mjs");
var Route$2 = createFileRoute("/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_slug-jvcEAhUZ.mjs");
var Route$1 = createFileRoute("/r/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AboutRoute = Route$15.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$17
});
var CartRoute = Route$14.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$17
});
var CheckoutRoute = Route$13.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$17
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$17
});
var OffersRoute = Route$11.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => Route$17
});
var SearchRoute = Route$10.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$17
});
var SupportRoute = Route$9.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => Route$17
});
var AccountIndexRoute = Route$8.update({
	id: "/account/",
	path: "/account/",
	getParentRoute: () => Route$17
});
var DevBrandRoute = Route$7.update({
	id: "/dev/brand",
	path: "/dev/brand",
	getParentRoute: () => Route$17
});
var LegalPrivacyRoute = Route$6.update({
	id: "/legal/privacy",
	path: "/legal/privacy",
	getParentRoute: () => Route$17
});
var LegalRefundsRoute = Route$5.update({
	id: "/legal/refunds",
	path: "/legal/refunds",
	getParentRoute: () => Route$17
});
var LegalTermsRoute = Route$4.update({
	id: "/legal/terms",
	path: "/legal/terms",
	getParentRoute: () => Route$17
});
var OrdersIndexRoute = Route$3.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => Route$17
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	CartRoute,
	CheckoutRoute,
	LoginRoute,
	OffersRoute,
	SearchRoute,
	SupportRoute,
	DevBrandRoute,
	LegalPrivacyRoute,
	LegalRefundsRoute,
	LegalTermsRoute,
	OrdersIdRoute: Route$2.update({
		id: "/orders/$id",
		path: "/orders/$id",
		getParentRoute: () => Route$17
	}),
	RSlugRoute: Route$1.update({
		id: "/r/$slug",
		path: "/r/$slug",
		getParentRoute: () => Route$17
	}),
	AccountIndexRoute,
	OrdersIndexRoute,
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$17
	})
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useBrand as a, Route$10 as i, Route$1 as n, useT as o, Route$2 as r, router_exports as t };
