# Admin UI Refactor - File Map

## Layout / Shell
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root admin layout wrapper with sidebar navigation and session auth |
| `app/login/page.tsx` | Admin authentication page |

## Pages
| File | Purpose |
|------|---------|
| `app/page.tsx` | Dashboard with metrics cards, charts, and recent activity feeds |
| `app/orders/page.tsx` | Orders listing page header and wrapper |
| `app/orders/orders-client.tsx` | Orders table with inline drawer for details editing |
| `app/products/page.tsx` | Products catalog page header and wrapper |
| `app/products/products-client.tsx` | Products table with add/edit form in drawer |
| `app/chatbot/page.tsx` | AI chatbot config and lead tracking dashboard |
| `app/settings/page.tsx` | Settings hub with category cards |
| `app/settings/videos/page.tsx` | Video slot uploader for homepage hero section |

## Tables
| File | Purpose |
|------|---------|
| `app/orders/orders-client.tsx` | Grid-based order table with status badges and action menu |
| `app/products/products-client.tsx` | Grid-based product catalog with image thumbnails and stock indicators |

## Drawers / Modals
| File | Purpose |
|------|---------|
| `components/ui/admin-drawer.tsx` | Slide-out panel for detailed forms and record editing |
| `components/ui/admin-dialog.tsx` | Modal dialog for confirmations and alerts |

## Shared Admin UI Primitives ⭐
| File | Purpose |
|------|---------|
| `components/admin-page-header.tsx` | Reusable page header with kicker, title, description, actions (PHASE 6) |
| `components/field-grid.tsx` | Flexible 1/2/3-column field layout for forms and details (PHASE 6) |
| `components/section-block.tsx` | Reusable section container with title and optional action button (PHASE 6) |

## Generic UI Components
| File | Purpose |
|------|---------|
| `components/ui/admin-button.tsx` | Primary button component with loading/disabled states |
| `components/ui/status-badge.tsx` | Colored status indicator with icon dot (success/warning/danger/info/primary) |
| `components/ui/action-menu.tsx` | Dropdown menu for row actions (edit, delete, etc.) |
| `components/ui/toast.tsx` | Toast notification system for success/error messages |
| `components/ui/motion-wrapper.tsx` | Framer Motion animation wrappers (HoverScale, LivePulse, FadeIn) |
| `components/DashboardCharts.tsx` | Recharts graph components for revenue and order status trends |

## Styling Files
| File | Purpose |
|------|---------|
| `app/globals.css` | Master CSS with 30+ admin component classes, CSS variables (colors/spacing/shadows), and utilities |
| `tailwind.config.js` | Tailwind configuration with brand colors and custom theme |

## Utility / Formatting Files ⭐
| File | Purpose |
|------|---------|
| `lib/format.ts` | Safe data formatters: safeMoney, safeDate, safeName, safePhone, safeAddress, safeQuantity (PHASE 5) |
| `lib/supabase.ts` | Supabase admin client setup for server-side queries |

## Data Fetching / Actions
| File | Purpose |
|------|---------|
| `app/api/orders/[id]/status` | Endpoint to update order status |
| `app/api/products/[id]` | Endpoints for CRUD operations on products |
| `app/api/settings` | Endpoints for site configuration updates |

---

## Priority Files by Improvement Area

### 1. **Header Quality** 📌
- **Primary:** `components/admin-page-header.tsx` — Edit to add breadcrumbs, filters, or export buttons
- **Secondary:** `app/globals.css` (.admin-page-header classes) — Adjust spacing, typography, colors

### 2. **Table Quality** 📊
- **Primary:** `app/orders/orders-client.tsx` + `app/products/products-client.tsx` — Refactor grid templates, add sorting/filtering
- **Secondary:** `app/globals.css` (.table-row, .table-header-row classes) — Add hover effects, column resizing

### 3. **Drawer/Modal UX** 🎯
- **Primary:** `components/section-block.tsx` + `components/field-grid.tsx` — Improve spacing, add validation UI
- **Secondary:** `components/ui/admin-drawer.tsx` — Add close button, keyboard shortcuts, scroll behavior
- **Tertiary:** `app/orders/orders-client.tsx` (drawer content) — Reorganize sections, add more actions

### 4. **Styling Consistency** 🎨
- **Primary:** `app/globals.css` — Update all CSS variables, add .admin-form-group classes, standardize spacing
- **Secondary:** `tailwind.config.js` — Define color palette as source of truth

### 5. **Dashboard Polish** ✨
- **Primary:** `app/page.tsx` — Refactor metric cards, improve chart layout, add loading states
- **Secondary:** `components/DashboardCharts.tsx` — Options for legends, tooltips, responsive sizing
- **Tertiary:** `app/globals.css` (.metric-card classes) — Add animations, better dark mode support

---

## File Dependencies Quick Reference
```
pages (orders/products/settings/page.tsx)
  └─> page-client.tsx
      ├─> components/admin-page-header.tsx
      ├─> components/section-block.tsx
      ├─> components/field-grid.tsx
      ├─> components/ui/status-badge.tsx
      ├─> components/ui/admin-drawer.tsx
      └─> lib/format.ts

app/globals.css (imported by all)
  ├─> CSS variables (colors, shadows, spacing)
  ├─> .admin-page-header, .field-grid, .section-block classes
  ├─> .table-row, .table-header-row classes
  ├─> Form input styling (.admin-input, .form-group)
  └─> Utility classes (.admin-gap, .text-sm, etc.)
```
