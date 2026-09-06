import { createFileRoute } from "@tanstack/react-router";
import { CustomerShell } from "@/components/market/shell";
import { useBrand, useT } from "@/components/providers";

export const Route = createFileRoute("/legal/terms")({ component: TermsPage });

function TermsPage() {
  const { t } = useT();
  const { brand, marketplace } = useBrand();
  return (
    <CustomerShell>
      <article className="px-4 py-5 text-sm text-muted">
        <h1 className="font-display text-3xl text-fg">{t("legal.terms")}</h1>
        <p className="mt-4">
          {brand.companyName} is a local marketplace. Sample kitchens are not live vendors. Prices, delivery fees and
          commissions are calculated on the server. Default kitchen commission is {marketplace.defaultCommissionBps / 100}
          % and is snapshotted per order. Cash on delivery is available. Online UPI is sandbox-only until a licensed
          payment aggregator is activated. These terms are a development draft, not a filed contract.
        </p>
      </article>
    </CustomerShell>
  );
}
