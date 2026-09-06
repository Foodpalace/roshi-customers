import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isOpenNow, localMinutesNow, type HourWindow } from "./hours.ts";

describe("hours", () => {
  it("reads Kolkata weekday and minute", () => {
    const at = new Date("2026-09-01T12:30:00+05:30");
    const { weekday, minute } = localMinutesNow("Asia/Kolkata", at);
    assert.equal(weekday, 2);
    assert.equal(minute, 12 * 60 + 30);
  });

  it("treats empty hours as open", () => {
    assert.equal(isOpenNow([], "Asia/Kolkata"), true);
  });

  it("opens inside a same-day window", () => {
    const hours: HourWindow[] = [{ weekday: 2, openMinute: 600, closeMinute: 1380 }];
    const at = new Date("2026-09-01T12:00:00+05:30");
    assert.equal(isOpenNow(hours, "Asia/Kolkata", at), true);
    const closed = new Date("2026-09-01T04:00:00+05:30");
    assert.equal(isOpenNow(hours, "Asia/Kolkata", closed), false);
  });
});
