import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { KitchenCard } from "@/components/market/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand, useT } from "@/components/providers";
import { listCategories, listRestaurants } from "@/lib/server/catalog";
import { useLocationStore } from "@/lib/stores/location";
import type { RestaurantCard } from "@/lib/market-types";

export function HomeFeed({
  q,
  veg,
  openNow,
  category,
}: {
  q?: string;
  veg?: boolean;
  openNow?: boolean;
  category?: string;
}) {
  const { t, lang } = useT();
  const { marketplace, brand } = useBrand();
  const location = useLocationStore((s) => s.location);
  const cats = useQuery({
    queryKey: ["categories", lang],
    queryFn: () => listCategories({ data: { lang } }),
  });
  const list = useQuery({
    queryKey: ["restaurants", location.zoneId, location.lat, location.lng, q, veg, openNow, category, lang],
    queryFn: () =>
      listRestaurants({
        data: {
          zoneId: location.zoneId,
          lat: location.lat,
          lng: location.lng,
          q,
          veg,
          openNow,
          category,
          lang,
        },
      }),
  });

  return (
    <div className="space-y-8 px-4 py-5">
      {!q && !veg && !openNow && !category ? (
        <section>
          <h1 className="font-display text-3xl leading-tight">{brand.tagline}</h1>
          <p className="mt-1 text-sm text-muted">{brand.promotionalHeadline}</p>
        </section>
      ) : null}

      {marketplace.sampleCatalogueBanner ? (
        <p className="rounded-[var(--radius-lg)] bg-surface px-3 py-3 text-sm text-muted">{t("home.sampleBanner")}</p>
      ) : null}

      <section aria-label={t("home.categories")}>
        <h2 className="mb-3 font-display text-xl">{t("home.categories")}</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {cats.isPending
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-24 shrink-0" />)
            : (cats.data?.categories ?? []).map((c) => (
                <Link
                  key={c.id}
                  to="/search"
                  search={{ category: c.id }}
                  className="w-24 shrink-0 text-center text-fg no-underline"
                >
                  <div className="aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-surface-2">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <span className="mt-1 block text-xs font-medium">{c.name}</span>
                </Link>
              ))}
        </div>
      </section>

      {list.isError ? (
        <button type="button" className="text-sm text-primary" onClick={() => void list.refetch()}>
          {t("common.retry")}
        </button>
      ) : list.isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : q || veg || openNow || category ? (
        <Section title={t("common.search")} items={list.data?.restaurants ?? []} empty={t("home.noResults")} />
      ) : (
        <>
          <Section title={t("home.bestOffers")} items={list.data?.sections.offers ?? []} />
          <Section title={t("home.popular")} items={list.data?.sections.popular ?? []} />
          <Section title={t("home.fast")} items={list.data?.sections.fast ?? []} />
          <Section title={t("home.budget")} items={list.data?.sections.budget ?? []} />
          <Section title={t("home.newRestaurants")} items={list.data?.sections.newKitchens ?? []} />
        </>
      )}
    </div>
  );
}

function Section({ title, items, empty }: { title: string; items: RestaurantCard[]; empty?: string }) {
  if (!items.length) {
    return empty ? <p className="text-sm text-muted">{empty}</p> : null;
  }
  return (
    <section>
      <h2 className="mb-3 font-display text-xl">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((r) => (
          <KitchenCard key={r.id} restaurant={r} />
        ))}
      </div>
    </section>
  );
}
