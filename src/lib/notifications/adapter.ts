import { getSql } from "@/lib/db";
import { newId } from "@/lib/ids";
import { loadConfig } from "@/lib/server/load-config";

export type NotificationChannel = "in_app" | "sms" | "whatsapp" | "email" | "push";

export type NotificationJob = {
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  kind: string;
  entityId?: string | null;
};

/**
 * Window 1 / Window 5 contract: enqueue only.
 * SMS / WhatsApp / email / push stay pending until a provider is connected.
 * Never send from the browser. Never invent a delivered receipt.
 */
export async function enqueueNotification(job: NotificationJob): Promise<{ id: string; status: "queued" | "deferred" }> {
  const cfg = await loadConfig();
  const sql = await getSql();
  const provider =
    job.channel === "sms"
      ? cfg.notification.smsProvider
      : job.channel === "whatsapp"
        ? cfg.notification.whatsappProvider
        : job.channel === "email"
          ? cfg.notification.emailProvider
          : job.channel === "push"
            ? cfg.notification.pushProvider
            : "in_app";
  const live = job.channel === "in_app" ? cfg.notification.inAppEnabled : provider !== "none";
  const status = live && job.channel === "in_app" ? "queued" : "deferred";

  if (job.channel === "in_app" && cfg.notification.inAppEnabled) {
    await sql`
      insert into notifications (id, user_id, title, body, kind, entity_id)
      values (${newId("ntf")}, ${job.userId}, ${job.title}, ${job.body}, ${job.kind}, ${job.entityId ?? null})
    `;
  }

  const id = newId("nbox");
  await sql`
    insert into notification_outbox (id, channel, status, payload)
    values (
      ${id},
      ${job.channel},
      ${status === "queued" ? "pending" : "deferred"},
      ${JSON.stringify({
        userId: job.userId,
        title: job.title,
        body: job.body,
        kind: job.kind,
        entityId: job.entityId ?? null,
        provider,
        reason: live ? null : "provider_not_connected",
      })}
    )
  `;
  return { id, status };
}

export function whatsappSupportUrl(number: string, text: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
