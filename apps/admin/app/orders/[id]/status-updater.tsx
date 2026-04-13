"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, AlertCircle } from "lucide-react";

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending (Хүлээгдэж буй)" },
  { value: "paid", label: "Paid (Төлөгдсөн)" },
  { value: "confirmed", label: "Confirmed (Баталгаажсан)" },
  { value: "packing", label: "Packing (Баглаж буй)" },
  { value: "shipped", label: "Shipped (Хүргэлтэнд гарсан)" },
  { value: "delivered", label: "Delivered (Хүргэгдсэн)" },
  { value: "cancelled", label: "Cancelled (Цуцлагдсан)" },
];

export default function StatusUpdater({ orderId, currentStatus }: StatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setNote("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: '6px' }}>
          ШИНЭ ТӨЛӨВ
        </label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: '6px' }}>
          ТАЙЛБАР (Audit Log-д харагдана)
        </label>
        <textarea 
          placeholder="Жишээ: Төлбөр орж ирсэн, Хүргэгчид өгсөн..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            fontSize: '0.9rem',
            minHeight: '80px',
            outline: 'none',
            resize: 'none'
          }}
        />
      </div>

      {error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--admin-danger)', 
          fontSize: '0.85rem',
          background: '#fee2e2',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button 
        onClick={handleUpdate}
        disabled={loading || status === currentStatus && !note}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          borderRadius: '8px',
          background: loading ? 'var(--admin-muted)' : 'var(--admin-primary)',
          color: 'white',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Хадгалж байна...' : 'Төлөв шинэчлэх'}
      </button>
      
      {status === currentStatus && (
        <p style={{ fontSize: '0.75rem', color: 'var(--admin-muted)', textAlign: 'center', margin: 0 }}>
          Төлөв өөрчлөгдөөгүй байна
        </p>
      )}
    </div>
  );
}
