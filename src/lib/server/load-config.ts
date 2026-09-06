import { getSql } from "@/lib/db";
import { mergeConfig } from "@/lib/config/defaults";
import type { PublicAppConfig } from "@/lib/config/types";

export async function loadConfig(): Promise<PublicAppConfig> {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`select key, value from app_config`;
  const bag: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      bag[row.key] = JSON.parse(row.value);
    } catch {
      /* ignore malformed config rows */
    }
  }
  return mergeConfig(bag as Partial<PublicAppConfig>);
}
