import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyBps, formatPaise, rupeesToPaise } from "./money.ts";

describe("money", () => {
  it("converts rupees to paise without float leftovers", () => {
    assert.equal(rupeesToPaise(100), 10000);
    assert.equal(rupeesToPaise(19.99), 1999);
    assert.equal(rupeesToPaise(0.1), 10);
  });

  it("applies basis points with floor", () => {
    assert.equal(applyBps(10000, 1000), 1000);
    assert.equal(applyBps(199, 1000), 19);
    assert.equal(applyBps(0, 1000), 0);
  });

  it("formats INR", () => {
    const s = formatPaise(25900);
    assert.match(s, /259/);
  });
});
