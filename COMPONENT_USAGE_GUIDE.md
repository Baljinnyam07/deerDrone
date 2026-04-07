# 🎨 DEER DRONE — Premium Component Usage Guide

## Quick Start

All premium components are located in:

- `apps/web/components/product/` — Product-related components
- `apps/web/components/ui/` — Reusable UI components

Import from the component index:

```typescript
import {
  PremiumProductCard,
  CategoryTabs,
  SearchFilterBar,
} from "@/components";
```

---

## 📦 Component Library

### 1. **PremiumProductCard** — Premium Product Display

**Location:** `components/product/premium-product-card.tsx`

**Props:**

```typescript
interface PremiumProductCardProps {
  product: Product; // Product data
  badge?: "new" | "sale" | "best-seller"; // Badge type
  discount?: number; // Discount percentage (for sale badge)
  rating?: number; // Star rating (3.5, 4.5, etc.)
  reviewCount?: number; // Number of reviews
  isWishlisted?: boolean; // Wishlist state
  onWishlistToggle?: () => void; // Wishlist handler
}
```

**Features:**

- ✨ Premium minimal design with hover states
- 🎯 Product badge (NEW, BEST SELLER, SALE with discount %)
- ❤️ Wishlist heart button with toggle
- 👁️ Quick view button on hover
- ⭐ Star rating with review count
- 📦 Stock status indicator
- 💰 Price display with discounted price
- 🖼️ Image zoom on hover

**Example Usage:**

```typescript
import { PremiumProductCard } from "@/components";

export function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <PremiumProductCard
          key={product.id}
          product={product}
          badge="new"
          rating={4.5}
          reviewCount={24}
          isWishlisted={false}
          onWishlistToggle={() => console.log("Wishlist updated")}
        />
      ))}
    </div>
  );
}
```

---

### 2. **CategoryTabs** — Product Category Navigation

**Location:** `components/product/category-tabs.tsx`

**Props:**

```typescript
interface CategoryTabsProps {
  categories: Category[]; // Array of category objects
  activeCategory?: string; // Currently active category slug
  onCategoryChange?: (slug: string) => void; // Category change handler
  showCount?: boolean; // Show item count in tab
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string; // Optional emoji or icon
  count?: number; // Optional item count
}
```

**Features:**

- 🎯 Horizontal scrollable tab bar
- 🎨 Blue accent for active tab
- 📱 Mobile-optimized with smooth scrolling
- 📊 Optional item count badges
- 🔄 Smooth transitions between states

**Example Usage:**

```typescript
import { CategoryTabs } from "@/components";

const categories = [
  { id: "1", name: "Professional", slug: "professional", icon: "🚁", count: 24 },
  { id: "2", name: "Creator", slug: "creator", icon: "📸", count: 18 },
  { id: "3", name: "Accessories", slug: "accessories", icon: "⚙️", count: 42 },
];

export function ProductListing() {
  const [active, setActive] = useState("professional");

  return (
    <CategoryTabs
      categories={categories}
      activeCategory={active}
      onCategoryChange={setActive}
      showCount={true}
    />
  );
}
```

---

### 3. **SearchFilterBar** — Search & Filter Controls

**Location:** `components/product/search-filter-bar.tsx`

**Props:**

```typescript
interface SearchFilterBarProps {
  onSearch?: (query: string) => void;
  onFiltersClick?: () => void;
  onSortChange?: (sortBy: string) => void;
  activeFilters?: FilterChip[];
  onClearAllFilters?: () => void;
  placeholder?: string;
}

interface FilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}
```

**Features:**

- 🔍 Search input with clear button
- 🎯 Sort dropdown (Popular, Newest, Price, Rating)
- 📍 Filter button with active count badge
- 🏷️ Active filter chips with remove buttons
- Clear all filters option
- Mongolian language labels

**Example Usage:**

```typescript
import { SearchFilterBar } from "@/components";

export function ProductPage() {
  const [filters, setFilters] = useState<FilterChip[]>([]);

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  return (
    <SearchFilterBar
      onSearch={(query) => console.log("Search:", query)}
      onFiltersClick={() => openFilterOverlay()}
      onSortChange={(sort) => handleSort(sort)}
      activeFilters={filters}
      onClearAllFilters={() => setFilters([])}
      placeholder="Дроны нэрээр хайх..."
    />
  );
}
```

---

### 4. **FilterOverlay** — Mobile Filter Panel

**Location:** `components/product/filter-overlay.tsx`

**Props:**

```typescript
interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  onFilterChange?: (
    groupId: string,
    optionId: string,
    checked: boolean,
  ) => void;
  onApply?: (filters: Record<string, string[]>) => void;
}

interface FilterGroup {
  id: string;
  title: string;
  type: "checkbox" | "range" | "toggle";
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: [number, number];
}

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}
```

**Features:**

- 📱 Bottom sheet panel for mobile
- 🎭 Expandable/collapsible filter groups
- ☑️ Checkbox filters
- 📊 Price range slider
- ✅ Apply button with handler
- Smooth animations

**Example Usage:**

```typescript
import { FilterOverlay } from "@/components";

const filterGroups: FilterGroup[] = [
  {
    id: "brand",
    title: "Үйлдвэрлэгч",
    type: "checkbox",
    options: [
      { id: "dji", label: "DJI", checked: false },
      { id: "parrot", label: "Parrot", checked: false },
    ],
  },
  {
    id: "price",
    title: "Үнэ",
    type: "range",
    min: 500000,
    max: 15000000,
  },
];

export function FilterExample() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <FilterOverlay
      isOpen={filterOpen}
      onClose={() => setFilterOpen(false)}
      filterGroups={filterGroups}
      onApply={(filters) => console.log("Applied:", filters)}
    />
  );
}
```

---

### 5. **RatingStars** — Star Rating Display

**Location:** `components/ui/rating-stars.tsx`

**Props:**

```typescript
interface RatingStarsProps {
  rating: number; // 0-5 (supports decimals like 4.5)
  reviewCount?: number; // Number of reviews
  size?: "sm" | "md" | "lg"; // Icon size
  showCount?: boolean; // Show review count
}
```

**Features:**

- ⭐ Accurate half-star rendering
- 🎨 Amber color (#F59E0B) for filled stars
- 📊 Optional review count display
- 📏 Three size options (14px, 16px, 20px)
- Accessible and semantic

**Example Usage:**

```typescript
import { RatingStars } from "@/components";

export function ProductCard() {
  return (
    <>
      <RatingStars rating={4.5} reviewCount={24} size="sm" showCount={true} />
      <RatingStars rating={3} size="md" />
      <RatingStars rating={5} reviewCount={100} size="lg" showCount={true} />
    </>
  );
}
```

---

### 6. **ProductBadge** — Status Badge Component

**Location:** `components/ui/product-badge.tsx`

**Props:**

```typescript
interface ProductBadgeProps {
  type: "new" | "sale" | "best-seller" | "limited" | "stock";
  label?: string; // Custom label (overrides default)
  discount?: number; // For sale badge (e.g., 20 for -20%)
}
```

**Features:**

- 🏷️ Semantic badge types with custom colors
- 🎨 Color-coded by status
  - New: Green
  - Sale: Red (with discount %)
  - Best Seller: Amber
  - Limited: Red
  - Stock: Green
- 👌 Proper spacing and typography

**Example Usage:**

```typescript
import { ProductBadge } from "@/components";

export function BadgeExamples() {
  return (
    <>
      <ProductBadge type="new" />
      <ProductBadge type="sale" discount={20} />
      <ProductBadge type="best-seller" />
      <ProductBadge type="stock" label="5 remaining" />
    </>
  );
}
```

---

### 7. **SkeletonCard** — Loading State

**Location:** `components/ui/skeleton-card.tsx`

**Props:** None

**Features:**

- 📦 Product card shape with shimmer animation
- ✨ Smooth 2-second animation loop
- 📱 Responsive and accessible
- 🎯 Matches PremiumProductCard dimensions

**Example Usage:**

```typescript
import { SkeletonCard } from "@/components";

export function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="product-grid">
      {isLoading ? (
        // Show 8 skeleton cards while loading
        Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))
      ) : (
        products.map(product => (
          <PremiumProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}
```

---

## 🎯 Color Reference for Development

When styling custom components, use these variables:

```css
/* Primary Actions */
--blue-primary: #2563eb;
--blue-dark: #1d4ed8;

/* Text Colors */
--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;

/* Backgrounds */
--bg-primary: #ffffff;
--surface-soft: #f8fafc;
--surface-hover: #f1f5f9;

/* Borders */
--border: #e2e8f0;

/* Semantic */
--green: #10b981;
--amber: #f59e0b;
--red: #ef4444;
--cyan: #06b6d4;
```

---

## 📱 Responsive Behavior

All components are fully responsive:

- **Desktop (1024px+):** Full featured with all options visible
- **Tablet (768px-1023px):** Optimized layouts, touch-friendly
- **Mobile (< 768px):** Stack vertically, larger touch targets (44px min)

---

## ♿ Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Proper color contrast (4.5:1+)
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ Focus indicators
- ✅ ARIA labels where needed

---

## 🚀 Performance Tips

1. **Lazy Load Images:** Use Next.js Image component with loading="lazy"
2. **Memoization:** Wrap card lists with `React.memo` for ProductCard
3. **Virtual Lists:** For >100 items, consider react-window
4. **CSS Split:** Global styles in globals.css, component styles in JSX

---

## 🐛 Troubleshooting

**Issue:** Styles not applying?

- Check CSS variable names in globals.css
- Ensure imports are correct
- Clear browser cache

**Issue:** Components not responsive?

- Check breakpoints in globals.css
- Test with DevTools responsive mode
- Verify tailwind/CSS is loaded

**Issue:** Animations feel sluggish?

- Check GPU acceleration: `will-change: transform`
- Profile with DevTools Performance tab
- Reduce animation complexity

---

## 📚 Next Components to Build

Priority order:

1. ✅ Premium Product Card
2. ✅ Category Tabs
3. ✅ Search/Filter Bar
4. ✅ Filter Overlay
5. ⬜ Leasing Calculator
6. ⬜ Testimonials Carousel
7. ⬜ FAQ Accordion
8. ⬜ Wishlist Page
9. ⬜ Comparison Tool

---

## 💬 Questions?

Refer to:

- **Design System:** `PREMIUM_DESIGN_GUIDE.md`
- **Implementation Plan:** `IMPLEMENTATION_ROADMAP.md`
- **Component Code:** Individual TSX files with inline comments
