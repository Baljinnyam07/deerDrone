import { SkeletonCard } from "../../../components/ui/skeleton-card";

export default function ProductsLoading() {
  return (
    <main style={{
      minHeight: "100vh",
      paddingBottom: 100,
      background: "linear-gradient(to bottom, #f8fafc 0%, #ffffff 26%, #ffffff 100%)",
    }}>
      <style>{`
        .pl-hero-sk {
          max-width: 1280px;
          margin: 20px auto 0;
          padding: 0 32px;
        }
        .pl-hero-sk-inner {
          width: 100%;
          height: clamp(340px, 38vw, 520px);
          border-radius: 30px;
          background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
          background-size: 200% 100%;
          animation: pl-shimmer 1.6s infinite;
        }
        .pl-grid-wrap {
          max-width: 1280px;
          margin: 28px auto 0;
          padding: 0 32px;
        }
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        @keyframes pl-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @media (max-width: 768px) {
          .pl-hero-sk, .pl-grid-wrap { padding: 0 16px !important; }
          .pl-hero-sk-inner { height: 240px !important; border-radius: 20px !important; }
          .pl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
        }
      `}</style>

      {/* Hero skeleton */}
      <section className="pl-hero-sk">
        <div className="pl-hero-sk-inner" />
      </section>

      {/* Skeleton cards */}
      <section className="pl-grid-wrap">
        <div className="pl-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
