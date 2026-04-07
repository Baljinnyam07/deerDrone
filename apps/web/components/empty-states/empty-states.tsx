"use client";

import { ShoppingCart, Package, Search } from "lucide-react";
import Link from "next/link";

export function EmptyProducts() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <Package size={60} style={{ color: "#2563EB" }} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        No Products Found
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "32px",
          maxWidth: "400px",
        }}
      >
        We couldn't find any products matching your search. Try adjusting your
        filters or browse our full collection.
      </p>

      <Link
        href="/products"
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
        Browse All Products
      </Link>
    </div>
  );
}

export function EmptyCart() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <ShoppingCart size={60} style={{ color: "#2563EB" }} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        Your Cart is Empty
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "32px",
          maxWidth: "400px",
        }}
      >
        Start shopping to add items to your cart. Explore our premium drone
        collection.
      </p>

      <Link
        href="/products"
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
        Continue Shopping
      </Link>
    </div>
  );
}

export function EmptySearch() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <Search size={60} style={{ color: "#2563EB" }} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        No Results
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "32px",
          maxWidth: "400px",
        }}
      >
        Try different search terms or check your spelling to find what you're
        looking for.
      </p>

      <Link
        href="/products"
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
        Browse Products
      </Link>
    </div>
  );
}
