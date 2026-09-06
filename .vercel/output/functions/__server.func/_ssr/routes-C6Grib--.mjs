import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as trackAnalytics } from "./quote-Clw5othl.mjs";
import { t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { t as HomeFeed } from "./home-feed-1jN8RQWb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C6Grib--.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		trackAnalytics({ data: { name: "app_open" } });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, {
		onSearch: () => void navigate({ to: "/search" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFeed, {})
	});
}
//#endregion
export { Home as component };
