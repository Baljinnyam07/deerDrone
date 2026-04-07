/**
 * DEER DRONE — Premium UI Component Library
 *
 * This file exports all reusable UI components for consistent styling
 * and easy integration throughout the application.
 */

// Product Components
export { PremiumProductCard } from "./product/premium-product-card";

export { CategoryTabs } from "./product/category-tabs";
export type { Category } from "./product/category-tabs";

export { SearchFilterBar } from "./product/search-filter-bar";
export type { FilterChip } from "./product/search-filter-bar";

export { FilterOverlay } from "./product/filter-overlay";
export type { FilterOption, FilterGroup } from "./product/filter-overlay";

// UI Components
export { RatingStars } from "./ui/rating-stars";
export { ProductBadge } from "./ui/product-badge";
export { SkeletonCard } from "./ui/skeleton-card";

/**
 * Usage Examples:
 *
 * 1. Premium Product Card:
 *    import { PremiumProductCard } from "@/components"
 *    <PremiumProductCard product={product} badge="new" rating={4.5} />
 *
 * 2. Category Tabs:
 *    <CategoryTabs categories={categories} onCategoryChange={handleChange} />
 *
 * 3. Search & Filter Bar:
 *    <SearchFilterBar onSearch={handleSearch} onFiltersClick={openFilters} />
 *
 * 4. Filter Overlay (Mobile):
 *    <FilterOverlay isOpen={open} onClose={close} filterGroups={groups} />
 *
 * 5. Rating Stars:
 *    <RatingStars rating={4.5} reviewCount={24} />
 *
 * 6. Product Badge:
 *    <ProductBadge type="new" label="NEW" />
 *    <ProductBadge type="sale" discount={20} />
 *
 * 7. Skeleton Card (Loading):
 *    <SkeletonCard />
 */
