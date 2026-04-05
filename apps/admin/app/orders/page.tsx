import { recentOrders } from "@deer-drone/data";
import { formatMoney } from "@deer-drone/utils";

export default function OrdersPage() {
  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Orders</p>
        <h1>Order operations</h1>
        <p className="admin-muted">
          Pending, confirmed, packing зэрэг lifecycle-ийг table-based workflow дээр харуулсан MVP page.
        </p>
      </div>

      <article className="admin-panel">
        <h2>All orders</h2>
        <div className="table-like">
          {recentOrders.map((order) => (
            <div className="table-row" key={order.id}>
              <div>
                <strong>{order.orderNumber}</strong>
                <p className="admin-muted">{order.contactName}</p>
              </div>
              <div>{order.paymentMethod}</div>
              <div>{formatMoney(order.total)}</div>
              <div>
                <span className="status-pill">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
