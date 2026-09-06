import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canAddToCart, cartCount, cartKey, mergeItem, toCartItem } from "./cart-logic.ts";

const line = (itemId: string, qty = 1, variantId: string | null = null) =>
  toCartItem({ itemId, variantId, addonIds: [], quantity: qty, instructions: "" });

describe("cart", () => {
  it("keys by item, variant, addons and note", () => {
    const a = cartKey({ itemId: "i", variantId: "v", addonIds: ["b", "a"], quantity: 1, instructions: "x" });
    const b = cartKey({ itemId: "i", variantId: "v", addonIds: ["a", "b"], quantity: 9, instructions: "x" });
    assert.equal(a, b);
  });

  it("merges the same key and caps at 20", () => {
    const merged = mergeItem([line("i", 18)], line("i", 5));
    assert.equal(merged[0]?.quantity, 20);
  });

  it("counts units not rows", () => {
    assert.equal(cartCount([line("a", 2), line("b", 3)]), 5);
  });

  it("forces replace when switching kitchens", () => {
    assert.equal(canAddToCart("rst_a", 1, "rst_b"), "replace");
    assert.equal(canAddToCart("rst_a", 0, "rst_b"), "ok");
    assert.equal(canAddToCart(null, 0, "rst_b"), "ok");
  });
});
