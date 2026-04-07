"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "40px 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <AlertCircle size={60} style={{ color: "#EF4444" }} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        Something Went Wrong
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "24px",
          maxWidth: "400px",
        }}
      >
        We encountered an issue loading this content. Please try again or
        contact support if the problem persists.
      </p>

      <button
        onClick={reset}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 32px",
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 250ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#1D4ED8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#2563EB")
        }
      >
        <RefreshCw size={18} />
        Try Again
      </button>

      {process.env.NODE_ENV === "development" && (
        <details
          style={{
            marginTop: "32px",
            padding: "16px",
            backgroundColor: "#F8FAFC",
            borderRadius: "8px",
            textAlign: "left",
            maxWidth: "500px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: "8px",
            }}
          >
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              fontSize: "12px",
              color: "#64748B",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}

export function LoadingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        padding: "32px",
        textAlign: "center",
      }}
    >
      <AlertCircle
        size={48}
        style={{ color: "#EF4444", marginBottom: "16px" }}
      />

      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        Failed to Load
      </h3>

      <p
        style={{
          fontSize: "14px",
          color: "#64748B",
          marginBottom: "16px",
        }}
      >
        We couldn&apos;t load this content. Please try again.
      </p>

      <button
        onClick={onRetry}
        style={{
          padding: "8px 24px",
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 250ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#1D4ED8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#2563EB")
        }
      >
        Retry
      </button>
    </div>
  );
}

export function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "500px",
        padding: "40px 32px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: "#2563EB",
          margin: "0 0 16px 0",
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "32px",
          maxWidth: "400px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 32px",
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 500,
          transition: "background-color 250ms",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#1D4ED8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#2563EB")
        }
      >
        Go Home
      </Link>
    </div>
  );
}
