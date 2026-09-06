import { applyBps } from "./money.ts";

export type FundedBy = "RESTAURANT" | "PLATFORM" | "SHARED" | "CUSTOMER";

export type QuoteLine = {
  code: string;
  name: string;
  amountPaise: number;
  source: "item" | "restaurant" | "platform" | "tax" | "delivery" | "promotion" | "packaging" | "service";
  fundedBy: FundedBy;
  reason: string;
};

export type PricedCartLine = {
  key: string;
  itemId: string;
  variantId: string | null;
  name: string;
  quantity: number;
  unitPaise: number;
  addons: { id: string; name: string; pricePaise: number }[];
  instructions: string;
  available: boolean;
};

export type PromoInput = {
  id: string;
  code: string | null;
  name: string;
  kind: "percent" | "fixed";
  percentBps: number | null;
  amountPaise: number | null;
  minOrderPaise: number;
  maxDiscountPaise: number | null;
  fundedBy: Exclude<FundedBy, "CUSTOMER">;
  firstOrderOnly: boolean;
};

export type FeeSchedule = {
  deliveryBasePaise: number;
  deliveryPerKmPaise: number;
  deliveryFreeOverPaise: number | null;
  serviceFeePaise: number;
  serviceFeeBps: number;
  menuPricesIncludeTax: boolean;
  menuTaxBps: number;
  serviceTaxBps: number;
  deliveryTaxBps: number;
  minOrderPaise: number;
};

export type QuoteInput = {
  lines: PricedCartLine[];
  packagingPaise: number;
  commissionBps: number;
  distanceKm: number;
  fees: FeeSchedule;
  promo: PromoInput | null;
  isFirstOrder: boolean;
};

export type Quote = {
  foodSubtotalPaise: number;
  restaurantDiscountPaise: number;
  platformDiscountPaise: number;
  packagingPaise: number;
  deliveryFeePaise: number;
  serviceFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  savingsPaise: number;
  commissionBps: number;
  commissionPaise: number;
  restaurantPayablePaise: number;
  minOrderPaise: number;
  lines: QuoteLine[];
  blockers: string[];
};

function deliveryFeePaise(distanceKm: number, fees: FeeSchedule, foodAfterDiscounts: number): number {
  const distanceComponent = Math.round(distanceKm * fees.deliveryPerKmPaise);
  let delivery = Math.max(0, fees.deliveryBasePaise + distanceComponent);
  if (fees.deliveryFreeOverPaise != null && foodAfterDiscounts >= fees.deliveryFreeOverPaise) {
    delivery = 0;
  }
  return Math.round(delivery / 100) * 100;
}

function splitDiscount(amount: number, fundedBy: PromoInput["fundedBy"]): { restaurant: number; platform: number } {
  if (fundedBy === "RESTAURANT") return { restaurant: amount, platform: 0 };
  if (fundedBy === "PLATFORM") return { restaurant: 0, platform: amount };
  const restaurant = Math.floor(amount / 2);
  return { restaurant, platform: amount - restaurant };
}

export function computePromoDiscount(foodPaise: number, promo: PromoInput | null, isFirstOrder: boolean): number {
  if (!promo) return 0;
  if (promo.firstOrderOnly && !isFirstOrder) return 0;
  if (foodPaise < promo.minOrderPaise) return 0;
  let disc = 0;
  if (promo.kind === "percent" && promo.percentBps != null) {
    disc = applyBps(foodPaise, promo.percentBps);
  } else if (promo.kind === "fixed" && promo.amountPaise != null) {
    disc = promo.amountPaise;
  }
  if (promo.maxDiscountPaise != null) disc = Math.min(disc, promo.maxDiscountPaise);
  return Math.max(0, Math.min(disc, foodPaise));
}

export function computeQuote(input: QuoteInput): Quote {
  const blockers: string[] = [];
  const foodSubtotalPaise = input.lines.reduce((sum, line) => {
    if (!line.available) blockers.push("UNAVAILABLE_ITEM");
    return sum + line.unitPaise * line.quantity;
  }, 0);

  if (input.lines.length === 0) blockers.push("EMPTY_CART");
  if (foodSubtotalPaise < input.fees.minOrderPaise) blockers.push("MIN_ORDER");

  const promoDiscount = computePromoDiscount(foodSubtotalPaise, input.promo, input.isFirstOrder);
  const split = input.promo ? splitDiscount(promoDiscount, input.promo.fundedBy) : { restaurant: 0, platform: 0 };
  const restaurantDiscountPaise = split.restaurant;
  const platformDiscountPaise = split.platform;
  const foodAfterDiscounts = foodSubtotalPaise - restaurantDiscountPaise - platformDiscountPaise;

  const packagingPaise = Math.max(0, input.packagingPaise);
  const deliveryFeePaiseValue = deliveryFeePaise(input.distanceKm, input.fees, foodAfterDiscounts);
  const serviceFeePaise =
    Math.max(0, input.fees.serviceFeePaise) + applyBps(foodSubtotalPaise, input.fees.serviceFeeBps);

  let taxPaise = 0;
  if (!input.fees.menuPricesIncludeTax) {
    taxPaise += applyBps(foodAfterDiscounts, input.fees.menuTaxBps);
  }
  taxPaise += applyBps(serviceFeePaise, input.fees.serviceTaxBps);
  taxPaise += applyBps(deliveryFeePaiseValue, input.fees.deliveryTaxBps);

  const totalPaise =
    foodAfterDiscounts + packagingPaise + deliveryFeePaiseValue + serviceFeePaise + taxPaise;

  const commissionBps = input.commissionBps;
  const foodForCommission = foodSubtotalPaise - restaurantDiscountPaise;
  const commissionPaise = applyBps(foodForCommission, commissionBps);
  const restaurantPayablePaise = foodForCommission - commissionPaise + packagingPaise;

  const lines: QuoteLine[] = [
    {
      code: "FOOD",
      name: "Food",
      amountPaise: foodSubtotalPaise,
      source: "item",
      fundedBy: "CUSTOMER",
      reason: "Sum of item prices including chosen variants and add-ons.",
    },
  ];
  if (restaurantDiscountPaise) {
    lines.push({
      code: "RESTAURANT_DISCOUNT",
      name: input.promo?.name ?? "Kitchen discount",
      amountPaise: -restaurantDiscountPaise,
      source: "promotion",
      fundedBy: "RESTAURANT",
      reason: "Discount funded by the kitchen, not by the platform.",
    });
  }
  if (platformDiscountPaise) {
    lines.push({
      code: "PLATFORM_DISCOUNT",
      name: input.promo?.name ?? "Platform discount",
      amountPaise: -platformDiscountPaise,
      source: "promotion",
      fundedBy: "PLATFORM",
      reason: "Discount funded by the platform. The kitchen is not charged for this amount.",
    });
  }
  if (packagingPaise) {
    lines.push({
      code: "PACKAGING",
      name: "Packaging",
      amountPaise: packagingPaise,
      source: "packaging",
      fundedBy: "CUSTOMER",
      reason: "Packaging charged by the kitchen and paid through to the kitchen.",
    });
  }
  lines.push({
    code: "DELIVERY",
    name: "Delivery",
    amountPaise: deliveryFeePaiseValue,
    source: "delivery",
    fundedBy: "CUSTOMER",
    reason:
      deliveryFeePaiseValue === 0
        ? "Delivery waived because the order crossed the free-delivery threshold."
        : "Base delivery fee plus distance component for this zone.",
  });
  if (serviceFeePaise) {
    lines.push({
      code: "SERVICE",
      name: "Service fee",
      amountPaise: serviceFeePaise,
      source: "service",
      fundedBy: "CUSTOMER",
      reason: "Optional platform service fee from marketplace configuration.",
    });
  }
  if (taxPaise) {
    lines.push({
      code: "TAX",
      name: "Tax",
      amountPaise: taxPaise,
      source: "tax",
      fundedBy: "CUSTOMER",
      reason: "Tax on fees. Menu prices are configured separately as tax-inclusive or exclusive.",
    });
  }
  lines.push({
    code: "TOTAL",
    name: "To pay",
    amountPaise: totalPaise,
    source: "item",
    fundedBy: "CUSTOMER",
    reason: "Customer payable. Every other line is included in this total.",
  });

  return {
    foodSubtotalPaise,
    restaurantDiscountPaise,
    platformDiscountPaise,
    packagingPaise,
    deliveryFeePaise: deliveryFeePaiseValue,
    serviceFeePaise,
    taxPaise,
    totalPaise,
    savingsPaise: restaurantDiscountPaise + platformDiscountPaise,
    commissionBps,
    commissionPaise,
    restaurantPayablePaise,
    minOrderPaise: input.fees.minOrderPaise,
    lines,
    blockers: [...new Set(blockers)],
  };
}
