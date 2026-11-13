# UK Vehicles On Move — Delivery Plan

|                       |                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Product**           | Company website and vehicle-delivery operations platform (production system, deployed on the company domain) |
| **Duration**          | 7 working days (1 sprint)                                                                                    |
| **Delivery approach** | Agile / Scrum-style: epics → user stories → tasks, tracked on a GitHub Project board                         |
| **Backlog**           | [docs/BACKLOG.md](docs/BACKLOG.md): 8 epics, 31 user stories                                                 |
| **Ways of working**   | [CONTRIBUTING.md](CONTRIBUTING.md): branching, commits, PR review, Definition of Ready / Done                |
| **Configuration**     | [.env.example](.env.example): every environment variable (names only)                                        |

---

## 1. Background & objectives

The client wanted a professional website for their UK vehicle-delivery business, modelled on the layout and feature set of a reference site they supplied. The look, copy and imagery would be original. The client also wanted the website to do more than marketing: it should capture quote requests and support day-to-day delivery operations. The site goes live on the company's own domain.

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
- Running cost limited to the domain registration (all services on free plans)

---

## 2. Scope

### In scope (MVP, this sprint)

- Public marketing website (Home, About, Services, Gallery, News, Contact)
- Forms: Get a Quote, Contact, Drive With Us (driver recruitment), Report an Incident
- Role-based accounts: **Admin**, **Customer** and **Driver**
- Admin back office: quotes → jobs pipeline, driver assignment, applications, incidents, content management
- Customer portal (track a delivery) and mobile-first Driver portal (status updates, proof photos)
- Transactional email notifications from the company domain
- GDPR-aligned cookie consent and privacy pages
- Production deployment on the company domain with business email

### Out of scope (phase 2 backlog)

- Online card payments
- Instant automatic price calculator (distance API + rate card)
- Live GPS tracking of drivers
- Native mobile apps

---

## 3. Personas

| Persona              | Description                                                                | Primary goals                                                       |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Visitor**          | A private seller, buyer, dealer or auction house looking to move a vehicle | Understand the service, trust the company, request a quote quickly  |
| **Customer**         | A visitor whose quote was accepted and who now has an account              | Know where their vehicle is and when it will arrive                 |
| **Driver applicant** | A professional driver who wants to work for the company                    | Apply easily with documents                                         |
| **Driver**           | An approved driver                                                         | See assigned jobs, update status, record proof photos and incidents |
| **Operations admin** | Company staff                                                              | Price quotes, schedule jobs, assign drivers, manage website content |
| **Developer**        | Engineering team                                                           | A safe, automated path from commit to production                    |

---

## 4. Epics

| ID  | Epic                         | Stories                     | Points  |
| --- | ---------------------------- | --------------------------- | ------- |
| E1  | Platform foundation          | US-01, US-02, US-11, US-17  | 13      |
| E2  | Public website               | US-03 – US-06, US-09, US-10 | 19      |
| E3  | Forms & lead capture         | US-07, US-08, US-13 – US-16 | 21      |
| E4  | Identity & access management | US-12                       | 5       |
| E5  | Operations back office       | US-18 – US-22               | 20      |
| E6  | Customer portal              | US-23, US-26                | 8       |
| E7  | Driver portal                | US-24, US-25                | 8       |
| E8  | Quality, security & release  | US-27 – US-31               | 16      |
|     | **Total**                    | **31 stories**              | **110** |

Priorities use **MoSCoW** (`priority:must`, `priority:should`, `priority:could`). Estimates use Fibonacci story points (1, 2, 3, 5, 8).

---

## 5. Non-functional requirements

| Area                | Requirement                                                                                                                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Security**        | OWASP Top 10 reviewed. Authorisation checked server-side on every query (ownership + role). Passwords hashed (Better Auth). Secrets only in environment variables. HTTPS everywhere. Security headers (CSP, HSTS, X-Frame-Options). Server-side validation on every input. Rate limiting and Turnstile on public forms |
| **Privacy**         | UK GDPR: consent-based cookies, privacy notice, minimal data collection, personal documents stored as private (authenticated) files served only via expiring signed URLs, defined retention periods                                                                                                                    |
| **Accessibility**   | WCAG 2.2 AA: keyboard navigable, sufficient contrast, labelled form fields, alt text                                                                                                                                                                                                                                   |
| **Performance**     | Largest Contentful Paint < 2.5 s on 4G. Images optimised by Cloudinary / `next/image`. Static or ISR rendering for public pages                                                                                                                                                                                        |
| **Portability**     | Same code runs locally and in production. Environment-specific values come only from environment variables. No files written to the server's disk                                                                                                                                                                      |
| **Reliability**     | Uptime monitoring, error alerts, managed PostgreSQL with point-in-time restore                                                                                                                                                                                                                                         |
| **Maintainability** | TypeScript strict mode, Prisma migrations in version control, shared validation schemas, linting and formatting enforced in CI                                                                                                                                                                                         |
| **Observability**   | Structured server logs (Netlify function logs), uptime alerts, cookieless analytics                                                                                                                                                                                                                                    |

---

## 6. Architecture & technology

```
                         ┌──────────────── Netlify (hosting, HTTPS, custom domain) ───────────────┐
Browser ──────────────►  │  Next.js 16                                                           │
   │                     │   ├─ Public pages (static / ISR)                                      │
   │                     │   ├─ Server Actions & Route Handlers ──► Prisma ──► PostgreSQL (Neon) │
   │                     │   ├─ Better Auth (sessions, roles)  ───────────────►      ▲           │
   │                     │   └─ Portals: /admin  /portal  /driver                    │           │
   │                     └──────────────┬───────────────────────────────────────────┼───────────┘
   │  signed direct upload              │ send email                                │ file IDs
   └──────────────────► Cloudinary ◄────┼───── signed URLs ──────────────────────────┘
                                        ▼
                               Resend (from quotes@domain) ──► customer / company inbox (Zoho Mail)
```

### Final technology stack (all free plans)

| Layer               | Technology                                   | Free allowance                                          | Purpose                                                                              |
| ------------------- | -------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Framework           | **Next.js 16** (App Router) + **TypeScript** | Open source                                             | Frontend and backend in one codebase                                                 |
| UI                  | **Tailwind CSS** + **shadcn/ui**             | Open source                                             | Design system and components                                                         |
| Database            | **PostgreSQL on Neon**                       | 0.5 GB per project; scales to zero and wakes on request | All business data                                                                    |
| ORM / migrations    | **Prisma**                                   | Open source                                             | Schema, migrations, type-safe queries                                                |
| Authentication      | **Better Auth**                              | Open source                                             | Email/password, sessions, password reset, roles                                      |
| File storage        | **Cloudinary**                               | Free plan (25 monthly credits)                          | Gallery/news images (public). CVs, licences, incident and job photos (authenticated) |
| Transactional email | **Resend** + **React Email**                 | 3,000 emails/month, 100/day                             | Confirmations and notifications                                                      |
| Business inbox      | **Zoho Mail Free**                           | Up to 5 mailboxes                                       | `info@` and `quotes@` on the company domain                                          |
| Forms               | **React Hook Form** + **Zod**                | Open source                                             | Validation shared by client and server                                               |
| Bot protection      | **Cloudflare Turnstile**                     | Unlimited                                               | Public forms                                                                         |
| Hosting / CD        | **Netlify**                                  | Free plan, commercial use allowed                       | Preview per PR, production from `main`                                               |
| CI                  | **GitHub Actions**                           | 2,000 min/month (private repo)                          | Lint, typecheck, build, tests                                                        |
| Testing             | **Vitest** + **Playwright**                  | Open source                                             | Unit and end-to-end                                                                  |
| Analytics           | **Cloudflare Web Analytics**                 | Unlimited, cookieless                                   | Traffic insight without consent friction                                             |
| Monitoring          | **UptimeRobot**                              | 50 monitors                                             | Downtime alerts                                                                      |
| Domain              | Registrar of the client's choice             | **≈ £10/year (only paid item)**                         | Website + email                                                                      |

### Environments

|              | Local development                                      | Preview (per PR)                          | Production                            |
| ------------ | ------------------------------------------------------ | ----------------------------------------- | ------------------------------------- |
| URL          | `http://localhost:3000`                                | Netlify deploy preview URL                | `https://<company-domain>`            |
| Database     | Docker PostgreSQL or Neon `dev` branch                 | Neon `dev` branch                         | Neon `main` branch                    |
| Files        | Cloudinary folder `uvm/dev`                            | `uvm/dev`                                 | `uvm/prod`                            |
| Email sender | `onboarding@resend.dev` (until the domain is verified) | `quotes@<domain>`                         | `quotes@<domain>`                     |
| Secrets      | `.env.local` (git-ignored)                             | Netlify env vars (deploy-preview context) | Netlify env vars (production context) |

The rule that makes this work: **the code is identical everywhere. Only environment variables change.** Nothing is written to the server's file system, because Netlify functions are stateless.

### How files are handled

1. The browser asks the backend for permission to upload.
2. The backend checks the session and role, then returns a **signed upload signature**.
3. The browser uploads **directly to Cloudinary**. This avoids Netlify's ~6 MB function payload limit.
4. The backend saves the Cloudinary `public_id` in PostgreSQL.
5. Private files (CVs, licences, incident and job photos) are `authenticated` assets. They are only viewable through short-lived signed URLs, which the backend generates after an authorisation check.

### How email is handled

- **Sending:** Resend, from a verified `send.` subdomain (SPF, DKIM, DMARC).
- **Receiving:** Zoho Mail mailboxes (MX, SPF, DKIM) on the root domain.
- Templates are built with React Email, so the same templates work locally and in production.

### Data model (Prisma)

| Model                                                    | Purpose                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `User`, `Session`, `Account`, `Verification`             | Better Auth tables. `User.role` = `ADMIN` / `CUSTOMER` / `DRIVER`        |
| `QuoteRequest`                                           | Incoming quote requests with status and quoted price                     |
| `Job`                                                    | Confirmed deliveries with customer, driver, schedule and status          |
| `JobEvent`                                               | Status timeline (audit trail) for each job                               |
| `JobPhoto`                                               | Collection / delivery / damage photo references (Cloudinary `public_id`) |
| `DriverApplication`                                      | Recruitment applications and document references                         |
| `IncidentReport`                                         | Incidents reported by drivers, with photo references                     |
| `ContactMessage`                                         | Messages from the contact form                                           |
| `NewsPost`, `Testimonial`, `GalleryImage`, `SiteSetting` | Website content managed from the admin area                              |

**Authorisation** lives in a single data-access layer (`src/server/data/*`). Every query for jobs, photos and documents is filtered by the signed-in user's ID and role. A customer can only load their own jobs, and a driver can only load or update jobs assigned to them. Automated tests (US-27) cover these rules.

---

## 7. Delivery plan (one week)

The frontend is completed in **Days 1–2** so that **Days 3–7** go to backend, portals, quality and release.

| Day   | Milestone           | Goal                                                                                             | Stories       | Points |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------ | ------------- | ------ |
| **1** | Day 1 — Frontend    | Foundation, design system, navigation, **Home page**. Netlify previews live                      | US-01 – US-04 | 14     |
| **2** | Day 2 — Frontend    | All remaining pages and form UIs, responsive, accessibility, SEO. **Frontend complete**          | US-05 – US-10 | 19     |
| **3** | Day 3 — Backend     | Neon + Prisma schema, authorisation layer, Better Auth roles, **quote submission + email**       | US-11 – US-13 | 15     |
| **4** | Day 4 — Backend     | Contact, driver applications and incidents with Cloudinary uploads, domain email (Resend + Zoho) | US-14 – US-17 | 10     |
| **5** | Day 5 — Back office | Quote pricing, quote → job, driver onboarding, incidents, CMS                                    | US-18 – US-22 | 20     |
| **6** | Day 6 — Portals     | Customer tracking, driver jobs and status, notifications                                         | US-23 – US-26 | 16     |
| **7** | Day 7 — Release     | Tests, privacy, security hardening, **production deployment on the company domain**, docs        | US-27 – US-31 | 16     |

**Accounts to create on Day 1** (all free): Netlify, Neon, Cloudinary, Resend, Cloudflare (Turnstile + analytics), Zoho Mail, UptimeRobot. Raise the domain purchase with the client on Day 1 so DNS is ready by Day 4.

**Daily cadence**

- **Start of day:** review the board and move the day's stories from _Todo_ to _In Progress_.
- **During the day:** one branch and one PR per story. CI must be green and acceptance criteria verified on the Netlify deploy preview before merging.
- **End of day:** demo the preview to the client, record feedback as new issues, and update the board.

**Board columns:** Backlog → Ready → In Progress → In Review → Done

---

## 8. Risks & mitigations

| Risk                                                   | Impact | Likelihood | Mitigation                                                                                              |
| ------------------------------------------------------ | ------ | ---------- | ------------------------------------------------------------------------------------------------------- |
| Domain / DNS not ready for email                       | High   | Medium     | Raised on Day 1. Use `onboarding@resend.dev` for local testing until verified                           |
| Free-plan limits reached as the business grows         | Medium | Low        | Usage reviewed monthly. Upgrade paths: Neon Launch, Cloudinary Plus, Resend Pro. No code changes needed |
| Neon cold start after idle (~1 s on the first request) | Low    | High       | Public pages are static/ISR, so only form submissions and portals touch the database                    |
| Large uploads exceed the function payload limit        | Medium | Medium     | Direct signed browser → Cloudinary uploads. Client-side size checks                                     |
| Brand assets (logo, photos) arrive late                | Medium | High       | Temporary wordmark and licensed stock imagery. Swapping assets is config-only                           |
| Scope creep (payments, live tracking)                  | High   | Medium     | Out-of-scope list agreed up front. New requests go to the phase-2 backlog                               |
| Testimonials or partner content not supplied           | Low    | High       | Sections hidden until real content is added. No fabricated reviews                                      |
| One-week timeline                                      | High   | Medium     | MoSCoW priorities: _could_ stories drop first. Daily demos catch issues early                           |

---

## 9. Assumptions & pending inputs from the client

- Logo and brand colours (otherwise a wordmark in black and gold)
- Domain name purchase and access to its DNS settings
- Final list of services and featured cities
- Real customer testimonials and partner logos
- Company registration and ICO numbers for the footer, if applicable
- Own photography for the gallery
