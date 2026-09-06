import { useT } from "@/components/providers";
import { formatPaise } from "@/lib/money";
import type { QuoteLine } from "@/lib/pricing";

export function QuoteLines({ lines, locale }: { lines: QuoteLine[]; locale: string }) {
  const { t } = useT();
  const visible = lines.filter((l) => l.code !== "TOTAL" && (l.amountPaise !== 0 || l.code === "DELIVERY"));
  const total = lines.find((l) => l.code === "TOTAL");
  const label = (code: string, fallback: string) => {
    const key = `quote.${code}`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };
  return (
    <div className="space-y-2 text-sm">
      {visible.map((line) => (
        <div key={line.code} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-fg">{label(line.code, line.name)}</p>
            <p className="text-xs text-muted">{line.reason}</p>
          </div>
          <p className="tabular-nums text-fg">{formatPaise(line.amountPaise, { locale })}</p>
        </div>
      ))}
      {total ? (
        <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
          <span>{t("cart.toPay")}</span>
          <span className="tabular-nums">{formatPaise(total.amountPaise, { locale })}</span>
        </div>
      ) : null}
      <p className="text-xs text-muted">{t("cart.includesTax")}</p>
    </div>
  );
}
