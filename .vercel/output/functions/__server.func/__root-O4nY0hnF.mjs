import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/__root-O4nY0hnF.js
var fetchSessionUser_createServerFn_handler = createServerRpc({
	id: "2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26",
	name: "fetchSessionUser",
	filename: "src/routes/__root.tsx"
}, (opts) => fetchSessionUser.__executeServer(opts));
var fetchSessionUser = createServerFn({ method: "GET" }).handler(fetchSessionUser_createServerFn_handler, async () => {
	const { getSessionUser } = await import("./_ssr/verify.server-D-9k7VVj.mjs");
	const u = await getSessionUser();
	return u ? {
		id: u.id,
		email: u.email
	} : null;
});
var fetchConfig_createServerFn_handler = createServerRpc({
	id: "5386a935e17f79c3770d46a1393dbf6b85ce8fecbccf4551bdde029dda3f8e3a",
	name: "fetchConfig",
	filename: "src/routes/__root.tsx"
}, (opts) => fetchConfig.__executeServer(opts));
var fetchConfig = createServerFn({ method: "GET" }).handler(fetchConfig_createServerFn_handler, async () => {
	const { loadConfig } = await import("./_ssr/load-config-CTS5QCHr.mjs").then((n) => n.n).then((n) => n.n);
	return loadConfig();
});
//#endregion
export { fetchConfig_createServerFn_handler, fetchSessionUser_createServerFn_handler };
