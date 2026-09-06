import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/providers";
import { listZones } from "@/lib/server/catalog";
import { useLocationStore, type SelectedLocation } from "@/lib/stores/location";
import { distanceKm } from "@/lib/geo";
import { trackAnalytics } from "@/lib/server/quote";

export function LocationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useT();
  const setLocation = useLocationStore((s) => s.setLocation);
  const { data, isError, refetch } = useQuery({
    queryKey: ["zones"],
    queryFn: () => listZones(),
  });
  const [locating, setLocating] = useState(false);
  const [line1, setLine1] = useState("");
  const [landmark, setLandmark] = useState("");

  const pick = (loc: SelectedLocation) => {
    setLocation(loc);
    void trackAnalytics({ data: { name: "location_selected", payload: { zoneId: loc.zoneId } } });
    onOpenChange(false);
  };

  const useGeo = async () => {
    if (!navigator.geolocation) {
      toast.error(t("location.geoDenied"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const zones = data?.zones ?? [];
        if (!zones.length) return;
        const nearest = [...zones].sort(
          (a, b) => distanceKm(here, { lat: a.lat, lng: a.lng }) - distanceKm(here, { lat: b.lat, lng: b.lng }),
        )[0]!;
        const dist = distanceKm(here, { lat: nearest.lat, lng: nearest.lng });
        if (dist > 12) toast.message(t("location.outside"));
        pick({
          cityId: nearest.cityId,
          cityName: nearest.cityName,
          zoneId: nearest.id,
          zoneName: nearest.name,
          label: nearest.name,
          line1: line1 || nearest.name,
          lat: here.lat,
          lng: here.lng,
        });
      },
      () => {
        setLocating(false);
        toast.error(t("location.geoDenied"));
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[var(--radius-2xl)] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:inset-auto md:left-1/2 md:top-1/2 md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-xl)]">
          <Dialog.Title className="font-display text-2xl">{t("location.title")}</Dialog.Title>
          <p className="mt-1 text-sm text-muted">{t("location.simulatedPin")}</p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => void useGeo()} disabled={locating}>
            {locating ? t("location.locating") : t("location.useCurrent")}
          </Button>
          <h3 className="mt-5 text-sm font-medium text-muted">{t("location.areas")}</h3>
          {isError ? (
            <button type="button" className="mt-2 text-sm text-primary" onClick={() => void refetch()}>
              {t("common.retry")}
            </button>
          ) : (
            <ul className="mt-2 space-y-2">
              {(data?.zones ?? []).map((z) => (
                <li key={z.id}>
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center justify-between rounded-[var(--radius-lg)] bg-bg px-3 text-left"
                    onClick={() =>
                      pick({
                        cityId: z.cityId,
                        cityName: z.cityName,
                        zoneId: z.id,
                        zoneName: z.name,
                        label: z.name,
                        line1: line1 || z.name,
                        lat: z.lat,
                        lng: z.lng,
                      })
                    }
                  >
                    <span>
                      <span className="block font-medium">{z.name}</span>
                      <span className="block text-xs text-muted">{z.cityName}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-5 text-sm font-medium text-muted">{t("location.manual")}</h3>
          <div className="mt-2 space-y-2">
            <Input
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder={t("location.line1")}
              aria-label={t("location.line1")}
            />
            <Input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder={t("location.landmark")}
              aria-label={t("location.landmark")}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
