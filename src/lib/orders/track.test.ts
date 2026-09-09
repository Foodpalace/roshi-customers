import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { trackProgress } from "./track.ts";

describe("trackProgress", () => {
  it("starts at PLACED index 0", () => {
    const p = trackProgress("PLACED");
    assert.equal(p.currentIndex, 0);
    assert.equal(p.percent, 0);
    assert.equal(p.isFailure, false);
  });

  it("DELIVERED is 100%", () => {
    const p = trackProgress("DELIVERED");
    assert.equal(p.percent, 100);
    assert.equal(p.isTerminal, true);
  });

  it("mid path has mid percent", () => {
    const p = trackProgress("READY");
    assert.ok(p.percent > 0 && p.percent < 100);
    assert.equal(p.currentIndex, 3);
  });

  it("CANCELLED is failure terminal", () => {
    const p = trackProgress("CANCELLED");
    assert.equal(p.isFailure, true);
    assert.equal(p.isTerminal, true);
  });
});
