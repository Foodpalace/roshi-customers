import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ClipboardList, House, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { LocationDialog } from "@/components/market/location-dialog";
import { useBrand, useT } from "@/components/providers";
import { cartCount, useCartStore } from "@/lib/stores/cart";
import { useLocationStore } from "@/lib/stores/location";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export function CustomerShell({
  children,
  onSearch,
}: {
  children: React.ReactNode;
  onSearch?: () => void;
}) {
  const { t } = useT();
  const { brand } = useBrand();
  const location = useLocationStore((s) => s.location);
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [locOpen, setLocOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg pb-24 md:max-w-5xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
      >
        {t("a11y.skip")}
      </a>
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <Wordmark />
          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
            ) : user ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              <SignedOut>
                <Link to="/login" className="text-sm font-medium text-primary">
                  {t("common.signIn")}
                </Link>
              </SignedOut>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLocOpen(true)}
          className="mt-3 flex min-h-11 w-full items-center justify-between rounded-[var(--radius-lg)] bg-surface px-3 text-left"
        >
          <span>
            <span className="block text-xs uppercase tracking-wide text-muted">{t("home.deliveringTo")}</span>
            <span className="block font-medium">{location.label}</span>
          </span>
          <span className="text-sm text-primary">{t("home.changeLocation")}</span>
        </button>
        <button
          type="button"
          onClick={() => (onSearch ? onSearch() : void navigate({ to: "/search" }))}
          className="mt-2 flex min-h-11 w-full items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface px-3 text-left text-muted"
        >
          <Search className="size-4" aria-hidden />
          {t("home.searchPlaceholder")}
        </button>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      {count > 0 && path !== "/cart" && path !== "/checkout" ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-4">
          <Link
            to="/cart"
            className="pointer-events-auto flex min-h-12 w-full max-w-lg items-center justify-between rounded-[var(--radius-xl)] bg-primary px-4 text-primary-fg no-underline shadow-md md:max-w-5xl"
          >
            <span>
              {count} {count === 1 ? t("cart.item") : t("cart.items")}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="size-4" aria-hidden />
              {t("cart.view")}
            </span>
          </Link>
        </div>
      ) : null}
      <nav
        aria-label={brand.appName}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4 md:max-w-5xl">
          <NavItem to="/" icon={House} label={t("common.home")} active={path === "/"} />
          <NavItem to="/search" icon={Search} label={t("common.search")} active={path.startsWith("/search")} />
          <NavItem to="/orders" icon={ClipboardList} label={t("common.orders")} active={path.startsWith("/orders")} />
          <NavItem to="/account" icon={UserRound} label={t("common.account")} active={path.startsWith("/account")} />
        </ul>
      </nav>
      <LocationDialog open={locOpen} onOpenChange={setLocOpen} />
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof House;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs no-underline",
          active ? "text-primary" : "text-muted",
        )}
      >
        <Icon className="size-5" aria-hidden />
        {label}
      </Link>
    </li>
  );
}
