# Project: Dev Krafters UI/UX Modernization & Bug Remediation

## Architecture
- Framework: Next.js 15.5.22 (App Router, Server Actions, Server & Client Components)
- UI Library: React 19.2.8 + Framer Motion 13.0.0 + Lucide React 0.475.0
- Styling: Tailwind CSS 3.4.17 with CSS custom properties (4 theme systems: Light, Cyber Dark, Warm Copper, Emerald Forest)
- Testing: Playwright E2E + Vitest/Jest unit & integration tests
- Code Boundaries:
  - `src/app/` — Next.js App Router pages and layouts
  - `src/components/` — Shared UI components, modern design primitives, and interactive widgets
  - `src/lib/` — Business logic, sanitization, database adapters, and utilities
  - `src/types/` — Shared TypeScript type declarations

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Hermetic Font Loading | Prevent build crashes in offline/restricted environments by eliminating remote font fetch failures in `src/app/layout.tsx` | M1 | survey (Explorer 1) |
| 2 | ESLint 9 Flat Config | Add `eslint.config.mjs` and configure Next.js flat linter to remove interactive prompt and fix `npm run lint` | M1 | survey (Explorer 1) |
| 3 | Lockfile Root Configuration | Set `outputFileTracingRoot` in `next.config.ts` to silence workspace root warning | M1 | survey (Explorer 1) |
| 4 | Recharts Hydration Fix | Replace module-level `Math.random()` in `src/app/portfolio/templates/pulse.tsx` with deterministic dataset | M1 | survey (Explorer 1) |
| 5 | Valid HTML Nesting | Fix `ShimmerButton` in `src/components/PremiumEffects.tsx` to prevent `<button>` inside `<Link>` | M1 | survey (Explorer 1, 2) |
| 6 | Dead Redirect Cleanup | Remove dead `/winter-internship` redirects in `next.config.ts` and clean up obsolete internship keys | M1 | survey (Explorer 1, 2) |
| 7 | Static Public Assets & Domain Alignment | Create `public/` directory with favicon and og-image; align domains to `devkrafters.com` across robots.ts and sitemap.ts (including all 20 templates) | M1 | survey (Explorer 1, 2) |
| 8 | Fixed Viewport Collision Resolution | Separate `BackToTop` (bottom-24 right-6) from `ChatWidget` (bottom-6 right-6); resolve `ThemeSwitcher` vs `CookieConsent` | M2 | survey (Explorer 1, 2) |
| 9 | Dark Mode Contrast System | Decouple brand primary (`#0F4C4C`) from foreground text in `globals.css` to fix unreadable white-on-white text in dark mode | M2 | survey (Explorer 2) |
| 10 | Canvas Theme Propagation | Remove hardcoded `bg-white text-gray-900` overrides on root page containers in `page.tsx`, `services`, `pricing`, `portfolio` | M2 | survey (Explorer 2) |
| 11 | Admin Layout Isolation | Isolate `/admin` routes so marketing header, footer, and chat widget do not leak into admin 2FA and dashboard | M2 | survey (Explorer 2) |
| 12 | Dual Header Stacking Fix | Fix sticky header offsets between global site header and Learning Hub header | M2 | survey (Explorer 2) |
| 13 | Contact Deep Link Query Ingestion | Ingest `useSearchParams()` (`package`, `service`, `url`, `pages`, `total`) in `contact/page.tsx` and prefill steps | M3 | survey (Explorer 1, 2) |
| 14 | Phone Number Sanitization | Strip spaces from phone numbers prior to generating fallback email to prevent HTTP 400 validation drops | M3 | survey (Explorer 1) |
| 15 | Step Validation Deadlock Resolution | Automatically redirect to Step 1 when phone is missing upon Step 4 submission | M3 | survey (Explorer 2) |
| 16 | Pricing & Timeline Harmonization | Reconcile pricing catalog across Services, Pricing, and Contact (₹5k, ₹9k, ₹25k, ₹75k, ₹3k/mo; 3-10 days) | M3 | survey (Explorer 1, 2) |
| 17 | FAQ Text & Currency Correction | Remove USD ($499), 6-12 weeks, and hourly billing claims from `FAQAccordion.tsx` | M3 | survey (Explorer 1, 2) |
| 18 | Accessible Form Selectors | Add ARIA attributes and keyboard navigation (Tab, Space, Enter) to Contact and Estimator selection cards | M3 | survey (Explorer 2) |
| 19 | Responsive Device Studio Detection | Auto-detect viewport width in `portfolio/[slug]` to default to mobile on small screens | M4 | survey (Explorer 2) |
| 20 | Mockup Fixed Element Containment | Establish containing block (`transform: translateZ(0)` / `contain: paint`) to prevent template navbars escaping frame | M4 | survey (Explorer 2) |
| 21 | Ultra-Realistic Hardware Shells | Build MacBook Pro 16", iPad Pro 11", and iPhone 16 Pro (with floating Dynamic Island) frames in `DeviceFrames.tsx` | M4 | survey (Explorer 3) |
| 22 | Device Studio Inquiry Form Fix | Wire separate name, email (`type="email"`), and phone (`type="tel"`) inputs and fix false-positive error catch | M4 | survey (Explorer 1, 2) |
| 23 | Interactive Dynamic Dock | Implement Apple-style magnification dock in Device Studio (`src/components/InteractiveDock.tsx`) | M4 | survey (Explorer 3) |
| 24 | Magic UI Bento Grid | Replace 4-card value proposition grid on Homepage with asymmetric, interactive Bento Grid (`BentoGrid.tsx`) | M5 | survey (Explorer 3) |
| 25 | Animated SVG Data Flow Beam | Implement `src/components/AnimatedBeam.tsx` showing client-to-code-to-revenue digital delivery pipeline | M5 | survey (Explorer 3) |
| 26 | Dual-Row Infinite Testimonial Marquee | Deploy `MarqueeTestimonials.tsx` with authentic verified client testimonials, ratings, and metrics | M5 | survey (Explorer 2, 3) |
| 27 | 3D CSS Hero Experience Depth | Add inverse contact shadows, specular glass sheen, and stereoscopic Z-depth layers to `HeroExperience.tsx` | M5 | survey (Explorer 3) |
| 28 | Accessible Micro-Interactions | Add `MagneticButton.tsx`, scroll-driven `ScrollProgress.tsx`, and continuous auto-scrolling `ClientLogoMarquee` | M5 | survey (Explorer 3) |
| 29 | Comprehensive E2E Test Suite | End-to-end verification covering all routes, device studio, forms, theme toggling, and accessibility | M6 | survey (Top-Level) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Codebase Stability & Hydration Fixes | Font loading, ESLint 9 flat config, lockfile root, Recharts hydration, HTML nesting, dead redirects, public assets | none | DONE |
| M2 | Global Layout & Theme Contrast Architecture | Viewport collision fixes, dark theme contrast fix, root canvas theme propagation, admin layout isolation, header stacking | M1 | DONE |
| M3 | Conversion Funnel & Form Accessibility | Query string ingestion in contact, phone number sanitization, step validation flow, pricing harmonization, FAQ copy, accessible selectors | M1 | DONE |
| M4 | Interactive Device Studio & Hardware Frames | Auto-responsive mode, mockup containment block, MacBook/iPad/iPhone shells, inquiry form fix, interactive dock | M1, M2 | DONE |
| M5 | Modern Design Engineering Upgrades | Bento Grid, Animated Beam, Dual-Row Marquee, 3D Hero depth, Magnetic buttons, ScrollProgress | M1, M2 | DONE |
| M6 | Final Verification & E2E Test Suite Pass | 100% E2E test pass across all tiers, adversarial coverage audit, forensic integrity verification | M1, M2, M3, M4, M5 | DONE |

## Interface Contracts
### Theme System ↔ UI Components
- Brand Primary: `--color-brand: #0F4C4C` (constant across themes).
- Surface Background: `--color-bg` (Light: `#FFFFFF`, Dark: `#090D16`, Copper: `#1F110B`, Emerald: `#022C22`).
- Text Primary: `--color-text` (Light: `#0F172A`, Dark: `#F8FAFC`).
- Text Muted: `--color-text-muted` (Light: `#5C6B6B`, Dark: `#94A3B8`).
- Components using `bg-primary text-white` must use `bg-brand text-white` or semantic `bg-surface text-primary`.

### Navigation / Routing ↔ Contact Funnel
- Deep-link URL parameters accepted by `/contact`:
  - `package`: string (`starter-page` | `landing-page` | `business-website` | `ecommerce` | `maintenance`)
  - `service`: string (`custom-web-dev` | `landing-page-opt` | `ecommerce-dev` | `web-app-saas` | `ui-ux-design`)
  - `url`: string (encoded website URL from HealthCheck)
  - `pages`: string (custom page count from Estimator)
  - `total`: string (estimated total budget)

### Device Studio ↔ Template Components
- Container frame wraps template in `<div style={{ transform: 'translateZ(0)', contain: 'paint' }}>` to scope CSS `position: fixed` to frame.
- Device mode types: `'desktop'` | `'tablet'` | `'mobile'`.

## Code Layout
- `src/app/`
  - `layout.tsx`: Root layout, hermetic fonts, theme provider, scroll progress
  - `page.tsx`: Homepage with Bento Grid, Marquee, HeroExperience
  - `contact/page.tsx`: Multi-step configurator with searchParams ingestion
  - `portfolio/[slug]/page.tsx`: Interactive Device Studio
  - `admin/`: Isolated admin portal
- `src/components/`
  - `DeviceFrames.tsx`: MacBook, iPad, iPhone 16 Pro realistic shells
  - `BentoGrid.tsx`: Asymmetric responsive Bento Grid
  - `AnimatedBeam.tsx`: SVG animated pipeline beam
  - `MarqueeTestimonials.tsx`: Dual-row continuous marquee
  - `InteractiveDock.tsx`: Apple-style magnification dock
  - `MagneticButton.tsx`: Magnetic cursor attraction button
  - `ScrollProgress.tsx`: Top scroll progress bar
  - `ChatWidget.tsx` & `BackToTop.tsx`: Coordinated fixed viewport anchors
