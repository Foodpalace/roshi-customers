import { createFileRoute } from "@tanstack/react-router";
import { CustomerShell } from "@/components/market/shell";
import { useBrand } from "@/components/providers";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  const { brand, marketplace, invoice } = useBrand();
  return (
    <CustomerShell>
      <article className="px-4 py-5 text-sm text-muted">
        <h1 className="font-display text-3xl text-fg">{brand.appName}</h1>
        <p className="mt-2 text-fg">{brand.tagline}</p>
        <p className="mt-4">{brand.description}</p>
        <h2 className="mt-6 font-display text-xl text-fg">How this marketplace works</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Location first, then kitchens, then a server-priced cart.</li>
          <li>Every rupee line has a name and a reason. No miscellaneous fees.</li>
          <li>Commission defaults to {marketplace.defaultCommissionBps / 100}% and is stored on the order.</li>
          <li>Sample kitchens are labelled. Ratings are omitted until real reviews exist.</li>
          <li>English and Bengali strings come from a dictionary, not from hardcoded UI copy.</li>
          <li>Brand, colours, fees and city come from central configuration.</li>
        </ul>
        <h2 className="mt-6 font-display text-xl text-fg">UX choices</h2>
        <p className="mt-2">
          Public food apps put search, location and a persistent cart within one thumb-reach. We kept that pattern and
          cut membership upsells, hidden charges and fake social proof. Tracking does not invent GPS.
        </p>
        <p className="mt-4 text-xs">
          Invoice entity: {invoice.companyName}. GSTIN {invoice.gstin}. FSSAI {invoice.fssai}.
        </p>
      </article>
    </CustomerShell>
  );
}
