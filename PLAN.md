# UK Vehicles On Move — Delivery Plan

| | |
|---|---|
| **Product** | Company website and vehicle-delivery operations platform |
| **Duration** | 7 working days (1 sprint) |
| **Delivery approach** | Agile / Scrum-style: epics → user stories → tasks, tracked on a GitHub Project board |
| **Backlog** | [docs/BACKLOG.md](docs/BACKLOG.md): 8 epics, 31 user stories |
| **Ways of working** | [CONTRIBUTING.md](CONTRIBUTING.md): branching, commits, PR review, Definition of Ready / Done |

---

## 1. Background & objectives

The client wanted a professional website for their UK vehicle-delivery business, modelled on the layout and feature set of a reference site they supplied. The look, copy and imagery would be original. The client also wanted the website to do more than marketing: it should capture quote requests and support day-to-day delivery operations.

**Business objectives**
1. **Generate leads:** make it effortless for a visitor to request a delivery quote.
2. **Build trust:** present services, coverage and customer feedback professionally.
3. **Run operations:** manage quotes, jobs, drivers and incidents in one place instead of by phone and spreadsheet.
4. **Be transparent:** let customers track their delivery and let drivers record proof of collection and delivery.

**Success measures**
- A quote request can be submitted in under 2 minutes on mobile
- Every quote, application and incident is stored and the company is notified by email within 1 minute
- Lighthouse ≥ 90 for Performance, Accessibility, Best Practices and SEO
- Zero critical or high findings in the dependency audit at release

---

## 2. Scope

### In scope (MVP, this sprint)
- Public marketing website (Home, About, Services, Gallery, News, Contact)
- Forms: Get a Quote, Contact, Drive With Us (driver recruitment), Report an Incident
- Role-based accounts: **Admin**, **Customer** and **Driver**
- Admin back office: quotes → jobs pipeline, driver assignment, applications, incidents, content management
- Customer portal (track a delivery) and mobile-first Driver portal (status updates, proof photos)
- Transactional email notifications
- GDPR-aligned cookie consent and privacy pages

### Out of scope (phase 2 backlog)
- Online card payments
- Instant automatic price calculator (distance API + rate card)
- Live GPS tracking of drivers
- Native mobile apps

---

## 3. Personas

| Persona | Description | Primary goals |
|---|---|---|
| **Visitor** | A private seller, buyer, dealer or auction house looking to move a vehicle | Understand the service, trust the company, request a quote quickly |
| **Customer** | A visitor whose quote was accepted and who now has an account | Know where their vehicle is and when it will arrive |
| **Driver applicant** | A professional driver who wants to work for the company | Apply easily with documents |
| **Driver** | An approved driver | See assigned jobs, update status, record proof photos and incidents |
| **Operations admin** | Company staff | Price quotes, schedule jobs, assign drivers, manage website content |
| **Developer** | Engineering team | A safe, automated path from commit to production |

---

## 4. Epics

| ID | Epic | Stories | Points |
|---|---|---|---|
| E1 | Platform foundation | US-01, US-02, US-11, US-17 | 13 |
| E2 | Public website | US-03 – US-06, US-09, US-10 | 19 |
| E3 | Forms & lead capture | US-07, US-08, US-13 – US-16 | 21 |
| E4 | Identity & access management | US-12 | 5 |
| E5 | Operations back office | US-18 – US-22 | 20 |
| E6 | Customer portal | US-23, US-26 | 8 |
| E7 | Driver portal | US-24, US-25 | 8 |
| E8 | Quality, security & release | US-27 – US-31 | 16 |
| | **Total** | **31 stories** | **110** |

Priorities use **MoSCoW** (`priority:must`, `priority:should`, `priority:could`). Estimates use Fibonacci story points (1, 2, 3, 5, 8).

---

## 5. Non-functional requirements

| Area | Requirement |
|---|---|
| **Security** | OWASP Top 10 reviewed. Row Level Security on every table. Secrets only in environment variables. HTTPS everywhere. Security headers (CSP, HSTS, X-Frame-Options). Server-side validation on every input. Rate limiting and CAPTCHA on public forms |
| **Privacy** | UK GDPR: consent-based cookies, privacy notice, minimal data collection, private storage for personal documents, defined retention periods |
| **Accessibility** | WCAG 2.2 AA: keyboard navigable, sufficient contrast, labelled form fields, alt text |
| **Performance** | Largest Contentful Paint < 2.5 s on 4G. Optimised images. Static or ISR rendering for public pages |
| **Reliability** | Uptime monitoring, error tracking, daily database backups (managed by Supabase) |
| **Maintainability** | TypeScript strict mode, shared validation schemas, linting and formatting enforced in CI, documented architecture |
| **Observability** | Structured server logs, error alerts, privacy-friendly analytics only after consent |

---

## 6. Architecture & technology

```
Browser ──► Next.js (Vercel)
              ├─ Public pages (SSG / ISR)
              ├─ Server Actions / Route Handlers ──► Supabase Postgres (RLS)
              │                                   ├► Supabase Storage (private buckets)
              │                                   └► Resend (transactional email)
              └─ Portals: /admin  /portal  /driver  (Supabase Auth + role middleware)
```

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Server Actions & Route Handlers |
| Database / Auth / Storage | Supabase (PostgreSQL, Auth, Storage, Row Level Security) |
| Validation | Zod schemas shared by client and server |
| Email | Resend + React Email |
| Bot protection | Cloudflare Turnstile |
| Testing | Vitest (unit), Playwright (end-to-end) |
| CI/CD | GitHub Actions + Vercel preview and production deployments |

Company contact details (phone, email, social links) are **not hard-coded**. They come from environment variables and a `site_settings` table, so no business data is committed to the repository.

### Data model

| Table | Purpose |
|---|---|
| `profiles` | User profile and **role** (`admin` / `customer` / `driver`) |
| `quote_requests` | Incoming quote requests with status and quoted price |
| `jobs` | Confirmed deliveries with customer, driver, schedule and status |
| `job_events` | Status timeline (audit trail) for each job |
| `job_photos` | Collection / delivery / damage photos |
| `driver_applications` | Recruitment applications and document references |
| `incident_reports` | Incidents reported by drivers |
| `contact_messages` | Messages from the contact form |
| `news_posts`, `testimonials`, `gallery_images`, `site_settings` | Website content managed from the admin area |

---

## 7. Delivery plan (one week)

The frontend is completed in **Days 1–2** so that **Days 3–7** go to backend, portals, quality and release.

| Day | Milestone | Goal | Stories | Points |
|---|---|---|---|---|
| **1** | Day 1 — Frontend | Foundation, design system, navigation, **Home page** | US-01 – US-04 | 14 |
| **2** | Day 2 — Frontend | All remaining pages and form UIs, responsive, accessibility, SEO. **Frontend complete** | US-05 – US-10 | 19 |
| **3** | Day 3 — Backend | Data model and RLS, authentication and roles, **quote submission** | US-11 – US-13 | 15 |
| **4** | Day 4 — Backend | Contact, driver applications, incidents, email deliverability | US-14 – US-17 | 10 |
| **5** | Day 5 — Back office | Quote pricing, quote → job, driver onboarding, incidents, CMS | US-18 – US-22 | 20 |
| **6** | Day 6 — Portals | Customer tracking, driver jobs and status, notifications | US-23 – US-26 | 16 |
| **7** | Day 7 — Release | Tests, privacy compliance, security hardening, production release, docs | US-27 – US-31 | 16 |

**Daily cadence**
- **Start of day:** review the board and move the day's stories from *Todo* to *In Progress*.
- **During the day:** one branch and one PR per story. CI must be green and acceptance criteria verified before merging.
- **End of day:** demo the Vercel preview to the client, record feedback as new issues, and update the board.

**Board columns:** Backlog → Ready → In Progress → In Review → Done

---

## 8. Risks & mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Brand assets (logo, photos) arrive late | Medium | High | Temporary wordmark and licensed stock imagery. Swapping assets is config-only |
| Domain / mailbox not ready for email sending | High | Medium | Raised on Day 1. Use the Resend test domain until DNS is verified |
| Scope creep (payments, live tracking) | High | Medium | Out-of-scope list agreed up front. New requests go to the phase-2 backlog |
| Testimonials or partner content not supplied | Low | High | Sections hidden until real content is added. No fabricated reviews |
| One-week timeline | High | Medium | MoSCoW priorities: *could* stories drop first. Daily demos catch issues early |

---

## 9. Assumptions & pending inputs from the client
- Logo and brand colours (otherwise a wordmark in black and gold)
- Domain name and the business mailboxes to be created on it
- Final list of services and featured cities
- Real customer testimonials and partner logos
- Company registration and ICO numbers for the footer, if applicable
- Own photography for the gallery
