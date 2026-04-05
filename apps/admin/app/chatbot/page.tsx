import { sampleChatMessages, sampleLeads } from "@deer-drone/data";

export default function ChatbotPage() {
  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Chatbot</p>
        <h1>Chatbot monitoring</h1>
        <p className="admin-muted">
          Default model, lead inbox, transcript viewer гэсэн chatbot admin spec-ийн үндсэн блокуудаар scaffold хийв.
        </p>
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <h2>Model settings</h2>
          <div className="admin-list">
            <div className="table-row">
              <div>
                <strong>GPT-4o-mini</strong>
                <p className="admin-muted">Default model</p>
              </div>
              <div>ON</div>
              <div>Fallback ready</div>
              <div>
                <span className="status-pill">MVP</span>
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
                <span className="status-pill">Enabled</span>
              </div>
            </div>
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
                <div>{lead.status}</div>
                <div>{lead.sourcePage}</div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-panel" style={{ marginTop: 18 }}>
        <h2>Recent transcript</h2>
        <div className="admin-list">
          {sampleChatMessages.map((message) => (
            <div className="table-row" key={message.id}>
              <div>
                <strong>{message.role}</strong>
              </div>
              <div style={{ gridColumn: "span 3" }}>{message.content}</div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
