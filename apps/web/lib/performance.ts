/**
 * Performance Optimization Checklist & Guidelines
 * Target metrics:
 * - Largest Contentful Paint (LCP): < 2.5s
 * - First Input Delay (FID): < 100ms
 * - Cumulative Layout Shift (CLS): < 0.1
 * - First Contentful Paint (FCP): < 1.8s
 */

export const PERFORMANCE_TARGETS = {
  LCP: {
    target: 2500, // milliseconds
    rating: "Good",
  },
  FID: {
    target: 100, // milliseconds
    rating: "Good",
  },
  CLS: {
    target: 0.1,
    rating: "Good",
  },
  FCP: {
    target: 1800, // milliseconds
    rating: "Good",
  },
};

/**
 * Image Optimization Guidelines
 */
export const IMAGE_OPTIMIZATION = {
  formats: ["webp", "jpg", "png"], // Use webp as primary with fallbacks
  sizes: {
    thumbnail: 100,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920,
  },
  quality: {
    webp: 80, // 80% quality for webp (80% quality = 90% visual quality)
    jpg: 85, // 85% quality for jpeg
    png: "lossless", // PNG should be lossless
  },
  lazy_loading: "eager", // For above-fold images, use "eager"; below-fold use "lazy"
  next_image_configs: {
    priority: "false", // Set to true for LCP image only
    placeholder: "blur", // Use blur placeholder for better perceived performance
    width: 600, // Responsive image width
    height: 600,
  },
};

/**
 * Font Optimization
 */
export const FONT_OPTIMIZATION = {
  family: {
    heading: "Sora",
    body: "Inter",
  },
  loading_strategy: "swap", // font-display: swap for better performance
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  recommendation: "Preload critical font weights with <link rel='preload'>",
};

/**
 * JavaScript Bundle Analysis
 *
 * Estimated bundle sizes (gzipped):
 * - Core framework (Next.js): ~40kb
 * - React: ~42kb
 * - UI components: ~15kb
 * - Framer Motion: ~30kb (used on limited pages)
 * - Zustand: ~2kb
 * - Lucide icons: ~5kb (tree-shakeable)
 * - Supabase client: ~20kb
 * ────────────────────────
 * Total estimated: ~154kb gzipped
 *
 * Optimization opportunities:
 * 1. Code-split Framer Motion (only load on cart/checkout)
 * 2. Tree-shake unused Lucide icons
 * 3. Defer non-critical components with React.lazy()
 */

export const BUNDLE_ANALYSIS = {
  critical_dependencies: [
    { name: "next.js", size_kb: 40, notes: "Framework - required" },
    { name: "react", size_kb: 42, notes: "Framework - required" },
    {
      name: "framer-motion",
      size_kb: 30,
      notes: "Animations - can code-split",
    },
    { name: "supabase-js", size_kb: 20, notes: "Auth/DB - required" },
  ],
  optimization_checklist: [
    {
      item: "Dynamic imports for heavy components",
      status: "todo",
      priority: "high",
      notes: "Use React.lazy() for checkout form, product carousel, etc.",
    },
    {
      item: "Remove unused CSS",
      status: "todo",
      priority: "medium",
      notes: "Remove Bootstrap references from production build",
    },
    {
      item: "Offline support (Service Worker)",
      status: "todo",
      priority: "low",
      notes: "Add PWA support for better mobile performance",
    },
    {
      item: "API response caching",
      status: "todo",
      priority: "high",
      notes: "Cache product listings, categories on client",
    },
    {
      item: "Image optimization with Next.js Image",
      status: "done",
      priority: "high",
      notes: "Using next/image for all product images",
    },
    {
      item: "Font loading optimization",
      status: "todo",
      priority: "medium",
      notes: "Preload critical fonts (Sora, Inter)",
    },
  ],
};

/**
 * Core Web Vitals Monitoring
 *
 * Utilities to measure real-world performance:
 */

interface WebVital {
  name: string;
  value: number;
  rating: "good" | "poor" | "needs-improvement";
}

export function reportWebVital(metric: WebVital): void {
  // In production, send to analytics service
  if (typeof window !== "undefined") {
    if ("sendBeacon" in navigator) {
      const body = JSON.stringify(metric);
      navigator.sendBeacon("/api/analytics/web-vitals", body);
    }
  }
}

export function getWebVitalRating(
  metric: string,
  value: number,
): "good" | "poor" | "needs-improvement" {
  const thresholds: Record<string, { good: number; needsImprovement: number }> =
    {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
    };

  const threshold = thresholds[metric];
  if (!threshold) return "poor";

  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Lazy Loading Strategy
 *
 * Components that should be lazy-loaded:
 * 1. Checkout form (only needed on /checkout page)
 * 2. Product comparison tool (only on comparison view)
 * 3. Chat widget (load after initial page render)
 * 4. Heavy carousels (load with intersection observer)
 */

export const LAZY_LOAD_COMPONENTS = [
  {
    component: "CheckoutForm",
    route: "/checkout",
    impact: "Saves ~40kb on product pages",
  },
  {
    component: "ProductCarousel",
    route: "/products",
    impact: "Animate-heavy, load with intersection observer",
  },
  {
    component: "ChatbotWidget",
    route: "/*",
    impact: "Load after 3s delay and idle callback",
  },
];

/**
 * Cache Strategy
 */
export const CACHE_STRATEGY = {
  static_assets: {
    duration: "1 year",
    policy: "immutable",
    examples: ["CSS", "JS bundles", "fonts"],
  },
  images: {
    duration: "1 month",
    policy: "public",
    examples: ["Product images", "logos", "icons"],
  },
  api_responses: {
    products_list: {
      duration: "5 minutes",
      strategy: "stale-while-revalidate",
    },
    product_detail: {
      duration: "10 minutes",
      strategy: "stale-while-revalidate",
    },
    user_data: {
      duration: "session",
      strategy: "no-cache",
    },
  },
};

/**
 * Next.js Configuration Recommendations
 */
export const NEXT_CONFIG_RECOMMENDATIONS = {
  swcMinify: true, // Minify with SWC (faster than Terser)
  productionBrowserSourceMaps: false, // Disable source maps in production
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  images: {
    formats: ["image/avif", "image/webp"], // Modern formats first
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for versioned images
  },
};
