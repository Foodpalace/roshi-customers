import type { CartLineInput } from "./market-types";

export type CartItem = CartLineInput & { key: string };

export function cartKey(item: Omit<CartItem, "key">): string {
  return [item.itemId, item.variantId ?? "", [...item.addonIds].sort().join(","), item.instructions].join("|");
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

export function mergeItem(items: CartItem[], item: CartItem): CartItem[] {
  const existing = items.find((i) => i.key === item.key);
  if (!existing) return [...items, item];
  return items.map((i) =>
    i.key === item.key ? { ...i, quantity: Math.min(20, i.quantity + item.quantity) } : i,
  );
}

export function canAddToCart(
  currentRestaurantId: string | null,
  itemCount: number,
  nextRestaurantId: string,
): "ok" | "replace" {
  if (currentRestaurantId && currentRestaurantId !== nextRestaurantId && itemCount > 0) return "replace";
  return "ok";
}

export function toCartItem(line: CartLineInput): CartItem {
  return { ...line, key: cartKey(line) };
}
