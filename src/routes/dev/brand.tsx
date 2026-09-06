import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/market/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBrand } from "@/components/providers";
import { updateBrandConfig } from "@/lib/server/config";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/dev/brand")({ component: BrandDevPage });

function BrandDevPage() {
  const config = useBrand();
  const { user, isPending } = useCurrentUserState();
  const [appName, setAppName] = useState(config.brand.appName);
  const [tagline, setTagline] = useState(config.brand.tagline);
  const [primaryColor, setPrimaryColor] = useState(config.brand.primaryColor);

  if (isPending) return <CustomerShell><p className="p-6">Loading</p></CustomerShell>;
  if (!user) return <RedirectToSignIn />;
  if (!config.marketplace.allowDevTools) {
    return (
      <CustomerShell>
        <p className="p-6 text-sm">Runtime brand editing is off.</p>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <p className="text-xs uppercase tracking-wide text-warn">Development configuration</p>
        <h1 className="font-display text-3xl">Brand</h1>
        <p className="mt-2 text-sm text-muted">
          Change these values in the database. The rest of the app reads them from one config object. Turn off
          allowDevTools before a public launch.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void updateBrandConfig({
              data: { brand: { appName, tagline, primaryColor, seoTitle: `${appName} — food delivery in Sribhumi` } },
            })
              .then(() => {
                toast.success("Saved. Reload to see every surface pick up the new name.");
                window.location.reload();
              })
              .catch((err: Error) => toast.error(err.message));
          }}
        >
          <label className="block text-sm">
            App name
            <Input className="mt-1" value={appName} onChange={(e) => setAppName(e.target.value)} />
          </label>
          <label className="block text-sm">
            Tagline
            <Input className="mt-1" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>
          <label className="block text-sm">
            Primary colour
            <Input className="mt-1" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </label>
          <Button type="submit">Save brand</Button>
        </form>
      </div>
    </CustomerShell>
  );
}
