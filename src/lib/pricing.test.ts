import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computePromoDiscount, computeQuote, type FeeSchedule, type PricedCartLine } from "./pricing.ts";

const fees: FeeSchedule = {
  deliveryBasePaise: 2500,
  deliveryPerKmPaise: 800,
  deliveryFreeOverPaise: 39900,
  serviceFeePaise: 0,
  serviceFeeBps: 0,
  menuPricesIncludeTax: true,
  menuTaxBps: 500,
  serviceTaxBps: 1800,
  deliveryTaxBps: 0,
  minOrderPaise: 8000,
};

const line = (unitPaise: number, quantity = 1): PricedCartLine => ({
  key: "k",
  itemId: "i",
  variantId: "v",
  name: "Item",
  quantity,
  unitPaise,
  addons: [],
  instructions: "",
  available: true,
});

describe("pricing", () => {
  it("sums food, delivery and commission at 10%", () => {
    const q = computeQuote({
      lines: [line(20000), line(5000, 2)],
      packagingPaise: 0,
      commissionBps: 1000,
      distanceKm: 2,
      fees,
      promo: null,
      isFirstOrder: false,
    });
    assert.equal(q.foodSubtotalPaise, 30000);
    assert.equal(q.deliveryFeePaise, 2500 + 1600);
    assert.equal(q.totalPaise, 30000 + 4100);
    assert.equal(q.commissionPaise, 3000);
    assert.equal(q.restaurantPayablePaise, 27000);
    assert.equal(q.blockers.length, 0);
  });

  it("never lets the client invent a total — quote is derived", () => {
    const q = computeQuote({
      lines: [line(10000)],
      packagingPaise: 1000,
      commissionBps: 1000,
      distanceKm: 0,
      fees,
      promo: null,
      isFirstOrder: true,
    });
    const reconstructed =
      q.foodSubtotalPaise -
      q.restaurantDiscountPaise -
      q.platformDiscountPaise +
      q.packagingPaise +
      q.deliveryFeePaise +
      q.serviceFeePaise +
      q.taxPaise;
    assert.equal(q.totalPaise, reconstructed);
  });

  it("applies platform-funded discount without charging the kitchen", () => {
    const q = computeQuote({
      lines: [line(20000)],
      packagingPaise: 0,
      commissionBps: 1000,
      distanceKm: 1,
      fees,
      promo: {
        id: "p",
        code: "FIRST50",
        name: "First order",
        kind: "fixed",
        percentBps: null,
        amountPaise: 5000,
        minOrderPaise: 19900,
        maxDiscountPaise: null,
        fundedBy: "PLATFORM",
        firstOrderOnly: true,
      },
      isFirstOrder: true,
    });
    assert.equal(q.platformDiscountPaise, 5000);
    assert.equal(q.restaurantDiscountPaise, 0);
    assert.equal(q.commissionPaise, 2000);
    assert.equal(q.restaurantPayablePaise, 18000);
    assert.equal(q.totalPaise, 20000 - 5000 + 2500 + 800);
  });

  it("does not apply first-order promo on a repeat customer", () => {
    assert.equal(
      computePromoDiscount(25000, {
        id: "p",
        code: "FIRST50",
        name: "First",
        kind: "fixed",
        percentBps: null,
        amountPaise: 5000,
        minOrderPaise: 0,
        maxDiscountPaise: null,
        fundedBy: "PLATFORM",
        firstOrderOnly: true,
      }, false),
      0,
    );
  });

  it("waives delivery over the threshold", () => {
    const q = computeQuote({
      lines: [line(40000)],
      packagingPaise: 0,
      commissionBps: 1000,
      distanceKm: 5,
      fees,
      promo: null,
      isFirstOrder: false,
    });
    assert.equal(q.deliveryFeePaise, 0);
  });

  it("blocks under min order", () => {
    const q = computeQuote({
      lines: [line(2000)],
      packagingPaise: 0,
      commissionBps: 1000,
      distanceKm: 1,
      fees,
      promo: null,
      isFirstOrder: false,
    });
    assert.ok(q.blockers.includes("MIN_ORDER"));
    assert.equal(q.minOrderPaise, 8000);
  });

  it("splits shared funding", () => {
    const q = computeQuote({
      lines: [line(10000)],
      packagingPaise: 0,
      commissionBps: 1000,
      distanceKm: 0,
      fees: { ...fees, minOrderPaise: 0, deliveryFreeOverPaise: null },
      promo: {
        id: "s",
        code: "SHARE",
        name: "Shared",
        kind: "fixed",
        percentBps: null,
        amountPaise: 1000,
        minOrderPaise: 0,
        maxDiscountPaise: null,
        fundedBy: "SHARED",
        firstOrderOnly: false,
      },
      isFirstOrder: false,
    });
    assert.equal(q.restaurantDiscountPaise, 500);
    assert.equal(q.platformDiscountPaise, 500);
  });
});
