/** Opening hours helpers. Weekday 0 = Sunday, minutes from local midnight. */

export type HourWindow = { weekday: number; openMinute: number; closeMinute: number };

export function localMinutesNow(timeZone: string, at = new Date()): { weekday: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  const week: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = week[map.weekday ?? "Mon"] ?? 1;
  const hour = Number(map.hour ?? "0");
  const minute = Number(map.minute ?? "0");
  return { weekday, minute: hour * 60 + minute };
}

export function isOpenNow(hours: HourWindow[], timeZone: string, at = new Date()): boolean {
  if (hours.length === 0) return true;
  const { weekday, minute } = localMinutesNow(timeZone, at);
  return hours.some((h) => {
    if (h.weekday !== weekday) return false;
    if (h.closeMinute > h.openMinute) return minute >= h.openMinute && minute < h.closeMinute;
    return minute >= h.openMinute || minute < h.closeMinute;
  });
}
