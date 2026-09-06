import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomizeDialog } from "@/components/market/customize-dialog";
import { CustomerShell } from "@/components/market/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand, useT } from "@/components/providers";
import { getRestaurant } from "@/lib/server/catalog";
import { trackAnalytics } from "@/lib/server/quote";
import { toggleFavourite } from "@/lib/server/account";
import { formatPaise } from "@/lib/money";
import type { MenuItemView } from "@/lib/market-types";
import { cartKey, useCartStore, type CartItem } from "@/lib/stores/cart";
import { useLocationStore } from "@/lib/stores/location";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/r/$slug")({ component: RestaurantPage });

function RestaurantPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useT();
  const { brand } = useBrand();
  const locale = lang === "bn" ? "bn-IN" : "en-IN";
  const location = useLocationStore((s) => s.location);
  const user = useCurrentUser();
  const addItem = useCartStore((s) => s.addItem);
  const replaceAndAdd = useCartStore((s) => s.replaceAndAdd);
  const [custom, setCustom] = useState<MenuItemView | null>(null);
  const [replaceWith, setReplaceWith] = useState<{ name: string; line: CartItem } | null>(null);
  const [menuQ, setMenuQ] = useState("");

  const detail = useQuery({
    queryKey: ["restaurant", slug, location.lat, location.lng, lang],
    queryFn: () => getRestaurant({ data: { slug, lat: location.lat, lng: location.lng, lang } }),
  });

  const restaurant = detail.data?.restaurant;
  useEffect(() => {
    if (restaurant) void trackAnalytics({ data: { name: "restaurant_view", payload: { slug } } });
  }, [restaurant, slug]);

  const add = (restId: string, restName: string, line: CartItem) => {
    const result = addItem(restId, restName, line);
    if (result === "replace") setReplaceWith({ name: restName, line });
    else toast.success(t("common.added"));
  };

  const onAddClick = (item: MenuItemView) => {
    if (!restaurant) return;
    void trackAnalytics({ data: { name: "item_view", payload: { item: item.id } } });
    if (item.variants.length || item.addonGroups.length) {
      setCustom(item);
      return;
    }
    const line: Omit<CartItem, "key"> = {
      itemId: item.id,
      variantId: null,
      addonIds: [],
      quantity: 1,
      instructions: "",
    };
    add(restaurant.card.id, restaurant.card.name, { ...line, key: cartKey(line) });
    void trackAnalytics({ data: { name: "add_to_cart", payload: { item: item.id } } });
  };

  const jsonLd = restaurant
    ? {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: restaurant.card.name,
        description: restaurant.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: restaurant.addressLine,
          addressLocality: restaurant.area,
          addressCountry: "IN",
        },
        servesCuisine: restaurant.card.cuisineSummary,
        ...(restaurant.card.dataLabel === "REAL"
          ? {}
          : { additionalProperty: { "@type": "PropertyValue", name: "dataLabel", value: restaurant.card.dataLabel } }),
      }
    : null;

  return (
    <CustomerShell>
      {detail.isPending ? (
        <div className="p-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="mt-4 h-8 w-2/3" />
        </div>
      ) : detail.isError ? (
        <p className="p-4">
          <button type="button" className="text-primary" onClick={() => void detail.refetch()}>
            {t("common.retry")}
          </button>
        </p>
      ) : !restaurant ? (
        <p className="p-4 text-muted">{t("common.empty")}</p>
      ) : (
        <article>
          {jsonLd ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          ) : null}
          <div className="relative aspect-[16/9] bg-surface-2">
            {restaurant.card.coverImage ? (
              <img src={restaurant.card.coverImage} alt="" className="h-full w-full object-cover" />
            ) : null}
            <div className="absolute left-3 top-3 flex gap-1">
              {restaurant.card.dataLabel !== "REAL" ? <Badge tone="warn">{t("common.sample")}</Badge> : null}
              {restaurant.card.promoted ? <Badge>{t("common.ad")}</Badge> : null}
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl">{restaurant.card.name}</h1>
                <p className="mt-1 text-sm text-muted">{restaurant.card.cuisineSummary}</p>
              </div>
              {user ? (
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-full bg-surface"
                  aria-label={t("account.favourites")}
                  onClick={() => void toggleFavourite({ data: { restaurantId: restaurant.card.id } })}
                >
                  <Heart className="size-5" />
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted">{restaurant.description}</p>
            <p className="mt-2 text-sm text-muted">
              {t("restaurant.eta", { n: restaurant.card.etaMinutes })} ·{" "}
              {t("restaurant.delivery", { fee: formatPaise(restaurant.card.deliveryFeePaise, { locale }) })} ·{" "}
              {t("restaurant.minOrder", { amount: formatPaise(restaurant.card.minOrderPaise, { locale }) })}
            </p>
            <p className="text-sm text-muted">
              {restaurant.area} · {restaurant.hoursLabel}
            </p>
            {restaurant.card.dataLabel !== "REAL" ? (
              <p className="mt-2 text-sm text-warn">{t("restaurant.sampleNotice")}</p>
            ) : null}
            {!restaurant.card.open ? <p className="mt-2 text-sm text-danger">{t("restaurant.closedNotice")}</p> : null}
            <input
              value={menuQ}
              onChange={(e) => setMenuQ(e.target.value)}
              placeholder={t("restaurant.searchMenu")}
              className="mt-4 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3"
            />
          </div>
          <nav className="flex gap-2 overflow-x-auto border-y border-border bg-bg px-4 py-2">
            {restaurant.categories.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full bg-surface px-3 py-2 text-sm text-fg no-underline">
                {c.name}
              </a>
            ))}
          </nav>
          {restaurant.categories.map((c) => (
            <section key={c.id} id={c.id} className="px-4 py-5">
              <h2 className="mb-3 font-display text-xl">{c.name}</h2>
              <ul className="space-y-3">
                {c.items
                  .filter((it) => !menuQ || it.name.toLowerCase().includes(menuQ.toLowerCase()))
                  .map((it) => (
                    <li key={it.id} className="flex gap-3 rounded-[var(--radius-lg)] bg-surface p-3">
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt="" className="size-20 rounded-[var(--radius-sm)] object-cover" />
                      ) : (
                        <div className="size-20 rounded-[var(--radius-sm)] bg-surface-2" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {it.veg ? <Leaf className="size-3.5 text-success" aria-label={t("common.veg")} /> : null}
                          <p className="font-medium">{it.name}</p>
                          {it.bestseller ? <Badge>{t("restaurant.bestseller")}</Badge> : null}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted">{it.description}</p>
                        <p className="mt-1 tabular-nums text-sm">{formatPaise(it.basePricePaise, { locale })}</p>
                      </div>
                      {it.available ? (
                        <Button size="sm" variant="outline" onClick={() => onAddClick(it)}>
                          {it.variants.length || it.addonGroups.length ? t("restaurant.customise") : t("restaurant.add")}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted">{t("restaurant.unavailable")}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          ))}
          <CustomizeDialog
            item={custom}
            open={Boolean(custom)}
            onOpenChange={(v) => !v && setCustom(null)}
            locale={locale}
            onConfirm={(line) => {
              add(restaurant.card.id, restaurant.card.name, line);
              void trackAnalytics({ data: { name: "add_to_cart", payload: { item: line.itemId } } });
            }}
          />
        </article>
      )}
      {replaceWith && restaurant ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-fg/40 p-4 md:place-items-center">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-surface p-5">
            <h2 className="font-display text-xl">{t("cart.replaceTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("cart.replaceBody", { name: replaceWith.name })}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setReplaceWith(null)}>
                {t("cart.keep")}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  replaceAndAdd(restaurant.card.id, restaurant.card.name, replaceWith.line);
                  setReplaceWith(null);
                  toast.success(t("common.added"));
                }}
              >
                {t("cart.replace")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <span className="sr-only">{brand.appName}</span>
    </CustomerShell>
  );
}
