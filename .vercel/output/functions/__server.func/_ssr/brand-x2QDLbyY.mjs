import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBrand } from "./router-C2RzFU3r.mjs";
import { n as Input, t as Button } from "./input-ijR1xX1-.mjs";
import { l as useCurrentUserState, n as RedirectToSignIn, t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-x2QDLbyY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).handler(createSsrRpc("9cd41fe297d7c46b692266979e68200df6bb20b91f694bf74ab39a178dfce9b2"));
var updateBrandConfig = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7de286efa5579bcfe3b7037b0e4f5b8090fe80525f7f74ca20814ba33b7a26da"));
function BrandDevPage() {
	const config = useBrand();
	const { user, isPending } = useCurrentUserState();
	const [appName, setAppName] = (0, import_react.useState)(config.brand.appName);
	const [tagline, setTagline] = (0, import_react.useState)(config.brand.tagline);
	const [primaryColor, setPrimaryColor] = (0, import_react.useState)(config.brand.primaryColor);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6",
		children: "Loading"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!config.marketplace.allowDevTools) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6 text-sm",
		children: "Runtime brand editing is off."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-warn",
				children: "Development configuration"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Brand"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Change these values in the database. The rest of the app reads them from one config object. Turn off allowDevTools before a public launch."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					updateBrandConfig({ data: { brand: {
						appName,
						tagline,
						primaryColor,
						seoTitle: `${appName} — food delivery in Sribhumi`
					} } }).then(() => {
						toast.success("Saved. Reload to see every surface pick up the new name.");
						window.location.reload();
					}).catch((err) => toast.error(err.message));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["App name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: appName,
							onChange: (e) => setAppName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Tagline", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: tagline,
							onChange: (e) => setTagline(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Primary colour", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: primaryColor,
							onChange: (e) => setPrimaryColor(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save brand"
					})
				]
			})
		]
	}) });
}
//#endregion
export { BrandDevPage as component };
