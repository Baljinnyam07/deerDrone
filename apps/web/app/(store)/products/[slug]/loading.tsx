// One calm placeholder for every product page (rich and classic): a bar for the
// sticky sub-nav and a block for the hero, so the layout does not jump when the page arrives.
export default function ProductDetailLoading() {
  return (
    <div className="pdl" aria-busy="true">
      <style>{`
        .pdl { min-height: 100vh; background: #fff; }
        .pdl-bar {
          height: 52px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          gap: 16px;
        }
        .pdl-hero {
          height: clamp(420px, 70vh, 720px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 0 24px;
        }
        .pdl-sk {
          border-radius: 8px;
          background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
          background-size: 200% 100%;
          animation: pdl-shimmer 1.6s infinite;
        }
        @keyframes pdl-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (max-width: 575.98px) {
          .pdl-bar { padding: 0 16px; }
        }
      `}</style>
      <div className="pdl-bar">
        <div className="pdl-sk" style={{ height: 16, width: 180 }} />
        <div className="pdl-sk" style={{ height: 34, width: 120, borderRadius: 999 }} />
      </div>
      <div className="pdl-hero">
        <div className="pdl-sk" style={{ height: 40, width: "min(520px, 80%)" }} />
        <div className="pdl-sk" style={{ height: 40, width: "min(340px, 55%)" }} />
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <div className="pdl-sk" style={{ height: 46, width: 140, borderRadius: 999 }} />
          <div className="pdl-sk" style={{ height: 46, width: 140, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}
