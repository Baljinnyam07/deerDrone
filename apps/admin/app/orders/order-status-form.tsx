"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const statuses = ["pending", "paid", "confirmed", "packing", "shipped", "delivered", "cancelled"];

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    startTransition(async () => {
      await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      router.refresh();
    });
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      style={{
        fontSize: "0.75rem",
        padding: "3px 8px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        background: isPending ? "#f1f1f1" : "#fff",
        cursor: isPending ? "wait" : "pointer",
      }}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
