import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMemoryRateLimiter } from "./rate-limit.ts";

describe("rate limit", () => {
  it("allows n hits then blocks", () => {
    const limit = createMemoryRateLimiter();
    assert.equal(limit("k", 2, 60_000), true);
    assert.equal(limit("k", 2, 60_000), true);
    assert.equal(limit("k", 2, 60_000), false);
  });
});
