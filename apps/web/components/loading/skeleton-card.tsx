export function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          backgroundColor: "#E2E8F0",
        }}
      />

      {/* Content area */}
      <div style={{ padding: "16px" }}>
        {/* Title */}
        <div
          style={{
            height: "16px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />

        {/* Description line 1 */}
        <div
          style={{
            height: "12px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            marginBottom: "8px",
            width: "90%",
          }}
        />

        {/* Description line 2 */}
        <div
          style={{
            height: "12px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            marginBottom: "16px",
            width: "70%",
          }}
        />

        {/* Price */}
        <div
          style={{
            height: "14px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            width: "50%",
            marginBottom: "12px",
          }}
        />

        {/* Button placeholder */}
        <div
          style={{
            height: "40px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}
    >
      {/* Image skeleton */}
      <div
        style={{
          backgroundColor: "#E2E8F0",
          borderRadius: "12px",
          aspectRatio: "1",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />

      {/* Content skeleton */}
      <div>
        {/* Title */}
        <div
          style={{
            height: "32px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            marginBottom: "16px",
            width: "80%",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />

        {/* Price */}
        <div
          style={{
            height: "24px",
            backgroundColor: "#E2E8F0",
            borderRadius: "8px",
            marginBottom: "24px",
            width: "40%",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />

        {/* Description lines */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "14px",
              backgroundColor: "#E2E8F0",
              borderRadius: "8px",
              marginBottom: "12px",
              width: i === 4 ? "60%" : "100%",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        ))}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <div
            style={{
              flex: 1,
              height: "44px",
              backgroundColor: "#E2E8F0",
              borderRadius: "8px",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div
            style={{
              flex: 1,
              height: "44px",
              backgroundColor: "#E2E8F0",
              borderRadius: "8px",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
