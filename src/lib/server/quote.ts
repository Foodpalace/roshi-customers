import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { distanceKm } from "@/lib/geo";
import { newId } from "@/lib/ids";
import { computeQuote, type FeeSchedule, type PricedCartLine, type PromoInput } from "@/lib/pricing";
import type { QuoteRequest, QuoteResult } from "@/lib/market-types";
import type { DataLabel } from "@/lib/config/types";
import { loadConfig } from "./load-config";

type Built = {
  restaurantId: string;
  restaurantName: string;
  dataLabel: DataLabel;
  outletId: string;
  zoneId: string;
  packagingPaise: number;
  commissionBps: number;
  distanceKm: number;
  fees: FeeSchedule;
  promo: PromoInput | null;
  pricedLines: PricedCartLine[];
};

export async function buildQuote(input: QuoteRequest, isFirstOrder: boolean): Promise<Built & { result: QuoteResult }> {
  const cfg = await loadConfig();
  const sql = await getSql();
  if (input.lines.length === 0) {
    const emptyFees: FeeSchedule = {
      deliveryBasePaise: cfg.marketplace.deliveryBasePaise,
      deliveryPerKmPaise: cfg.marketplace.deliveryPerKmPaise,
      deliveryFreeOverPaise: cfg.marketplace.deliveryFreeOverPaise,
      serviceFeePaise: cfg.marketplace.serviceFeePaise,
      serviceFeeBps: cfg.marketplace.serviceFeeBps,
      menuPricesIncludeTax: cfg.tax.menuPricesIncludeTax,
      menuTaxBps: cfg.tax.menuTaxBps,
      serviceTaxBps: cfg.tax.serviceTaxBps,
      deliveryTaxBps: cfg.tax.deliveryTaxBps,
      minOrderPaise: cfg.marketplace.minOrderPaise,
    };
    const quote = computeQuote({
      lines: [],
      packagingPaise: 0,
      commissionBps: cfg.marketplace.defaultCommissionBps,
      distanceKm: 0,
      fees: emptyFees,
      promo: null,
      isFirstOrder,
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
        promoName: null,
      },
    };
  }

  const rst = await sql<{
    id: string;
    name: string;
    commission_bps: number;
    packaging_paise: number;
    min_order_paise: number | null;
    data_label: DataLabel;
  }>`select id, name, commission_bps, packaging_paise, min_order_paise, data_label from restaurants where id = ${input.restaurantId} and active = true`;
  const restaurant = rst[0];
  if (!restaurant) throw new Error("Kitchen not found");

  const outlet = await sql<{ id: string; lat: number; lng: number; zone_id: string }>`
    select id, lat, lng, zone_id from restaurant_outlets where restaurant_id = ${restaurant.id} and active = true limit 1
  `;
  const out = outlet[0];
  if (!out) throw new Error("Kitchen outlet not found");

  const zone = await sql<{
    id: string;
    min_order_paise: number;
    delivery_base_paise: number;
    delivery_per_km_paise: number;
    delivery_free_over_paise: number | null;
  }>`select id, min_order_paise, delivery_base_paise, delivery_per_km_paise, delivery_free_over_paise from service_zones where id = ${input.zoneId}`;
  const z = zone[0];
  if (!z) throw new Error("Service area not found");

  const itemIds = [...new Set(input.lines.map((l) => l.itemId))];
  const items = await sql<{
    id: string;
    restaurant_id: string;
    name_en: string;
    available: boolean;
    base_price_paise: number;
  }>`select id, restaurant_id, name_en, available, base_price_paise from menu_items`;
  const itemMap = new Map(items.filter((i) => itemIds.includes(i.id)).map((i) => [i.id, i]));
  const variants = await sql<{ id: string; item_id: string; name_en: string; price_paise: number; is_default: boolean; available: boolean }>`
    select id, item_id, name_en, price_paise, is_default, available from menu_variants
  `;
  const addons = await sql<{ id: string; group_id: string; name_en: string; price_paise: number; available: boolean }>`
    select id, group_id, name_en, price_paise, available from addons
  `;
  const groups = await sql<{ id: string; item_id: string }>`select id, item_id from addon_groups`;
  const addonById = new Map(addons.map((a) => [a.id, a]));
  const groupById = new Map(groups.map((g) => [g.id, g]));

  const pricedLines: PricedCartLine[] = [];
  for (const line of input.lines) {
    const item = itemMap.get(line.itemId);
    if (!item || item.restaurant_id !== restaurant.id) throw new Error("Item does not belong to this kitchen");
    const qty = Math.max(1, Math.min(20, Math.floor(line.quantity)));
    const variant = line.variantId
      ? variants.find((v) => v.id === line.variantId && v.item_id === item.id)
      : variants.find((v) => v.item_id === item.id && v.is_default);
    if (line.variantId && !variant) throw new Error("Unknown variant");
    const unitBase = variant ? variant.price_paise : item.base_price_paise;
    const chosenAddons: { id: string; name: string; pricePaise: number }[] = [];
    for (const id of line.addonIds) {
      const addon = addonById.get(id);
      if (!addon) throw new Error("Unknown add-on");
      const group = groupById.get(addon.group_id);
      if (!group || group.item_id !== item.id) throw new Error("Add-on does not belong to this item");
      if (!addon.available) throw new Error("Add-on unavailable");
      chosenAddons.push({ id: addon.id, name: addon.name_en, pricePaise: addon.price_paise });
    }
    const unitPaise = unitBase + chosenAddons.reduce((s, a) => s + a.pricePaise, 0);
    const name = variant ? `${item.name_en} · ${variant.name_en}` : item.name_en;
    pricedLines.push({
      key: [line.itemId, line.variantId ?? "", [...line.addonIds].sort().join(","), line.instructions].join("|"),
      itemId: item.id,
      variantId: variant?.id ?? null,
      name,
      quantity: qty,
      unitPaise,
      addons: chosenAddons,
      instructions: (line.instructions ?? "").slice(0, 180),
      available: item.available && (variant ? variant.available : true),
    });
  }

  let promo: PromoInput | null = null;
  const code = input.coupon?.trim().toUpperCase();
  if (code) {
    const found = await sql<{
      id: string;
      code: string | null;
      name_en: string;
      kind: string;
      percent_bps: number | null;
      amount_paise: number | null;
      min_order_paise: number;
      max_discount_paise: number | null;
      funded_by: string;
      first_order_only: boolean;
      restaurant_id: string | null;
      active: boolean;
    }>`select id, code, name_en, kind, percent_bps, amount_paise, min_order_paise, max_discount_paise, funded_by, first_order_only, restaurant_id, active from promotions where code = ${code}`;
    const p = found[0];
    if (p && p.active && (!p.restaurant_id || p.restaurant_id === restaurant.id)) {
      promo = {
        id: p.id,
        code: p.code,
        name: p.name_en,
        kind: p.kind === "percent" ? "percent" : "fixed",
        percentBps: p.percent_bps,
        amountPaise: p.amount_paise,
        minOrderPaise: p.min_order_paise,
        maxDiscountPaise: p.max_discount_paise,
        fundedBy: p.funded_by as PromoInput["fundedBy"],
        firstOrderOnly: p.first_order_only,
      };
    }
  }

  const dist = distanceKm({ lat: input.lat, lng: input.lng }, { lat: out.lat, lng: out.lng });
  const fees: FeeSchedule = {
    deliveryBasePaise: z.delivery_base_paise,
    deliveryPerKmPaise: z.delivery_per_km_paise,
    deliveryFreeOverPaise: z.delivery_free_over_paise,
    serviceFeePaise: cfg.marketplace.serviceFeePaise,
    serviceFeeBps: cfg.marketplace.serviceFeeBps,
    menuPricesIncludeTax: cfg.tax.menuPricesIncludeTax,
    menuTaxBps: cfg.tax.menuTaxBps,
    serviceTaxBps: cfg.tax.serviceTaxBps,
    deliveryTaxBps: cfg.tax.deliveryTaxBps,
    minOrderPaise: restaurant.min_order_paise ?? z.min_order_paise,
  };
  const quote = computeQuote({
    lines: pricedLines,
    packagingPaise: restaurant.packaging_paise,
    commissionBps: restaurant.commission_bps,
    distanceKm: dist,
    fees,
    promo,
    isFirstOrder,
  });

  const result: QuoteResult = {
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
      instructions: l.instructions,
    })),
    promoName: promo?.name ?? null,
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
    result,
  };
}

export const quoteCart = createServerFn({ method: "POST" })
  .validator((input: QuoteRequest & { isFirstOrder?: boolean }) => input)
  .handler(async ({ data }) => {
    const built = await buildQuote(data, Boolean(data.isFirstOrder));
    return built.result;
  });

export const trackAnalytics = createServerFn({ method: "POST" })
  .validator((input: { name: string; payload?: Record<string, string | number | boolean | null> }) => input)
  .handler(async ({ data }) => {
    const allowed = new Set([
      "app_open",
      "location_selected",
      "search",
      "restaurant_view",
      "item_view",
      "add_to_cart",
      "remove_from_cart",
      "checkout_started",
      "order_placed",
      "order_delivered",
      "coupon_applied",
      "repeat_order",
    ]);
    if (!allowed.has(data.name)) return { ok: false as const };
    const sql = await getSql();
    await sql`
      insert into analytics_events (id, user_id, name, payload)
      values (${newId("evt")}, null, ${data.name}, ${JSON.stringify(data.payload ?? {})})
    `;
    return { ok: true as const };
  });
