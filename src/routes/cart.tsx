import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QuoteLines } from "@/components/market/quote-lines";
import { CustomerShell } from "@/components/market/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/providers";
import { formatPaise } from "@/lib/money";
import { quoteCart, trackAnalytics } from "@/lib/server/quote";
import { useCartStore } from "@/lib/stores/cart";
import { useLocationStore } from "@/lib/stores/location";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { t, lang } = useT();
  const locale = lang === "bn" ? "bn-IN" : "en-IN";
  const { restaurantId, restaurantName, items, coupon, updateQty, remove, setCoupon, clear } = useCartStore();
  const location = useLocationStore((s) => s.location);
  const [code, setCode] = useState(coupon);
  const navigate = useNavigate();

  const quote = useQuery({
    queryKey: ["quote", restaurantId, items, coupon, location.lat, location.lng, location.zoneId],
    enabled: Boolean(restaurantId && items.length),
    queryFn: () =>
      quoteCart({
        data: {
          restaurantId: restaurantId!,
          zoneId: location.zoneId,
          lat: location.lat,
          lng: location.lng,
          coupon,
          lines: items,
        },
      }),
  });

  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <h1 className="font-display text-3xl">{t("cart.title")}</h1>
        {!items.length ? (
          <div className="mt-8">
            <p className="text-muted">{t("cart.empty")}</p>
            <p className="mt-1 text-sm text-muted">{t("cart.emptyHint")}</p>
            <Button className="mt-4" asChild>
              <Link to="/">{t("cart.browse")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">{t("cart.from", { name: restaurantName })}</p>
            <ul className="mt-4 space-y-3">
              {items.map((item) => {
                const priced = quote.data?.pricedLines.find((p) => p.key === item.key);
                return (
                  <li key={item.key} className="rounded-[var(--radius-lg)] bg-surface p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{priced?.name ?? item.itemId}</p>
                        {item.instructions ? <p className="text-xs text-muted">{item.instructions}</p> : null}
                        {priced ? (
                          <p className="mt-1 tabular-nums text-sm">
                            {formatPaise(priced.unitPaise * item.quantity, { locale })}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="size-11 rounded-full bg-bg"
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          className="size-11 rounded-full bg-bg"
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button type="button" className="mt-2 text-xs text-danger" onClick={() => remove(item.key)}>
                      {t("common.remove")}
                    </button>
                  </li>
                );
              })}
            </ul>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const next = code.trim().toUpperCase();
                setCoupon(next);
                if (next) void trackAnalytics({ data: { name: "coupon_applied", payload: { code: next } } });
              }}
            >
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("cart.coupon")}
                aria-label={t("cart.coupon")}
              />
              <Button type="submit" variant="outline">
                {t("cart.apply")}
              </Button>
            </form>
            {quote.data?.promoName ? <p className="mt-2 text-sm text-primary">{quote.data.promoName}</p> : null}
            {coupon && quote.data && !quote.data.promoName ? (
              <p className="mt-2 text-sm text-danger">{t("cart.invalidCoupon")}</p>
            ) : null}
            <div className="mt-6 rounded-[var(--radius-xl)] bg-surface p-4">
              {quote.isPending ? (
                <p className="text-sm text-muted">{t("common.loading")}</p>
              ) : quote.isError ? (
                <button type="button" className="text-sm text-primary" onClick={() => void quote.refetch()}>
                  {t("common.retry")}
                </button>
              ) : quote.data ? (
                <QuoteLines lines={quote.data.quote.lines} locale={locale} />
              ) : null}
            </div>
            {quote.data?.quote.savingsPaise ? (
              <p className="mt-2 text-sm text-primary">
                {t("cart.savings", { amount: formatPaise(quote.data.quote.savingsPaise, { locale }) })}
              </p>
            ) : null}
            <div className="mt-6 flex gap-2">
              <Button variant="ghost" onClick={() => clear()}>
                {t("cart.clear")}
              </Button>
              <Button
                className="flex-1"
                disabled={!quote.data || quote.data.quote.blockers.includes("MIN_ORDER")}
                onClick={() => void navigate({ to: "/checkout" })}
              >
                {t("cart.checkout")}
              </Button>
            </div>
            {quote.data?.quote.blockers.includes("MIN_ORDER") ? (
              <p className="mt-2 text-sm text-warn">
                {t("cart.minOrder", { amount: formatPaise(quote.data.quote.minOrderPaise, { locale }) })}
              </p>
            ) : null}
          </>
        )}
      </div>
    </CustomerShell>
  );
}
