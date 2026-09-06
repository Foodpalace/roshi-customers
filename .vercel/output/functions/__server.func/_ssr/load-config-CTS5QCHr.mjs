import { r as __exportAll } from "../_runtime.mjs";
import { c as __exportAll$1 } from "./ssr.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { n as mergeConfig } from "./defaults-BTJwphDE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/load-config-CTS5QCHr.js
var load_config_CTS5QCHr_exports = /* @__PURE__ */ __exportAll({
	n: () => load_config_exports,
	t: () => loadConfig
});
var load_config_exports = /* @__PURE__ */ __exportAll$1({ loadConfig: () => loadConfig });
async function loadConfig() {
	const rows = await (await getSql())`select key, value from app_config`;
	const bag = {};
	for (const row of rows) try {
		bag[row.key] = JSON.parse(row.value);
	} catch {}
	return mergeConfig(bag);
}
//#endregion
export { load_config_CTS5QCHr_exports as n, loadConfig as t };
