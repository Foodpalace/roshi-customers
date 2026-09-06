import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPlausibleVpa } from "./upi.ts";

describe("upi sandbox vpa", () => {
  it("accepts a typical VPA shape", () => {
    assert.equal(isPlausibleVpa("hasan@okaxis"), true);
  });

  it("rejects empty or malformed values", () => {
    assert.equal(isPlausibleVpa(""), false);
    assert.equal(isPlausibleVpa("not-an-id"), false);
  });
});
