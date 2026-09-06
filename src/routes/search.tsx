import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HomeFeed } from "@/components/market/home-feed";
import { CustomerShell } from "@/components/market/shell";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/providers";
import { trackAnalytics } from "@/lib/server/quote";

type Search = { q?: string; category?: string; veg?: boolean; openNow?: boolean };

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    q: typeof raw.q === "string" ? raw.q : "",
    category: typeof raw.category === "string" ? raw.category : undefined,
    veg: raw.veg === true || raw.veg === "true",
    openNow: raw.openNow === true || raw.openNow === "true",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useT();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(search.q ?? "");

  const commit = (next: Search) => {
    void navigate({ search: next });
    if (next.q) void trackAnalytics({ data: { name: "search", payload: { q: next.q } } });
  };

  return (
    <CustomerShell onSearch={() => undefined}>
      <div className="px-4 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commit({ ...search, q: draft });
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
            aria-label={t("common.search")}
            autoFocus
          />
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            active={Boolean(search.veg)}
            onClick={() => commit({ ...search, veg: !search.veg })}
            label={t("home.vegOnly")}
          />
          <FilterChip
            active={Boolean(search.openNow)}
            onClick={() => commit({ ...search, openNow: !search.openNow })}
            label={t("home.openNow")}
          />
        </div>
      </div>
      <HomeFeed q={search.q} veg={search.veg} openNow={search.openNow} category={search.category} />
    </CustomerShell>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 shrink-0 rounded-full px-3 text-sm ${active ? "bg-primary text-primary-fg" : "bg-surface text-fg"}`}
    >
      {label}
    </button>
  );
}
