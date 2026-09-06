import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { DEFAULT_CONFIG } from "@/lib/config/defaults";
import type { PublicAppConfig } from "@/lib/config/types";
import { isLang, translate, type Lang } from "@/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false } },
});

const BrandContext = createContext<PublicAppConfig>(DEFAULT_CONFIG);

export function useBrand() {
  return useContext(BrandContext);
}

const I18nContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}>({
  lang: "en",
  setLang: () => undefined,
  t: (path, vars) => translate("en", path, vars),
});

export function useT() {
  return useContext(I18nContext);
}

export function AppProviders({
  children,
  config,
}: {
  children: ReactNode;
  config: PublicAppConfig;
}) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem("marketplace-lang");
    return isLang(stored) ? stored : "en";
  });
  useEffect(() => {
    document.title = config.brand.seoTitle;
    document.querySelector('link[rel="icon"]')?.setAttribute("href", config.brand.faviconUrl || "/favicon.svg");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", config.brand.primaryColor);
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    document.documentElement.style.setProperty("--radius-lg", `${config.brand.radiusPx}px`);
  }, [config, lang]);
  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") window.localStorage.setItem("marketplace-lang", next);
    if (typeof document !== "undefined") document.documentElement.lang = next === "bn" ? "bn" : "en";
  };
  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path: string, vars?: Record<string, string | number>) => translate(lang, path, vars),
    }),
    [lang],
  );

  const brandStyle = {
    ["--color-primary" as string]: config.brand.primaryColor,
    ["--color-accent" as string]: config.brand.accentColor,
    ["--color-bg" as string]: config.brand.backgroundColor,
    ["--color-surface" as string]: config.brand.surfaceColor,
    ["--color-fg" as string]: config.brand.textColor,
    ["--color-muted" as string]: config.brand.mutedColor,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrandContext.Provider value={config}>
        <I18nContext.Provider value={value}>
          <div style={brandStyle} className="min-h-dvh bg-bg text-fg">
            {children}
          </div>
          <Toaster position="top-center" richColors={false} />
        </I18nContext.Provider>
      </BrandContext.Provider>
    </QueryClientProvider>
  );
}
