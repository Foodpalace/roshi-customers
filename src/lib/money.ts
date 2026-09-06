/** All money in this marketplace is integer paise. ₹1 = 100 paise. */

export const PAISE_PER_RUPEE = 100;

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * PAISE_PER_RUPEE);
}

export function applyBps(amountPaise: number, bps: number): number {
  if (bps <= 0 || amountPaise <= 0) return 0;
  return Math.floor((amountPaise * bps) / 10_000);
}

export function formatPaise(
  paise: number,
  opts?: { currency?: string; locale?: string; signed?: boolean },
): string {
  const currency = opts?.currency ?? "INR";
  const locale = opts?.locale ?? "en-IN";
  const abs = Math.abs(paise) / PAISE_PER_RUPEE;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  if (paise < 0) return `−${formatted}`;
  if (opts?.signed && paise > 0) return `+${formatted}`;
  return formatted;
}

export function formatPaiseCompact(paise: number, locale = "en-IN"): string {
  const rupees = paise / PAISE_PER_RUPEE;
  const rounded = Math.round(rupees);
  if (Math.abs(paise) % 100 === 0) {
    return `₹${new Intl.NumberFormat(locale).format(rounded)}`;
  }
  return formatPaise(paise, { locale });
}
