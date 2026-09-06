import type { Lang } from "./i18n";

export function localeFor(lang: Lang): string {
  if (lang === "bn") return "bn-IN";
  if (lang === "as") return "as-IN";
  if (lang === "hi") return "hi-IN";
  return "en-IN";
}

export function htmlLang(lang: Lang): string {
  return lang;
}
