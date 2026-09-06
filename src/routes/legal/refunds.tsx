import { createFileRoute } from "@tanstack/react-router";
import { CustomerShell } from "@/components/market/shell";
import { useT } from "@/components/providers";

export const Route = createFileRoute("/legal/refunds")({ component: RefundsPage });

function RefundsPage() {
  const { t } = useT();
  return (
    <CustomerShell>
      <article className="px-4 py-5 text-sm text-muted">
        <h1 className="font-display text-3xl text-fg">{t("legal.refunds")}</h1>
        <p className="mt-4">
          You may cancel until the kitchen starts preparing. After that, cancellation depends on the kitchen. Refunds
          are not automatic. Support tickets record the request. COD orders have nothing to refund unless already paid
          to a rider. This policy is a development draft.
        </p>
      </article>
    </CustomerShell>
  );
}
