# 🎨 DEER DRONE — Premium Minimal Production Design System

## Design Philosophy

**Technical Luxury meets Minimal Sophistication** — Clean, spacious, and purposeful. Every element serves a function, every color has meaning, every interaction is smooth.

### Core Principles

- **Minimalism First** — Remove decorative elements, keep only what matters
- **Premium Typography** — Clear hierarchy, generous spacing, optimal readability
- **Subtle Animations** — Smooth transitions for functional feedback, not distraction
- **Trust-Building UI** — Professional, accessible, transparent
- **Mobile-First** — Responsive design that works beautifully at any scale

---

## Color Palette

### Primary Colors

| Token            | Value   | Usage                                         |
| ---------------- | ------- | --------------------------------------------- |
| `--blue-primary` | #2563EB | Primary CTAs, focus states, important actions |
| `--blue-dark`    | #1D4ED8 | Hover states, active states                   |
| `--blue-light`   | #3B82F6 | Disabled states, secondary accents            |

### Semantic Colors

| Token     | Value   | Usage                                    |
| --------- | ------- | ---------------------------------------- |
| `--cyan`  | #06B6D4 | Secondary accent, chatbot                |
| `--green` | #10B981 | Success, stock available, positive state |
| `--amber` | #F59E0B | Warning, low stock, lease badge          |
| `--red`   | #EF4444 | Danger, error, out of stock              |

### Neutral Scale

| Token              | Value   | Usage                           |
| ------------------ | ------- | ------------------------------- |
| `--text-primary`   | #0F172A | Body text, primary content      |
| `--text-secondary` | #475569 | Secondary text, descriptions    |
| `--text-muted`     | #94A3B8 | Tertiary text, labels, captions |
| `--text-light`     | #F1F5F9 | Text on dark backgrounds        |

### Background Scale

| Token            | Value   | Usage                                  |
| ---------------- | ------- | -------------------------------------- |
| `--bg-primary`   | #FFFFFF | Main page background                   |
| `--bg-secondary` | #F8FAFC | Card backgrounds, alternate sections   |
| `--bg-tertiary`  | #F1F5F9 | Hover states, subtle backgrounds       |
| `--bg-dark`      | #0F172A | Dark hero sections, premium containers |

### Border & Surface

| Token            | Value   | Usage                           |
| ---------------- | ------- | ------------------------------- |
| `--border`       | #E2E8F0 | Card borders, dividers          |
| `--border-light` | #F1F5F9 | Subtle borders, inactive states |
| `--surface`      | #FFFFFF | Base surface color              |
| `--surface-soft` | #F8FAFC | Hover backgrounds               |

---

## Typography System

### Font Stack

- **Display (Hero, H1):** Sora 700 — Bold, distinctive
- **Headings (H2, H3):** Sora 600 — Clear hierarchy
- **Body & UI:** Inter 400/500/600 — Clean, professional
- **Small Text:** Inter 500 — Labels, captions

### Size Scale

| Use          | Size (Desktop) | Size (Mobile) | Weight | Line Height |
| ------------ | -------------- | ------------- | ------ | ----------- |
| Display      | 3.8rem         | 2.2rem        | 700    | 1.1         |
| H1           | 2.8rem         | 1.8rem        | 700    | 1.15        |
| H2           | 2rem           | 1.4rem        | 600    | 1.2         |
| H3           | 1.4rem         | 1.2rem        | 600    | 1.3         |
| Body Large   | 1rem           | 0.95rem       | 400    | 1.6         |
| Body Regular | 0.9rem         | 0.85rem       | 400    | 1.6         |
| Body Small   | 0.8rem         | 0.75rem       | 400    | 1.5         |
| Button       | 0.9rem         | 0.85rem       | 600    | 1           |
| Caption      | 0.75rem        | 0.7rem        | 500    | 1.4         |

---

## Spacing System

All spacing is based on **8px base grid**:

```
4px   = xs   (icon gaps, tight)
8px   = sm   (tight spacing)
12px  = md   (standard compact)
16px  = base (standard)
20px  = lg   (card padding)
24px  = xl   (section spacing)
32px  = 2xl  (large sections)
48px  = 3xl  (layout margins)
64px  = 4xl  (hero padding)
80px  = 5xl  (section gap)
```

---

## Shadow System

Premium shadows with subtle depth:

| Size | Value                                                                            | Usage                   |
| ---- | -------------------------------------------------------------------------------- | ----------------------- |
| XS   | `0 1px 2px 0 rgba(15, 23, 42, 0.05)`                                             | Minimal, subtle         |
| SM   | `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`      | Cards, hover            |
| MD   | `0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`    | Elevated cards          |
| LG   | `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`  | Modals, dropdowns       |
| XL   | `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)` | Premium panels          |
| 2XL  | `0 25px 50px -12px rgba(15, 23, 42, 0.1)`                                        | Hero sections, overlays |

_Note: Never use sharp shadows. All shadows use soft color stops._

---

## Border Radius

Consistent, modern curves:

| Size | Value | Usage                  |
| ---- | ----- | ---------------------- |
| XS   | 4px   | Minimal curvature      |
| SM   | 8px   | Small elements         |
| MD   | 12px  | Buttons, inputs, cards |
| LG   | 16px  | Large cards, panels    |
| XL   | 20px  | Dropdowns, modals      |
| 2XL  | 24px  | Large containers       |
| Full | 999px | Pill buttons, badges   |

---

## Component Library

### Buttons

#### Primary Button (CTA)

```css
/* Blue, full shadow, hover lift */
background: var(--blue-primary);
color: #ffffff;
padding: 12px 24px;
border-radius: var(--radius-lg);
font-weight: 600;
box-shadow: var(--shadow-sm);
transition: all var(--transition-base);
```

**Hover State:** `background: var(--blue-dark)`, `box-shadow: var(--shadow-md)`, `transform: translateY(-1px)`

#### Secondary Button

```css
/* Outline, no shadow */
background: transparent;
border: 1px solid var(--border);
color: var(--text-primary);
padding: 12px 24px;
border-radius: var(--radius-lg);
font-weight: 600;
```

**Hover State:** `border-color: var(--blue-primary)`, `background: var(--surface-hover)`

### Product Cards

#### Card Container

```css
border: 1px solid var(--border);
border-radius: var(--radius-lg);
background: var(--surface);
box-shadow: var(--shadow-xs);
transition: all var(--transition-base) ease;
```

**Hover State:** `transform: translateY(-4px)`, `box-shadow: var(--shadow-lg)`

#### Image Container

- Aspect ratio: 1:1 (square)
- Background: `var(--surface-soft)`
- Padding: 24px
- Hover: Image scales 1.08

#### Card Content

- Padding: 20px
- Title: Sora 600, 1rem, 1.4 line height
- Description: Inter 400, 0.8rem, 2-line clamp
- Price block: Sora 700, 1.2rem

### Input Fields

```css
min-height: 44px;
padding: 12px 16px;
border: 1px solid var(--border);
border-radius: var(--radius-md);
font-size: 0.9rem;
font-family: var(--font-body);
transition: all var(--transition-fast);
```

**Focus State:** `border-color: var(--blue-primary)`, `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1)`

### Headers & Footers

#### Header

- Sticky, blurred background with backdrop filter
- Height: 64px
- Padding: 0 32px
- Border-bottom: 1px solid var(--border)
- Navigation items: Rounded 12px buttons with hover soft background

#### Footer

- Dark background: `var(--bg-dark)`
- Text: `var(--text-light)`
- Generous vertical padding: 64px top/bottom

---

## Animation & Transitions

### Duration Standards

| Speed | Value | Usage                          |
| ----- | ----- | ------------------------------ |
| Fast  | 150ms | Hover feedback, small elements |
| Base  | 250ms | Button clicks, card hover      |
| Slow  | 350ms | Page transitions, image zoom   |

### Easing

- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)` — Default for all transitions
- **Emphasis:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — Image zoom, large movements

### Common Animations

| Animation       | Keyframes              | Usage          |
| --------------- | ---------------------- | -------------- |
| **Lift**        | `translateY(-4px)`     | Card hover     |
| **Subtle Lift** | `translateY(-1px)`     | Button hover   |
| **Scale**       | `scale(1.08)`          | Image hover    |
| **Fade In**     | `opacity: 0 → 1`       | Section reveal |
| **Slide Up**    | `translateY(10px) → 0` | Content entry  |

---

## Page Layouts

### Home Page

1. **Hero Section** — Dark background, 100vh height, centered content
2. **Category Section** — Premium category tabs with selected state
3. **Featured Products** — 4-column grid on desktop, 3 on tablet, 2 on mobile
4. **Why Us Section** — Light background, features with icons
5. **Leasing CTA** — Bold call-to-action section
6. **Testimonials** — Carousel or grid layout
7. **Footer** — Dark background with white text

### Product Listing Page

1. **Header** — Breadcrumbs + title
2. **Search & Filters** — Top filter bar
3. **Product Grid** — Responsive grid with smooth transitions
4. **Pagination** — Load more or pagination buttons

### Product Detail Page

1. **Gallery** — Large product images, 55% width on desktop
2. **Product Info** — 45% width, sticky on desktop
   - Name, category, rating
   - Price, stock status
   - Key specs
   - CTA buttons (Add to Cart, Leasing, Chat)
3. **Related Products** — Carousel at bottom

### Cart Page

1. **Item List** — Full width or left column
2. **Order Summary** — Sticky right sidebar (desktop) or bottom (mobile)
3. **Checkout CTA** — Prominent button at bottom

### Checkout Page

1. **Progress Indicator** — Step-by-step visual
2. **Form Section** — Address, payment method, etc.
3. **Order Summary** — Right panel (desktop) or collapsible (mobile)
4. **Trust Badges** — Secure payment icons at bottom

---

## Responsive Breakpoints

```css
/* Mobile First */
0px     — Base mobile styles
640px   — Tablet (iPad mini)
768px   — Large tablet
1024px  — Desktop
1280px  — Large desktop (--max-width: 1280px)
```

---

## Accessibility Standards

### Color Contrast

- Text on background: Minimum 4.5:1 (AA standard)
- All colors tested with WCAG guidelines
- Blue primary (#2563EB) on white: 5.8:1 ✓

### Touch Targets

- Minimum button/link size: 44px × 44px
- Spacing between targets: 8px minimum
- Mobile inputs: 44px minimum height

### Keyboard Navigation

- All interactive elements: Tab-accessible
- Focus rings: Blue border (var(--blue-primary))
- Focus ring width: 2px offset: 2px

### Semantic HTML

- Use proper heading hierarchy (h1, h2, h3)
- Form labels connected to inputs
- ARIA labels for hidden content
- Skip-to-content link on mobile

---

## Dark Mode (Future Enhancement)

CSS variables support easy dark mode implementation:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --border: #334155;
    /* ... update other variables */
  }
}
```

---

## Production Checklist

Before launch:

- [ ] All text colors meet contrast ratios (4.5:1)
- [ ] All interactive elements are keyboard accessible
- [ ] Buttons have proper focus states
- [ ] Images have alt text
- [ ] Fonts properly loaded (no fallback flash)
- [ ] Animations perform at 60fps
- [ ] Mobile layout tested at 320px width
- [ ] Tablet layout tested at 768px width
- [ ] Desktop layout tested at multiple widths
- [ ] Touch targets are 44px minimum
- [ ] Form validation messages clear and accessible

---

## Implementation Notes

1. **Use CSS Variables** — All colors, spacing, shadows defined in `:root`
2. **Mobile First** — Base styles are mobile, expand for larger screens
3. **No Hardcoded Colors** — Always use `var(--token-name)`
4. **Smooth Transitions** — Use `var(--transition-base)` for standard interactions
5. **Consistent Shadows** — Match shadow depth to elevation level
6. **Typography Scale** — Use `clamp()` for fluid typography between breakpoints
