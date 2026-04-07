/\*\*

- Phase 4: Final QA Testing Checklist
- Date: April 8, 2026
- Target: Production-ready state
  \*/

export const QA_CHECKLIST = {
// 1. FUNCTIONAL TESTING
functional: [
{
area: "Product Listing Page",
tests: [
"Products load correctly with images",
"Product cards display all required info (name, price, brand)",
"Search functionality works and filters results",
"Category filters work correctly",
"Price range filter works",
"Sort options work (price, name, newest)",
"Pagination or infinite scroll works",
"Add to cart button works from listing",
"Product links navigate to detail page",
],
status: "pending",
},
{
area: "Product Detail Page",
tests: [
"Product image and gallery load correctly",
"Product details display fully (specs, description, drone type)",
"Price displays correctly with appropriate formatting",
"Stock status updates correctly",
"Quantity selector works (min/max bounds)",
"Add to cart functionality works",
"Add to comparison works (if implemented)",
"Related products display correctly",
"Breadcrumb navigation works",
],
status: "pending",
},
{
area: "Shopping Cart",
tests: [
"Items add to cart correctly",
"Cart count badge updates in header",
"Cart displays all items with correct details",
"Quantity can be updated in cart",
"Items can be removed from cart",
"Subtotal calculates correctly",
"Free shipping threshold (500k) applies correctly",
"Discount code DEER5 applies -5% discount",
"Total updates correctly with shipping/discount",
"Can proceed to checkout",
],
status: "pending",
},
{
area: "Checkout Flow",
tests: [
"Step 1: Contact info form validates and saves",
"Step 2: Shipping address form validates and saves",
"Step 2: Shipping method selection works (UB/Rural prices)",
"Step 3: Payment method selection works (QPay/Bank)",
"Step 4: Order review displays all info correctly",
"Step 4: Edit buttons return to correct step",
"Order submission completes",
"Order confirmation page displays correctly",
"Order confirmation shows QR code (QPay) or bank details",
"Order can be viewed in account history",
],
status: "pending",
},
{
area: "Header Navigation",
tests: [
"Logo/home link works from all pages",
"Desktop navigation works on large screens",
"Mobile menu opens/closes correctly",
"Mobile menu navigation works",
"Search overlay opens/closes",
"Search functionality works",
"Cart icon shows correct count",
"Account link navigates correctly (logged in = account, not logged in = login)",
"Sticky header behavior works on scroll",
"Header styling changes on scroll",
],
status: "pending",
},
{
area: "Footer",
tests: [
"Footer displays on all pages",
"Footer links navigate correctly",
"Social media icons display and link correctly",
"Company info displays correctly",
"Copyright year updates automatically",
"Footer styling consistent across pages",
],
status: "pending",
},
],

// 2. RESPONSIVE DESIGN
responsive: [
{
breakpoint: "Mobile (320px - 767px)",
tests: [
"Layout reflows correctly",
"Touch targets are 44x44px minimum",
"Mobile menu hamburger works",
"Images scale properly",
"Text is readable without horizontal scroll",
"Forms are usable on mobile",
"Buttons are easily tappable",
],
status: "pending",
},
{
breakpoint: "Tablet (768px - 1023px)",
tests: [
"Layout uses appropriate spacing",
"Navigation works as expected",
"Two-column layouts work",
"Images maintain aspect ratio",
],
status: "pending",
},
{
breakpoint: "Desktop (1024px+)",
tests: [
"Full layout displays correctly",
"Desktop navigation visible",
"Multi-column layouts work",
"Sticky header works",
"Hover effects visible",
],
status: "pending",
},
],

// 3. BROWSER COMPATIBILITY
browsers: [
{
browser: "Chrome (Latest)",
versions: ["Latest"],
status: "pending",
notes: "Primary development browser",
},
{
browser: "Firefox (Latest)",
versions: ["Latest"],
status: "pending",
notes: "Critical compatibility check",
},
{
browser: "Safari (Latest)",
versions: ["Latest"],
status: "pending",
notes: "iOS and macOS support",
},
{
browser: "Edge (Latest)",
versions: ["Latest"],
status: "pending",
notes: "Windows users",
},
{
browser: "Mobile Safari (iOS)",
versions: ["14+"],
status: "pending",
notes: "iPhone/iPad support",
},
{
browser: "Chrome Mobile",
versions: ["Latest"],
status: "pending",
notes: "Android support",
},
],

// 4. ACCESSIBILITY
accessibility: [
{
category: "Keyboard Navigation",
tests: [
"Tab key navigates through all interactive elements",
"Tab order is logical (left to right, top to bottom)",
"Focus indicators are visible (3px minimum)",
"Escape closes modals and menus",
"Enter activates buttons and links",
],
status: "pending",
},
{
category: "Screen Reader",
tests: [
"Page structure is semantic (h1, h2, landmarks)",
"Form labels are associated with inputs",
"Buttons have descriptive text or aria-label",
"Icons have aria-labels or title attributes",
"Lists are semantically correct",
"Link text is descriptive",
],
status: "pending",
},
{
category: "Color & Contrast",
tests: [
"Text contrast meets WCAG AAA (7:1 normal, 4.5:1 large)",
"Color not used as sole indicator",
"Focus indicators have 3:1 contrast",
],
status: "pending",
},
{
category: "Motion & Animation",
tests: [
"Animations respect prefers-reduced-motion",
"No autoplaying audio/video without user control",
"Animations don't cause motion sickness (< 3 flashes/sec)",
],
status: "pending",
},
],

// 5. PERFORMANCE
performance: [
{
metric: "Largest Contentful Paint (LCP)",
target: "< 2.5s",
status: "pending",
notes: "Run with Chrome DevTools Lighthouse",
},
{
metric: "First Input Delay (FID)",
target: "< 100ms",
status: "pending",
},
{
metric: "Cumulative Layout Shift (CLS)",
target: "< 0.1",
status: "pending",
},
{
metric: "First Contentful Paint (FCP)",
target: "< 1.8s",
status: "pending",
},
{
metric: "Bundle Size",
target: "< 200kb gzipped",
status: "pending",
notes: "Check with next/bundle-analyzer",
},
{
metric: "Images compressed",
target: "Modern formats (webp/avif)",
status: "pending",
notes: "Verify with Chrome DevTools",
},
],

// 6. SECURITY
security: [
{
test: "HTTPS enabled in production",
status: "pending",
notes: "Verify SSL certificate is valid",
},
{
test: "No sensitive data in localStorage",
status: "pending",
notes: "Only store auth tokens securely",
},
{
test: "Environment variables not exposed",
status: "pending",
notes: "Check build output for .env content",
},
{
test: "CSRF protection on forms",
status: "pending",
notes: "Verify anti-CSRF tokens on POST requests",
},
{
test: "XSS protection",
status: "pending",
notes: "Check for proper input sanitization",
},
],

// 7. USER FLOWS
user_flows: [
{
flow: "Guest Checkout",
steps: [
"Browse products",
"Add item to cart",
"Go to checkout",
"Enter contact info (not logged in)",
"Enter shipping address",
"Select shipping method",
"Select payment method",
"Review order",
"Complete payment",
],
status: "pending",
},
{
flow: "Registered User Checkout",
steps: [
"Login to account",
"Browse products",
"Add items to cart",
"Go to checkout",
"Auto-filled contact info",
"Select saved address or enter new",
"Select shipping method",
"Select payment method",
"Review order",
"Complete payment",
],
status: "pending",
},
{
flow: "Apply Discount Code",
steps: [
"Add items to cart",
"Subtotal < 500k (no free shipping)",
"Enter discount code DEER5",
"Verify 5% discount applied",
"Subtotal updates with discount",
"Proceed to checkout",
],
status: "pending",
},
],

// 8. ERROR HANDLING
error_handling: [
{
scenario: "Network error during product load",
expected: "Show error message with retry button",
status: "pending",
},
{
scenario: "Failed checkout submission",
expected: "Display error and allow retry",
status: "pending",
},
{
scenario: "Invalid form input",
expected: "Show field-level error messages",
status: "pending",
},
{
scenario: "Product out of stock",
expected: "Disable add to cart button",
status: "pending",
},
{
scenario: "Invalid discount code",
expected: "Show error message, don't apply discount",
status: "pending",
},
],
};

/\*\*

- Testing Tools Recommendations
  \*/
  export const TESTING_TOOLS = {
  accessibility: {
  "axe DevTools": "https://www.deque.com/axe/devtools/",
  "WAVE": "https://wave.webaim.org/",
  "Lighthouse": "Built into Chrome DevTools",
  },
  performance: {
  "Lighthouse": "Chrome DevTools > Lighthouse tab",
  "WebPageTest": "https://www.webpagetest.org/",
  "GTmetrix": "https://gtmetrix.com/",
  },
  browser_testing: {
  "BrowserStack": "https://www.browserstack.com/",
  "Sauce Labs": "https://saucelabs.com/",
  "Local testing": "Chrome, Firefox, Safari, Edge",
  },
  automated_testing: {
  "Playwright": "E2E testing framework",
  "Cypress": "E2E testing alternative",
  "Jest": "Unit testing (already configured)",
  },
  };

/\*\*

- Release Checklist Before Going Live
  \*/
  export const RELEASE_CHECKLIST = [
  { task: "All QA items marked as 'pass'", completed: false },
  { task: "Zero console errors in production build", completed: false },
  { task: "Zero console warnings", completed: false },
  { task: "Lighthouse score > 90 on all metrics", completed: false },
  { task: "Mobile and desktop tested", completed: false },
  { task: "All major browsers tested", completed: false },
  { task: "Payment gateway tested (test mode)", completed: false },
  { task: "Email notifications tested", completed: false },
  { task: "Analytics tracking verified", completed: false },
  { task: "SEO meta tags verified", completed: false },
  { task: "404 page works correctly", completed: false },
  { task: "Error pages display correctly", completed: false },
  { task: "SSL certificate installed", completed: false },
  { task: "Domain DNS configured", completed: false },
  { task: "Database backups configured", completed: false },
  { task: "Monitoring/error tracking set up", completed: false },
  { task: "Privacy policy and T&C linked in footer", completed: false },
  { task: "Contact/support info available", completed: false },
  ];
