# AfixZ — Developer Handoff Spec

> Public-facing app only. Admin CMS and Provider dashboard excluded.

---

## 1. Overview

AfixZ = local home services marketplace (India: Delhi, Noida, Gurgaon). Users browse services, filter by location/category, add to cart, checkout with address + time slot, and manage subscriptions for recurring garden care.

**Tech stack:** React 18 + Vite + Tailwind CSS v4 + Firebase (Auth + Firestore) + Vercel hosting + Vercel Cron

**Target audience:** Indian homeowners, 25-45, booking doorstep services (gardening, mechanic, interior, fabrication)

---

## 2. Design Tokens

All tokens defined in `src/index.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1f2933` | Dark text, buttons, nav, headings |
| `--color-primary-hover` | `#323f4b` | Primary button hover state |
| `--color-secondary` | `#475569` | Secondary text |
| `--color-background` | `#f9fafb` | Page backgrounds |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-accent` | `#f36b21` | CTA buttons, price text, active states, brand orange |
| `--color-accent-hover` | `#e85d0f` | Accent button hover |
| `--color-accent-light` | `#ffb37d` | Star ratings, subtle orange accents |
| `--gradient-accent` | `linear-gradient(135deg, #f36b21, #e85d0f)` | Gradient backgrounds (sparingly used) |
| `--font-sans` | `Roboto Condensed` | Body text, labels, small UI |
| `--font-heading` | `Raleway` | H1-H4, card titles, bold headings |
| `--font-display` | `Cormorant Garamond` | Section subtitles (italic, editorial feel) |

### Font Weight Rules (global CSS)
- `h1-h4`: `font-weight: 600` (via `font-heading`)
- `p`: `font-weight: 400`
- Body: `Roboto Condensed`, system-ui fallback

### Utility Classes (custom)
| Class | Purpose |
|-------|---------|
| `.text-accent` | Orange text (`--color-accent`) |
| `.bg-accent` | Orange background |
| `.bg-accent-gradient` | Gradient background |
| `.scrollbar-hide` | Hides scrollbar (horizontal scroll containers) |
| `.plan-card-enter` | Subscription plan card entrance animation (translateY + opacity, 0.5s) |

---

## 3. Global Layout

### Navbar (`src/components/common/Navbar.tsx`)
- **Position:** `fixed top-0`, `z-50`, full-width
- **Height:** `h-20` (80px)
- **Scroll behavior:** Transparent → `bg-white/90 backdrop-blur-md shadow-sm` on scroll (> 20px)
- **Contents (desktop):**
  - Logo (left) — `h-16`, `mix-blend-multiply`, hover `scale-[1.02]`
  - Search bar (center) — `max-w-xl`, debounced Firestore search (300ms), dropdown results w/ images
  - Location picker button — pill shape, `MapPin` icon, opens modal
  - Nav links: Home, Our Plans (`/garden-care`), Blogs
  - Cart icon (badge count), Profile icon
- **Mobile (`md:` breakpoint):** Hamburger menu, search hidden, full-width drawer with buttons
- **Active link:** `text-accent` class

| Element | State | Behavior |
|---------|-------|----------|
| Nav container | Default | `bg-white` |
| Nav container | Scrolled (>20px) | `bg-white/90 backdrop-blur-md shadow-sm` |
| Search dropdown | Typing (≥2 chars) | Shows dropdown with service results (image + title + price) |
| Search dropdown | Loading | "Searching..." text |
| Search dropdown | No results | "No services found" text |
| Mobile menu | Open | Slide-down drawer with location, nav buttons |

### Footer (`src/components/common/Footer.tsx`)
- **Background:** `bg-primary` (dark `#1f2933`)
- **Text:** `text-slate-300` / `text-slate-400`
- **Layout:** 4-column grid (`md:grid-cols-4`)
  - Col 1-2: Logo + description + social icons
  - Col 3: Category links (Garden, Mechanic, Interior, Fabrication, Our Plans, Blogs)
  - Col 4: Company links (About, Terms, Privacy, My Account)

### Location Picker Modal (`src/components/common/LocationPickerModal.tsx`)
- **Trigger:** MapPin button in Navbar or Hero
- **Overlay:** `bg-slate-950/35`, `z-[60]`
- **Card:** `max-w-2xl`, `rounded-[32px]`, `shadow-2xl`
- **Options:** 3 cities (Delhi, Noida, Gurgaon) in a `sm:grid-cols-3` grid
- **Selected state:** `border-accent bg-accent/5`
- **Unselected hover:** `-translate-y-0.5`, `border-accent/30`, `shadow-lg`
- **Mobile:** Full-width, bottom-aligned (`items-end`)
- **Close:** Only visible if location already selected (X button top-right)
- **Mandatory:** If no location selected, no close button — forces selection

---

## 4. Pages

### 4.1 Home (`/`)

**File:** `src/pages/Home.tsx`

**Sections (top to bottom):**

1. **Hero** — Split layout with dark left panel + image carousel right
2. **Top Categories** — Horizontal scrollable category chips
3. **Recommended Services** — Grid of featured service cards
4. **Gardening Section** — Grid layout, white bg
5. **Mechanic Section** — List layout, gray bg `#f9fafb`
6. **Interior Section** — Grid layout, white bg
7. **Fabrication Section** — List layout, gray bg

**SEO:** LocalBusiness JSON-LD schema injected via `useLocalBusinessSchema()`

#### Hero Component (`src/components/sections/Hero.tsx`)

| Spec | Value |
|------|-------|
| Container | `max-w-7xl`, `rounded-[2rem]`, border `border-black/[0.06]`, shadow `0_30px_90px_rgba(15,23,42,0.12)` |
| Grid | `lg:grid-cols-[1.08fr_0.92fr]`, min-height `lg:min-h-[560px]` |
| Left panel bg | `#0d1117` (near-black) |
| Left ambient glow | Orange `bg-orange-500/10 blur-3xl`, 280x280px top-left |
| Left dot texture | Radial gradient dots, `opacity-[0.035]`, 18px spacing |
| H1 font size | `clamp(2.65rem, 8vw, 5.1rem)`, `font-extrabold`, `leading-[0.94]`, `tracking-[-0.05em]` |
| H1 max-width | `max-w-[13ch]` (desktop) |
| Description | `text-[14px]`/`sm:text-[15px]`, `text-white/60` |
| CTA button | `bg-orange-500`, `rounded-2xl`, shadow `0_18px_40px_rgba(249,115,22,0.32)` |
| CTA hover | `-translate-y-0.5`, `bg-orange-400`, arrow translates right |
| Trust strip | Border-top `border-white/[0.06]`, items with `CheckCircle` icons, `text-white/35` |
| Location pill | `border-white/10 bg-white/[0.05]`, `text-white/70`, `MapPin` orange |
| Eyebrow | `text-[10px]`, `tracking-[0.28em]`, `text-orange-400`, uppercase |

**Right panel — Image Carousel:**

| Spec | Value |
|------|-------|
| Images | 3 local PNGs (`hero1.png`, `hero2.png`, `hero3.png`) |
| Autoplay | 6500ms interval |
| Transition | `duration-700 ease-out`, opacity + `scale(1 → 1.04)` |
| Overlays | 3 gradient layers (bottom-up dark, radial vignette, left-side shadow) |
| Floating stats | Top-left, `rounded-2xl`, `bg-black/20 backdrop-blur-lg` — "24/7 Booking" + "Same Day" |
| Slide counter | Top-right, `rounded-full`, zero-padded "01 / 03" |
| Bottom card | `rounded-[1.5rem]`, `bg-black/30 backdrop-blur-lg`, caption + description |
| Dots | Active: `h-2 w-10 bg-white`, Inactive: `h-2 w-2 bg-white/35` |
| Arrows | `h-9 w-9`/`sm:h-10 sm:w-10`, `rounded-full`, `bg-black/20 backdrop-blur-lg` |
| First image | `loading="eager"`, `fetchPriority="high"` |
| Others | `loading="lazy"` |

#### Top Categories Section

| Spec | Value |
|------|-------|
| Layout | Horizontal scroll on mobile, `sm:grid-cols-3 lg:grid-cols-5` on desktop |
| Card size (mobile) | `w-[148px]`, `shrink-0` |
| Card | `rounded-xl`, `border-slate-100`, icon + label + arrow |
| Icon | `h-9 w-9`/`sm:h-10 sm:w-10`, `rounded-lg`, `bg-primary text-white` |
| Hover | `-translate-y-0.5`, `border-primary/20`, `shadow-md shadow-primary/10` |
| Loading | Pulse skeleton with icon + text placeholders |
| Empty | Dashed border message "No categories available" |
| Hidden | Cleaning-category slugs filtered out |

#### Service Category Sections

Two layouts available (`layout` prop):

**Grid layout** (`sm:grid-cols-2 lg:grid-cols-4`):

| Spec | Value |
|------|-------|
| Card radius | `rounded-[24px]` |
| Card shadow | `0_14px_34px_-24px_rgba(31,41,51,0.22)` |
| Image aspect | `aspect-[4/3]` |
| Hover | `-translate-y-1`, `border-[#f36b21]/30`, enhanced shadow |
| Image hover | `scale-105`, 500ms duration |
| Title font | `Raleway`, `text-[15px]`, `font-semibold` |
| Price label | `Roboto Condensed`, `text-[10px]`, uppercase "From" |
| Price value | `Raleway`, `text-xl`, `font-bold`, `text-[#f36b21]` |
| Book button | `bg-[#1f2933]`, `rounded-full`, uppercase, hover `bg-[#323f4b]` |
| Rating badge | Bottom-right of image, `bg-[#1f2933]/85 backdrop-blur`, star icon |
| Accent line | `h-px w-10 bg-[#f36b21]/30` → hover: `w-16 bg-[#f36b21]` |
| No image | Gradient placeholder with "AZ" monogram |

**List layout** (vertical stack):

| Spec | Value |
|------|-------|
| Image | `h-32 w-32`/`sm:h-36 sm:w-36`, left side |
| Content | Right side, flex column between title and price row |
| Short description | `line-clamp-1`, `text-[#1f2933]/55` |

**Section header:**

| Element | Font | Style |
|---------|------|-------|
| Subtitle | `Cormorant Garamond`, `text-xl italic`, `text-[#f36b21]` |
| Category label | `Roboto Condensed`, `text-[11px]`, uppercase, `tracking-[0.22em]` |
| Section title | `Raleway`, `text-2xl sm:text-3xl`, `font-bold` |
| CTA link | Pill shape, `border-[#1f2933]/12`, uppercase, hover orange |

---

### 4.2 Services Page (`/services`)

**File:** `src/pages/ServicesPage.tsx`

| Spec | Value |
|------|-------|
| Max width | `max-w-6xl` |
| H1 | `text-2xl font-bold`, "All Services" |
| Grid | `sm:grid-cols-2 lg:grid-cols-3`, gap `20px` |

**Filter bar:**
- Search input: `rounded-xl`, `bg-slate-50`, focus ring `#f36b21`
- Sort dropdown: Recommended / Price Low→High / Price High→Low
- Category chips: Horizontal scroll, selected = `bg-[#1f2933] text-white` (All) or `bg-[#f36b21] text-white` (category)
- Clear filters button: Underlined text link
- Result count shown when filters active

**Service card (simpler than homepage):**

| Spec | Value |
|------|-------|
| Image aspect | `aspect-[16/10]` |
| Card radius | `rounded-xl` |
| Hover | `-translate-y-0.5`, `border-slate-300`, `shadow-lg` |
| Title | `text-sm font-semibold` |
| Price | `text-base font-bold text-accent` |
| No image | Gradient `from-primary/10 to-primary/5` with "afixz" text |

**States:**
- Loading: 6 skeleton cards (pulse animation)
- Error: Red border card with error message
- Empty: Icon + "No services found" + optional clear filters button

---

### 4.3 Category Services (`/category/:categorySlug`)

**File:** `src/pages/CategoryServices.tsx`

Same grid layout as ServicesPage. Additional features:
- Price range filter (min/max inputs)
- Sort options: price-asc, price-desc
- Mobile filter drawer (`showMobileFilters` toggle)
- Category-specific SEO meta tags and breadcrumbs
- Category labels/descriptions mapping for known slugs

---

### 4.4 Service Detail (`/services/:slug`)

**File:** `src/pages/ServiceDetail.tsx`

**Layout:** Two-column on desktop (service info left, booking card right)

**Components:**
- `ServiceGalleryCard` — Image gallery/carousel
- `ServiceOverviewCard` — Title, description, features
- `ServiceFAQCard` — Accordion FAQ
- `AddToCartBlock` — Price + add-to-cart CTA

**SEO:** Service JSON-LD schema + BreadcrumbList schema

---

### 4.5 Cart (`/cart`)

**File:** `src/pages/Cart.tsx` (protected route)

| Spec | Value |
|------|-------|
| Layout | `lg:grid-cols-[1fr_360px]` — items left, summary right |
| Auth required | Triggers login modal if not signed in |
| Location mismatch | Warning if cart items from different location |
| Empty state | ShoppingBag icon + "Your cart is empty" |
| Loading | Skeleton with 2 item placeholders + summary box |

---

### 4.6 Checkout (`/checkout`)

**File:** `src/pages/Checkout.tsx` (protected route)

**Form fields:**
- Name, Phone, House/Flat, Area/Street, City, Pincode, Landmark (optional), Full Address (textarea)
- Date picker, Time slot dropdown (10:00 AM default, options: 10AM/11AM/12PM/2PM/4PM)
- Payment: Cash on Delivery only

**On submit:** Creates Firestore booking(s) via `writeBatch`, sends notification, navigates to `/booking-success/:id`

---

### 4.7 Booking Success (`/booking-success/:id`)

**File:** `src/pages/BookingSuccess.tsx` (protected route)

| Spec | Value |
|------|-------|
| Layout | Centered, `max-w-md` |
| Icon | `h-16 w-16`, `bg-emerald-50`, `CheckCircle` emerald |
| Heading | "Booking Confirmed", `text-2xl font-bold` |
| Booking ID | Mono code block + copy button |
| CTAs | "Back to Home" + "View Bookings" |

---

### 4.8 Garden Care Plans (`/garden-care`)

**File:** `src/pages/GardenCarePlans.tsx`

| Spec | Value |
|------|-------|
| Background | `bg-[#f6f6f4]`, ambient orange blur + slate blur |
| Breadcrumb | Home → Services → Garden Subscription |
| Eyebrow | `text-[11px]`, `tracking-[0.28em]`, uppercase, orange |
| H1 | `clamp(3.5rem, 6vw, 6rem)`, `font-semibold`, `leading-[0.92]`, `tracking-[-0.08em]` |
| Stats | 3 cards in grid: "2 Visits/month", "30 Plants covered", "7 Day guarantee" (orange accent) |
| Stat card | `rounded-[1.75rem]`, value `text-5xl font-semibold tracking-[-0.07em]` |

**Plan cards** (3 in `lg:grid-cols-3`):

| Plan | Style |
|------|-------|
| Monthly (Flexible) | Default border, white bg |
| 6 Months (Most Popular) | Orange border, elevated `-translate-y-3 scale-[1.02]`, glow, enhanced shadow |
| Yearly (Best Value) | Orange-100 border, `bg-[#fffaf7]` |

| Card spec | Value |
|-----------|-------|
| Radius | `rounded-[2rem]` |
| Padding | `p-10` |
| Price | `text-6xl font-semibold tracking-[-0.07em]` |
| Subscribe button (Popular) | `bg-orange-500 text-white` |
| Subscribe button (Yearly) | `bg-[#0f1720] text-white` |
| Subscribe button (Monthly) | Outlined, `border-[#0f1720]`, hover fills dark |
| Savings badge | `bg-emerald-50 text-emerald-700`, rounded-full |

**Features grid:** `md:grid-cols-2 xl:grid-cols-3`, `rounded-[1.75rem]` cards with Leaf icon

**Notes section:** `rounded-[2rem]` white card, `md:grid-cols-2`, Check icons in orange circles

**Checkout modal:**
- Overlay: `bg-black/40 backdrop-blur-sm`
- Modal: `max-w-2xl`, `rounded-[2rem]`
- Sticky header + footer
- Schedule section (date + time slot)
- Address form (same fields as Checkout)
- Submit: `bg-orange-500`, "Confirm Subscription"
- Success modal: Check icon, confirmation text, "View Plans" CTA

---

### 4.9 Profile (`/profile`)

**File:** `src/pages/Profile.tsx`

| Spec | Value |
|------|-------|
| Layout | `max-w-5xl`, sidebar tabs (desktop) / dropdown (mobile) |
| Auth required | Shows AuthLogin if not signed in |

**Tabs:**
- Bookings (default) — Paginated booking list with status badges
- Subscriptions — Uses `SubscriptionCard` components
- Profile — Avatar upload (Cloudinary), display name edit, email/phone display
- Addresses — CRUD address list
- Support — Contact info, help text

---

### 4.10 My Subscriptions (`/subscriptions`)

**File:** `src/features/subscriptions/pages/MySubscriptionsPage.tsx` (protected route)

Shows user's subscriptions sorted by status (active → paused → expired → cancelled). Uses `SubscriptionCard` component.

#### SubscriptionCard (`src/features/subscriptions/components/SubscriptionCard.tsx`)

| Spec | Value |
|------|-------|
| Container | `rounded-xl border bg-white` |
| Active | `border-slate-200` |
| Paused | `border-amber-200` |
| Inactive | `border-slate-100 opacity-60` |
| Icon | `Leaf`, 9x9 rounded-lg box, color matches status |
| Title | "Garden Care — {planName}" |
| Meta row | Location + date range + preferred time, with icons |
| Actions | Pause/Resume + Cancel (with confirm dialog) |
| Busy state | `Loader2` spinner |
| Cancel confirm | "Are you sure?" + "Yes, cancel" (red) + "No" |

**Status badges:**

| Status | Style |
|--------|-------|
| Active | `bg-emerald-50 text-emerald-700` |
| Paused | `bg-amber-50 text-amber-700` |
| Cancelled | `bg-slate-100 text-slate-500` |
| Expired | `bg-slate-100 text-slate-500` |

---

### 4.11 Blogs (`/blogs`)

**File:** `src/pages/BlogsPage.tsx`

- Paginated (12 per page, batch 24)
- Category filter chips
- Search filter
- Blog cards with image, title, date, read time
- Location-aware filtering

### 4.12 Blog Detail (`/blogs/:blogId`)

**File:** `src/pages/BlogDetail.tsx`

- Fetches by slug or doc ID
- Location-aware content resolution
- Related blogs section
- SEO meta tags

---

### 4.13 Static Pages

| Page | Route | File |
|------|-------|------|
| About Us | `/about` | `src/pages/AboutUs.tsx` |
| Privacy Policy | `/privacy` | `src/pages/PrivacyPolicy.tsx` |
| Terms of Service | `/terms` | `src/pages/TermsOfService.tsx` |
| 404 | `*` | `src/pages/NotFound.tsx` |

---

## 5. Authentication

**File:** `src/components/auth/AuthLogin.tsx`

**Methods:**
1. Google Sign-In (popup)
2. Email Magic Link (passwordless)

**Flow:**
- Google: `signInWithPopup` → instant
- Email: Enter email → `sendSignInLinkToEmail` → user clicks email link → auto-completes on return
- Email link callback URL: `VITE_SITE_URL` env var or `window.location.origin`
- Email stored in `localStorage` key `afixz_email_for_signin`

**Error handling:**
- `auth/account-exists-with-different-credential` → suggests alternate method
- `auth/popup-closed-by-user` → silent (user cancelled)

**Protected routes** use `UserProtectedRoute` wrapper → redirects to login if unauthenticated.

---

## 6. Data Flow

### Location Context (`src/context/LocationContext.tsx`)
- Persisted in `localStorage` + Firestore user profile
- Affects: service filtering, content resolution, booking validation
- 3 cities: `delhi`, `noida`, `gurgaon`

### Cart Context (`src/context/CartContext.tsx`)
- Synced to Firestore `users/{uid}/cart` subcollection
- Location-scoped (warns on mismatch)

### Service Cache (`src/lib/serviceCache.ts`)
- In-memory cache with 5-min TTL
- Request deduplication (concurrent fetches share one promise)
- Exports: `getAllServices()`, `getAllCategories()`

### Homepage Content (`src/hooks/useHomepageContent.ts`)
- Fetches from Firestore `config/homepage` doc
- Falls back to `src/lib/homepageFallbackContent.ts` static data

---

## 7. Responsive Breakpoints

Tailwind v4 defaults:

| Breakpoint | Min-width | Key changes |
|------------|-----------|-------------|
| `sm` | 640px | Grid columns increase, larger padding |
| `md` | 768px | Navbar search visible, hamburger hidden |
| `lg` | 1024px | Hero grid side-by-side, nav links visible, full grid layouts |
| `xl` | 1280px | Some grids get extra columns |

**Mobile-first:** All layouts start stacked, expand with breakpoints.

---

## 8. Animation & Motion

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Hero slides | Auto (6.5s) / click | Opacity + scale (1→1.04) | 700ms | `ease-out` |
| Hero CTA | Hover | `-translate-y-0.5` + arrow shift | 300ms | default |
| Hero dots | Active change | Width 2→10, color change | 300ms | default |
| Service cards | Hover | `-translate-y-1` or `-translate-y-0.5` | 300ms | default |
| Service images | Hover | `scale-105` | 500ms | default |
| Accent line (cards) | Hover | `w-10→w-16`, color intensifies | 300ms | default |
| Category chips | Hover | `-translate-y-0.5`, shadow | 200ms | default |
| Plan cards | Mount | `plan-card-enter` keyframe (translateY+opacity) | 500ms | `cubic-bezier(0.16,1,0.3,1)` |
| Navbar | Scroll | Background + shadow transition | 300ms | default |
| Loading skeletons | Always | `animate-pulse` | Tailwind default | — |

---

## 9. Accessibility Notes

**Implemented:**
- `aria-label` on carousel prev/next buttons, slide dots
- `aria-hidden` on inactive carousel slides
- `aria-label` on search inputs, sort select, clear buttons
- Semantic headings (H1 per page, H2 for sections, H3 for cards)
- `loading="lazy"` on below-fold images
- `fetchPriority="high"` on first hero image
- Focus ring on inputs (`focus:ring-2 focus:ring-accent`)

**Gaps to address:**
- No skip-to-content link
- No focus trap on modals (location picker, checkout, login)
- Carousel not keyboard-navigable (no arrow key support)
- Missing `role="dialog"` + `aria-modal` on modals
- Color contrast: `text-white/35` trust items on dark bg may fail WCAG AA
- Touch targets: Some dots/icons under 44x44px minimum

---

## 10. Edge Cases

| Scenario | Behavior |
|----------|----------|
| No location selected | Location picker modal forced (no close button) |
| No services for location | "No services available" empty state |
| Service not available in location | Hidden from results |
| Cart location mismatch | Warning banner shown |
| Empty cart → checkout | Redirects to `/cart` |
| Unauthenticated user | Login modal triggered by `useRequireAuth` |
| Blog not found | Renders `<Navigate>` redirect |
| Firestore offline | Firebase IndexedDB persistence handles reads; writes fail silently or show error |
| Long service title | `line-clamp-2` truncation on cards |
| Missing service image | Gradient placeholder with "AZ" monogram or "afixz" text |
| Subscription paused | Amber border, pause icon, "Resume" button |
| Subscription cancelled/expired | `opacity-60`, no action buttons |

---

## 11. Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase client config | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app | Yes |
| `VITE_SITE_URL` | Canonical URL (e.g. `https://afixz.com`) | No (defaults to `window.location.origin`) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Server-side (Vercel API routes) | Yes (Vercel env) |
| `NOTIFY_API_SECRET` | API route auth token | Yes (Vercel env) |

---

## 12. File Map

| Domain | Files |
|--------|-------|
| **Routing** | `src/App.tsx` |
| **Entry** | `src/index.tsx`, `src/index.css`, `index.html` |
| **Auth** | `src/components/auth/AuthLogin.tsx`, `src/context/AuthContext.tsx`, `src/auth/phone/` |
| **Cart** | `src/pages/Cart.tsx`, `src/pages/Checkout.tsx`, `src/context/CartContext.tsx` |
| **Services** | `src/pages/ServicesPage.tsx`, `src/pages/ServiceDetail.tsx`, `src/pages/CategoryServices.tsx`, `src/lib/services.ts`, `src/lib/serviceCache.ts` |
| **Homepage** | `src/pages/Home.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/TopCategoriesSection.tsx`, `src/components/sections/RecommendedServices.tsx`, `src/components/sections/ServiceCategorySection.tsx` |
| **Subscriptions** | `src/features/subscriptions/` (feature-sliced: pages, components, lib, types, plans) |
| **Blogs** | `src/pages/BlogsPage.tsx`, `src/pages/BlogDetail.tsx`, `src/lib/blogs.ts` |
| **Location** | `src/lib/locations.ts`, `src/context/LocationContext.tsx`, `src/components/common/LocationPickerModal.tsx` |
| **Shared** | `src/components/common/Navbar.tsx`, `src/components/common/Footer.tsx`, `src/hooks/useSeo.ts` |
| **API** | `api/generate-visits.ts`, `api/notify-order.ts`, `api/set-role.ts` |
| **Firebase** | `src/lib/firebase.ts`, `firestore.rules` |
