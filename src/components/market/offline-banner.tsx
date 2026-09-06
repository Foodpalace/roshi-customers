import { useEffect, useState } from "react";
import { useT } from "@/components/providers";

export function OfflineBanner() {
  const { t } = useT();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  if (!offline) return null;
  return (
    <p role="status" className="border-b border-border bg-warn/15 px-4 py-2 text-center text-sm text-warn">
      {t("common.offline")}
    </p>
  );
}
