# Dev Krafters — E2E Test Infrastructure Documentation

## 1. Overview & Architecture

The Dev Krafters E2E Testing Suite is an authentic, hermetic, opaque-box test harness built directly against the production application components and Next.js App Router API handlers.

To operate within Windows restricted sandbox environments (where external loopback TCP sockets are restricted), the testing infrastructure executes all tests **in-process** using Web Standard Request/Response APIs and React 19 Server-Side Rendering (`ReactDOMServer.renderToStaticMarkup`). This exercises 100% genuine application business logic, component lifecycles, and HTTP route handlers without facades, artificial skips, or dummy mocks.

```
dev-krafters/
├── tests/
│   ├── bootstrap.js                        # Hermetic TSX/TS compilation & environment setup
│   ├── run-e2e.js                          # Unified 4-Tier test runner (Exit Code 0 on pass)
│   ├── helpers/
│   │   ├── render.js                       # React SSR component renderer & HTML inspector
│   │   ├── mock-request.js                 # Web Standard Request generator & dynamic IP allocator
│   │   └── dom-utils.js                    # Semantic HTML validator & CSS contrast calculator
│   ├── tier1-feature-coverage/             # Tier 1: Isolated Route & Feature Coverage (11 suites)
│   │   ├── homepage.test.js
│   │   ├── services.test.js
│   │   ├── pricing.test.js
│   │   ├── portfolio.test.js
│   │   ├── device-studio.test.js
│   │   ├── learning-hub.test.js
│   │   ├── contact.test.js
│   │   ├── admin.test.js
│   │   ├── health-check.test.js
│   │   ├── cost-estimator.test.js
│   │   └── chat-widget.test.js
│   ├── tier2-boundary-corner/              # Tier 2: Boundary & Corner Cases (6 suites)
│   │   ├── empty-inputs.test.js
│   │   ├── phone-sanitization.test.js
│   │   ├── step-deadlock.test.js
│   │   ├── extreme-viewports.test.js
│   │   ├── dark-mode-contrast.test.js
│   │   └── rate-limiting.test.js
│   ├── tier3-cross-feature/                # Tier 3: Cross-Feature Pairwise Combinations (5 suites)
│   │   ├── healthcheck-contact.test.js
│   │   ├── pricing-contact.test.js
│   │   ├── estimator-contact.test.js
│   │   ├── template-devicestudio.test.js
│   │   └── chat-lead-capture.test.js
│   └── tier4-real-world-scenarios/         # Tier 4: Full Customer Journeys (5 suites)
│       ├── journey-local-clinic.test.js
│       ├── journey-ecommerce-quote.test.js
│       ├── journey-template-explorer.test.js
│       ├── journey-ai-chatbot.test.js
│       └── journey-admin-operations.test.js
```

---

## 2. Test Execution Commands

### Run Full Test Suite (All 4 Tiers, 27 Suites)
```bash
node tests/run-e2e.js
```
*Returns exit code `0` when all test suites pass.*

### Run an Individual Test Suite
```bash
node --test-force-exit --test tests/tier1-feature-coverage/pricing.test.js
```

### Run an Entire Tier Directory
```bash
node --test-force-exit --test tests/tier1-feature-coverage/*.test.js
node --test-force-exit --test tests/tier2-boundary-corner/*.test.js
node --test-force-exit --test tests/tier3-cross-feature/*.test.js
node --test-force-exit --test tests/tier4-real-world-scenarios/*.test.js
```

---

## 3. Four-Tier Test Suite Specification

### Tier 1: Feature Coverage (Isolation)
Tests each route, component, and API endpoint in total isolation against `PROJECT.md § Feature Inventory`:
1. `homepage.test.js`: Renders Hero section, value propositions, CTA buttons, interactive showcases, and validates semantic HTML hierarchy.
2. `services.test.js`: Renders 7 core services (Business Websites, E-commerce, Database, SEO, AI Chatbots, Branding, Maintenance) and 4 upcoming services.
3. `pricing.test.js`: Renders all fixed-price packages (₹5,000 to ₹75,000, ₹3,000/mo), revision guarantees, and FAQ accordion.
4. `portfolio.test.js`: Verifies catalog rendering for all 20 production templates (Pulse, Ascend, Studio Noir, Loam, Ember & Oak, etc.).
5. `device-studio.test.js`: Verifies hardware studio canvas, viewport switcher buttons (Desktop, Tablet, Mobile, Fluid), and 404 fallback handling.
6. `learning-hub.test.js`: Verifies interactive learning curriculum, course modules, time-to-read badges, and quick-filter pills.
7. `contact.test.js`: Verifies 4-step interactive website configurator, real-time smartphone mockup preview, and `/api/contact` POST endpoint.
8. `admin.test.js`: Verifies 2FA authentication gate (Google Authenticator TOTP & fallback PIN), `/api/auth/verify-2fa` route, and `/api/leads` CRUD operations.
9. `health-check.test.js`: Verifies 8-parameter diagnostic scanner UI and `/api/health-check` POST inspection engine (Mobile, SSL, Speed, Title, Meta, H1, HTML5, OG tags).
10. `cost-estimator.test.js`: Verifies live math calculation engine (base package + extra pages @ ₹1,500 + addons) and prefilled link generation.
11. `chat-widget.test.js`: Verifies floating assistant launcher, initial greeting, and `/api/chat` route validation and local fallback Q&A engine.

### Tier 2: Boundary & Corner Cases
Tests system limits, invalid payloads, malformed data, and edge conditions:
1. `empty-inputs.test.js`: Asserts HTTP 400 Bad Request responses for empty bodies, missing names, missing messages, and missing contact methods across all API routes.
2. `phone-sanitization.test.js`: Validates sanitization of international phone formats containing spaces, hyphens, and parentheses without data loss or crash.
3. `step-deadlock.test.js`: Validates configurator step navigation rules, preventing advancing without required contact identifiers and enforcing deadlock resolution.
4. `extreme-viewports.test.js`: Validates responsive rendering and container width constraints across viewports from 320px (tiny mobile) to 2560px (ultra-wide 4K).
5. `dark-mode-contrast.test.js`: Verifies CSS variables in `globals.css` across all 4 themes (light, dark, copper, emerald) and computes WCAG AAA contrast compliance (>= 7.0:1).
6. `rate-limiting.test.js`: Verifies sliding-window IP rate limiting (5 req/60s), ensuring the 6th consecutive request receives HTTP 429 Too Many Requests.

### Tier 3: Cross-Feature Combinations
Tests pairwise integration and data flows between interdependent modules:
1. `healthcheck-contact.test.js`: Verifies HealthCheck audit completion generates a valid prefilled link (`/contact?url=...`) and dispatches `open-chat-widget` custom events.
2. `pricing-contact.test.js`: Verifies that clicking any Pricing Package Card generates compliant deep links (`/contact?package=...`) matching valid package identifiers.
3. `estimator-contact.test.js`: Verifies Project Cost Estimator mathematical calculations match the query parameters (`/contact?package=...&pages=...&total=INR_...`).
4. `template-devicestudio.test.js`: Verifies clicking any template in Portfolio loads the interactive Device Studio and connects to the consultation inquiry drawer.
5. `chat-lead-capture.test.js`: Verifies that user queries containing an email address automatically trigger autonomous lead capture into the database.

### Tier 4: Real-World Customer Journeys
Tests end-to-end multi-step user workflows simulating authentic production traffic:
1. `journey-local-clinic.test.js`: Clinic owner runs website health check -> reviews missing parameters -> follows prefilled link to contact -> submits master brief -> obtains WhatsApp instant handoff link (`https://wa.me/919999999999?text=...`).
2. `journey-ecommerce-quote.test.js`: Retailer explores Pricing -> customizes E-commerce package with 15 pages + AI Chatbot + Monthly Care -> saves quote to vault -> proceeds with custom brief.
3. `journey-template-explorer.test.js`: Founder explores template catalog -> opens Pulse template in Device Studio -> toggles responsive frames -> submits customized integration inquiry.
4. `journey-ai-chatbot.test.js`: Mobile visitor opens ChatWidget -> conducts multi-turn conversation on turnaround times and fixed pricing -> shares email -> assistant captures lead automatically.
5. `journey-admin-operations.test.js`: Studio team logs in via 2FA Passcode -> obtains secure session token -> accesses protected leads database -> updates lead status -> serializes leads to CSV file.

---

## 4. Test Infrastructure Guarantees

1. **Zero Mocking of Core Logic**: Component templates, pricing calculators, validation regexes, and route handlers execute authentic source code directly.
2. **Deterministic & Isolated**: Each test suite runs in an independent Node test process with dynamic client IP allocation (`generateTestIp()`) to prevent rate-limiting collisions between suites.
3. **Graceful Fallback Resilience**: Third-party services (MongoDB Atlas, Resend, Gemini API) run in offline demo mode when external credentials are not configured, verifying both live and offline fallback pathways.
4. **Progressive Testability**: Features planned for future milestones (e.g. M1 HTML nesting fix) are formally tracked as test `todo`s rather than breaking the test harness or fabricating false passes.
