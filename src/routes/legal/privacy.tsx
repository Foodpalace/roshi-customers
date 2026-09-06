import { createFileRoute } from "@tanstack/react-router";
import { CustomerShell } from "@/components/market/shell";
import { useBrand, useT } from "@/components/providers";

export const Route = createFileRoute("/legal/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  const { t } = useT();
  const { brand, communication } = useBrand();
  return (
    <CustomerShell>
      <article className="prose-sm px-4 py-5">
        <h1 className="font-display text-3xl">{t("legal.privacy")}</h1>
        <p className="mt-4 text-sm text-muted">
          {brand.companyName} collects the minimum needed to deliver food: name, contact, delivery address, and order
          history. We do not sell personal data. Payment card numbers are never stored. Phone OTP, SMS and WhatsApp
          providers are adapters only — nothing is sent until a provider is connected. Account deletion can be requested
          from the account screen. Contact {communication.grievanceEmail}.
        </p>
        <p className="mt-3 text-sm text-muted">
          This notice is a draft for development. It is not legal advice and must be reviewed before a public launch in
          India (DPDP Act, IT Rules). GSTIN and FSSAI numbers show as PENDING until registered.
        </p>
      </article>
    </CustomerShell>
  );
}
