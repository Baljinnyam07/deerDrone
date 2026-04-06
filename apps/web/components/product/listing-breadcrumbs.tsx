"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function ListingBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="py-3">
      <ol className="breadcrumb mb-0 d-flex align-items-center flex-wrap" style={{ listStyle: "none", padding: 0 }}>
        <li className="breadcrumb-item d-flex align-items-center">
          <Link href="/" className="text-secondary text-decoration-none d-flex align-items-center hover-dark transition-all">
            <Home size={14} className="me-1" />
            <span style={{ fontSize: "0.85rem" }}>Нүүр</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item d-flex align-items-center">
            <ChevronRight size={14} className="mx-2 text-muted opacity-50" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="text-secondary text-decoration-none hover-dark transition-all"
                style={{ fontSize: "0.85rem" }}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-dark fw-medium" style={{ fontSize: "0.85rem" }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>

      <style jsx>{`
        .hover-dark:hover {
          color: #111827 !absolute;
        }
      `}</style>
    </nav>
  );
}
