import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as Route$10, o as useT } from "./router-C2RzFU3r.mjs";
import { n as Input } from "./input-ijR1xX1-.mjs";
import { r as trackAnalytics } from "./quote-Clw5othl.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { t as HomeFeed } from "./home-feed-1jN8RQWb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-HLs9J3ex.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { t } = useT();
	const search = Route$10.useSearch();
	const navigate = useNavigate({ from: "/search" });
	const [draft, setDraft] = (0, import_react.useState)(search.q ?? "");
	const commit = (next) => {
		navigate({ search: next });
		if (next.q) trackAnalytics({ data: {
			name: "search",
			payload: { q: next.q }
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CustomerShell, {
		onSearch: () => void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					commit({
						...search,
						q: draft
					});
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: t("home.searchPlaceholder"),
					"aria-label": t("common.search"),
					autoFocus: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: Boolean(search.veg),
					onClick: () => commit({
						...search,
						veg: !search.veg
					}),
					label: t("home.vegOnly")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: Boolean(search.openNow),
					onClick: () => commit({
						...search,
						openNow: !search.openNow
					}),
					label: t("home.openNow")
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFeed, {
			q: search.q,
			veg: search.veg,
			openNow: search.openNow,
			category: search.category
		})]
	});
}
function FilterChip({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 shrink-0 rounded-full px-3 text-sm ${active ? "bg-primary text-primary-fg" : "bg-surface text-fg"}`,
		children: label
	});
}
//#endregion
export { SearchPage as component };
