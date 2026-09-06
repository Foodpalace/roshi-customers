import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color] duration-[var(--motion-fast,250ms)] ease-[var(--ease-smooth-out,cubic-bezier(0.22,1,0.36,1))] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-11",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-92",
        secondary: "bg-surface-2 text-fg hover:bg-surface",
        outline: "border border-border bg-surface text-fg hover:bg-surface-2",
        ghost: "text-fg hover:bg-surface-2",
        danger: "bg-danger text-primary-fg hover:opacity-92",
      },
      size: {
        md: "rounded-[var(--radius-md)] px-4 text-sm",
        lg: "rounded-[var(--radius-lg)] px-5 text-base",
        sm: "min-h-9 rounded-[var(--radius-sm)] px-3 text-sm",
        icon: "size-11 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
