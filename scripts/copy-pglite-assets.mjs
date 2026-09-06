import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Nitro's PGLite bundle looks for wasm/data next to `_libs/electric-sql__pglite.mjs`. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(root, ".vercel/output/functions/__server.func/_libs");

if (!existsSync(destDir)) {
  console.log("[pglite-assets] no server bundle yet — skip");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(srcDir, name);
  const to = join(destDir, name);
  if (!existsSync(from)) {
    console.warn(`[pglite-assets] missing ${from}`);
    continue;
  }
  copyFileSync(from, to);
}
