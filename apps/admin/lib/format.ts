/**
 * Safe formatting utilities for admin UI
 * Handles edge cases and provides fallbacks
 */

export function safeMoney(value: any, currency = "₮"): string {
  try {
    // Handle null/undefined
    if (value === null || value === undefined) return "—";
    
    // Convert to number
    const num = Number(value);
    
    // Check for NaN
    if (isNaN(num)) return "—";
    
    // Check for Infinity
    if (!isFinite(num)) return "—";
    
    // Format with commas
    const formatted = new Intl.NumberFormat("en-US").format(Math.round(num));
    return `${currency}${formatted}`;
  } catch (e) {
    return "—";
  }
}

export function safePhone(phone: any): string {
  if (!phone) return "—";
  return String(phone).trim() || "—";
}

export function safeName(name: any): string {
  if (!name) return "—";
  return String(name).trim() || "—";
}

export function safeDate(date: any, locale = "mn-MN"): string {
  try {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(locale);
  } catch (e) {
    return "—";
  }
}

export function safeAddress(address: any): string {
  try {
    if (!address) return "—";
    
    // If it's an object
    if (typeof address === "object" && address !== null) {
      const parts = [
        address.city,
        address.district,
        address.khoroo,
        address.line1,
      ].filter(Boolean);
      return parts.join(", ") || "—";
    }
    
    // If it's a string
    return String(address).trim() || "—";
  } catch (e) {
    return "—";
  }
}

export function safeQuantity(qty: any): string {
  try {
    if (qty === null || qty === undefined) return "0";
    const num = Number(qty);
    return isNaN(num) ? "0" : String(Math.round(num));
  } catch (e) {
    return "0";
  }
}
