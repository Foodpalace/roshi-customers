import { Link } from "@tanstack/react-router";
import { useBrand } from "@/components/providers";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  const { brand } = useBrand();
  if (brand.logoUrl) {
    return <img src={brand.logoUrl} alt="" className={cn("h-8 w-8 object-contain", className)} />;
  }
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <circle cx="16" cy="16" r="10" fill="currentColor" className="text-bg" />
      <circle cx="16" cy="16" r="5" fill="currentColor" className="text-primary" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  const { brand } = useBrand();
  return (
    <Link to="/" className={cn("flex items-center gap-2 text-fg no-underline", className)} aria-label={brand.appName}>
      <BrandMark />
      <span className="font-display text-xl tracking-tight">{brand.appName}</span>
    </Link>
  );
}
