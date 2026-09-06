import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canTransition, customerMayCancel, SIMULATED_ADVANCE } from "./state.ts";

describe("order state machine", () => {
  it("allows the happy path", () => {
    const path = [
      "PLACED",
      "ACCEPTED",
      "PREPARING",
      "READY",
      "RIDER_ASSIGNED",
      "PICKED_UP",
      "ON_THE_WAY",
      "DELIVERED",
    ] as const;
    for (let i = 0; i < path.length - 1; i++) {
      assert.equal(canTransition(path[i], path[i + 1]), true, `${path[i]} -> ${path[i + 1]}`);
    }
  });

  it("rejects illegal jumps", () => {
    assert.equal(canTransition("PLACED", "DELIVERED"), false);
    assert.equal(canTransition("DELIVERED", "PLACED"), false);
  });

  it("lets customers cancel only early", () => {
    assert.equal(customerMayCancel("PLACED"), true);
    assert.equal(customerMayCancel("PREPARING"), false);
  });

  it("simulated advance follows the kitchen path", () => {
    assert.equal(SIMULATED_ADVANCE.PLACED, "ACCEPTED");
    assert.equal(SIMULATED_ADVANCE.ON_THE_WAY, "DELIVERED");
  });
});
