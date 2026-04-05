import { dashboardMetrics, recentOrders, sampleLeads } from "@deer-drone/data";
import { MetricCard } from "@deer-drone/ui";
import { formatMoney } from "@deer-drone/utils";

export default function DashboardPage() {
  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Dashboard</p>
        <h1>MVP operations overview</h1>
        <p className="admin-muted">
          Orders, chatbot leads, and catalog health-г нэг дэлгэц дээр харах зориулалттай admin landing.
        </p>
      </div>

      <div className="metric-grid">
        {dashboardMetrics.map((metric) => (
          <MetricCard
            hint={metric.hint}
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <h2>Recent orders</h2>
          <div className="table-like">
            {recentOrders.map((order) => (
              <div className="table-row" key={order.id}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <p className="admin-muted">{order.contactName}</p>
                </div>
                <div>{formatMoney(order.total)}</div>
                <div>
                  <span className="status-pill">{order.status}</span>
                </div>
                <div>{order.paymentMethod}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <h2>Lead inbox</h2>
          <div className="admin-list">
            {sampleLeads.map((lead) => (
              <div className="table-row" key={lead.id}>
                <div>
                  <strong>{lead.name}</strong>
                  <p className="admin-muted">{lead.phone}</p>
                </div>
                <div>{lead.interest}</div>
                <div>
                  <span className="status-pill">{lead.status}</span>
                </div>
                <div>{lead.sourcePage}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
