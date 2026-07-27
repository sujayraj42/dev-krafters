# Dev Krafters — Website Build Spec

Use this as the prompt/context for building the site in Antigravity (Gemini). Stack: React/Next.js + Tailwind CSS, deployed on Vercel.

---

## 1. Brand

**Name:** Dev Krafters
**Tagline:** Affordable AI-powered websites for local businesses.
**One-liner:** A one-person AI-powered web development studio helping small businesses with websites, SEO, AI chatbots, automation, branding, and ongoing support.

**Logo:** Monitor icon with `</>` code brackets on screen + a wrench overlapping bottom-right corner (signifies "we build and fix"). Wordmark "Dev Krafters" set below/beside in the heading font.

---

## 2. Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#0F4C4C` | Headers, nav, body text, footer bg |
| `--color-primary-dark` | `#0A3838` | Hover states, deep backgrounds |
| `--color-accent` | `#E85A3C` | CTA buttons, highlights, links, icons |
| `--color-accent-dark` | `#C94A2F` | Accent hover state |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-alt` | `#F7F9F9` | Alternating section background |
| `--color-text-muted` | `#5C6B6B` | Secondary/body copy on white |

### Typography
- **Headings:** Montserrat (600–800 weight)
- **Body:** Poppins (400–500 weight)
- Both loaded via Google Fonts.
- Suggested scale: H1 48–56px / H2 36px / H3 24px / body 16–18px / caption 14px.

### Layout
- Max content width: 1200px, centered, 24px side padding on mobile.
- Rounded corners on cards/buttons (8–12px radius) to echo the logo's rounded monitor shape.
- Generous whitespace; mobile-first responsive.

---

## 3. Site Map (separate pages)

1. `/` — Home
2. `/services` — Services
3. `/pricing` — Pricing
4. `/portfolio` — Portfolio
5. `/components` — UI Components Showcase
6. `/contact` — Contact

Shared: Nav header (logo + links + "Get a Quote" CTA button), Footer (on every page).

---

## 4. Page-by-Page Content

### Home (`/`)
**Hero**
- Headline: "Websites that work as hard as you do."
- Subheadline: "Dev Krafters builds fast, affordable, AI-powered websites and tools for small businesses — from first sketch to launch and beyond."
- Primary CTA button: "Get a Free Quote" → `/contact`
- Secondary CTA (text link): "See our work" → `/portfolio`

**About / Why Us** (3–4 short value props, icon + short text each)
- Affordable, transparent pricing
- AI-powered speed — sites built faster without cutting corners
- One point of contact, no agency runaround
- Ongoing support & maintenance, not just a handoff

**Testimonials** (placeholder structure — 2–3 cards, swap in real quotes later)
- Quote, client name, business type (e.g. "— Priya S., Salon Owner")

**Footer**
- Logo + one-line tagline
- Nav links repeated
- Social icons (LinkedIn, Instagram, Twitter/X)
- Contact email
- © Dev Krafters, current year

---

### Services (`/services`)
List each with a short description (from handbook):
1. **Business Websites** — Custom-built sites for local businesses, restaurants, clinics, salons, and professionals.
2. **E-commerce** — Online stores with payments, inventory, and order management.
3. **SEO** — Get found on Google with on-page and technical SEO.
4. **AI Chatbots** — Custom AI assistants for customer support and lead capture.
5. **Automation** — Workflow automation (via n8n) to save you hours every week.
6. **Branding** — Logo, colors, and identity that make your business memorable.
7. **Maintenance & Support** — Ongoing updates, fixes, and monitoring.

Each service card: icon, title, 1–2 sentence description, "Learn more" or "Get a quote" link.

---

### Pricing (`/pricing`)
Fixed pricing, with a details/inclusions list per package:

| Package | Price | Included |
|---|---|---|
| **Starter Page** | ₹5,000 | 1 page · Template-based design · Mobile responsive · Contact form · 1 round of revisions · 3-day delivery |
| **Landing Page** | ₹9,000 | Up to 3 sections (Hero, About, Services/Contact) · Custom design · Mobile responsive · Contact form · Basic on-page SEO · 2 rounds of revisions · 5-day delivery |
| **Business Website** | ₹25,000 | 5–8 pages · Custom design · Mobile responsive · Contact form + Google Maps embed · Basic on-page SEO · Google Business Profile setup guidance · 3 rounds of revisions · 10-day delivery · 15 days free post-launch bug fixes |
| **E-commerce Site** | ₹75,000 | Up to 30 products · Payment gateway integration (Razorpay/Stripe) · Cart & checkout · Order management dashboard · Mobile responsive · Basic on-page SEO · 3 rounds of revisions · 20-day delivery · 30 days free post-launch bug fixes |
| **Maintenance** | ₹3,000/mo | Security & dependency updates · Uptime monitoring · Monthly backup · Up to 2 hours of content changes/month · Email support (48h response) |

**Not included (state clearly, separate from the table):** domain registration, hosting costs, premium plugins/themes, copywriting/content creation, stock photo licensing, pages/features beyond what's listed, 3rd-party API usage costs (e.g. AI chatbot usage fees).

- Each package card should have a way to reveal/expand its "Included" list (e.g. accordion or always-visible bullet list under the price — designer's choice, keep it uncluttered)
- CTA button on each card: "Get Started" → `/contact`, with the package name passed along if feasible (e.g. pre-fill the Project Type dropdown on the contact form)

---

### Portfolio (`/portfolio`)
- Grid of project cards: thumbnail image, project name, business type, 1-line result/description, link.
- User has real projects to add — leave this as a clean, reusable `<ProjectCard>` component so real work can be dropped in easily (image, title, category, description, url props).
- Empty/placeholder state text if no projects yet: "New work coming soon — here's what we're building."

---

### Components Showcase (`/components`)
A live, interactive page demonstrating reusable UI components — doubles as a portfolio proof-point ("we build clean UI, see for yourself"). Include:
- **Buttons**: primary (accent fill), secondary (outline), ghost/text — default, hover, disabled states
- **Cards**: basic content card, pricing card, testimonial card
- **Form inputs**: text input, textarea, select, checkbox, radio — with focus states
- **Badges/tags**: status pills (e.g. "New", "Popular", "In Progress")
- **Alerts/toasts**: success, error, info variants
- **Modal/dialog**: a simple "Open modal" button that triggers an overlay dialog
- **Toggle/switch**: on/off UI switch
- **Tabs**: a small working tab component (meta: this page itself can demo the tab pattern)

Each component block should have a short caption/label above it (e.g. "Primary Button", "Alert — Success") so it reads as a living style guide, not just a random assortment.

---

### Contact (`/contact`)
- Short intro: "Tell us about your project — we'll get back within 24 hours."
- Form fields: Name, Email, Phone (optional), Business type (dropdown), Project type (dropdown: Landing page / Business website / E-commerce / Chatbot / Automation / Other), Message
- Submit button: "Send Message" (accent color)
- Below form: direct contact info (email, optionally phone), social links
- Optional: embed a Calendly link/button as an alternative to the form ("Or book a call directly")

---

## 5. Tech Notes
- **Framework:** Next.js (App Router or Pages Router — either is fine for this scope)
- **Styling:** Tailwind CSS, with custom theme colors/fonts mapped to the tokens above in `tailwind.config.js`
- **Fonts:** Import Montserrat + Poppins via `next/font/google`
- **Deployment target:** Vercel
- **Forms:** Contact form can post to a simple API route or a service like Formspree until a backend exists
- **Components:** Build `/components` page components as real, reusable components (not one-off markup) so they're shared with the rest of the site (e.g. the same `<Button>` component used in Hero CTA should appear in the showcase)

---

## 6. Copy Voice Guide
- Plain, direct, active voice — speak to small business owners, not developers.
- Avoid jargon ("headless CMS," "serverless") on customer-facing pages.
- Every CTA describes the actual outcome ("Get a Free Quote," not "Submit").
- Keep sentences short; this audience skims.
