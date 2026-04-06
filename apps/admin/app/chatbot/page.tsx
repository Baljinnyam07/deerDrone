import { createAdminClient } from "../../lib/supabase";

async function getLeads() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  return data || [];
}

export default async function ChatbotPage() {
  const leads = await getLeads();

  const statusColors: Record<string, string> = {
    new: "#3b82f6",
    qualified: "#10b981",
    contacted: "#f59e0b",
    closed: "#6b7280",
  };

  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Chatbot</p>
        <h1>Chatbot & Lead мониторинг</h1>
        <p className="admin-muted">
          AI зөвлөхийн тохиргоо болон chatbot-оос ирсэн lead-үүд.
        </p>
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <h2>Model тохиргоо</h2>
          <div className="admin-list">
            <div className="table-row">
              <div>
                <strong>GPT-4o-mini</strong>
                <p className="admin-muted">Default model</p>
              </div>
              <div>ON</div>
              <div>Fallback ready</div>
              <div>
                <span className="status-pill" style={{ backgroundColor: "#22c55e", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "0.75rem" }}>MVP</span>
              </div>
            </div>
            <div className="table-row">
              <div>
                <strong>Streaming contract</strong>
                <p className="admin-muted">Widget and service aligned</p>
              </div>
              <div>Ready</div>
              <div>OpenAI seam</div>
              <div>
                <span className="status-pill" style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "0.75rem" }}>Enabled</span>
              </div>
            </div>
          </div>
        </article>

        <article className="admin-panel">
          <h2>Lead inbox ({leads.length})</h2>
          {leads.length === 0 ? (
            <p className="admin-muted" style={{ padding: "1rem" }}>Lead байхгүй байна. Chatbot-оос lead ирэхэд энд харагдана.</p>
          ) : (
            <div className="admin-list">
              {leads.map((lead: any) => (
                <div className="table-row" key={lead.id}>
                  <div>
                    <strong>{lead.name || "Нэргүй"}</strong>
                    <p className="admin-muted">{lead.phone || "—"}</p>
                  </div>
                  <div>{lead.interest || "—"}</div>
                  <div>
                    <span
                      style={{
                        backgroundColor: statusColors[lead.status] || "#666",
                        color: "#fff",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="admin-muted" style={{ fontSize: "0.8rem" }}>
                    {lead.source_page || "—"}
                    <br />
                    {new Date(lead.created_at).toLocaleDateString("mn-MN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
