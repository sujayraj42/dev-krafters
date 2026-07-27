# Dev Krafters — AI-Powered Web Development Studio

> **Affordable AI-powered websites and digital tools for local businesses.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-dev--krafters.vercel.app-0F4C4C?style=for-the-badge&logo=vercel)](https://dev-krafters.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

---

## 🌟 Overview

**Dev Krafters** is a modern, high-converting web studio web application designed for small and local businesses (clinics, salons, restaurants, retail shops, and service professionals). 

It combines clean UI engineering with modern AI features — including an **Instant Website Health Check** lead magnet, a **Floating AI Assistant Chatbot** with lead intent capture, transparent fixed-price package cards, and a living **UI Component Style Guide**.

---

## 🚀 Key Features

### 🔍 1. Instant Website Health Check (Lead Magnet)
- **10-Point Scorecard**: Performs server-side HTML audits checking Mobile Responsiveness (`viewport`), SEO Fundamentals (`title`, `meta description`, `h1`), Page Speed Latency Proxy, and Security/DOcTYPE signals.
- **AI Summary**: Powered by Google Gemini (`gemini-2.0-flash`), translating raw technical metrics into 2-3 plain-English, business-focused insights for small business owners.
- **Interactive CTAs**: Connects directly to the floating AI Chatbot or pre-fills project parameters on the Contact form.

### 🤖 2. Floating AI Assistant Chatbot
- **Gemini 2.0 Flash Integration**: Intelligent studio assistant answering inquiries about fixed package pricing, deliverables, timelines, and services.
- **Automatic Lead Capture**: Detects client emails and dispatches immediate notification emails to the site owner via **Resend API**.
- **Resilient Fallback Engine**: If API keys are missing or rate limits are reached, the chatbot seamlessly transitions to a built-in local knowledge engine to ensure 100% uptime for free.

### 💳 3. Transparent Fixed Pricing Packages
- Fixed, transparent pricing cards for **Starter Page** (₹5,000), **Landing Page** (₹9,000), **Business Website** (₹25,000), **E-commerce Site** (₹75,000), and **Maintenance** (₹3,000/mo).
- Interactive collapsible inclusions accordions and explicit "What is Not Included" transparency disclosure.
- Direct CTA routing passing package parameters (`/contact?package=business-website`).

### 🎨 4. Living UI Component Showcase (`/components`)
- An interactive component library demonstrating reusable React components:
  - `<Button>` (Primary, Secondary, Ghost, Loading states)
  - `<Card>` (Default, Highlighted, Alt, Clickable variants)
  - `<Input>`, `<Select>`, `<Textarea>` Form Controls
  - `<Alert>` (Success, Error, Info) & `<Badge>` status pills
  - Accessible `<Modal>` overlay (Backdrop click & `Escape` key close listener)
  - Interactive `<Tabs>` & `<Toggle>` switch elements

### 🛡️ 5. Security & Rate Limiting Guardrails
- **In-Memory Sliding Window Rate Limiter**: Enforces max 5 requests/min per IP address across all serverless API endpoints (`/api/contact`, `/api/chat`, `/api/health-check`).
- **Graceful Error Handling**: Input validation, custom User-Agent fetch wrappers, 8-second request timeouts, and hydration mismatch protection (`suppressHydrationWarning`).

---

## 🛠️ Technology Stack

| Category | Technologies Used |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, Custom Design Tokens |
| **Icons** | Lucide React |
| **AI Integration** | `@google/genai` (Gemini 2.0 Flash API) |
| **Email Dispatch** | Resend API SDK |
| **Hosting & CI/CD** | Vercel Serverless |

---

## 📂 Project Architecture

```
DEV KRAFTERS/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts         # Gemini AI chatbot endpoint + Lead capture
│   │   │   ├── contact/
│   │   │   │   └── route.ts         # Contact form API + Resend email dispatcher
│   │   │   └── health-check/
│   │   │       └── route.ts         # Server-side website auditor & AI summary
│   │   ├── components/
│   │   │   └── HealthCheck.tsx      # Website Health Check lead-magnet component
│   │   ├── contact/
│   │   │   └── page.tsx             # Contact inquiry form & Calendly booking
│   │   ├── portfolio/
│   │   │   └── page.tsx             # Client work showcase & reusable ProjectCard grid
│   │   ├── pricing/
│   │   │   └── page.tsx             # Fixed pricing packages & inclusions accordion
│   │   ├── services/
│   │   │   └── page.tsx             # Detailed service offerings breakdown
│   │   ├── components/
│   │   │   └── page.tsx             # Living UI component style guide showcase
│   │   ├── globals.css              # Custom font utilities & Tailwind directives
│   │   ├── layout.tsx               # Root layout, Header, Footer & ChatWidget
│   │   └── page.tsx                 # Home page (Hero, Health Check, Testimonials, CTA)
│   ├── components/                  # Shared Design System Components
│   │   ├── Alert.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── FormControls.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx
│   │   ├── Modal.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Tabs.tsx
│   │   └── Toggle.tsx
│   └── lib/
│       └── rateLimit.ts             # In-memory sliding window IP rate limiter
├── public/                          # Static images, icons, and assets
├── dev-krafters-build-spec.md       # Core studio specification & design tokens
├── tailwind.config.ts               # Custom color tokens & Montserrat/Poppins typography
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## ⚡ Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/sujayraj42/dev-krafters.git
cd dev-krafters
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Resend API Key (for contact form email delivery)
RESEND_API_KEY=re_your_resend_api_key_here

# Target Email Address to Receive Contact Inquiries
CONTACT_RECEIVER_EMAIL=hello@devkrafters.com

# Google Gemini API Key (Obtain from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Build & Type Check Verification

To verify production readiness locally:
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Test production build
npm run build
```

---

## 🌐 Production Deployment

Deployed on **Vercel**. To deploy your own instance using the Vercel CLI:

```bash
# Log in to Vercel
npx vercel login

# Link project and deploy to Production
npx vercel --prod
```

Ensure environment variables (`RESEND_API_KEY` and `GEMINI_API_KEY`) are added in **Vercel Project Settings > Environment Variables**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Crafted with precision & AI power by **Dev Krafters Studio**.
