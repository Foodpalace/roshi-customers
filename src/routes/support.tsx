import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/market/shell";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createTicket, listTickets } from "@/lib/server/account";

export const Route = createFileRoute("/support")({ component: SupportPage });

const TOPICS = ["where", "issue", "missing", "wrong", "payment", "cancel", "refund", "restaurant", "delivery", "other"] as const;

function SupportPage() {
  const { t } = useT();
  const { user, isPending } = useCurrentUserState();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("issue");
  const [message, setMessage] = useState("");
  const tickets = useQuery({
    queryKey: ["tickets"],
    queryFn: () => listTickets(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <CustomerShell>
        <div className="p-6">{t("common.loading")}</div>
      </CustomerShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <CustomerShell>
      <div className="px-4 py-5">
        <h1 className="font-display text-3xl">{t("support.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("support.hint")}</p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void createTicket({ data: { topic, message } })
              .then(() => {
                setMessage("");
                toast.success(t("support.sent"));
                void tickets.refetch();
              })
              .catch((err: Error) => toast.error(err.message));
          }}
        >
          <label className="block text-sm">
            {t("support.topic")}
            <select
              className="mt-1 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3"
              value={topic}
              onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
            >
              {TOPICS.map((key) => (
                <option key={key} value={key}>
                  {t(`support.topics.${key}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            {t("support.message")}
            <textarea
              className="mt-1 min-h-28 w-full rounded-[var(--radius-md)] border border-border bg-surface p-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <Button type="submit">{t("support.send")}</Button>
        </form>
        <h2 className="mt-8 font-display text-xl">{t("support.tickets")}</h2>
        <ul className="mt-3 space-y-2">
          {(tickets.data?.tickets ?? []).map((tk) => (
            <li key={tk.id} className="rounded-[var(--radius-lg)] bg-surface p-3 text-sm">
              <p className="font-medium">{tk.topic}</p>
              <p className="text-muted">{tk.message}</p>
              <p className="text-xs text-subtle">{tk.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </CustomerShell>
  );
}
