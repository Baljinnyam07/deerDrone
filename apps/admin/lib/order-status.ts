// Paid orders that still need work before they leave the shop ("Хүргэх")
export const TODO_STATUSES = ["paid", "confirmed", "packing"];

// Every status that means the customer actually paid — counts as revenue
export const PAID_STATUSES = ["paid", "confirmed", "packing", "shipped", "delivered", "completed"];
