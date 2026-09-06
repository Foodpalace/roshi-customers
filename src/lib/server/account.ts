import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/ids";
import type { AddressView, LoyaltyView, PromoView, TicketView } from "@/lib/market-types";

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name?: string; language?: string } | undefined) => input ?? {})
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, display_name, language)
      values (${context.userId}, ${data.name ?? null}, ${data.language === "bn" ? "bn" : "en"})
      on conflict (user_id) do nothing
    `;
    await sql`
      insert into loyalty_accounts (user_id, points, lifetime_points, tier)
      values (${context.userId}, 0, 0, ${"starter"})
      on conflict (user_id) do nothing
    `;
    const profile = await sql<{
      display_name: string | null;
      phone: string | null;
      language: string;
      notify_push: boolean;
      notify_email: boolean;
      deletion_requested_at: string | null;
    }>`
      select display_name, phone, language, notify_push, notify_email, deletion_requested_at::text as deletion_requested_at
      from profiles where user_id = ${context.userId}
    `;
    const loyalty = await sql<{ points: number; lifetime_points: number; tier: string }>`
      select points, lifetime_points, tier from loyalty_accounts where user_id = ${context.userId}
    `;
    const favs = await sql<{ restaurant_id: string }>`select restaurant_id from favourites where user_id = ${context.userId}`;
    return {
      profile: profile[0] ?? null,
      loyalty: (loyalty[0] ?? { points: 0, lifetime_points: 0, tier: "starter" }) satisfies {
        points: number;
        lifetime_points: number;
        tier: string;
      },
      favouriteRestaurantIds: favs.map((f) => f.restaurant_id),
    };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    name?: string;
    phone?: string;
    language?: string;
    notifyPush?: boolean;
    notifyEmail?: boolean;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, display_name, phone, language, notify_push, notify_email)
      values (
        ${context.userId}, ${data.name ?? null}, ${data.phone ?? null},
        ${data.language === "bn" ? "bn" : "en"},
        ${data.notifyPush ?? true}, ${data.notifyEmail ?? true}
      )
      on conflict (user_id) do update set
        display_name = coalesce(excluded.display_name, profiles.display_name),
        phone = coalesce(excluded.phone, profiles.phone),
        language = excluded.language,
        notify_push = excluded.notify_push,
        notify_email = excluded.notify_email,
        updated_at = now()
    `;
    return { ok: true };
  });

export const listAddresses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      label: string;
      line1: string;
      landmark: string | null;
      area: string;
      zone_id: string | null;
      lat: number | null;
      lng: number | null;
      instructions: string | null;
      is_default: boolean;
    }>`
      select id, label, line1, landmark, area, zone_id, lat, lng, instructions, is_default
      from customer_addresses where user_id = ${context.userId}
      order by is_default desc, created_at desc
    `;
    const addresses: AddressView[] = rows.map((r) => ({
      id: r.id,
      label: r.label,
      line1: r.line1,
      landmark: r.landmark,
      area: r.area,
      zoneId: r.zone_id,
      lat: r.lat,
      lng: r.lng,
      instructions: r.instructions,
      isDefault: r.is_default,
    }));
    return { addresses };
  });

export const saveAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: string;
    label: string;
    line1: string;
    landmark?: string;
    area: string;
    cityId: string;
    zoneId: string;
    lat: number;
    lng: number;
    instructions?: string;
    isDefault?: boolean;
  }) => input)
  .handler(async ({ context, data }) => {
    if (!data.line1.trim()) throw new Error("Address is required");
    const sql = await getSql();
    if (data.id) {
      const owned = await sql<{ id: string }>`
        select id from customer_addresses where id = ${data.id} and user_id = ${context.userId}
      `;
      if (!owned[0]) throw new Error("Address not found");
    }
    const id = data.id ?? newId("adr");
    if (data.isDefault) {
      await sql`update customer_addresses set is_default = false where user_id = ${context.userId}`;
    }
    await sql`
      insert into customer_addresses (
        id, user_id, label, line1, landmark, area, city_id, zone_id, lat, lng, instructions, is_default
      ) values (
        ${id}, ${context.userId}, ${data.label}, ${data.line1.trim()}, ${data.landmark ?? null},
        ${data.area}, ${data.cityId}, ${data.zoneId}, ${data.lat}, ${data.lng},
        ${data.instructions ?? null}, ${Boolean(data.isDefault)}
      )
      on conflict (id) do update set
        label = excluded.label, line1 = excluded.line1, landmark = excluded.landmark, area = excluded.area,
        zone_id = excluded.zone_id, lat = excluded.lat, lng = excluded.lng, instructions = excluded.instructions,
        is_default = excluded.is_default
    `;
    return { id };
  });

export const toggleFavourite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { restaurantId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ restaurant_id: string }>`
      select restaurant_id from favourites where user_id = ${context.userId} and restaurant_id = ${data.restaurantId}
    `;
    if (existing[0]) {
      await sql`delete from favourites where user_id = ${context.userId} and restaurant_id = ${data.restaurantId}`;
      return { favourite: false };
    }
    await sql`insert into favourites (user_id, restaurant_id) values (${context.userId}, ${data.restaurantId})`;
    return { favourite: true };
  });

export const listPromos = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    code: string | null;
    name_en: string;
    funded_by: string;
    min_order_paise: number;
  }>`select id, code, name_en, funded_by, min_order_paise from promotions where active = true`;
  const promos: PromoView[] = rows.map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name_en,
    fundedBy: r.funded_by,
    minOrderPaise: r.min_order_paise,
  }));
  return { promos };
});

export const getLoyalty = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ points: number; lifetime_points: number; tier: string }>`
      select points, lifetime_points, tier from loyalty_accounts where user_id = ${context.userId}
    `;
    const loyalty: LoyaltyView = rows[0]
      ? { points: rows[0].points, lifetimePoints: rows[0].lifetime_points, tier: rows[0].tier }
      : { points: 0, lifetimePoints: 0, tier: "starter" };
    return { loyalty };
  });

export const requestDeletion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, deletion_requested_at)
      values (${context.userId}, now())
      on conflict (user_id) do update set deletion_requested_at = now(), updated_at = now()
    `;
    await sql`
      insert into audit_logs (id, actor_user_id, actor_role, action, entity, entity_id, metadata)
      values (${newId("aud")}, ${context.userId}, ${"customer"}, ${"account.deletion_request"}, ${"profile"}, ${context.userId}, ${"{}"})
    `;
    return { ok: true };
  });

export const createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { topic: string; message: string; orderId?: string }) => input)
  .handler(async ({ context, data }) => {
    const message = data.message.trim();
    if (message.length < 4) throw new Error("Please describe the issue.");
    const sql = await getSql();
    const id = newId("tkt");
    await sql`
      insert into support_tickets (id, user_id, order_id, topic, message, status)
      values (${id}, ${context.userId}, ${data.orderId ?? null}, ${data.topic}, ${message.slice(0, 2000)}, ${"open"})
    `;
    return { id };
  });

export const listTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      topic: string;
      message: string;
      status: string;
      created_at: string;
    }>`
      select id, topic, message, status, created_at::text as created_at
      from support_tickets where user_id = ${context.userId} order by created_at desc
    `;
    const tickets: TicketView[] = rows.map((r) => ({
      id: r.id,
      topic: r.topic,
      message: r.message,
      status: r.status,
      createdAt: r.created_at,
    }));
    return { tickets };
  });
