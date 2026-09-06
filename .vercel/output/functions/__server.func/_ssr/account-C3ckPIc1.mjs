import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
import { t as newId } from "./ids-BXI880_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-C3ckPIc1.js
var ensureProfile_createServerFn_handler = createServerRpc({
	id: "490861950fcd9141aae2f9961856697ed1cd40bc0b57e671ffd85e45abab75df",
	name: "ensureProfile",
	filename: "src/lib/server/account.ts"
}, (opts) => ensureProfile.__executeServer(opts));
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(ensureProfile_createServerFn_handler, async ({ context, data }) => {
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
	const profile = await sql`
      select display_name, phone, language, notify_push, notify_email, deletion_requested_at::text as deletion_requested_at
      from profiles where user_id = ${context.userId}
    `;
	const loyalty = await sql`
      select points, lifetime_points, tier from loyalty_accounts where user_id = ${context.userId}
    `;
	const favs = await sql`select restaurant_id from favourites where user_id = ${context.userId}`;
	return {
		profile: profile[0] ?? null,
		loyalty: loyalty[0] ?? {
			points: 0,
			lifetime_points: 0,
			tier: "starter"
		},
		favouriteRestaurantIds: favs.map((f) => f.restaurant_id)
	};
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "f23116ccd8021e4eeff9e6ee47ae6b15fe44fb917fc10a9b79071c37d0dc7437",
	name: "updateProfile",
	filename: "src/lib/server/account.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
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
var listAddresses_createServerFn_handler = createServerRpc({
	id: "e9e656cc52a0ab54c1451c3c6bcdd4d0c9183d44cb3e36a4a6ae12a241c117cd",
	name: "listAddresses",
	filename: "src/lib/server/account.ts"
}, (opts) => listAddresses.__executeServer(opts));
var listAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAddresses_createServerFn_handler, async ({ context }) => {
	return { addresses: (await (await getSql())`
      select id, label, line1, landmark, area, zone_id, lat, lng, instructions, is_default
      from customer_addresses where user_id = ${context.userId}
      order by is_default desc, created_at desc
    `).map((r) => ({
		id: r.id,
		label: r.label,
		line1: r.line1,
		landmark: r.landmark,
		area: r.area,
		zoneId: r.zone_id,
		lat: r.lat,
		lng: r.lng,
		instructions: r.instructions,
		isDefault: r.is_default
	})) };
});
var saveAddress_createServerFn_handler = createServerRpc({
	id: "b47af9d3d84286eef9854674463db25394f27cea97c0ad52dc494cd2b2a830cc",
	name: "saveAddress",
	filename: "src/lib/server/account.ts"
}, (opts) => saveAddress.__executeServer(opts));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAddress_createServerFn_handler, async ({ context, data }) => {
	if (!data.line1.trim()) throw new Error("Address is required");
	const sql = await getSql();
	if (data.id) {
		if (!(await sql`
        select id from customer_addresses where id = ${data.id} and user_id = ${context.userId}
      `)[0]) throw new Error("Address not found");
	}
	const id = data.id ?? newId("adr");
	if (data.isDefault) await sql`update customer_addresses set is_default = false where user_id = ${context.userId}`;
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
var toggleFavourite_createServerFn_handler = createServerRpc({
	id: "8c5a873bcf5cb2ad5b118fc3b6176d3ac9a59a3393741e6f2b0bb1dc4a7ba57e",
	name: "toggleFavourite",
	filename: "src/lib/server/account.ts"
}, (opts) => toggleFavourite.__executeServer(opts));
var toggleFavourite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleFavourite_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select restaurant_id from favourites where user_id = ${context.userId} and restaurant_id = ${data.restaurantId}
    `)[0]) {
		await sql`delete from favourites where user_id = ${context.userId} and restaurant_id = ${data.restaurantId}`;
		return { favourite: false };
	}
	await sql`insert into favourites (user_id, restaurant_id) values (${context.userId}, ${data.restaurantId})`;
	return { favourite: true };
});
var listPromos_createServerFn_handler = createServerRpc({
	id: "8d9f7913dc9f0b5ee4b00c3771467f47af7f528d52953603105c30f71ac77ef7",
	name: "listPromos",
	filename: "src/lib/server/account.ts"
}, (opts) => listPromos.__executeServer(opts));
var listPromos = createServerFn({ method: "GET" }).handler(listPromos_createServerFn_handler, async () => {
	return { promos: (await (await getSql())`select id, code, name_en, funded_by, min_order_paise from promotions where active = true`).map((r) => ({
		id: r.id,
		code: r.code,
		name: r.name_en,
		fundedBy: r.funded_by,
		minOrderPaise: r.min_order_paise
	})) };
});
var getLoyalty_createServerFn_handler = createServerRpc({
	id: "176cd1deb4152d5d1d1952e0ad6ad1181b4a9b922fb3a330cd6f5f0551e86ed3",
	name: "getLoyalty",
	filename: "src/lib/server/account.ts"
}, (opts) => getLoyalty.__executeServer(opts));
var getLoyalty = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getLoyalty_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql())`
      select points, lifetime_points, tier from loyalty_accounts where user_id = ${context.userId}
    `;
	return { loyalty: rows[0] ? {
		points: rows[0].points,
		lifetimePoints: rows[0].lifetime_points,
		tier: rows[0].tier
	} : {
		points: 0,
		lifetimePoints: 0,
		tier: "starter"
	} };
});
var requestDeletion_createServerFn_handler = createServerRpc({
	id: "8f2fa14fb93a2d34001d031b150820b95051f162ff04d95ce01d42657bbc5c68",
	name: "requestDeletion",
	filename: "src/lib/server/account.ts"
}, (opts) => requestDeletion.__executeServer(opts));
var requestDeletion = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(requestDeletion_createServerFn_handler, async ({ context }) => {
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
var createTicket_createServerFn_handler = createServerRpc({
	id: "c6868e2d4a4fe12a40bca7379e178fc4d2f3b57d25db966dc42dfca2cd1fd5c8",
	name: "createTicket",
	filename: "src/lib/server/account.ts"
}, (opts) => createTicket.__executeServer(opts));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createTicket_createServerFn_handler, async ({ context, data }) => {
	const message = data.message.trim();
	if (message.length < 4) throw new Error("Please describe the issue.");
	const sql = await getSql();
	const id = newId("tkt");
	await sql`
      insert into support_tickets (id, user_id, order_id, topic, message, status)
      values (${id}, ${context.userId}, ${data.orderId ?? null}, ${data.topic}, ${message.slice(0, 2e3)}, ${"open"})
    `;
	return { id };
});
var listTickets_createServerFn_handler = createServerRpc({
	id: "30becb3d60b6e5c654fafb211acf4d70b656e20cc26203ff60f1301a75df8dd7",
	name: "listTickets",
	filename: "src/lib/server/account.ts"
}, (opts) => listTickets.__executeServer(opts));
var listTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTickets_createServerFn_handler, async ({ context }) => {
	return { tickets: (await (await getSql())`
      select id, topic, message, status, created_at::text as created_at
      from support_tickets where user_id = ${context.userId} order by created_at desc
    `).map((r) => ({
		id: r.id,
		topic: r.topic,
		message: r.message,
		status: r.status,
		createdAt: r.created_at
	})) };
});
//#endregion
export { createTicket_createServerFn_handler, ensureProfile_createServerFn_handler, getLoyalty_createServerFn_handler, listAddresses_createServerFn_handler, listPromos_createServerFn_handler, listTickets_createServerFn_handler, requestDeletion_createServerFn_handler, saveAddress_createServerFn_handler, toggleFavourite_createServerFn_handler, updateProfile_createServerFn_handler };
