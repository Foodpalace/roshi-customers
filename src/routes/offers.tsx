import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomerShell } from "@/components/market/shell";
import { useT } from "@/components/providers";
import { listPromos } from "@/lib/server/account";
import { formatPaise } from "@/lib/money";
import { useCartStore } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/offers")({ component: OffersPage });

function OffersPage() {
  const { t, lang } = useT();
  const locale = lang === "bn" ? "bn-IN" : "en-IN";
  const setCoupon = useCartStore((s) => s.setCoupon);
  const promos = useQuery({ queryKey: ["promos"], queryFn: () => listPromos() });
  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <h1 className="font-display text-3xl">{t("offers.title")}</h1>
        <ul className="mt-4 space-y-3">
          {(promos.data?.promos ?? []).map((p) => (
            <li key={p.id} className="rounded-[var(--radius-lg)] bg-surface p-4">
              <p className="font-medium">{p.name}</p>
              {p.code ? <p className="font-mono text-sm">{p.code}</p> : null}
              <p className="text-xs text-muted">
                {p.fundedBy === "RESTAURANT"
                  ? t("offers.fundedByRestaurant")
                  : p.fundedBy === "PLATFORM"
                    ? t("offers.fundedByPlatform")
                    : t("offers.fundedByShared")}
              </p>
              <p className="text-xs text-muted">{t("offers.min", { amount: formatPaise(p.minOrderPaise, { locale }) })}</p>
              {p.code ? (
                <Button
                  className="mt-2"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCoupon(p.code!);
                    toast.success(t("cart.applied"));
                  }}
                >
                  {t("cart.apply")}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </CustomerShell>
  );
}
