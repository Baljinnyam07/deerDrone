"use client";

export function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image Skeleton */}
      <div
        style={{
          aspectRatio: "1/1",
          backgroundColor: "#F1F5F9",
          backgroundImage: `
            linear-gradient(
              90deg,
              #F1F5F9 0%,
              #E2E8F0 50%,
              #F1F5F9 100%
            )`,
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite",
          borderBottom: "1px solid #E2E8F0",
        }}
      />

      {/* Content Skeleton */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        {/* Category */}
        <div
          style={{
            height: "12px",
            backgroundColor: "#F1F5F9",
            borderRadius: "4px",
            width: "60%",
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Title Lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              height: "16px",
              backgroundColor: "#F1F5F9",
              borderRadius: "4px",
              width: "100%",
              animation: "shimmer 2s infinite",
            }}
          />
          <div
            style={{
              height: "16px",
              backgroundColor: "#F1F5F9",
              borderRadius: "4px",
              width: "80%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        {/* Rating */}
        <div
          style={{
            height: "14px",
            backgroundColor: "#F1F5F9",
            borderRadius: "4px",
            width: "70%",
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Price */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            style={{
              height: "20px",
              backgroundColor: "#F1F5F9",
              borderRadius: "4px",
              width: "60%",
              animation: "shimmer 2s infinite",
            }}
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#F1F5F9",
              borderRadius: "4px",
              width: "40%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
