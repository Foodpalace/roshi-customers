import type { DataLabel } from "./config/types";
import type { Quote, QuoteLine } from "./pricing";
import type { OrderStatus } from "./orders/state";

export type ZoneOption = {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  lat: number;
  lng: number;
  minOrderPaise: number;
  deliveryBasePaise: number;
};

export type CategoryView = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
};

export type RestaurantCard = {
  id: string;
  slug: string;
  name: string;
  coverImage: string | null;
  cuisineSummary: string;
  vegOnly: boolean;
  prepMinutes: number;
  dataLabel: DataLabel;
  promoted: boolean;
  distanceKm: number;
  etaMinutes: number;
  deliveryFeePaise: number;
  minOrderPaise: number;
  open: boolean;
  hasOffer: boolean;
  offerLabel: string | null;
  zoneName: string;
  ratingAvg: number | null;
  ratingCount: number;
};

export type AddonView = {
  id: string;
  name: string;
  pricePaise: number;
  available: boolean;
};

export type AddonGroupView = {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  addons: AddonView[];
};

export type VariantView = {
  id: string;
  name: string;
  pricePaise: number;
  isDefault: boolean;
  available: boolean;
};

export type MenuItemView = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  veg: boolean;
  spicyLevel: number;
  bestseller: boolean;
  available: boolean;
  basePricePaise: number;
  variants: VariantView[];
  addonGroups: AddonGroupView[];
};

export type MenuCategoryView = {
  id: string;
  name: string;
  items: MenuItemView[];
};

export type RestaurantDetail = {
  card: RestaurantCard;
  description: string;
  outletId: string;
  addressLine: string;
  area: string;
  hoursLabel: string;
  categories: MenuCategoryView[];
};

export type CartLineInput = {
  itemId: string;
  variantId: string | null;
  addonIds: string[];
  quantity: number;
  instructions: string;
};

export type QuoteRequest = {
  restaurantId: string;
  zoneId: string;
  lat: number;
  lng: number;
  coupon?: string | null;
  lines: CartLineInput[];
};

export type QuoteResult = {
  restaurantId: string;
  restaurantName: string;
  dataLabel: DataLabel;
  quote: Quote;
  pricedLines: {
    key: string;
    itemId: string;
    variantId: string | null;
    name: string;
    quantity: number;
    unitPaise: number;
    addons: { id: string; name: string; pricePaise: number }[];
    instructions: string;
  }[];
  promoName: string | null;
};

export type AddressView = {
  id: string;
  label: string;
  line1: string;
  landmark: string | null;
  area: string;
  zoneId: string | null;
  lat: number | null;
  lng: number | null;
  instructions: string | null;
  isDefault: boolean;
};

export type OrderSummary = {
  id: string;
  publicId: string;
  status: OrderStatus;
  restaurantName: string;
  restaurantSlug: string;
  totalPaise: number;
  placedAt: string;
  itemPreview: string;
  dataLabel: DataLabel;
};

export type OrderDetail = {
  summary: OrderSummary;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  deliveryOtp: string | null;
  notes: string | null;
  address: string;
  lines: QuoteLine[];
  items: {
    name: string;
    quantity: number;
    lineTotalPaise: number;
    instructions: string | null;
  }[];
  events: { toStatus: string; createdAt: string; note: string | null }[];
  restaurantSimulated: boolean;
  canCancel: boolean;
};

export type PromoView = {
  id: string;
  code: string | null;
  name: string;
  fundedBy: string;
  minOrderPaise: number;
};

export type LoyaltyView = {
  points: number;
  lifetimePoints: number;
  tier: string;
};

export type TicketView = {
  id: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
};
