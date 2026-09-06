import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as customerMayCancel, n as SIMULATED_ADVANCE, r as canTransition } from "./state-1rAkgEsW.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { t as loadConfig } from "./load-config-CTS5QCHr.mjs";
import { t as buildQuote } from "./quote-Clw5othl.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
import { n as publicOrderCode, t as newId } from "./ids-BXI880_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CvgjYyz2.js
var buckets = /* @__PURE__ */ new Map();
function rateLimit(key, n, windowMs) {
	const now = Date.now();
	const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
	if (arr.length >= n) return false;
	arr.push(now);
	buckets.set(key, arr);
	return true;
}
async function isFirstOrder(userId) {
	return ((await (await getSql())`select count(*)::int as c from orders where user_id = ${userId} and status not in ('FAILED_PAYMENT','CANCELLED')`)[0]?.c ?? 0) === 0;
}
async function writeEvent(orderId, fromStatus, toStatus, actorUserId, actorRole, note) {
	await (await getSql())`
    insert into order_events (id, order_id, from_status, to_status, actor_user_id, actor_role, note)
    values (${newId("oev")}, ${orderId}, ${fromStatus}, ${toStatus}, ${actorUserId}, ${actorRole}, ${note ?? null})
  `;
}
var placeOrder_createServerFn_handler = createServerRpc({
	id: "eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f",
	name: "placeOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(placeOrder_createServerFn_handler, async ({ context, data }) => {
	if (!rateLimit(`order:${context.userId}`, 5, 6e4)) throw new Error("Too many order attempts. Wait a minute.");
	if (!data.address.line1.trim()) throw new Error("Delivery address is required.");
	if (data.lines.length === 0) throw new Error("Cart is empty.");
	const sql = await getSql();
	const existing = await sql`
      select id, public_id from orders where idempotency_key = ${data.idempotencyKey} and user_id = ${context.userId}
    `;
	if (existing[0]) return {
		orderId: existing[0].id,
		publicId: existing[0].public_id,
		duplicate: true
	};
	const first = await isFirstOrder(context.userId);
	const built = await buildQuote({
		restaurantId: data.restaurantId,
		zoneId: data.zoneId,
		lat: data.lat,
		lng: data.lng,
		coupon: data.coupon,
		lines: data.lines
	}, first);
	if (built.result.quote.blockers.length) throw new Error(`Order blocked: ${built.result.quote.blockers.join(", ")}`);
	const cfg = await loadConfig();
	const orderId = newId("ord");
	const publicId = publicOrderCode(cfg.marketplace.orderPrefix);
	const otp = String(Math.floor(1e3 + Math.random() * 9e3));
	const method = data.paymentMethod;
	const paymentStatus = method === "COD" ? "pending_collection" : "sandbox_paid";
	const q = built.result.quote;
	const addressSnapshot = JSON.stringify({
		...data.address,
		lat: data.lat,
		lng: data.lng,
		zoneId: data.zoneId
	});
	await sql`
      insert into orders (
        id, public_id, user_id, restaurant_id, outlet_id, zone_id, address_snapshot, status,
        payment_method, payment_status, idempotency_key,
        food_subtotal_paise, restaurant_discount_paise, platform_discount_paise,
        delivery_fee_paise, service_fee_paise, tax_paise, packaging_paise, total_paise,
        commission_bps, commission_paise, restaurant_payable_paise, promotion_id, notes, delivery_otp, data_label
      ) values (
        ${orderId}, ${publicId}, ${context.userId}, ${built.restaurantId}, ${built.outletId}, ${built.zoneId},
        ${addressSnapshot}, ${"PLACED"}, ${method}, ${paymentStatus}, ${data.idempotencyKey},
        ${q.foodSubtotalPaise}, ${q.restaurantDiscountPaise}, ${q.platformDiscountPaise},
        ${q.deliveryFeePaise}, ${q.serviceFeePaise}, ${q.taxPaise}, ${q.packagingPaise}, ${q.totalPaise},
        ${q.commissionBps}, ${q.commissionPaise}, ${q.restaurantPayablePaise}, ${built.promo?.id ?? null},
        ${(data.notes ?? "").slice(0, 240)}, ${otp}, ${built.dataLabel}
      )
    `;
	for (const line of built.pricedLines) await sql`
        insert into order_items (
          id, order_id, item_id, variant_id, name_snapshot, quantity, unit_price_paise, addons_snapshot, instructions, line_total_paise
        ) values (
          ${newId("oit")}, ${orderId}, ${line.itemId}, ${line.variantId}, ${line.name}, ${line.quantity},
          ${line.unitPaise}, ${JSON.stringify(line.addons)}, ${line.instructions || null},
          ${line.unitPaise * line.quantity}
        )
      `;
	for (let i = 0; i < q.lines.length; i++) {
		const line = q.lines[i];
		await sql`
        insert into order_price_lines (id, order_id, code, name, amount_paise, source, funded_by, reason, sort_order)
        values (${newId("opl")}, ${orderId}, ${line.code}, ${line.name}, ${line.amountPaise}, ${line.source}, ${line.fundedBy}, ${line.reason}, ${i})
      `;
	}
	await sql`
      insert into payments (id, order_id, provider, status, amount_paise, currency, idempotency_key, raw_payload)
      values (
        ${newId("pay")}, ${orderId}, ${method === "COD" ? "COD" : "UPI_SANDBOX"},
        ${method === "COD" ? "pending" : "sandbox_paid"}, ${q.totalPaise}, ${"INR"},
        ${`${data.idempotencyKey}:pay`}, ${method === "UPI_SANDBOX" ? JSON.stringify({
		sandbox: true,
		note: "Not a real UPI transfer"
	}) : null}
      )
    `;
	if (built.promo) await sql`
        insert into promotion_redemptions (id, promotion_id, user_id, order_id)
        values (${newId("red")}, ${built.promo.id}, ${context.userId}, ${orderId})
      `;
	const points = Math.floor(q.foodSubtotalPaise / 1e4);
	await sql`
      insert into loyalty_accounts (user_id, points, lifetime_points, tier)
      values (${context.userId}, ${points}, ${points}, ${"starter"})
      on conflict (user_id) do update set
        points = loyalty_accounts.points + ${points},
        lifetime_points = loyalty_accounts.lifetime_points + ${points},
        updated_at = now()
    `;
	await sql`
      insert into loyalty_transactions (id, user_id, order_id, delta, reason)
      values (${newId("loy")}, ${context.userId}, ${orderId}, ${points}, ${"order_placed"})
    `;
	await writeEvent(orderId, null, "PLACED", context.userId, "customer", "Order placed");
	await sql`
      insert into notifications (id, user_id, title, body, kind, entity_id)
      values (
        ${newId("ntf")}, ${context.userId}, ${"Order confirmed"},
        ${`Order ${publicId} is confirmed. Pay ${method === "COD" ? "on delivery" : "was marked sandbox-paid"}.`},
        ${"ORDER_PLACED"}, ${orderId}
      )
    `;
	await sql`
      insert into notification_outbox (id, channel, status, payload)
      values (
        ${newId("nbox")}, ${"sms"}, ${"pending"},
        ${JSON.stringify({
		reason: "provider_not_connected",
		event: "ORDER_PLACED",
		orderId
	})}
      )
    `;
	await sql`
      insert into audit_logs (id, actor_user_id, actor_role, action, entity, entity_id, metadata)
      values (${newId("aud")}, ${context.userId}, ${"customer"}, ${"order.place"}, ${"order"}, ${orderId}, ${JSON.stringify({
		publicId,
		method
	})})
    `;
	await sql`
      insert into analytics_events (id, user_id, name, payload)
      values (${newId("evt")}, ${context.userId}, ${"order_placed"}, ${JSON.stringify({ orderId })})
    `;
	return {
		orderId,
		publicId,
		duplicate: false,
		deliveryOtp: otp
	};
});
async function getOwnedOrder(userId, orderId) {
	return (await (await getSql())`select id, public_id, user_id, restaurant_id, status, payment_method, payment_status, total_paise, placed_at::text as placed_at, notes, delivery_otp, address_snapshot, data_label from orders where id = ${orderId} and user_id = ${userId}`)[0] ?? null;
}
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e",
	name: "listMyOrders",
	filename: "src/lib/server/orders.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	return { orders: (await (await getSql())`
      select o.id, o.public_id, o.status, o.total_paise, o.placed_at::text as placed_at, o.data_label,
             r.name as restaurant_name, r.slug as restaurant_slug,
             (select string_agg(name_snapshot, ', ') from (select name_snapshot from order_items where order_id = o.id limit 3) s) as preview
      from orders o
      join restaurants r on r.id = o.restaurant_id
      where o.user_id = ${context.userId}
      order by o.placed_at desc
      limit 50
    `).map((r) => ({
		id: r.id,
		publicId: r.public_id,
		status: r.status,
		restaurantName: r.restaurant_name,
		restaurantSlug: r.restaurant_slug,
		totalPaise: r.total_paise,
		placedAt: r.placed_at,
		itemPreview: r.preview ?? "",
		dataLabel: r.data_label
	})) };
});
var getMyOrder_createServerFn_handler = createServerRpc({
	id: "4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e",
	name: "getMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => getMyOrder.__executeServer(opts));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getMyOrder_createServerFn_handler, async ({ context, data }) => {
	const order = await getOwnedOrder(context.userId, data.orderId);
	if (!order) return { order: null };
	const sql = await getSql();
	const rst = await sql`
      select name, slug, data_label from restaurants where id = ${order.restaurant_id}
    `;
	const items = await sql`
      select name_snapshot, quantity, line_total_paise, instructions from order_items where order_id = ${order.id}
    `;
	const lines = await sql`select code, name, amount_paise, source, funded_by, reason from order_price_lines where order_id = ${order.id} order by sort_order`;
	const events = await sql`
      select to_status, created_at::text as created_at, note from order_events where order_id = ${order.id} order by created_at
    `;
	const restaurant = rst[0];
	return { order: {
		summary: {
			id: order.id,
			publicId: order.public_id,
			status: order.status,
			restaurantName: restaurant?.name ?? "Kitchen",
			restaurantSlug: restaurant?.slug ?? "",
			totalPaise: order.total_paise,
			placedAt: order.placed_at,
			itemPreview: items.map((i) => i.name_snapshot).join(", "),
			dataLabel: order.data_label
		},
		status: order.status,
		paymentMethod: order.payment_method,
		paymentStatus: order.payment_status,
		deliveryOtp: order.delivery_otp,
		notes: order.notes,
		address: order.address_snapshot,
		lines: lines.map((l) => ({
			code: l.code,
			name: l.name,
			amountPaise: l.amount_paise,
			source: l.source,
			fundedBy: l.funded_by ?? "CUSTOMER",
			reason: l.reason
		})),
		items: items.map((i) => ({
			name: i.name_snapshot,
			quantity: i.quantity,
			lineTotalPaise: i.line_total_paise,
			instructions: i.instructions
		})),
		events: events.map((e) => ({
			toStatus: e.to_status,
			createdAt: e.created_at,
			note: e.note
		})),
		restaurantSimulated: restaurant?.data_label === "SIMULATED",
		canCancel: customerMayCancel(order.status)
	} };
});
var cancelMyOrder_createServerFn_handler = createServerRpc({
	id: "ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db",
	name: "cancelMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => cancelMyOrder.__executeServer(opts));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(cancelMyOrder_createServerFn_handler, async ({ context, data }) => {
	const order = await getOwnedOrder(context.userId, data.orderId);
	if (!order) throw new Error("Order not found");
	if (!customerMayCancel(order.status)) throw new Error("This order can no longer be cancelled.");
	if (!canTransition(order.status, "CANCELLED")) throw new Error("Illegal cancellation");
	await (await getSql())`update orders set status = ${"CANCELLED"}, updated_at = now() where id = ${order.id} and user_id = ${context.userId}`;
	await writeEvent(order.id, order.status, "CANCELLED", context.userId, "customer", "Cancelled by customer");
	return { ok: true };
});
var advanceSimulatedOrder_createServerFn_handler = createServerRpc({
	id: "1b802b8c3455fb8f760dacc7746a602f14752310da779e615e7d3dc0919f5938",
	name: "advanceSimulatedOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => advanceSimulatedOrder.__executeServer(opts));
var advanceSimulatedOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(advanceSimulatedOrder_createServerFn_handler, async ({ context, data }) => {
	const order = await getOwnedOrder(context.userId, data.orderId);
	if (!order) throw new Error("Order not found");
	const sql = await getSql();
	if ((await sql`select data_label from restaurants where id = ${order.restaurant_id}`)[0]?.data_label !== "SIMULATED") throw new Error("Only sample kitchens can be advanced in development.");
	const next = SIMULATED_ADVANCE[order.status];
	if (!next) return { status: order.status };
	if (!canTransition(order.status, next)) throw new Error("Illegal transition");
	await sql`update orders set status = ${next}, updated_at = now() where id = ${order.id} and user_id = ${context.userId}`;
	await writeEvent(order.id, order.status, next, context.userId, "system", "Sample kitchen status advanced");
	if (next === "DELIVERED") {
		await sql`update payments set status = ${"collected"} where order_id = ${order.id} and provider = ${"COD"}`;
		await sql`update orders set payment_status = ${"collected"} where id = ${order.id} and payment_method = ${"COD"}`;
	}
	return { status: next };
});
//#endregion
export { advanceSimulatedOrder_createServerFn_handler, cancelMyOrder_createServerFn_handler, getMyOrder_createServerFn_handler, listMyOrders_createServerFn_handler, placeOrder_createServerFn_handler };
