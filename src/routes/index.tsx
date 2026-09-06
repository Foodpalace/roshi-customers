import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { HomeFeed } from "@/components/market/home-feed";
import { CustomerShell } from "@/components/market/shell";
import { trackAnalytics } from "@/lib/server/quote";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    void trackAnalytics({ data: { name: "app_open" } });
  }, []);
  return (
    <CustomerShell onSearch={() => void navigate({ to: "/search" })}>
      <HomeFeed />
    </CustomerShell>
  );
}
