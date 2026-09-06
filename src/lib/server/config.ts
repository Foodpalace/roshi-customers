import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { mergeConfig } from "@/lib/config/defaults";
import type { BrandConfig, PublicAppConfig } from "@/lib/config/types";
import { newId } from "@/lib/ids";
import { loadConfig } from "./load-config";

export const getPublicConfig = createServerFn({ method: "GET" }).handler(async () => {
  return loadConfig();
});

export const updateBrandConfig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { brand: Partial<BrandConfig> }) => input)
  .handler(async ({ context, data }) => {
    const current = await loadConfig();
    if (!current.marketplace.allowDevTools) {
      throw new Error("Runtime brand editing is off.");
    }
    const nextBrand = { ...current.brand, ...data.brand };
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
    const merged: PublicAppConfig = mergeConfig({ ...current, brand: nextBrand });
    return merged;
  });
