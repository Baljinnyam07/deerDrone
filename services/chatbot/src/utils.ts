// Inline utility functions for chatbot service
// Copied from @deer-drone/utils to avoid workspace resolution issues on Vercel

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("mn-MN", {
    maximumFractionDigits: 0,
  }).format(value) + "₮";
}
