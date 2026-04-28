export default function ProductDetailLoading() {
  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingBottom: 80 }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .sk {
          background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* Breadcrumb skeleton */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px 0" }}>
        <div className="sk" style={{ height: 14, width: 220, borderRadius: 6 }} />
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1200,
        margin: "32px auto 0",
        padding: "0 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
      }}
        className="pd-sk-grid"
      >
        {/* Left: image */}
        <div>
          <div className="sk" style={{ width: "100%", aspectRatio: "1/1", borderRadius: 20 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[0,1,2].map(i => (
              <div key={i} className="sk" style={{ width: 72, height: 72, borderRadius: 10, flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* Right: info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
          <div className="sk" style={{ height: 14, width: 80 }} />
          <div className="sk" style={{ height: 36, width: "90%" }} />
          <div className="sk" style={{ height: 36, width: "60%" }} />
          <div className="sk" style={{ height: 18, width: 120, marginTop: 8 }} />
          <div className="sk" style={{ height: 44, width: 160, borderRadius: 999 }} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div className="sk" style={{ height: 50, flex: 1, borderRadius: 12 }} />
            <div className="sk" style={{ height: 50, flex: 1, borderRadius: 12 }} />
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[0,1,2].map(i => (
              <div key={i} className="sk" style={{ height: 14, width: `${[80,65,72][i]}%` }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pd-sk-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 0 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
