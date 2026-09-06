import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers";
import { formatPaise } from "@/lib/money";
import type { MenuItemView } from "@/lib/market-types";
import { cartKey, type CartItem } from "@/lib/stores/cart";

export function CustomizeDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  locale,
}: {
  item: MenuItemView | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (line: CartItem) => void;
  locale: string;
}) {
  const { t } = useT();
  const defaultVariant = item?.variants.find((v) => v.isDefault) ?? item?.variants[0] ?? null;
  const [variantId, setVariantId] = useState<string | null>(defaultVariant?.id ?? null);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const reset = (next: MenuItemView | null) => {
    const v = next?.variants.find((x) => x.isDefault) ?? next?.variants[0] ?? null;
    setVariantId(v?.id ?? null);
    setAddonIds([]);
    setQty(1);
    setNote("");
  };

  useEffect(() => {
    if (open) reset(item);
    // Reset only when the dialog opens or the item identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item?.id]);

  const variant = item?.variants.find((v) => v.id === variantId) ?? null;
  const unit = useMemo(() => {
    if (!item) return 0;
    const base = variant ? variant.pricePaise : item.basePricePaise;
    const add = item.addonGroups
      .flatMap((g) => g.addons)
      .filter((a) => addonIds.includes(a.id))
      .reduce((s, a) => s + a.pricePaise, 0);
    return base + add;
  }, [item, variant, addonIds]);

  if (!item) return null;

  const toggleAddon = (id: string, groupMax: number, groupIds: string[]) => {
    setAddonIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      const inGroup = cur.filter((x) => groupIds.includes(x));
      if (inGroup.length >= groupMax) {
        return [...cur.filter((x) => !groupIds.includes(x)), id];
      }
      return [...cur, id];
    });
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (v) reset(item);
        onOpenChange(v);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[var(--radius-2xl)] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Dialog.Title className="font-display text-2xl">{item.name}</Dialog.Title>
          <p className="mt-1 text-sm text-muted">{item.description}</p>
          {item.variants.length ? (
            <fieldset className="mt-4">
              <legend className="text-sm font-medium">{t("customize.size")}</legend>
              <div className="mt-2 space-y-2">
                {item.variants.map((v) => (
                  <label key={v.id} className="flex min-h-11 items-center justify-between rounded-[var(--radius-md)] bg-bg px-3">
                    <span>
                      <input
                        type="radio"
                        name="variant"
                        className="mr-2"
                        checked={variantId === v.id}
                        onChange={() => setVariantId(v.id)}
                        disabled={!v.available}
                      />
                      {v.name}
                    </span>
                    <span className="tabular-nums text-sm">{formatPaise(v.pricePaise, { locale })}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {item.addonGroups.map((g) => (
            <fieldset key={g.id} className="mt-4">
              <legend className="text-sm font-medium">
                {g.name} · {g.required ? t("customize.required") : t("customize.optional")}
              </legend>
              <div className="mt-2 space-y-2">
                {g.addons.map((a) => (
                  <label key={a.id} className="flex min-h-11 items-center justify-between rounded-[var(--radius-md)] bg-bg px-3">
                    <span>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={addonIds.includes(a.id)}
                        onChange={() => toggleAddon(a.id, g.maxSelect, g.addons.map((x) => x.id))}
                        disabled={!a.available}
                      />
                      {a.name}
                    </span>
                    <span className="tabular-nums text-sm">{formatPaise(a.pricePaise, { locale })}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <label className="mt-4 block text-sm font-medium">
            {t("customize.instructions")}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 180))}
              placeholder={t("customize.instructionsPlaceholder")}
              className="mt-1 min-h-20 w-full rounded-[var(--radius-md)] border border-border bg-bg p-3 text-base"
            />
          </label>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full bg-bg"
                aria-label={t("a11y.decreaseQty")}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full bg-bg"
                aria-label={t("a11y.increaseQty")}
                onClick={() => setQty((q) => Math.min(20, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              onClick={() => {
                const line: Omit<CartItem, "key"> = {
                  itemId: item.id,
                  variantId,
                  addonIds,
                  quantity: qty,
                  instructions: note.trim(),
                };
                onConfirm({ ...line, key: cartKey(line) });
                onOpenChange(false);
              }}
            >
              {t("customize.addFor", { amount: formatPaise(unit * qty, { locale }) })}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
