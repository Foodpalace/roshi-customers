import { CUSTOMER_TRACK_STEPS, isTerminal, type OrderStatus } from "./state.ts";

export type TrackProgress = {
  steps: readonly OrderStatus[];
  currentIndex: number;
  /** 0–100; 100 when delivered or terminal success. */
  percent: number;
  label: OrderStatus;
  isTerminal: boolean;
  isFailure: boolean;
};

const FAILURE: ReadonlySet<OrderStatus> = new Set([
  "REJECTED",
  "CANCELLED",
  "FAILED_PAYMENT",
  "DELIVERY_FAILED",
]);

export function trackProgress(status: OrderStatus): TrackProgress {
  const idx = CUSTOMER_TRACK_STEPS.indexOf(status);
  const failure = FAILURE.has(status);
  const terminal = isTerminal(status);
  let percent = 0;
  if (status === "DELIVERED") percent = 100;
  else if (failure) percent = idx >= 0 ? Math.round(((idx + 1) / CUSTOMER_TRACK_STEPS.length) * 100) : 0;
  else if (idx >= 0) percent = Math.round((idx / (CUSTOMER_TRACK_STEPS.length - 1)) * 100);
  else if (status === "CART" || status === "CHECKOUT") percent = 0;
  else percent = 0;

  return {
    steps: CUSTOMER_TRACK_STEPS,
    currentIndex: idx,
    percent,
    label: status,
    isTerminal: terminal,
    isFailure: failure,
  };
}
