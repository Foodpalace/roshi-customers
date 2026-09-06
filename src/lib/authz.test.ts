import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertOwned, rejectClientPrice } from "./authz.ts";

describe("authorization", () => {
  it("hides another user's row as not found", () => {
    assert.throws(() => assertOwned({ user_id: "a", id: "1" }, "b"), /Not found/);
    assert.throws(() => assertOwned(null, "b"), /Not found/);
  });

  it("returns the row when the actor matches", () => {
    const row = assertOwned({ user_id: "a", id: "1" }, "a");
    assert.equal(row.id, "1");
  });

  it("refuses a client-supplied total", () => {
    assert.throws(() => rejectClientPrice(77500), /Client totals/);
    assert.doesNotThrow(() => rejectClientPrice(undefined));
  });
});
