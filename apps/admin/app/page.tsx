import { createAdminClient } from "../lib/supabase";
import { safeMoney, safeDate } from "../lib/format";
import DashboardCharts from "./components/DashboardCharts";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Activity, Clock, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { HoverScale, LivePulse, FadeIn } from "../components/ui/motion-wrapper";

async function getDashboardData() {
  const supabase = createAdminClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [productsRes, ordersRes, pendingRes, leadsRes, chartDataRes, auditRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("orders")
      .select("total, status, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const totalRevenue = (ordersRes.data || []).reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const totalOrders = ordersRes.data?.length || 0;

  // Process chart data (Revenue by day)
  const dailyData: Record<string, { date: string, revenue: number, orders: number }> = {};
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
    dailyData[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
  }

  (chartDataRes.data || []).forEach((order: any) => {
    const dateStr = new Date(order.created_at).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
    if (dailyData[dateStr]) {
      dailyData[dateStr].revenue += Number(order.total || 0);
      dailyData[dateStr].orders += 1;
    }
  });

  // Status Distribution
  const statusCounts: Record<string, number> = {};
  (chartDataRes.data || []).forEach((order: any) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  return {
    metrics: {
      products: productsRes.count || 0,
      orders: totalOrders,
      revenue: totalRevenue,
      pendingOrders: pendingRes.count || 0,
      newLeads: leadsRes.count || 0,
    },
    chartData: Object.values(dailyData),
    statusData,
    recentAudit: auditRes.data || []
  };
}

async function getRecentLists() {
  const supabase = createAdminClient();
  const [orders, leads] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(6)
  ]);
  return { recentOrders: orders.data || [], recentLeads: leads.data || [] };
}

export default async function DashboardPage() {
  const { metrics, chartData, statusData, recentAudit } = await getDashboardData();
  const { recentOrders, recentLeads } = await getRecentLists();

  const metricCards = [
    { label: "Нийт борлуулалт", value: safeMoney(metrics.revenue), hint: "Нийт хугацааны дүн", tone: "accent" as const, icon: <Activity size={16} /> },
    { label: "Идэвхтэй захиалга", value: `${metrics.pendingOrders}`, hint: "Гүйцэтгэл хүлээж буй", tone: "warning" as const, icon: <ShoppingCart size={16} /> },
    { label: "Шинэ хүсэлт", value: `${metrics.newLeads}`, hint: "Сүүлийн 30 хоног", tone: "accent" as const, icon: <User size={16} /> },
    { label: "Барааны үлдэгдэл", value: `${metrics.products}`, hint: "Идэвхтэй бараа", tone: "success" as const, icon: <ShoppingCart size={16} /> },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Хүлээгдэж буй", color: "var(--admin-warning)" },
    paid: { label: "Төлөгдсөн", color: "var(--admin-success)" },
    confirmed: { label: "Баталгаажсан", color: "var(--admin-primary)" },
    packing: { label: "Савлаж буй", color: "var(--admin-info)" },
    shipped: { label: "Илгээсэн", color: "var(--admin-info)" },
    delivered: { label: "Хүргэгдсэн", color: "var(--admin-success)" },
    cancelled: { label: "Цуцлагдсан", color: "var(--admin-danger)" },
  };

  return (
    <section>
      {/* Page Header */}
      <AdminPageHeader
        title="Ерөнхий тойм"
        description="Бодит цагийн систем болон аудитын мэдээллийн тойм."
      />

      {/* Metric Cards */}
      <div className="metric-grid" style={{ marginBottom: '32px' }}>
        {metricCards.map((metric, i) => (
          <div key={metric.label} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
                <p className="metric-hint">{metric.hint}</p>
              </div>
              <div style={{ color: 'var(--admin-muted)', background: 'var(--admin-surface)', padding: '8px', borderRadius: '6px' }}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ marginBottom: '32px' }}>
        <div className="admin-panel admin-p-lg">
          <h2 style={{ marginTop: 0 }}>Гүйцэтгэлийн үзүүлэлт</h2>
          <DashboardCharts chartData={chartData} statusData={statusData} />
        </div>
      </div>

      {/* Recent Data Section */}
      <div className="admin-grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div className="admin-panel" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, padding: 0, border: 'none' }}>Сүүлийн гүйлгээ</h2>
            <Link href="/orders" className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Бүгдийг харах</Link>
          </div>
          <div style={{ padding: '12px' }}>
            {recentOrders.length === 0 ? (
              <p className="admin-muted" style={{ padding: '12px', margin: 0 }}>Бичлэг олдсонгүй.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentOrders.map((order: any) => (
                  <Link key={order.id} href={`/orders`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="interactive-card" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="font-semibold text-sm">{order.order_number}</div>
                        <div className="text-xs text-muted">{order.contact_name}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="font-semibold text-sm">{safeMoney(order.total)}</div>
                        <div style={{ minWidth: '80px', textAlign: 'center' }}>
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor: 'var(--admin-surface)',
                              color: statusMap[order.status]?.color || 'var(--admin-text-secondary)',
                              border: '1px solid var(--admin-border)',
                              padding: '2px 8px',
                              fontSize: '10px'
                            }}
                          >
                            {statusMap[order.status]?.label || order.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted">{safeDate(order.created_at, 'mn-MN')}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="admin-panel" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border-subtle)' }}>
            <h2 style={{ margin: 0, padding: 0, border: 'none' }}>Үйл ажиллагааны бүртгэл</h2>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {recentAudit.length === 0 ? (
              <p className="admin-muted" style={{ margin: 0 }}>Одоогоор идэвхгүй байна.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {recentAudit.map((log: any, i: number) => (
                  <div key={log.id} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    padding: '12px 0', 
                    borderBottom: i === recentAudit.length - 1 ? 'none' : '1px solid var(--admin-border-subtle)' 
                  }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      background: i === 0 ? 'var(--admin-primary)' : 'var(--admin-border)', 
                      marginTop: '6px',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="font-semibold text-sm" style={{ margin: 0 }}>{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>
                        {log.admin_email.split('@')[0]} • {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
