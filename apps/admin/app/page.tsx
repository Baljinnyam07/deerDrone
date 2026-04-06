import { createAdminClient } from "../lib/supabase";
import { formatMoney } from "@deer-drone/utils";

async function getMetrics() {
  const supabase = createAdminClient();

  const [productsRes, ordersRes, pendingRes, leadsRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const totalRevenue = (ordersRes.data || []).reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const totalOrders = ordersRes.data?.length || 0;

  return {
    products: productsRes.count || 0,
    orders: totalOrders,
    revenue: totalRevenue,
    pendingOrders: pendingRes.count || 0,
    newLeads: leadsRes.count || 0,
  };
}

async function getRecentOrders() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

async function getRecentLeads() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

export default async function DashboardPage() {
  const metrics = await getMetrics();
  const recentOrders = await getRecentOrders();
  const recentLeads = await getRecentLeads();

  const metricCards = [
    { label: "Нийт орлого", value: formatMoney(metrics.revenue), hint: "Бүх захиалгын нийлбэр", tone: "accent" as const },
    { label: "Захиалга", value: `${metrics.orders}`, hint: "Нийт захиалга", tone: "neutral" as const },
    { label: "Хүлээгдэж буй", value: `${metrics.pendingOrders}`, hint: "Pending өртэй", tone: "warning" as const },
    { label: "Бүтээгдэхүүн", value: `${metrics.products}`, hint: "Каталогт", tone: "success" as const },
    { label: "Шинэ lead", value: `${metrics.newLeads}`, hint: "Chatbot-оос", tone: "accent" as const },
  ];

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
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Dashboard</p>
        <h1>DEER Drone — Удирдлагын самбар</h1>
        <p className="admin-muted">
          Захиалга, орлого, бүтээгдэхүүн, lead-ийн бодит тоо баримт.
        </p>
      </div>

      <div className="metric-grid">
        {metricCards.map((metric) => (
          <div className={`metric-card metric-${metric.tone}`} key={metric.label}>
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <p className="metric-hint">{metric.hint}</p>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <h2>Сүүлийн захиалгууд</h2>
          {recentOrders.length === 0 ? (
            <p className="admin-muted" style={{ padding: "1rem" }}>Захиалга байхгүй байна.</p>
          ) : (
            <div className="table-like">
              {recentOrders.map((order: any) => (
                <div className="table-row" key={order.id}>
                  <div>
                    <strong>{order.order_number}</strong>
                    <p className="admin-muted">{order.contact_name}</p>
                  </div>
                  <div>{formatMoney(Number(order.total))}</div>
                  <div>
                    <span
                      className="status-pill"
                      style={{
                        backgroundColor: statusColors[order.status] || "#666",
                        color: "#fff",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="admin-muted" style={{ fontSize: "0.8rem" }}>
                    {new Date(order.created_at).toLocaleDateString("mn-MN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel">
          <h2>Lead inbox</h2>
          {recentLeads.length === 0 ? (
            <p className="admin-muted" style={{ padding: "1rem" }}>Lead байхгүй байна.</p>
          ) : (
            <div className="admin-list">
              {recentLeads.map((lead: any) => (
                <div className="table-row" key={lead.id}>
                  <div>
                    <strong>{lead.name || "—"}</strong>
                    <p className="admin-muted">{lead.phone || "—"}</p>
                  </div>
                  <div>{lead.interest || "—"}</div>
                  <div>
                    <span className="status-pill">{lead.status}</span>
                  </div>
                  <div>{lead.source_page || "—"}</div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
