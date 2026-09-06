import { en, type MessageTree } from "./en";
import { bn } from "./bn";
import { as } from "./as";
import { hi } from "./hi";

export type Lang = "en" | "bn" | "as" | "hi";

export const LANGS: { id: Lang; native: string }[] = [
  { id: "en", native: "English" },
  { id: "bn", native: "বাংলা" },
  { id: "as", native: "অসমীয়া" },
  { id: "hi", native: "हिन्दी" },
];

const trees: Record<Lang, MessageTree> = { en, bn, as, hi };

export function isLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "bn" || value === "as" || value === "hi";
}

type Nested = Record<string, unknown>;

function lookup(tree: Nested, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = tree;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Nested)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(
  lang: Lang,
  path: string,
  vars?: Record<string, string | number>,
): string {
  const raw = lookup(trees[lang] as unknown as Nested, path) ?? lookup(trees.en as unknown as Nested, path) ?? path;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

export { en, bn, as, hi };
