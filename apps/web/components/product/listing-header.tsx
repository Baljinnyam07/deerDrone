"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function ListingHeader({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 py-2">
      <div className="d-flex align-items-baseline gap-2">
        <h2 className="fw-bold mb-0" style={{ fontSize: "1.25rem", color: "#111827" }}>
          {count} бүтээгдэхүүн
        </h2>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="position-relative">
          <select
            className="form-select border shadow-sm pe-5 appearance-none"
            style={{
              fontSize: "0.85rem",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              minWidth: "160px"
            }}
            value={currentSort}
            onChange={handleSortChange}
          >
            <option value="newest">Сүүлд нэмэгдсэн</option>
            <option value="price_asc">Үнэ: Өсөхөөр</option>
            <option value="price_desc">Үнэ: Буурахаар</option>
          </select>
        </div>
      </div>
    </div>
  );
}
