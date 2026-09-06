import { r as createServerFn } from "./ssr.mjs";
import { t as computeQuote } from "./pricing-CnXKp7tT.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as distanceKm } from "./geo-VuaDxie_.mjs";
import { t as loadConfig } from "./load-config-CTS5QCHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quote-Clw5othl.js
async function buildQuote(input, isFirstOrder) {
	const cfg = await loadConfig();
	const sql = await getSql();
	if (input.lines.length === 0) {
		const emptyFees = {
			deliveryBasePaise: cfg.marketplace.deliveryBasePaise,
			deliveryPerKmPaise: cfg.marketplace.deliveryPerKmPaise,
			deliveryFreeOverPaise: cfg.marketplace.deliveryFreeOverPaise,
			serviceFeePaise: cfg.marketplace.serviceFeePaise,
			serviceFeeBps: cfg.marketplace.serviceFeeBps,
			menuPricesIncludeTax: cfg.tax.menuPricesIncludeTax,
			menuTaxBps: cfg.tax.menuTaxBps,
			serviceTaxBps: cfg.tax.serviceTaxBps,
			deliveryTaxBps: cfg.tax.deliveryTaxBps,
			minOrderPaise: cfg.marketplace.minOrderPaise
		};
		const quote = computeQuote({
			lines: [],
			packagingPaise: 0,
			commissionBps: cfg.marketplace.defaultCommissionBps,
			distanceKm: 0,
			fees: emptyFees,
			promo: null,
			isFirstOrder
		});
		return {
			restaurantId: input.restaurantId,
			restaurantName: "",
			dataLabel: "SIMULATED",
			outletId: "",
			zoneId: input.zoneId,
			packagingPaise: 0,
			commissionBps: cfg.marketplace.defaultCommissionBps,
			distanceKm: 0,
			fees: emptyFees,
			promo: null,
			pricedLines: [],
			result: {
				restaurantId: input.restaurantId,
				restaurantName: "",
				dataLabel: "SIMULATED",
				quote,
				pricedLines: [],
				promoName: null
			}
		};
	}
	const restaurant = (await sql`select id, name, commission_bps, packaging_paise, min_order_paise, data_label from restaurants where id = ${input.restaurantId} and active = true`)[0];
	if (!restaurant) throw new Error("Kitchen not found");
	const out = (await sql`
    select id, lat, lng, zone_id from restaurant_outlets where restaurant_id = ${restaurant.id} and active = true limit 1
  `)[0];
	if (!out) throw new Error("Kitchen outlet not found");
	const z = (await sql`select id, min_order_paise, delivery_base_paise, delivery_per_km_paise, delivery_free_over_paise from service_zones where id = ${input.zoneId}`)[0];
	if (!z) throw new Error("Service area not found");
	const itemIds = [...new Set(input.lines.map((l) => l.itemId))];
	const items = await sql`select id, restaurant_id, name_en, available, base_price_paise from menu_items`;
	const itemMap = new Map(items.filter((i) => itemIds.includes(i.id)).map((i) => [i.id, i]));
	const variants = await sql`
    select id, item_id, name_en, price_paise, is_default, available from menu_variants
  `;
	const addons = await sql`
    select id, group_id, name_en, price_paise, available from addons
  `;
	const groups = await sql`select id, item_id from addon_groups`;
	const addonById = new Map(addons.map((a) => [a.id, a]));
	const groupById = new Map(groups.map((g) => [g.id, g]));
	const pricedLines = [];
	for (const line of input.lines) {
		const item = itemMap.get(line.itemId);
		if (!item || item.restaurant_id !== restaurant.id) throw new Error("Item does not belong to this kitchen");
		const qty = Math.max(1, Math.min(20, Math.floor(line.quantity)));
		const variant = line.variantId ? variants.find((v) => v.id === line.variantId && v.item_id === item.id) : variants.find((v) => v.item_id === item.id && v.is_default);
		if (line.variantId && !variant) throw new Error("Unknown variant");
		const unitBase = variant ? variant.price_paise : item.base_price_paise;
		const chosenAddons = [];
		for (const id of line.addonIds) {
			const addon = addonById.get(id);
			if (!addon) throw new Error("Unknown add-on");
			const group = groupById.get(addon.group_id);
			if (!group || group.item_id !== item.id) throw new Error("Add-on does not belong to this item");
			if (!addon.available) throw new Error("Add-on unavailable");
			chosenAddons.push({
				id: addon.id,
				name: addon.name_en,
				pricePaise: addon.price_paise
			});
		}
		const unitPaise = unitBase + chosenAddons.reduce((s, a) => s + a.pricePaise, 0);
		const name = variant ? `${item.name_en} · ${variant.name_en}` : item.name_en;
		pricedLines.push({
			key: [
				line.itemId,
				line.variantId ?? "",
				[...line.addonIds].sort().join(","),
				line.instructions
			].join("|"),
			itemId: item.id,
			variantId: variant?.id ?? null,
			name,
			quantity: qty,
			unitPaise,
			addons: chosenAddons,
			instructions: (line.instructions ?? "").slice(0, 180),
			available: item.available && (variant ? variant.available : true)
		});
	}
	let promo = null;
	const code = input.coupon?.trim().toUpperCase();
	if (code) {
		const p = (await sql`select id, code, name_en, kind, percent_bps, amount_paise, min_order_paise, max_discount_paise, funded_by, first_order_only, restaurant_id, active from promotions where code = ${code}`)[0];
		if (p && p.active && (!p.restaurant_id || p.restaurant_id === restaurant.id)) promo = {
			id: p.id,
			code: p.code,
			name: p.name_en,
			kind: p.kind === "percent" ? "percent" : "fixed",
			percentBps: p.percent_bps,
			amountPaise: p.amount_paise,
			minOrderPaise: p.min_order_paise,
			maxDiscountPaise: p.max_discount_paise,
			fundedBy: p.funded_by,
			firstOrderOnly: p.first_order_only
		};
	}
	const dist = distanceKm({
		lat: input.lat,
		lng: input.lng
	}, {
		lat: out.lat,
		lng: out.lng
	});
	const fees = {
		deliveryBasePaise: z.delivery_base_paise,
		deliveryPerKmPaise: z.delivery_per_km_paise,
		deliveryFreeOverPaise: z.delivery_free_over_paise,
		serviceFeePaise: cfg.marketplace.serviceFeePaise,
		serviceFeeBps: cfg.marketplace.serviceFeeBps,
		menuPricesIncludeTax: cfg.tax.menuPricesIncludeTax,
		menuTaxBps: cfg.tax.menuTaxBps,
		serviceTaxBps: cfg.tax.serviceTaxBps,
		deliveryTaxBps: cfg.tax.deliveryTaxBps,
		minOrderPaise: restaurant.min_order_paise ?? z.min_order_paise
	};
	const quote = computeQuote({
		lines: pricedLines,
		packagingPaise: restaurant.packaging_paise,
		commissionBps: restaurant.commission_bps,
		distanceKm: dist,
		fees,
		promo,
		isFirstOrder
	});
	const result = {
		restaurantId: restaurant.id,
		restaurantName: restaurant.name,
		dataLabel: restaurant.data_label,
		quote,
		pricedLines: pricedLines.map((l) => ({
			key: l.key,
			itemId: l.itemId,
			variantId: l.variantId,
			name: l.name,
			quantity: l.quantity,
			unitPaise: l.unitPaise,
			addons: l.addons,
			instructions: l.instructions
		})),
		promoName: promo?.name ?? null
	};
	return {
		restaurantId: restaurant.id,
		restaurantName: restaurant.name,
		dataLabel: restaurant.data_label,
		outletId: out.id,
		zoneId: z.id,
		packagingPaise: restaurant.packaging_paise,
		commissionBps: restaurant.commission_bps,
		distanceKm: dist,
		fees,
		promo,
		pricedLines,
		result
	};
}
var quoteCart = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("06af4eb626dbd302bf40958362cfa97a9b98424ce26e624a46c1872e64c70b01"));
var trackAnalytics = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("973e5ed0e3e794113873176663114003cb50bfc713d159f2d72f48c1965b0e71"));
//#endregion
export { quoteCart as n, trackAnalytics as r, buildQuote as t };
