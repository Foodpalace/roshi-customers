import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchesQuery } from "./search.ts";

describe("search", () => {
  it("matches substrings and small typos", () => {
    assert.equal(matchesQuery("Chicken Dum Biryani", "biryani"), true);
    assert.equal(matchesQuery("Chicken Dum Biryani", "biryani"), true);
    assert.equal(matchesQuery("Momos", "momo"), true);
    assert.equal(matchesQuery("Pizza", "piza"), true);
    assert.equal(matchesQuery("Burger", "xyz"), false);
  });
});
