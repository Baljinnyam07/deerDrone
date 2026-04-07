# ⚡ QUICK START — Premium Components

## 5-Minute Integration Guide

### 1️⃣ Import Components

```typescript
// Option A: Import individual components
import { PremiumProductCard } from "@/components/product/premium-product-card";
import { CategoryTabs } from "@/components/product/category-tabs";

// Option B: Import from main export (simpler)
import {
  PremiumProductCard,
  CategoryTabs,
  SearchFilterBar,
  RatingStars,
  ProductBadge,
  SkeletonCard,
  FilterOverlay,
} from "@/components";
```

### 2️⃣ Use in Your Component

#### Product Cards

```typescript
<div className="product-grid">
  {products.map(product => (
    <PremiumProductCard
      key={product.id}
      product={product}
      badge="new"
      rating={4.5}
      reviewCount={24}
    />
  ))}
</div>
```

#### Category Navigation

```typescript
<CategoryTabs
  categories={[
    { id: "1", name: "Бүхэлдээ", slug: "all", icon: "🚁", count: 48 },
    { id: "2", name: "Мэргэжлийн", slug: "pro", icon: "🏢", count: 12 },
  ]}
  activeCategory="all"
  onCategoryChange={setActive}
/>
```

#### Search & Filter

```typescript
<SearchFilterBar
  onSearch={(q) => handleSearch(q)}
  onFiltersClick={() => setFilterOpen(true)}
  onSortChange={(s) => handleSort(s)}
  activeFilters={filters}
/>
```

#### Rating Display

```typescript
<RatingStars
  rating={4.5}
  reviewCount={24}
  size="sm"
/>
```

#### Product Badge

```typescript
<ProductBadge type="new" />
<ProductBadge type="sale" discount={20} />
<ProductBadge type="best-seller" />
```

#### Loading State

```typescript
{isLoading ? (
  Array.from({length: 8}).map(() => <SkeletonCard />)
) : (
  // render products
)}
```

---

## 🎨 Color Usage Cheat Sheet

```css
/* Primary (Blue) */
--blue-primary: #2563eb; /* Main CTAs, focus */
--blue-dark: #1d4ed8; /* Hover state */

/* Text */
--text-primary: #0f172a; /* Main text */
--text-secondary: #475569; /* Secondary */
--text-muted: #94a3b8; /* Disabled/hints */

/* Background */
--bg-primary: #ffffff; /* Main background */
--surface-soft: #f8fafc; /* Cards, sections */
--surface-hover: #f1f5f9; /* Hover state */

/* Status Colors */
--green: #10b981; /* Success, in stock */
--amber: #f59e0b; /* Warning, low stock */
--red: #ef4444; /* Error, sold out */

/* Borders */
--border: #e2e8f0; /* Card borders */
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
0px      — Mobile (default)
640px    — Small tablet
768px    — Tablet
1024px   — Desktop
1280px   — Large desktop (--max-width: 1280px)
```

---

## 🎯 Common Patterns

### Pattern 1: Product Grid with Filters

```typescript
const [filters, setFilters] = useState([]);
const [sort, setSort] = useState("popular");

return (
  <>
    <SearchFilterBar
      activeFilters={filters}
      onSortChange={setSort}
      onFiltersClick={() => setFilterOpen(true)}
    />
    <div className="product-grid">
      {filteredProducts.map(p => (
        <PremiumProductCard key={p.id} product={p} />
      ))}
    </div>
    <FilterOverlay isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
  </>
);
```

### Pattern 2: Category Switching

```typescript
const [active, setActive] = useState("all");

const filtered = active === "all"
  ? products
  : products.filter(p => p.category === active);

return (
  <>
    <CategoryTabs
      categories={categories}
      activeCategory={active}
      onCategoryChange={setActive}
    />
    <ProductGrid products={filtered} />
  </>
);
```

### Pattern 3: Loading States

```typescript
{isLoading && (
  <div className="product-grid">
    {Array.from({length: 12}).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}

{!isLoading && products.length > 0 && (
  <div className="product-grid">
    {products.map(p => <PremiumProductCard key={p.id} product={p} />)}
  </div>
)}

{!isLoading && products.length === 0 && (
  <div style={{textAlign: "center", padding: "60px"}}>
    <p>Үр дүн олдсонгүй</p>
  </div>
)}
```

---

## 🔧 Customization

### Change Primary Color

Edit `apps/web/app/globals.css`:

```css
:root {
  --blue-primary: #YOUR_COLOR;
  --blue-dark: #DARKER_VERSION;
}
```

### Change Font Size

Components use `clamp()` for fluid sizing:

```css
font-size: clamp(1.8rem, 4vw, 2.8rem);
/* Mobile min: 1.8rem, Desktop max: 2.8rem */
```

### Change Border Radius

Use radius variables:

```css
border-radius: var(--radius-lg); /* 16px */
border-radius: var(--radius-md); /* 12px */
```

### Change Animation Speed

Use transition variables:

```css
transition: all var(--transition-base) ease; /* 250ms */
transition: all var(--transition-fast) ease; /* 150ms */
```

---

## 🐛 Troubleshooting

| Issue              | Solution                                         |
| ------------------ | ------------------------------------------------ |
| Colors not showing | Check CSS variables in globals.css               |
| Images not loading | Use next/image and ensure paths are correct      |
| Layout breaking    | Check viewport: use `viewport: 100%`             |
| Icons missing      | Install lucide-react: `npm install lucide-react` |
| Styles conflicting | Check Bootstrap version, use CSS variables       |

---

## 📊 Component Sizes

### Grid Layouts

```
Desktop:  4 columns (280px each)
Tablet:   3 columns (250px each)
Mobile:   2 columns (160px each)
```

### Spacing

```
Padding: 20px (cards)
Gap: 24px (grid)
Section: 80px (vertical)
```

### Touch Targets

```
Minimum: 44px × 44px (WCAG AA)
Buttons: 44px height
Icons: 40px container
```

---

## ✅ Checklist for Implementation

- [ ] Copy component files to correct directories
- [ ] Update globals.css with new variables (already done)
- [ ] Import components in pages
- [ ] Update product listing page
- [ ] Test on mobile (320px+)
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify color contrast
- [ ] Test loading states
- [ ] Test empty states

---

## 🚀 Performance Tips

1. **Lazy Load Images**

   ```typescript
   <Image src={url} loading="lazy" />
   ```

2. **Memoize Cards**

   ```typescript
   const ProductCard = React.memo(PremiumProductCard);
   ```

3. **Virtual Scrolling** (for 100+ items)

   ```typescript
   import { FixedSizeList } from "react-window";
   ```

4. **Skeleton Loading**
   ```typescript
   {isLoading && <SkeletonCard />}
   ```

---

## 📞 Need Help?

See detailed documentation:

- **Component API:** `COMPONENT_USAGE_GUIDE.md`
- **Design System:** `PREMIUM_DESIGN_GUIDE.md`
- **Full Example:** `PRODUCTS_PAGE_EXAMPLE.tsx`
- **Launch Plan:** `IMPLEMENTATION_ROADMAP.md`

---

## 🎉 You're Ready!

Start building with premium components today. All CSS variables and components are production-ready. Happy coding! 🚀
