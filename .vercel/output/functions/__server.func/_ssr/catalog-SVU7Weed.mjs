import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-6y6klq7F.mjs";
import { n as travelMinutes, t as distanceKm } from "./geo-VuaDxie_.mjs";
import { t as loadConfig } from "./load-config-CTS5QCHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-SVU7Weed.js
function localMinutesNow(timeZone, at = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(at);
	const map = {};
	for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
	const weekday = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	}[map.weekday ?? "Mon"] ?? 1;
	const hour = Number(map.hour ?? "0");
	const minute = Number(map.minute ?? "0");
	return {
		weekday,
		minute: hour * 60 + minute
	};
}
function isOpenNow(hours, timeZone, at = /* @__PURE__ */ new Date()) {
	if (hours.length === 0) return true;
	const { weekday, minute } = localMinutesNow(timeZone, at);
	return hours.some((h) => {
		if (h.weekday !== weekday) return false;
		if (h.closeMinute > h.openMinute) return minute >= h.openMinute && minute < h.closeMinute;
		return minute >= h.openMinute || minute < h.closeMinute;
	});
}
function levenshtein(a, b) {
	if (a === b) return 0;
	if (!a.length) return b.length;
	if (!b.length) return a.length;
	const row = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = i - 1;
		row[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const tmp = row[j];
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
			prev = tmp;
		}
	}
	return row[b.length];
}
function matchesQuery(haystack, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	const hay = haystack.toLowerCase();
	if (hay.includes(q)) return true;
	return hay.split(/[^a-z0-9\u0980-\u09FF]+/).filter(Boolean).some((w) => {
		if (w.startsWith(q) || q.startsWith(w)) return true;
		const max = q.length <= 4 ? 1 : 2;
		return levenshtein(w, q) <= max && w.length >= 3;
	});
}
function num(v) {
	if (v == null) return null;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : null;
}
function deliveryFee(distance, base, perKm, freeOver) {
	if (freeOver != null && freeOver <= 0) return 0;
	const raw = Math.max(0, base + Math.round(distance * perKm));
	return Math.round(raw / 100) * 100;
}
async function loadHours() {
	const map = /* @__PURE__ */ new Map();
	const rows = await (await getSql())`select outlet_id, weekday, open_minute, close_minute from restaurant_hours`;
	for (const row of rows) {
		const list = map.get(row.outlet_id) ?? [];
		list.push({
			weekday: row.weekday,
			openMinute: row.open_minute,
			closeMinute: row.close_minute
		});
		map.set(row.outlet_id, list);
	}
	return map;
}
var RESTAURANT_SELECT = `
  select r.id, r.slug, r.name, r.description_en, r.description_bn, r.cover_image, r.cuisine_summary,
         r.veg_only, r.rating_avg, r.rating_count, r.prep_minutes, r.min_order_paise, r.promoted, r.data_label,
         o.id as outlet_id, o.zone_id, z.name as zone_name, o.address_line, o.area, o.lat, o.lng, o.open_override,
         z.delivery_base_paise, z.delivery_per_km_paise, z.delivery_free_over_paise
  from restaurants r
  join restaurant_outlets o on o.restaurant_id = r.id and o.active = true
  join service_zones z on z.id = o.zone_id
`;
async function toCard(row, origin, hours, offerLabel, cfg) {
	const dist = distanceKm(origin, {
		lat: row.lat,
		lng: row.lng
	});
	const open = row.open_override == null ? isOpenNow(hours.get(row.outlet_id) ?? [], cfg.business.timezone) : row.open_override;
	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		coverImage: row.cover_image,
		cuisineSummary: row.cuisine_summary,
		vegOnly: row.veg_only,
		prepMinutes: row.prep_minutes,
		dataLabel: row.data_label,
		promoted: row.promoted,
		distanceKm: Math.round(dist * 10) / 10,
		etaMinutes: row.prep_minutes + travelMinutes(dist, cfg.marketplace.riderSpeedKmh),
		deliveryFeePaise: deliveryFee(dist, row.delivery_base_paise, row.delivery_per_km_paise, null),
		minOrderPaise: row.min_order_paise ?? cfg.marketplace.minOrderPaise,
		open,
		hasOffer: Boolean(offerLabel),
		offerLabel,
		zoneName: row.zone_name,
		ratingAvg: num(row.rating_avg),
		ratingCount: row.rating_count
	};
}
var listZones_createServerFn_handler = createServerRpc({
	id: "54020ec2d54f74887dbac2468d373b9c4d9a7ba5cc3449457c4dd71e48c6b697",
	name: "listZones",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listZones.__executeServer(opts));
var listZones = createServerFn({ method: "GET" }).handler(listZones_createServerFn_handler, async () => {
	return { zones: (await (await getSql())`
    select z.id, z.name, z.city_id, c.name as city_name, z.center_lat, z.center_lng,
           z.min_order_paise, z.delivery_base_paise
    from service_zones z
    join cities c on c.id = z.city_id
    where z.active = true
    order by z.name
  `).map((r) => ({
		id: r.id,
		name: r.name,
		cityId: r.city_id,
		cityName: r.city_name,
		lat: r.center_lat,
		lng: r.center_lng,
		minOrderPaise: r.min_order_paise,
		deliveryBasePaise: r.delivery_base_paise
	})) };
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "599f6ef157822c87192cc0213fef3f49c7a84d058a3039012c70ae9f73b7e713",
	name: "listCategories",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).validator((input) => input).handler(listCategories_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`select id, slug, name_en, name_bn, image_url from categories where active = true order by sort_order`;
	const lang = data.lang === "bn" ? "bn" : "en";
	return { categories: rows.map((r) => ({
		id: r.id,
		slug: r.slug,
		name: lang === "bn" ? r.name_bn : r.name_en,
		imageUrl: r.image_url
	})) };
});
var listRestaurants_createServerFn_handler = createServerRpc({
	id: "4ca646786be2f0e1a862acf8879f6e338fb929dc92da415872ec15bf04aa0a3f",
	name: "listRestaurants",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listRestaurants.__executeServer(opts));
var listRestaurants = createServerFn({ method: "POST" }).validator((input) => input).handler(listRestaurants_createServerFn_handler, async ({ data }) => {
	const cfg = await loadConfig();
	const sql = await getSql();
	const rows = await sql.query(`${RESTAURANT_SELECT} where r.active = true order by r.promoted desc, r.name`);
	const promos = await sql`
      select id, restaurant_id, name_en from promotions where active = true
    `;
	const hours = await loadHours();
	const origin = {
		lat: data.lat,
		lng: data.lng
	};
	const q = data.q?.trim() ?? "";
	const itemNames = q ? await sql`
          select restaurant_id, name_en, name_bn from menu_items where available = true
        ` : [];
	const catLinks = data.category ? await sql`
          select restaurant_id from restaurant_categories where category_id = ${data.category}
        ` : [];
	const catSet = new Set(catLinks.map((c) => c.restaurant_id));
	const cards = [];
	for (const row of rows) {
		const card = await toCard(row, origin, hours, promos.find((p) => !p.restaurant_id || p.restaurant_id === row.id)?.name_en ?? null, cfg);
		if (data.veg && !row.veg_only) continue;
		if (data.openNow && !card.open) continue;
		if (data.category && !catSet.has(row.id)) continue;
		if (q) {
			const blob = `${row.name} ${row.cuisine_summary} ${row.description_en} ${row.description_bn}`;
			const itemHit = itemNames.some((it) => it.restaurant_id === row.id && (matchesQuery(it.name_en, q) || matchesQuery(it.name_bn, q)));
			if (!matchesQuery(blob, q) && !itemHit) continue;
		}
		cards.push(card);
	}
	cards.sort((a, b) => {
		if (a.open !== b.open) return a.open ? -1 : 1;
		if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
		return a.etaMinutes - b.etaMinutes || a.distanceKm - b.distanceKm;
	});
	return {
		restaurants: cards,
		sections: {
			offers: cards.filter((c) => c.hasOffer).slice(0, 8),
			popular: [...cards].sort((a, b) => a.etaMinutes - b.etaMinutes).slice(0, 8),
			fast: cards.filter((c) => c.etaMinutes <= 35).slice(0, 8),
			budget: cards.filter((c) => c.minOrderPaise <= 8e3).slice(0, 8),
			veg: cards.filter((c) => c.vegOnly),
			newKitchens: cards.slice(0, 6)
		}
	};
});
var getRestaurant_createServerFn_handler = createServerRpc({
	id: "dcf312928525099f8b792af3d56ce0d707c4a03392b5cabb690055496ce68271",
	name: "getRestaurant",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getRestaurant.__executeServer(opts));
var getRestaurant = createServerFn({ method: "GET" }).validator((input) => input).handler(getRestaurant_createServerFn_handler, async ({ data }) => {
	const cfg = await loadConfig();
	const sql = await getSql();
	const lang = data.lang === "bn" ? "bn" : "en";
	const row = (await sql.query(`${RESTAURANT_SELECT} where r.slug = $1 and r.active = true limit 1`, [data.slug]))[0];
	if (!row) return { restaurant: null };
	const hours = await loadHours();
	const offer = (await sql`
      select name_en, restaurant_id from promotions where active = true
    `).find((p) => !p.restaurant_id || p.restaurant_id === row.id);
	const card = await toCard(row, {
		lat: data.lat,
		lng: data.lng
	}, hours, offer?.name_en ?? null, cfg);
	const cats = await sql`
      select id, name_en, name_bn from menu_categories where restaurant_id = ${row.id} order by sort_order
    `;
	const items = await sql`
      select id, category_id, name_en, name_bn, description_en, description_bn, image_url, veg, spicy_level,
             bestseller, available, base_price_paise
      from menu_items where restaurant_id = ${row.id} order by sort_order
    `;
	const variants = await sql`select id, item_id, name_en, name_bn, price_paise, is_default, available from menu_variants order by sort_order`;
	const groups = await sql`select id, item_id, name_en, name_bn, required, min_select, max_select from addon_groups`;
	const addons = await sql`select id, group_id, name_en, name_bn, price_paise, available from addons`;
	const windows = hours.get(row.outlet_id) ?? [];
	const { weekday } = localMinutesNow(cfg.business.timezone);
	const today = windows.find((w) => w.weekday === weekday) ?? windows[0];
	const hoursLabel = today ? `${String(Math.floor(today.openMinute / 60)).padStart(2, "0")}:${String(today.openMinute % 60).padStart(2, "0")} – ${String(Math.floor(today.closeMinute / 60)).padStart(2, "0")}:${String(today.closeMinute % 60).padStart(2, "0")}` : "";
	const categories = cats.map((c) => ({
		id: c.id,
		name: lang === "bn" ? c.name_bn : c.name_en,
		items: items.filter((it) => it.category_id === c.id).map((it) => ({
			id: it.id,
			name: lang === "bn" ? it.name_bn : it.name_en,
			description: lang === "bn" ? it.description_bn : it.description_en,
			imageUrl: it.image_url,
			veg: it.veg,
			spicyLevel: it.spicy_level,
			bestseller: it.bestseller,
			available: it.available,
			basePricePaise: it.base_price_paise,
			variants: variants.filter((v) => v.item_id === it.id).map((v) => ({
				id: v.id,
				name: lang === "bn" ? v.name_bn : v.name_en,
				pricePaise: v.price_paise,
				isDefault: v.is_default,
				available: v.available
			})),
			addonGroups: groups.filter((g) => g.item_id === it.id).map((g) => ({
				id: g.id,
				name: lang === "bn" ? g.name_bn : g.name_en,
				required: g.required,
				minSelect: g.min_select,
				maxSelect: g.max_select,
				addons: addons.filter((a) => a.group_id === g.id).map((a) => ({
					id: a.id,
					name: lang === "bn" ? a.name_bn : a.name_en,
					pricePaise: a.price_paise,
					available: a.available
				}))
			}))
		}))
	}));
	return { restaurant: {
		card,
		description: lang === "bn" ? row.description_bn : row.description_en,
		outletId: row.outlet_id,
		addressLine: row.address_line,
		area: row.area,
		hoursLabel,
		categories
	} };
});
//#endregion
export { getRestaurant_createServerFn_handler, listCategories_createServerFn_handler, listRestaurants_createServerFn_handler, listZones_createServerFn_handler };
