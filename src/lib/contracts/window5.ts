/**
 * Window 5 integration contract (restaurant / rider / dispatch / settlements).
 *
 * Architecture conflicts resolved in Window 1 (do not reverse):
 * 1. One Postgres schema, one TanStack app. Not microservices.
 * 2. Brand strings live in `app_config` / BrandConfig — never in JSX.
 * 3. grokPwaPlugin owns the install manifest; customer SW only caches assets + offline.html.
 * 4. Customer UI is the only Window 1 surface. `/restaurant`, `/rider`, `/admin` URLs
 *    exist in config as future portals — do not scaffold those apps here.
 * 5. Quotes, totals, payment status, and commission are server-authoritative.
 *    Window 5 must never accept a client-sent total or "paid" flag.
 * 6. SIMULATED kitchens stay labelled until a verified onboarding flow writes VERIFIED/REAL.
 *
 * Shared tables already in migrations/0002_schema.sql:
 * restaurants, restaurant_outlets, restaurant_hours, restaurant_members,
 * orders, order_events, order_items, order_price_lines, payments, refunds,
 * riders, notification_outbox, audit_logs, promotions, loyalty_*.
 */

import type { OrderStatus } from "@/lib/orders/state";

export type KitchenAcceptCommand = {
  orderId: string;
  actorUserId: string;
  prepMinutes?: number;
};

export type KitchenRejectCommand = {
  orderId: string;
  actorUserId: string;
  reason: string;
};

export type RiderAssignCommand = {
  orderId: string;
  riderUserId: string;
  actorUserId: string;
};

export type PaymentWebhookCommand = {
  provider: "razorpay" | "cashfree";
  providerRef: string;
  orderId: string;
  amountPaise: number;
  signature: string;
};

export type SettlementSnapshot = {
  orderId: string;
  restaurantId: string;
  commissionBps: number;
  commissionPaise: number;
  restaurantPayablePaise: number;
  platformDiscountPaise: number;
  restaurantDiscountPaise: number;
};

export const WINDOW5_ALLOWED_KITCHEN_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PLACED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["PREPARING"],
  PREPARING: ["READY"],
};

export const WINDOW5_ALLOWED_RIDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  READY: ["RIDER_ASSIGNED"],
  RIDER_ASSIGNED: ["PICKED_UP"],
  PICKED_UP: ["ON_THE_WAY"],
  ON_THE_WAY: ["DELIVERED", "DELIVERY_FAILED"],
};
