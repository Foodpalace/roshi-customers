export const ORDER_STATUSES = [
  "CART",
  "CHECKOUT",
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "RIDER_ASSIGNED",
  "PICKED_UP",
  "ON_THE_WAY",
  "DELIVERED",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
  "PARTIAL_REFUND",
  "FAILED_PAYMENT",
  "DELIVERY_FAILED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Customer-visible tracking ladder after a successful place. */
export const CUSTOMER_TRACK_STEPS: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "RIDER_ASSIGNED",
  "PICKED_UP",
  "ON_THE_WAY",
  "DELIVERED",
];

export const TERMINAL_STATUSES: ReadonlySet<OrderStatus> = new Set([
  "DELIVERED",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
  "PARTIAL_REFUND",
  "FAILED_PAYMENT",
  "DELIVERY_FAILED",
]);

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CART: ["CHECKOUT", "CANCELLED"],
  CHECKOUT: ["PLACED", "FAILED_PAYMENT", "CANCELLED"],
  PLACED: ["ACCEPTED", "REJECTED", "CANCELLED", "FAILED_PAYMENT"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["RIDER_ASSIGNED", "CANCELLED"],
  RIDER_ASSIGNED: ["PICKED_UP", "CANCELLED", "DELIVERY_FAILED"],
  PICKED_UP: ["ON_THE_WAY", "DELIVERY_FAILED"],
  ON_THE_WAY: ["DELIVERED", "DELIVERY_FAILED"],
  DELIVERED: ["REFUNDED", "PARTIAL_REFUND"],
  REJECTED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
  PARTIAL_REFUND: [],
  FAILED_PAYMENT: ["CHECKOUT", "CANCELLED"],
  DELIVERY_FAILED: ["REFUNDED", "CANCELLED"],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal order transition ${from} → ${to}`);
  }
}

export function customerMayCancel(status: OrderStatus): boolean {
  return status === "PLACED" || status === "ACCEPTED";
}

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

export function trackIndex(status: OrderStatus): number {
  const i = CUSTOMER_TRACK_STEPS.indexOf(status);
  return i;
}

/** Dev-only: advance sample kitchens without partner/rider apps. */
export const SIMULATED_ADVANCE: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "RIDER_ASSIGNED",
  RIDER_ASSIGNED: "PICKED_UP",
  PICKED_UP: "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
};
