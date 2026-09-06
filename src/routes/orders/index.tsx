import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomerShell } from "@/components/market/shell";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyOrders } from "@/lib/server/orders";
import { formatPaise } from "@/lib/money";
import type { OrderStatus } from "@/lib/orders/state";

export const Route = createFileRoute("/orders/")({ component: OrdersPage });

function statusKey(status: OrderStatus): string {
  const map: Partial<Record<OrderStatus, string>> = {
    PLACED: "orders.placed",
    ACCEPTED: "orders.accepted",
    PREPARING: "orders.preparing",
    READY: "orders.ready",
    RIDER_ASSIGNED: "orders.riderAssigned",
    PICKED_UP: "orders.pickedUp",
    ON_THE_WAY: "orders.onTheWay",
    DELIVERED: "orders.delivered",
    REJECTED: "orders.rejected",
    CANCELLED: "orders.cancelled",
    REFUNDED: "orders.refunded",
    FAILED_PAYMENT: "orders.failed",
    DELIVERY_FAILED: "orders.deliveryFailed",
  };
  return map[status] ?? "orders.placed";
}

function OrdersPage() {
  const { t, lang } = useT();
  const locale = lang === "bn" ? "bn-IN" : "en-IN";
  const { user, isPending } = useCurrentUserState();
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => listMyOrders(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <CustomerShell>
        <div className="p-6 text-muted">{t("common.loading")}</div>
      </CustomerShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const list = orders.data?.orders ?? [];
  const active = list.filter((o) => !["DELIVERED", "CANCELLED", "REJECTED", "REFUNDED", "FAILED_PAYMENT"].includes(o.status));
  const past = list.filter((o) => !active.includes(o));

  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <h1 className="font-display text-3xl">{t("orders.title")}</h1>
        {orders.isError ? (
          <button type="button" className="mt-4 text-primary" onClick={() => void orders.refetch()}>
            {t("common.retry")}
          </button>
        ) : !list.length ? (
          <div className="mt-8">
            <p>{t("orders.empty")}</p>
            <p className="text-sm text-muted">{t("orders.emptyHint")}</p>
            <Button className="mt-4" asChild>
              <Link to="/">{t("cart.browse")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {active.length ? (
              <section className="mt-6">
                <h2 className="text-sm font-medium text-muted">{t("orders.active")}</h2>
                <ul className="mt-2 space-y-3">
                  {active.map((o) => (
                    <li key={o.id}>
                      <Link to="/orders/$id" params={{ id: o.id }} className="block rounded-[var(--radius-lg)] bg-surface p-3 text-fg no-underline">
                        <p className="font-medium">{o.restaurantName}</p>
                        <p className="text-sm text-muted">{t(statusKey(o.status))}</p>
                        <p className="text-sm tabular-nums">{formatPaise(o.totalPaise, { locale })}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {past.length ? (
              <section className="mt-6">
                <h2 className="text-sm font-medium text-muted">{t("orders.past")}</h2>
                <ul className="mt-2 space-y-3">
                  {past.map((o) => (
                    <li key={o.id}>
                      <Link to="/orders/$id" params={{ id: o.id }} className="block rounded-[var(--radius-lg)] bg-surface p-3 text-fg no-underline">
                        <p className="font-medium">{o.restaurantName}</p>
                        <p className="text-sm text-muted">{o.itemPreview}</p>
                        <p className="text-sm tabular-nums">{formatPaise(o.totalPaise, { locale })}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </CustomerShell>
  );
}
