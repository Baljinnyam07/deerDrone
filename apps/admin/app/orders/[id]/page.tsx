import { createAdminClient } from "@/lib/supabase";
import { formatMoney } from "@deer-drone/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Package,
  Phone,
  Receipt,
  User,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  History
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusUpdater from "./status-updater";

async function getOrderDetails(id: string) {
  const supabase = createAdminClient();

  const [orderRes, itemsRes, logsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("admin_audit_logs")
      .select("*")
      .eq("target_table", "orders")
      .eq("target_id", id)
      .order("created_at", { ascending: false })
  ]);

  if (orderRes.error || !orderRes.data) return null;

  return {
    order: orderRes.data,
    items: itemsRes.data || [],
    logs: logsRes.data || []
  };
}

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const data = await getOrderDetails(id);

  if (!data) {
    notFound();
  }

  const { order, items, logs } = data;

  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    paid: "#10b981",
    confirmed: "#3b82f6",
    packing: "#8b5cf6",
    shipped: "#06b6d4",
    delivered: "#22c55e",
    cancelled: "#ef4444",
  };

  return (
    <div className="admin-order-detail">
      <div className="admin-title" style={{ marginBottom: '24px' }}>
        <Link href="/" className="admin-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Dashboard руу буцах
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="admin-kicker">Order Detail</p>
            <h1 style={{ fontSize: '1.75rem' }}>{order.order_number || `#${order.id.slice(0, 8)}`}</h1>
          </div>
          <span
            className="status-pill"
            style={{
              backgroundColor: statusColors[order.status] || '#666',
              color: '#fff',
              padding: '8px 16px',
              fontSize: '0.9rem'
            }}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <article className="admin-panel">
            <h2>Захиалсан бараанууд</h2>
            <div className="table-like">
              <div className="table-row" style={{ background: 'transparent', border: 'none', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', borderRadius: 0 }}>
                <div>Барааны нэр</div>
                <div style={{ textAlign: 'center' }}>Тоо</div>
                <div style={{ textAlign: 'center' }}>Нэгж үнэ</div>
                <div style={{ textAlign: 'right' }}>Нийт</div>
              </div>
              {items.map((item: any) => (
                <div className="table-row" key={item.id} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--admin-surface)', borderRadius: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--admin-surface)', borderRadius: '6px' }}></div>
                    <span>{item.product_name}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>{item.quantity}</div>
                  <div style={{ textAlign: 'center' }}>{formatMoney(item.unit_price)}</div>
                  <div style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(item.line_total)}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel">
            <h2>Төлвийн түүх</h2>
            <div className="admin-list">
              {logs.length === 0 ? (
                <p className="admin-muted" style={{ padding: '1rem' }}>Түүх байхгүй байна.</p>
              ) : (
                logs.map((log: any) => (
                  <div key={log.id} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--admin-surface)' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--admin-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--admin-primary)',
                      flexShrink: 0
                    }}>
                      <History size={16} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{log.action.replace(/_/g, ' ')}</p>
                      <p className="admin-muted" style={{ fontSize: '0.85rem', margin: '4px 0' }}>{log.details?.note || 'Тайлбар байхгүй'}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--admin-muted)' }}>
                        <span>{log.admin_email}</span>
                        <span>•</span>
                        <span>{new Date(log.created_at).toLocaleString('mn-MN')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <article className="admin-panel">
            <h2>Төлөв удирдах</h2>
            <StatusUpdater orderId={order.id} currentStatus={order.status} />
          </article>

          <article className="admin-panel">
            <h2>Хэрэглэгч</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--admin-muted)' }}><User size={20} /></div>
                <div>
                  <p className="admin-muted" style={{ fontSize: '0.75rem' }}>Нэр</p>
                  <p style={{ fontWeight: 600 }}>{order.contact_name}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--admin-muted)' }}><Phone size={20} /></div>
                <div>
                  <p className="admin-muted" style={{ fontSize: '0.75rem' }}>Утас</p>
                  <p style={{ fontWeight: 600 }}>{order.contact_phone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--admin-muted)' }}><MapPin size={20} /></div>
                <div>
                  <p className="admin-muted" style={{ fontSize: '0.75rem' }}>Хаяг</p>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {typeof order.shipping_address === 'string'
                      ? order.shipping_address
                      : order.shipping_address && typeof order.shipping_address === 'object'
                        ? [
                          (order.shipping_address as any).city,
                          (order.shipping_address as any).district,
                          (order.shipping_address as any).khoroo,
                          (order.shipping_address as any).line1
                        ].filter(Boolean).join(', ')
                        : 'Хаяг тодорхойгүй'}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="admin-panel">
            <h2>Төлбөр</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="admin-muted">Бараанууд:</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="admin-muted">Хүргэлт:</span>
                <span>{formatMoney(order.shipping_cost)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--admin-border)', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: 'var(--admin-primary)' }}>
                <span>Нийт:</span>
                <span>{formatMoney(order.total)}</span>
              </div>
              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--admin-surface)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p className="admin-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Төлбөрийн хэлбэр</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <Receipt size={16} /> {order.payment_method?.toUpperCase()}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
