"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ListingSidebarProps {
  categories: Category[];
  brands: string[];
  activeCategory?: string;
  activeBrand?: string;
}

export function ListingSidebar({
  categories,
  brands,
  activeCategory,
  activeBrand
}: ListingSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands.filter(b =>
    b.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeBrand === brand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  return (
    <aside className="product-sidebar pe-lg-4">
      {/* Category Section */}
      <div className="mb-5">

        <div className="d-flex flex-column gap-2">
          {/* Mock nested structure based on screenshot */}
          <div className="category-group mb-2">
            <button className="btn btn-link p-0 text-decoration-none d-flex align-items-center justify-content-between w-100 text-dark fw-bold" style={{ fontSize: "0.9rem" }}>
              Бүтээгдэхүүн <ChevronUp size={16} />
            </button>
            <div className="ps-3 mt-2 d-flex flex-column gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`text-decoration-none small transition-all ${activeCategory === cat.slug ? "fw-bold text-success" : "text-secondary hover-dark"}`}
                  style={{ fontSize: "0.85rem" }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="mb-5 pt-4 border-top">
        <button
          onClick={() => setIsBrandExpanded(!isBrandExpanded)}
          className="btn btn-link p-0 text-decoration-none d-flex align-items-center justify-content-between w-100 text-dark fw-bold mb-3"
          style={{ fontSize: "1rem" }}
        >
          БРЭНД {isBrandExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isBrandExpanded && (
          <div className="brand-filters">
            <div className="position-relative mb-3">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-2 text-secondary">
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control ps-4"
                placeholder="Хайх"
                style={{ fontSize: "0.8rem", height: "36px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="d-flex flex-column gap-2 overflow-auto max-h-48" style={{ maxHeight: "200px" }}>
              {filteredBrands.map((brand) => (
                <label key={brand} className="d-flex align-items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={activeBrand === brand}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span className="small text-secondary" style={{ fontSize: "0.85rem" }}>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {(activeCategory || activeBrand) && (
        <button
          onClick={clearFilters}
          className="btn btn-outline-secondary w-100 rounded-pill py-2 mt-4 d-flex align-items-center justify-content-center gap-2"
          style={{ fontSize: "0.8rem" }}
        >
          <X size={14} /> Шүүлтүүр цэвэрлэх
        </button>
      )}

      <style jsx>{`
        .hover-dark:hover {
          color: #111827 !important;
        }
        .max-h-48 {
          scrollbar-width: thin;
        }
      `}</style>
    </aside>
  );
}
