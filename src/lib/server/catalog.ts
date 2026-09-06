import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { distanceKm, travelMinutes } from "@/lib/geo";
import { isOpenNow, localMinutesNow, type HourWindow } from "@/lib/hours";
import { matchesQuery } from "@/lib/search";
import type { DataLabel } from "@/lib/config/types";
import type {
  CategoryView,
  MenuCategoryView,
  RestaurantCard,
  RestaurantDetail,
  ZoneOption,
} from "@/lib/market-types";
import { loadConfig } from "./load-config";

type RestaurantRow = {
  id: string;
  slug: string;
  name: string;
  description_en: string;
  description_bn: string;
  cover_image: string | null;
  cuisine_summary: string;
  veg_only: boolean;
  rating_avg: string | number | null;
  rating_count: number;
  prep_minutes: number;
  min_order_paise: number | null;
  promoted: boolean;
  data_label: DataLabel;
  outlet_id: string;
  zone_id: string;
  zone_name: string;
  address_line: string;
  area: string;
  lat: number;
  lng: number;
  open_override: boolean | null;
  delivery_base_paise: number;
  delivery_per_km_paise: number;
  delivery_free_over_paise: number | null;
};

function num(v: string | number | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function deliveryFee(distance: number, base: number, perKm: number, freeOver: number | null): number {
  if (freeOver != null && freeOver <= 0) return 0;
  const raw = Math.max(0, base + Math.round(distance * perKm));
  return Math.round(raw / 100) * 100;
}

async function loadHours(): Promise<Map<string, HourWindow[]>> {
  const map = new Map<string, HourWindow[]>();
  const sql = await getSql();
  const rows = await sql<{
    outlet_id: string;
    weekday: number;
    open_minute: number;
    close_minute: number;
  }>`select outlet_id, weekday, open_minute, close_minute from restaurant_hours`;
  for (const row of rows) {
    const list = map.get(row.outlet_id) ?? [];
    list.push({ weekday: row.weekday, openMinute: row.open_minute, closeMinute: row.close_minute });
    map.set(row.outlet_id, list);
  }
  return map;
}

const RESTAURANT_SELECT = `
  select r.id, r.slug, r.name, r.description_en, r.description_bn, r.cover_image, r.cuisine_summary,
         r.veg_only, r.rating_avg, r.rating_count, r.prep_minutes, r.min_order_paise, r.promoted, r.data_label,
         o.id as outlet_id, o.zone_id, z.name as zone_name, o.address_line, o.area, o.lat, o.lng, o.open_override,
         z.delivery_base_paise, z.delivery_per_km_paise, z.delivery_free_over_paise
  from restaurants r
  join restaurant_outlets o on o.restaurant_id = r.id and o.active = true
  join service_zones z on z.id = o.zone_id
`;

async function toCard(
  row: RestaurantRow,
  origin: { lat: number; lng: number },
  hours: Map<string, HourWindow[]>,
  offerLabel: string | null,
  cfg: Awaited<ReturnType<typeof loadConfig>>,
): Promise<RestaurantCard> {
  const dist = distanceKm(origin, { lat: row.lat, lng: row.lng });
  const open =
    row.open_override == null ? isOpenNow(hours.get(row.outlet_id) ?? [], cfg.business.timezone) : row.open_override;
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
    ratingCount: row.rating_count,
  };
}

export const listZones = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    name: string;
    city_id: string;
    city_name: string;
    center_lat: number;
    center_lng: number;
    min_order_paise: number;
    delivery_base_paise: number;
  }>`
    select z.id, z.name, z.city_id, c.name as city_name, z.center_lat, z.center_lng,
           z.min_order_paise, z.delivery_base_paise
    from service_zones z
    join cities c on c.id = z.city_id
    where z.active = true
    order by z.name
  `;
  const zones: ZoneOption[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    cityId: r.city_id,
    cityName: r.city_name,
    lat: r.center_lat,
    lng: r.center_lng,
    minOrderPaise: r.min_order_paise,
    deliveryBasePaise: r.delivery_base_paise,
  }));
  return { zones };
});

export const listCategories = createServerFn({ method: "GET" })
  .validator((input: { lang?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      slug: string;
      name_en: string;
      name_bn: string;
      image_url: string | null;
    }>`select id, slug, name_en, name_bn, image_url from categories where active = true order by sort_order`;
    const lang = data.lang === "bn" ? "bn" : "en";
    const categories: CategoryView[] = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: lang === "bn" ? r.name_bn : r.name_en,
      imageUrl: r.image_url,
    }));
    return { categories };
  });

export const listRestaurants = createServerFn({ method: "POST" })
  .validator((input: {
    zoneId: string;
    lat: number;
    lng: number;
    q?: string;
    veg?: boolean;
    openNow?: boolean;
    category?: string;
    lang?: string;
  }) => input)
  .handler(async ({ data }) => {
    const cfg = await loadConfig();
    const sql = await getSql();
    const rows = await sql.query<RestaurantRow>(`${RESTAURANT_SELECT} where r.active = true order by r.promoted desc, r.name`);
    const promos = await sql<{ id: string; restaurant_id: string | null; name_en: string }>`
      select id, restaurant_id, name_en from promotions where active = true
    `;
    const hours = await loadHours();
    const origin = { lat: data.lat, lng: data.lng };
    const q = data.q?.trim() ?? "";
    const itemNames = q
      ? await sql<{ restaurant_id: string; name_en: string; name_bn: string }>`
          select restaurant_id, name_en, name_bn from menu_items where available = true
        `
      : [];
    const catLinks = data.category
      ? await sql<{ restaurant_id: string }>`
          select restaurant_id from restaurant_categories where category_id = ${data.category}
        `
      : [];
    const catSet = new Set(catLinks.map((c) => c.restaurant_id));

    const cards: RestaurantCard[] = [];
    for (const row of rows) {
      const offer = promos.find((p) => !p.restaurant_id || p.restaurant_id === row.id);
      const card = await toCard(row, origin, hours, offer?.name_en ?? null, cfg);
      if (data.veg && !row.veg_only) continue;
      if (data.openNow && !card.open) continue;
      if (data.category && !catSet.has(row.id)) continue;
      if (q) {
        const blob = `${row.name} ${row.cuisine_summary} ${row.description_en} ${row.description_bn}`;
        const itemHit = itemNames.some(
          (it) => it.restaurant_id === row.id && (matchesQuery(it.name_en, q) || matchesQuery(it.name_bn, q)),
        );
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
        budget: cards.filter((c) => c.minOrderPaise <= 8000).slice(0, 8),
        veg: cards.filter((c) => c.vegOnly),
        newKitchens: cards.slice(0, 6),
      },
    };
  });

export const getRestaurant = createServerFn({ method: "GET" })
  .validator((input: { slug: string; lat: number; lng: number; lang?: string }) => input)
  .handler(async ({ data }) => {
    const cfg = await loadConfig();
    const sql = await getSql();
    const lang = data.lang === "bn" ? "bn" : "en";
    const rows = await sql.query<RestaurantRow>(
      `${RESTAURANT_SELECT} where r.slug = $1 and r.active = true limit 1`,
      [data.slug],
    );
    const row = rows[0];
    if (!row) return { restaurant: null as RestaurantDetail | null };

    const hours = await loadHours();
    const promos = await sql<{ name_en: string; restaurant_id: string | null }>`
      select name_en, restaurant_id from promotions where active = true
    `;
    const offer = promos.find((p) => !p.restaurant_id || p.restaurant_id === row.id);
    const card = await toCard(row, { lat: data.lat, lng: data.lng }, hours, offer?.name_en ?? null, cfg);

    const cats = await sql<{ id: string; name_en: string; name_bn: string }>`
      select id, name_en, name_bn from menu_categories where restaurant_id = ${row.id} order by sort_order
    `;
    const items = await sql<{
      id: string;
      category_id: string;
      name_en: string;
      name_bn: string;
      description_en: string;
      description_bn: string;
      image_url: string | null;
      veg: boolean;
      spicy_level: number;
      bestseller: boolean;
      available: boolean;
      base_price_paise: number;
    }>`
      select id, category_id, name_en, name_bn, description_en, description_bn, image_url, veg, spicy_level,
             bestseller, available, base_price_paise
      from menu_items where restaurant_id = ${row.id} order by sort_order
    `;
    const variants = await sql<{
      id: string;
      item_id: string;
      name_en: string;
      name_bn: string;
      price_paise: number;
      is_default: boolean;
      available: boolean;
    }>`select id, item_id, name_en, name_bn, price_paise, is_default, available from menu_variants order by sort_order`;
    const groups = await sql<{
      id: string;
      item_id: string;
      name_en: string;
      name_bn: string;
      required: boolean;
      min_select: number;
      max_select: number;
    }>`select id, item_id, name_en, name_bn, required, min_select, max_select from addon_groups`;
    const addons = await sql<{
      id: string;
      group_id: string;
      name_en: string;
      name_bn: string;
      price_paise: number;
      available: boolean;
    }>`select id, group_id, name_en, name_bn, price_paise, available from addons`;

    const windows = hours.get(row.outlet_id) ?? [];
    const { weekday } = localMinutesNow(cfg.business.timezone);
    const today = windows.find((w) => w.weekday === weekday) ?? windows[0];
    const hoursLabel = today
      ? `${String(Math.floor(today.openMinute / 60)).padStart(2, "0")}:${String(today.openMinute % 60).padStart(2, "0")} – ${String(Math.floor(today.closeMinute / 60)).padStart(2, "0")}:${String(today.closeMinute % 60).padStart(2, "0")}`
      : "";

    const categories: MenuCategoryView[] = cats.map((c) => ({
      id: c.id,
      name: lang === "bn" ? c.name_bn : c.name_en,
      items: items
        .filter((it) => it.category_id === c.id)
        .map((it) => ({
          id: it.id,
          name: lang === "bn" ? it.name_bn : it.name_en,
          description: lang === "bn" ? it.description_bn : it.description_en,
          imageUrl: it.image_url,
          veg: it.veg,
          spicyLevel: it.spicy_level,
          bestseller: it.bestseller,
          available: it.available,
          basePricePaise: it.base_price_paise,
          variants: variants
            .filter((v) => v.item_id === it.id)
            .map((v) => ({
              id: v.id,
              name: lang === "bn" ? v.name_bn : v.name_en,
              pricePaise: v.price_paise,
              isDefault: v.is_default,
              available: v.available,
            })),
          addonGroups: groups
            .filter((g) => g.item_id === it.id)
            .map((g) => ({
              id: g.id,
              name: lang === "bn" ? g.name_bn : g.name_en,
              required: g.required,
              minSelect: g.min_select,
              maxSelect: g.max_select,
              addons: addons
                .filter((a) => a.group_id === g.id)
                .map((a) => ({
                  id: a.id,
                  name: lang === "bn" ? a.name_bn : a.name_en,
                  pricePaise: a.price_paise,
                  available: a.available,
                })),
            })),
        })),
    }));

    const detail: RestaurantDetail = {
      card,
      description: lang === "bn" ? row.description_bn : row.description_en,
      outletId: row.outlet_id,
      addressLine: row.address_line,
      area: row.area,
      hoursLabel,
      categories,
    };
    return { restaurant: detail };
  });
