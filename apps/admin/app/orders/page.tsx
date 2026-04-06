import { createAdminClient } from "../../lib/supabase";
import { formatMoney } from "@deer-drone/utils";
import { OrderStatusForm } from "./order-status-form";

async function getOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    return [];
  }
  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

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
        <p className="admin-kicker">Orders</p>
        <h1>Захиалгын удирдлага</h1>
        <p className="admin-muted">
          Бүх захиалгыг харах, төлөв шинэчлэх. Нийт: {orders.length} захиалга.
        </p>
      </div>

      <article className="admin-panel">
        <h2>Бүх захиалгууд</h2>
        {orders.length === 0 ? (
          <p className="admin-muted" style={{ padding: "1rem" }}>Захиалга байхгүй байна.</p>
        ) : (
          <div className="table-like">
            {orders.map((order: any) => (
              <div className="table-row" key={order.id} style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>{order.order_number}</strong>
                  <p className="admin-muted">{order.contact_name}</p>
                  <p className="admin-muted" style={{ fontSize: "0.75rem" }}>{order.contact_phone}</p>
                </div>
                <div>
                  <strong>{formatMoney(Number(order.total))}</strong>
                  <p className="admin-muted" style={{ fontSize: "0.75rem" }}>
                    {(order.items || []).length} бараа
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      backgroundColor: statusColors[order.status] || "#666",
                      color: "#fff",
                      padding: "3px 12px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "inline-block",
                      marginBottom: "6px",
                    }}
                  >
                    {order.status}
                  </span>
                  <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                </div>
                <div className="admin-muted" style={{ fontSize: "0.8rem" }}>
                  {new Date(order.created_at).toLocaleDateString("mn-MN")}
                  <br />
                  {order.payment_method}
                  <br />
                  {order.shipping_method === "ub" ? "УБ" : "Орон нутаг"}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
