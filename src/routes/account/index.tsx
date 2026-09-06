import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomerShell } from "@/components/market/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBrand, useT } from "@/components/providers";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureProfile, getLoyalty, requestDeletion, updateProfile } from "@/lib/server/account";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/")({ component: AccountPage });

function AccountPage() {
  const { t, lang, setLang } = useT();
  const { brand, domain } = useBrand();
  const { user, isPending } = useCurrentUserState();
  const [name, setName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState("");

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => ensureProfile({ data: { name: user?.displayName ?? undefined, language: lang } }),
    enabled: Boolean(user),
  });
  const loyalty = useQuery({
    queryKey: ["loyalty"],
    queryFn: () => getLoyalty(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (profile.data?.profile?.display_name) setName(profile.data.profile.display_name);
    if (profile.data?.profile?.phone) setPhone(profile.data.profile.phone);
  }, [profile.data]);

  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <h1 className="font-display text-3xl">{t("account.title")}</h1>
        {isPending ? (
          <p className="mt-4 text-muted">{t("common.loading")}</p>
        ) : !user ? (
          <div className="mt-6">
            <p>{t("account.guest")}</p>
            <p className="text-sm text-muted">{t("account.guestHint")}</p>
            <Button className="mt-4" asChild>
              <Link to="/login">{t("common.signIn")}</Link>
            </Button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void updateProfile({ data: { name, phone, language: lang } }).then(() => toast.success(t("account.saved")));
            }}
          >
            <label className="block text-sm">
              {t("account.name")}
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block text-sm">
              {t("account.phone")}
              <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </label>
            <p className="text-sm text-muted">{user.primaryEmail}</p>
            <Button type="submit">{t("common.save")}</Button>
          </form>
        )}

        <section className="mt-8">
          <h2 className="text-sm font-medium text-muted">{t("account.language")}</h2>
          <div className="mt-2 flex gap-2">
            <Button variant={lang === "en" ? "primary" : "outline"} onClick={() => setLang("en")}>
              {t("common.english")}
            </Button>
            <Button variant={lang === "bn" ? "primary" : "outline"} onClick={() => setLang("bn")}>
              {t("common.bengali")}
            </Button>
          </div>
        </section>

        {user ? (
          <section className="mt-8 rounded-[var(--radius-lg)] bg-surface p-4">
            <h2 className="font-medium">{t("account.loyalty", { name: brand.appName })}</h2>
            <p className="mt-1 text-2xl tabular-nums">{t("account.points", { n: loyalty.data?.loyalty.points ?? 0 })}</p>
            <p className="text-sm text-muted">{t("account.loyaltyHint")}</p>
          </section>
        ) : null}

        <nav className="mt-8 space-y-2 text-sm">
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/offers">
            {t("account.offers")}
          </Link>
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/support">
            {t("common.support")}
          </Link>
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/legal/privacy">
            {t("account.privacy")}
          </Link>
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/legal/terms">
            {t("account.terms")}
          </Link>
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/legal/refunds">
            {t("account.refunds")}
          </Link>
          <Link className="block min-h-11 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-fg no-underline" to="/about">
            {t("account.about", { name: brand.appName })}
          </Link>
        </nav>

        {user ? (
          <Button
            className="mt-8"
            variant="ghost"
            onClick={() =>
              void requestDeletion().then(() => toast.success(t("account.deleteDone")))
            }
          >
            {t("account.delete")}
          </Button>
        ) : null}
        <p className="mt-2 text-xs text-muted">{t("account.deleteHint")}</p>
        <p className="mt-8 text-xs text-subtle">{domain.webUrl}</p>
      </div>
    </CustomerShell>
  );
}
