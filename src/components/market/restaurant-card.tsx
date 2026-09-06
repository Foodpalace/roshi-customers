import { Link } from "@tanstack/react-router";
import { Clock3, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBrand, useT } from "@/components/providers";
import { formatPaiseCompact } from "@/lib/money";
import type { RestaurantCard } from "@/lib/market-types";

export function KitchenCard({ restaurant }: { restaurant: RestaurantCard }) {
  const { t, lang } = useT();
  const { business } = useBrand();
  const locale = lang === "bn" ? "bn-IN" : "en-IN";
  return (
    <Link
      to="/r/$slug"
      params={{ slug: restaurant.slug }}
      className="block overflow-hidden rounded-[var(--radius-xl)] bg-surface text-fg no-underline shadow-[0_1px_0_var(--color-border)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {restaurant.coverImage ? (
          <img
            src={restaurant.coverImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {restaurant.dataLabel !== "REAL" ? <Badge tone="warn">{t("common.sample")}</Badge> : null}
          {restaurant.promoted ? <Badge>{t("common.ad")}</Badge> : null}
          {!restaurant.open ? <Badge tone="danger">{t("common.closed")}</Badge> : null}
        </div>
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{restaurant.name}</h3>
          {restaurant.vegOnly ? (
            <span className="mt-1 text-success" aria-label={t("common.veg")}>
              <Leaf className="size-4" />
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted">{restaurant.cuisineSummary}</p>
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" aria-hidden />
            {t("home.etaMin", { n: restaurant.etaMinutes })}
          </span>
          <span aria-hidden>·</span>
          <span>{t("home.deliveryFrom", { fee: formatPaiseCompact(restaurant.deliveryFeePaise, locale) })}</span>
          <span aria-hidden>·</span>
          <span>{t("home.minOrder", { amount: formatPaiseCompact(restaurant.minOrderPaise, locale) })}</span>
        </p>
        {restaurant.hasOffer && restaurant.offerLabel ? (
          <p className="text-xs text-primary">{restaurant.offerLabel}</p>
        ) : null}
        {restaurant.ratingAvg == null ? (
          <p className="text-xs text-subtle">{t("common.new")}</p>
        ) : (
          <p className="text-xs tabular-nums text-muted">
            {restaurant.ratingAvg.toFixed(1)} ({restaurant.ratingCount})
          </p>
        )}
        <span className="sr-only">{business.currency}</span>
      </div>
    </Link>
  );
}
