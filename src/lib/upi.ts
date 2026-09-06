/** Format-only check. Never treats a VPA as proof of payment. */
export function isPlausibleVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(vpa.trim());
}
