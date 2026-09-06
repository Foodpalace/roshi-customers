import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { n as Input, t as Button } from "./input-ijR1xX1-.mjs";
import { l as useCurrentUserState, t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { c as updateProfile, n as ensureProfile, o as requestDeletion, r as getLoyalty } from "./account-kZN00YTD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-Dje_sBMn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { t, lang, setLang } = useT();
	const { brand, domain } = useBrand();
	const { user, isPending } = useCurrentUserState();
	const [name, setName] = (0, import_react.useState)(user?.displayName ?? "");
	const [phone, setPhone] = (0, import_react.useState)("");
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => ensureProfile({ data: {
			name: user?.displayName ?? void 0,
			language: lang
		} }),
		enabled: Boolean(user)
	});
	const loyalty = useQuery({
		queryKey: ["loyalty"],
		queryFn: () => getLoyalty(),
		enabled: Boolean(user)
	});
	(0, import_react.useEffect)(() => {
		if (profile.data?.profile?.display_name) setName(profile.data.profile.display_name);
		if (profile.data?.profile?.phone) setPhone(profile.data.profile.phone);
	}, [profile.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("account.title")
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: t("common.loading")
			}) : !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("account.guest") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("account.guestHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: t("common.signIn")
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					updateProfile({ data: {
						name,
						phone,
						language: lang
					} }).then(() => toast.success(t("account.saved")));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [t("account.name"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [t("account.phone"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							inputMode: "tel"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: user.primaryEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: t("common.save")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted",
					children: t("account.language")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lang === "en" ? "primary" : "outline",
						onClick: () => setLang("en"),
						children: t("common.english")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lang === "bn" ? "primary" : "outline",
						onClick: () => setLang("bn"),
						children: t("common.bengali")
					})]
				})]
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-[var(--radius-lg)] bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: t("account.loyalty", { name: brand.appName })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl tabular-nums",
						children: t("account.points", { n: loyalty.data?.loyalty.points ?? 0 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("account.loyaltyHint")
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-8 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/offers",
						children: t("account.offers")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/support",
						children: t("common.support")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/legal/privacy",
						children: t("account.privacy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/legal/terms",
						children: t("account.terms")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/legal/refunds",
						children: t("account.refunds")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline",
						to: "/about",
						children: t("account.about", { name: brand.appName })
					})
				]
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8",
				variant: "ghost",
				onClick: () => void requestDeletion().then(() => toast.success(t("account.deleteDone"))),
				children: t("account.delete")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: t("account.deleteHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs text-subtle",
				children: domain.webUrl
			})
		]
	}) });
}
//#endregion
export { AccountPage as component };
