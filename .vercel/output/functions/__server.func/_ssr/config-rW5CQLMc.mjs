import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { n as mergeConfig } from "./defaults-BTJwphDE.mjs";
import { t as loadConfig } from "./load-config-CTS5QCHr.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
import { t as newId } from "./ids-BXI880_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/config-rW5CQLMc.js
var getPublicConfig_createServerFn_handler = createServerRpc({
	id: "9cd41fe297d7c46b692266979e68200df6bb20b91f694bf74ab39a178dfce9b2",
	name: "getPublicConfig",
	filename: "src/lib/server/config.ts"
}, (opts) => getPublicConfig.__executeServer(opts));
var getPublicConfig = createServerFn({ method: "GET" }).handler(getPublicConfig_createServerFn_handler, async () => {
	return loadConfig();
});
var updateBrandConfig_createServerFn_handler = createServerRpc({
	id: "7de286efa5579bcfe3b7037b0e4f5b8090fe80525f7f74ca20814ba33b7a26da",
	name: "updateBrandConfig",
	filename: "src/lib/server/config.ts"
}, (opts) => updateBrandConfig.__executeServer(opts));
var updateBrandConfig = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateBrandConfig_createServerFn_handler, async ({ context, data }) => {
	const current = await loadConfig();
	if (!current.marketplace.allowDevTools) throw new Error("Runtime brand editing is off.");
	const nextBrand = {
		...current.brand,
		...data.brand
	};
	const sql = await getSql();
	await sql`
      insert into app_config (key, value, updated_at)
      values ('brand', ${JSON.stringify(nextBrand)}, now())
      on conflict (key) do update set value = excluded.value, updated_at = now()
    `;
	await sql`
      insert into audit_logs (id, actor_user_id, actor_role, action, entity, entity_id, metadata)
      values (
        ${newId("aud")},
        ${context.userId},
        'customer',
        'brand.update',
        'app_config',
        'brand',
        ${JSON.stringify({ keys: Object.keys(data.brand) })}
      )
    `;
	return mergeConfig({
		...current,
		brand: nextBrand
	});
});
//#endregion
export { getPublicConfig_createServerFn_handler, updateBrandConfig_createServerFn_handler };
