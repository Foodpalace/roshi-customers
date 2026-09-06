import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as GROK_PROVIDERS } from "./server-CYBGq_QQ.mjs";
import { a as useBrand, o as useT } from "./router-C2RzFU3r.mjs";
import { n as Input, r as Wordmark, t as Button } from "./input-ijR1xX1-.mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-s5g0QMmy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { t } = useT();
	const { brand } = useBrand();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const onEmail = async () => {
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (res.error) throw new Error(res.error.message);
			}
			const res = await authClient.signIn.email({
				email,
				password,
				callbackURL: "/"
			});
			if (res.error) throw new Error(res.error.message);
			window.location.href = "/";
		} catch (e) {
			setError(e instanceof Error ? e.message : t("auth.error"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-3xl",
				children: t("auth.title", { name: brand.appName })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: t("auth.subtitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [
					GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
						children: p.idp === "google" ? t("auth.google") : t("auth.x")
					}, p.providerId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2",
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: t("auth.name"),
								autoComplete: "name"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: t("auth.email"),
								autoComplete: "email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: t("auth.password"),
								autoComplete: mode === "up" ? "new-password" : "current-password"
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								disabled: busy || password.length < 8,
								onClick: () => void onEmail(),
								children: mode === "up" ? t("auth.emailSignUp") : t("auth.emailSignIn")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "w-full text-sm text-primary",
								onClick: () => setMode(mode === "up" ? "in" : "up"),
								children: mode === "up" ? t("auth.switchToSignIn") : t("auth.switchToSignUp")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-3 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-fg",
							children: t("auth.phoneSoon")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("auth.phoneSoonHint") })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mt-8 text-sm text-muted",
				children: ["← ", brand.appName]
			})
		]
	});
}
//#endregion
export { Login as component };
