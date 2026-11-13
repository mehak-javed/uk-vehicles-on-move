# Product Backlog — UK Vehicles On Move

Source of truth for the GitHub issues. `scripts/create_github_issues.py` turns every `## ` section into an issue:
epics are created first, then stories are linked to their epic, and each epic gets a checklist of its stories.

Metadata lines directly under a heading: `id`, `epic`, `labels`, `milestone`. Everything after them is the issue body.
Story format: **User story** → **Acceptance criteria** (Given / When / Then) → **Tasks** → **Dependencies**.
Every story must also meet the Definition of Done in [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## [Epic] E1 · Platform foundation
id: E1
labels: type:epic

Engineering foundation: repository, CI/CD, design system, data model, security model and email infrastructure. This lets every feature ship safely and consistently.

## [Epic] E2 · Public website
id: E2
labels: type:epic

The public marketing site. It presents the company, its services, UK-wide coverage and customer trust signals, and drives visitors towards requesting a quote.

## [Epic] E3 · Forms & lead capture
id: E3
labels: type:epic

All public forms (quote, contact, driver recruitment, incident reporting): UI, validation, secure storage and notifications.

## [Epic] E4 · Identity & access management
id: E4
labels: type:epic

Authentication and role-based authorisation for admins, customers and drivers.

## [Epic] E5 · Operations back office
id: E5
labels: type:epic

The admin area where staff price quotes, schedule jobs, assign drivers, process applications and incidents, and manage website content.

## [Epic] E6 · Customer portal
id: E6
labels: type:epic

A self-service area where customers track their deliveries and receive status updates.

## [Epic] E7 · Driver portal
id: E7
labels: type:epic

A mobile-first area where drivers see assigned jobs, update status and record proof of collection and delivery.

## [Epic] E8 · Quality, security & release
id: E8
labels: type:epic

Automated testing, privacy compliance, security hardening, production release and documentation.

---

## US-01 · Repository, tooling & CI pipeline
id: US-01
epic: E1
labels: type:enabler, area:devops, priority:must, points:3
milestone: Day 1 — Frontend

**User story**
As a **developer**, I want every change to be automatically linted, type-checked, built and previewed, so that defects are caught before they reach the main branch.

**Acceptance criteria**
- **Given** a pull request is opened, **when** CI runs, **then** lint, typecheck and build jobs run and report status on the PR.
- **Given** any CI job fails, **when** I try to merge, **then** branch protection blocks the merge.
- **Given** a pull request is opened, **when** Netlify builds it, **then** a deploy preview URL is posted on the PR.
- **Given** a fresh clone, **when** I copy `.env.example` to `.env.local` and run `npm run dev`, **then** the app starts locally.

**Tasks**
- [ ] Scaffold Next.js 15 (App Router, TypeScript strict, Tailwind, `src/`)
- [ ] ESLint, Prettier, `prettier-plugin-tailwindcss`, Husky + lint-staged, commitlint (Conventional Commits)
- [ ] `.env.example` documenting every variable (no real values committed)
- [ ] GitHub Actions workflow: install → lint → typecheck → build
- [ ] Branch protection on `main`: PR required, CI must pass
- [ ] Create a Netlify site linked to the repo (`netlify.toml`, Next.js runtime) with deploy previews per PR

**Dependencies:** none

## US-02 · Design system & UI components
id: US-02
epic: E1
labels: type:enabler, area:frontend, area:design, priority:must, points:3
milestone: Day 1 — Frontend

**User story**
As a **visitor**, I want a consistent, premium-looking interface, so that I trust the company with my vehicle.

**Acceptance criteria**
- **Given** any page, **when** it renders, **then** it uses only the defined colour, typography and spacing tokens.
- **Given** the gold accent colour, **when** it is used for text or buttons, **then** the contrast ratio meets WCAG 2.2 AA.
- **Given** the `/styleguide` dev route, **when** I open it, **then** every UI primitive and its states (hover, focus, disabled, error) are displayed.

**Tasks**
- [ ] Tailwind theme tokens: black, off-white, gold accent, neutral greys
- [ ] Fonts with `next/font`: serif headings, sans-serif body
- [ ] Components: Button, SectionHeading, Card, Container, Badge
- [ ] Form primitives: Input, Select, Textarea, Checkbox, FileInput, FieldError
- [ ] Logo slot (client logo or temporary wordmark)

**Dependencies:** US-01

## US-03 · Global navigation & contact bar
id: US-03
epic: E2
labels: type:story, area:frontend, priority:must, points:3
milestone: Day 1 — Frontend

**User story**
As a **visitor**, I want to reach any page and contact the company from anywhere on the site, so that I never have to search for how to get in touch.

**Acceptance criteria**
- **Given** any page, **when** it loads, **then** a top bar shows a click-to-call link and a "Chat with us" (WhatsApp) link, both read from configuration.
- **Given** a mobile viewport, **when** I open the menu, **then** a hamburger menu shows all navigation links and is fully keyboard and screen-reader accessible.
- **Given** any page, **when** I scroll to the bottom, **then** the footer shows navigation, contact links, legal links and social icons.
- **Given** a first visit, **when** the page loads, **then** a cookie banner offers Accept, Decline and Preferences.

**Tasks**
- [ ] Top bar (phone and WhatsApp from env/config)
- [ ] Sticky header + desktop nav + mobile drawer
- [ ] Scrolling announcement ticker
- [ ] Footer
- [ ] Cookie banner UI (consent logic in US-28)

**Dependencies:** US-02

## US-04 · Home page
id: US-04
epic: E2
labels: type:story, area:frontend, priority:must, points:5
milestone: Day 1 — Frontend

**User story**
As a **visitor**, I want the home page to quickly show what the company does, where it operates and why it can be trusted, so that I feel confident requesting a quote.

**Acceptance criteria**
- **Given** I land on the home page, **when** the hero loads, **then** I see the value proposition and a "Get a Free Quote" button that leads to `/quote`.
- **Given** I scroll down, **then** I see, in order: about teaser, 4 service cards, latest news, featured cities, UK coverage map, partners, testimonials and a final call-to-action band.
- **Given** testimonials or partners have no real content yet, **when** the page renders, **then** that section is hidden (no fabricated content goes live).
- **Given** a 4G mobile connection, **when** the page loads, **then** LCP is under 2.5 s.

**Tasks**
- [ ] Hero section with optimised background image
- [ ] About teaser, services grid, news panel, cities strip
- [ ] SVG UK coverage map
- [ ] Partners and testimonials sections (data-driven, hidden when empty)
- [ ] CTA band (Quote + Call)
- [ ] Original copywriting

**Dependencies:** US-02, US-03

## US-05 · About & Services pages
id: US-05
epic: E2
labels: type:story, area:frontend, priority:must, points:3
milestone: Day 2 — Frontend

**User story**
As a **visitor**, I want detailed information about the company and each service, so that I can choose the right service for my vehicle.

**Acceptance criteria**
- **Given** `/about`, **when** it loads, **then** it shows the company story, values and reasons to choose the company, with a quote CTA.
- **Given** `/services`, **when** it loads, **then** each service (same-day, door-to-door, insured transport, nationwide, trade/dealer) has a description and a CTA.
- **Given** the FAQ on `/services`, **when** I use the keyboard, **then** every accordion item can be opened and closed.

**Tasks**
- [ ] About page
- [ ] Services page with service sections
- [ ] Accessible FAQ accordion

**Dependencies:** US-03

## US-06 · Gallery & News
id: US-06
epic: E2
labels: type:story, area:frontend, priority:should, points:3
milestone: Day 2 — Frontend

**User story**
As a **visitor**, I want to see real work and company updates, so that I know the company is active and professional.

**Acceptance criteria**
- **Given** `/gallery`, **when** I click an image, **then** it opens in an accessible lightbox that I can close with Escape.
- **Given** `/news`, **when** it loads, **then** posts are listed newest first, each linking to `/news/[slug]`.
- **Given** a news post, **when** shared on social media, **then** it shows the correct title, description and image (Open Graph).

**Tasks**
- [ ] Gallery grid + lightbox (`next/image`)
- [ ] News list and detail pages (static data now, database in US-22)

**Dependencies:** US-03

## US-07 · Quote request form (UI)
id: US-07
epic: E3
labels: type:story, area:frontend, priority:must, points:5
milestone: Day 2 — Frontend

**User story**
As a **visitor**, I want a simple step-by-step quote form, so that I can request a price for moving my vehicle in under two minutes.

**Acceptance criteria**
- **Given** `/quote`, **when** I start, **then** the form has 4 steps (Vehicle → Route & date → Contact details → Review) with a progress indicator.
- **Given** I enter an invalid UK postcode, email or phone, **when** I continue, **then** a clear inline error is shown and I cannot proceed.
- **Given** I go back a step, **when** I return, **then** my previously entered data is kept.
- **Given** the review step, **when** I submit, **then** a loading state shows and then a success screen.

**Tasks**
- [ ] Shared Zod schema `quoteRequestSchema` in `lib/validation`
- [ ] Multi-step form with React Hook Form
- [ ] UK postcode and phone validation
- [ ] Review and success screens (submission mocked until US-13)

**Dependencies:** US-02

## US-08 · Contact, Drive With Us & Report an Incident forms (UI)
id: US-08
epic: E3
labels: type:story, area:frontend, priority:must, points:3
milestone: Day 2 — Frontend

**User story**
As a **visitor, driver applicant or driver**, I want clear forms for contacting the company, applying to drive and reporting incidents, so that I can reach the right team with the right information.

**Acceptance criteria**
- **Given** each form, **when** a required field is missing, **then** an inline error is shown and announced to screen readers.
- **Given** a file input, **when** I choose a file over 5 MB or of the wrong type, **then** it is rejected with a message.
- **Given** a valid form, **when** I submit, **then** a success state is shown.

**Tasks**
- [ ] `/contact` form + contact options
- [ ] `/drive-with-us` application form (CV and licence upload)
- [ ] `/report-incident` form (job reference, date, location, description, photos)
- [ ] Shared Zod schemas for each form

**Dependencies:** US-02

## US-09 · Sign-in screens & legal pages
id: US-09
epic: E2
labels: type:story, area:frontend, priority:must, points:2
milestone: Day 2 — Frontend

**User story**
As a **customer or driver**, I want clear sign-in pages, and as a **visitor**, I want to read the legal terms, so that I can access my account and understand how my data is used.

**Acceptance criteria**
- **Given** `/login` and `/driver/login`, **when** they load, **then** each shows email/password fields and a "Forgot password" link.
- **Given** `/privacy`, `/cookies` and `/terms`, **when** they load, **then** content is shown with a "last updated" date.
- **Given** an unknown URL, **when** I visit it, **then** a branded 404 page with navigation is shown.

**Tasks**
- [ ] Customer and driver sign-in UI, forgot/reset password UI
- [ ] Legal page templates
- [ ] 404 and error pages

**Dependencies:** US-03

## US-10 · Responsive, accessibility & SEO hardening
id: US-10
epic: E2
labels: type:story, area:frontend, priority:must, points:3
milestone: Day 2 — Frontend

**User story**
As a **visitor on any device**, I want the site to work well and be easy to find on search engines, so that I can find and use it wherever I am.

**Acceptance criteria**
- **Given** widths of 375, 768 and 1280 px, **when** any page renders, **then** there is no horizontal scroll or overlapping content.
- **Given** the site, **when** audited with Lighthouse and axe, **then** all categories score ≥ 90 and there are no serious accessibility violations.
- **Given** a search engine crawler, **when** it visits, **then** `sitemap.xml`, `robots.txt`, unique page metadata and `LocalBusiness` structured data are present.

**Tasks**
- [ ] Responsive QA across all pages
- [ ] Keyboard, focus, alt text and contrast fixes
- [ ] Metadata, Open Graph image, favicon
- [ ] Sitemap, robots, JSON-LD
- [ ] Share the preview with the client for sign-off on the frontend

**Dependencies:** US-03 – US-09

## US-11 · PostgreSQL data model, authorisation layer & file storage
id: US-11
epic: E1
labels: type:enabler, area:backend, area:database, area:security, priority:must, points:5
milestone: Day 3 — Backend

**User story**
As the **operations admin**, I want all business data and documents stored securely with strict access rules, so that customers and drivers can only ever see their own information.

**Acceptance criteria**
- **Given** the Prisma migrations, **when** applied to a clean PostgreSQL database (local or Neon), **then** every model in the data model is created.
- **Given** a customer, **when** they request jobs through the data-access layer, **then** only jobs where they are the customer are returned.
- **Given** a driver, **when** they request jobs, **then** only jobs assigned to them are returned.
- **Given** a private file (CV, licence, incident or job photo), **when** its Cloudinary URL is opened without a signature, **then** access is denied. Files are served only through short-lived signed URLs.
- **Given** the same code, **when** run locally and on Netlify, **then** only `DATABASE_URL` and `CLOUDINARY_FOLDER` differ.

**Tasks**
- [ ] Neon project with `main` (production) and `dev` branches. Local option: PostgreSQL in Docker (`docker-compose.yml`)
- [ ] Prisma schema for all models in PLAN.md §6 + first migration
- [ ] Prisma client singleton (safe for serverless connection reuse, Neon pooled connection string)
- [ ] Reference number generator (e.g. `UVM-Q-1042`)
- [ ] Data-access layer `src/server/data/*` with ownership + role checks on every query
- [ ] Cloudinary setup: signed upload endpoint, `authenticated` delivery for private files, signed URL helper, `uvm/dev` vs `uvm/prod` folders
- [ ] Seed script (`prisma db seed`) with demo admin, customer, driver and jobs

**Dependencies:** US-01

## US-12 · Role-based authentication
id: US-12
epic: E4
labels: type:story, area:backend, area:auth, area:security, priority:must, points:5
milestone: Day 3 — Backend

**User story**
As a **customer, driver or admin**, I want to sign in securely and see only the area meant for my role, so that my account and data stay protected.

**Acceptance criteria**
- **Given** valid credentials, **when** I sign in, **then** I am redirected to my area (`/portal`, `/driver` or `/admin`).
- **Given** I am a customer, **when** I visit `/admin` or `/driver`, **then** access is denied and I am redirected.
- **Given** I forgot my password, **when** I request a reset, **then** I receive a reset email and can set a new password.
- **Given** the public site, **when** anyone looks for it, **then** there is no way to self-register as admin or driver.

**Tasks**
- [ ] Better Auth with the Prisma adapter (email + password, hashed passwords, database sessions)
- [ ] `role` field on `User` (`ADMIN` / `CUSTOMER` / `DRIVER`), default `CUSTOMER`
- [ ] Password reset + account invite emails sent through Resend
- [ ] Middleware + server-side session checks protecting `/portal/*`, `/driver/*`, `/admin/*` by role
- [ ] Wire up sign-in, sign-out, reset password screens
- [ ] Admin account created only via seed / CLI script
- [ ] `BETTER_AUTH_URL` set per environment (localhost locally, company domain in production)

**Dependencies:** US-09, US-11

## US-13 · Submit a quote request
id: US-13
epic: E3
labels: type:story, area:backend, area:email, priority:must, points:5
milestone: Day 3 — Backend

**User story**
As a **visitor**, I want my quote request to be received and confirmed with a reference number, so that I know the company will contact me.

**Acceptance criteria**
- **Given** a valid quote form, **when** I submit, **then** the request is stored with status `new` and a unique reference number.
- **Given** a successful submission, **then** I receive a confirmation email with my reference, and the company quotes mailbox receives the full details within 1 minute.
- **Given** invalid data sent directly to the server, **when** processed, **then** it is rejected by server-side validation.
- **Given** a bot or more than 5 submissions per hour from one IP, **when** it submits, **then** the request is blocked.

**Tasks**
- [ ] Server action with shared Zod validation, saving through Prisma
- [ ] Cloudflare Turnstile verification
- [ ] Rate limiting (stored in PostgreSQL, since serverless functions keep no memory between requests)
- [ ] Resend client + React Email templates (company + customer); sender from `EMAIL_FROM`
- [ ] Connect the US-07 form to the server action

**Dependencies:** US-07, US-11

## US-14 · Send a contact message
id: US-14
epic: E3
labels: type:story, area:backend, area:email, priority:must, points:2
milestone: Day 4 — Backend

**User story**
As a **visitor**, I want to send the company a message, so that I can ask questions before booking.

**Acceptance criteria**
- **Given** a valid contact form, **when** I submit, **then** the message is stored and emailed to the company inbox.
- **Given** a bot submission, **when** Turnstile fails, **then** nothing is stored or sent.

**Tasks**
- [ ] Server action + `contact_messages` insert
- [ ] Email notification
- [ ] Turnstile + rate limit

**Dependencies:** US-08, US-11

## US-15 · Apply to become a driver
id: US-15
epic: E3
labels: type:story, area:backend, priority:must, points:3
milestone: Day 4 — Backend

**User story**
As a **driver applicant**, I want to submit my application with my CV and driving licence, so that the company can assess me for work.

**Acceptance criteria**
- **Given** a valid application with documents, **when** I submit, **then** files are uploaded directly to Cloudinary as private (`authenticated`) assets and the application is saved with status `new`.
- **Given** a successful submission, **then** I receive an acknowledgement email and the company is notified.
- **Given** a file that is not PDF/JPG/PNG or is over 5 MB, **when** uploaded, **then** it is rejected (client check + signed upload restrictions).

**Tasks**
- [ ] Signed direct browser → Cloudinary upload (folder `uvm/<env>/applications`, allowed formats, max size)
- [ ] `DriverApplication` record storing Cloudinary `public_id`s
- [ ] Acknowledgement and notification emails (Resend)

**Dependencies:** US-08, US-11

## US-16 · Report an incident
id: US-16
epic: E3
labels: type:story, area:backend, priority:must, points:3
milestone: Day 4 — Backend

**User story**
As a **driver**, I want to report an incident with photos as soon as it happens, so that the company can respond quickly and keep an accurate record.

**Acceptance criteria**
- **Given** a valid incident report, **when** submitted, **then** it is stored with a reference number (`UVM-I-…`) and photos are uploaded to Cloudinary as private assets.
- **Given** a new incident, **then** an urgent email is sent to the company immediately.
- **Given** I am a signed-in driver, **when** I open the form from a job, **then** the job reference is pre-filled.

**Tasks**
- [ ] Multiple photo upload, mobile camera friendly (signed direct upload to `uvm/<env>/incidents`)
- [ ] `IncidentReport` record + reference number
- [ ] Urgent email notification (Resend)

**Dependencies:** US-08, US-11

## US-17 · Domain email & deliverability
id: US-17
epic: E1
labels: type:enabler, area:devops, area:email, priority:must, points:2
milestone: Day 4 — Backend

**User story**
As the **operations admin**, I want emails to come from the company domain and land in inboxes rather than spam, so that customers trust and read our messages.

**Acceptance criteria**
- **Given** the company domain, **when** DNS is checked, **then** SPF, DKIM and DMARC records are valid.
- **Given** a test email to Gmail and Outlook, **when** received, **then** it lands in the inbox and passes SPF/DKIM.
- **Given** the business mailboxes, **when** set up, **then** general and quotes mailboxes can send and receive.

**Tasks**
- [ ] Confirm the domain purchase and get access to its DNS settings
- [ ] Zoho Mail Free: add the domain, create `info@` and `quotes@`, add MX + SPF + DKIM records
- [ ] Resend: verify the `send.` subdomain (MX + SPF + DKIM records)
- [ ] Add a DMARC record (start with `p=none`, tighten after monitoring)
- [ ] Switch `EMAIL_FROM` from `onboarding@resend.dev` to `quotes@<domain>`
- [ ] Deliverability test to Gmail and Outlook

**Dependencies:** none (raise with the client on Day 1)

## US-18 · Review and price quote requests
id: US-18
epic: E5
labels: type:story, area:admin, area:backend, area:frontend, priority:must, points:5
milestone: Day 5 — Back office

**User story**
As the **operations admin**, I want to see all quote requests and send a price to the customer, so that I can respond to leads quickly.

**Acceptance criteria**
- **Given** `/admin`, **when** it loads, **then** a dashboard shows counts of new quotes, active jobs, new applications and open incidents.
- **Given** the quotes list, **when** I filter by status or search by reference or name, **then** results update accordingly.
- **Given** a quote, **when** I enter a price and send it, **then** the status becomes `quoted` and the customer receives a quote email.
- **Given** a quoted request, **when** I mark it accepted or declined, **then** the status updates and the change is timestamped.

**Tasks**
- [ ] Admin layout + dashboard KPIs
- [ ] Quotes table (filter, search, pagination)
- [ ] Quote detail + pricing action + email

**Dependencies:** US-12, US-13

## US-19 · Convert a quote into a job and assign a driver
id: US-19
epic: E5
labels: type:story, area:admin, area:backend, priority:must, points:5
milestone: Day 5 — Back office

**User story**
As the **operations admin**, I want to turn an accepted quote into a scheduled job and assign a driver, so that the delivery is organised and tracked.

**Acceptance criteria**
- **Given** an accepted quote, **when** I convert it, **then** a job is created with a reference, schedule date and status `scheduled`, and a customer account is invited if none exists.
- **Given** a job, **when** I assign or reassign a driver, **then** the driver sees it in their portal and a `job_events` entry is recorded.
- **Given** a job, **when** I cancel it, **then** its status becomes `cancelled` with a reason.

**Tasks**
- [ ] Convert-to-job action
- [ ] Customer account invite via Better Auth (set-password email through Resend)
- [ ] Jobs list and detail with driver assignment
- [ ] Job event logging

**Dependencies:** US-18

## US-20 · Review driver applications and onboard drivers
id: US-20
epic: E5
labels: type:story, area:admin, area:backend, priority:should, points:3
milestone: Day 5 — Back office

**User story**
As the **operations admin**, I want to review driver applications and their documents, so that I can approve qualified drivers and give them access.

**Acceptance criteria**
- **Given** an application, **when** I open a document, **then** it opens via a signed URL that expires.
- **Given** I approve an application, **when** confirmed, **then** a driver account is invited with the `driver` role.
- **Given** I reject an application, **then** its status updates and the applicant is notified.

**Tasks**
- [ ] Applications list and detail
- [ ] Document viewer using expiring Cloudinary signed URLs (generated only for admins)
- [ ] Approve (invite a driver account via Better Auth, role `DRIVER`) / reject actions

**Dependencies:** US-12, US-15

## US-21 · Manage incidents and contact messages
id: US-21
epic: E5
labels: type:story, area:admin, priority:should, points:2
milestone: Day 5 — Back office

**User story**
As the **operations admin**, I want to track incidents and messages through to resolution, so that nothing is missed.

**Acceptance criteria**
- **Given** the incidents list, **when** I open one, **then** I see details and photos and can mark it resolved with a note.
- **Given** the messages inbox, **when** I mark a message handled, **then** it moves out of the unread view.

**Tasks**
- [ ] Incidents list/detail + resolve action
- [ ] Messages inbox + handled toggle

**Dependencies:** US-14, US-16

## US-22 · Manage website content
id: US-22
epic: E5
labels: type:story, area:admin, area:backend, priority:should, points:5
milestone: Day 5 — Back office

**User story**
As the **operations admin**, I want to publish news, testimonials, gallery images and announcement messages myself, so that the website stays up to date without a developer.

**Acceptance criteria**
- **Given** the content area, **when** I create, edit or delete a news post, testimonial or gallery image, **then** the public site reflects the change within 60 seconds.
- **Given** the announcement ticker settings, **when** I update the messages, **then** the ticker on every page shows them.
- **Given** an image upload, **when** saved, **then** it is stored in Cloudinary (`uvm/<env>/public`) and served optimised (auto format and quality).

**Tasks**
- [ ] CRUD screens for news, testimonials, gallery
- [ ] Ticker / site settings editor
- [ ] Switch public pages from static data to the database with on-demand revalidation

**Dependencies:** US-06, US-12

## US-23 · Track my delivery
id: US-23
epic: E6
labels: type:story, area:frontend, area:backend, priority:must, points:5
milestone: Day 6 — Portals

**User story**
As a **customer**, I want to see the status of my delivery and proof photos, so that I know where my vehicle is and that it was handled with care.

**Acceptance criteria**
- **Given** I sign in, **when** `/portal` loads, **then** I see only my jobs with their current status.
- **Given** a job, **when** I open it, **then** I see a timeline (scheduled → collected → in transit → delivered), the driver's first name and the collection/delivery photos.
- **Given** another customer's job ID in the URL, **when** I open it, **then** access is denied.

**Tasks**
- [ ] Portal jobs list
- [ ] Job detail with timeline and photo gallery (Cloudinary signed URLs, generated only after the ownership check)
- [ ] Profile page (name, phone)

**Dependencies:** US-12, US-19

## US-24 · View my assigned jobs
id: US-24
epic: E7
labels: type:story, area:frontend, area:backend, priority:must, points:3
milestone: Day 6 — Portals

**User story**
As a **driver**, I want to see today's and upcoming jobs on my phone, so that I know where to go and whom to contact.

**Acceptance criteria**
- **Given** I sign in as a driver, **when** `/driver` loads, **then** I see only jobs assigned to me, grouped into Today and Upcoming.
- **Given** a job, **when** I tap an address, **then** it opens in my phone's maps app; **when** I tap the customer phone, **then** it starts a call.
- **Given** a 375 px screen, **when** I use the portal, **then** all actions are reachable with one thumb (touch targets ≥ 44 px).

**Tasks**
- [ ] Driver jobs list (mobile-first)
- [ ] Job detail with map and call links

**Dependencies:** US-12, US-19

## US-25 · Update job status with proof photos
id: US-25
epic: E7
labels: type:story, area:frontend, area:backend, priority:must, points:5
milestone: Day 6 — Portals

**User story**
As a **driver**, I want to record collection and delivery with photos and notes, so that there is clear proof of the vehicle's condition at each stage.

**Acceptance criteria**
- **Given** an assigned job, **when** I tap "Collected", "In transit" or "Delivered", **then** the status updates in order and a `job_events` record is created with time and author.
- **Given** "Collected" or "Delivered", **when** I confirm, **then** at least one photo is required, captured from the camera or gallery.
- **Given** a problem, **when** I tap "Report incident", **then** the incident form opens with the job reference pre-filled.
- **Given** a job not assigned to me, **when** I try to update it, **then** the server rejects the update (authorisation layer) and nothing changes.

**Tasks**
- [ ] Status transition actions with validation of allowed transitions
- [ ] Signed direct photo upload to Cloudinary (`uvm/<env>/jobs`) + `JobPhoto` record with type (collection / delivery / damage)
- [ ] Notes field
- [ ] Incident shortcut

**Dependencies:** US-24, US-16

## US-26 · Delivery status notifications
id: US-26
epic: E6
labels: type:story, area:backend, area:email, priority:should, points:3
milestone: Day 6 — Portals

**User story**
As a **customer**, I want an email when my vehicle is scheduled, collected and delivered, so that I stay informed without having to check the portal.

**Acceptance criteria**
- **Given** a job status changes to `scheduled`, `collected` or `delivered`, **when** saved, **then** the customer receives the matching email with a link to the portal.
- **Given** a job is delivered or an incident is raised, **then** the admin receives a notification.
- **Given** an email fails to send, **then** the failure is logged and the status change is not lost.

**Tasks**
- [ ] Email templates per status
- [ ] Trigger emails from status transitions
- [ ] Error logging

**Dependencies:** US-25, US-17

## US-27 · Automated test suite
id: US-27
epic: E8
labels: type:enabler, area:testing, priority:must, points:5
milestone: Day 7 — Release

**User story**
As a **developer**, I want automated tests for the critical journeys, so that future changes don't break the business.

**Acceptance criteria**
- **Given** CI, **when** a PR is opened, **then** unit and end-to-end tests run and must pass before merge.
- **Given** the E2E suite, **then** it covers: visitor submits a quote → admin prices and converts it → driver marks it delivered → customer sees the timeline.
- **Given** the authorisation tests, **then** a customer cannot read another customer's job and a driver cannot update an unassigned job.

**Tasks**
- [ ] Vitest: validation schemas, reference generator, status transition rules
- [ ] Playwright E2E against a seeded PostgreSQL (Docker service in GitHub Actions)
- [ ] Authorisation tests for the data-access layer
- [ ] Mock Resend and Cloudinary in tests
- [ ] Add test jobs to CI

**Dependencies:** US-13 – US-25

## US-28 · Cookie consent & privacy compliance
id: US-28
epic: E8
labels: type:story, area:frontend, area:security, priority:must, points:3
milestone: Day 7 — Release

**User story**
As a **visitor**, I want control over cookies and clear information about how my data is used, so that my privacy is respected.

**Acceptance criteria**
- **Given** I decline cookies, **when** I browse, **then** no analytics or non-essential scripts load.
- **Given** I change my choice in Preferences, **then** the new choice is applied and remembered.
- **Given** any form collecting personal data, **then** it links to the privacy notice and states why the data is collected.
- **Given** the privacy notice, **then** it lists retention periods for applications, incidents and quotes.

**Tasks**
- [ ] Consent state + conditional script loading (Cloudflare Web Analytics is cookieless; anything non-essential waits for consent)
- [ ] Privacy and cookie policy content (client approval)
- [ ] Privacy notices on forms

**Dependencies:** US-03, US-09

## US-29 · Security hardening
id: US-29
epic: E8
labels: type:enabler, area:security, priority:must, points:3
milestone: Day 7 — Release

**User story**
As the **business owner**, I want the platform protected against common attacks, so that customer data and the company's reputation are safe.

**Acceptance criteria**
- **Given** the production site, **when** scanned (e.g. securityheaders.com), **then** CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy are present.
- **Given** `npm audit` / Dependabot, **when** run, **then** there are no critical or high vulnerabilities.
- **Given** the OWASP Top 10 checklist, **when** reviewed, **then** each item is documented as mitigated or not applicable.
- **Given** the repository history, **when** scanned for secrets, **then** none are found.

**Tasks**
- [ ] Security headers in `next.config` / `netlify.toml`
- [ ] Enable Dependabot + secret scanning
- [ ] Confirm no code writes to the server file system and no private file is delivered without a signature
- [ ] OWASP checklist in `docs/SECURITY_REVIEW.md`
- [ ] Verify rate limits and server-side validation on all endpoints

**Dependencies:** US-13 – US-16

## US-30 · Production release
id: US-30
epic: E8
labels: type:enabler, area:devops, priority:must, points:3
milestone: Day 7 — Release

**User story**
As the **business owner**, I want the website live on the company domain and monitored, so that customers can use it and problems are spotted quickly.

**Acceptance criteria**
- **Given** the production URL, **when** visited, **then** it is served over HTTPS on the company domain (and `www` redirects to it, or the reverse).
- **Given** the production database (Neon `main` branch), **when** checked, **then** all Prisma migrations are applied and an admin account exists.
- **Given** a smoke test on production, **when** a quote is submitted and a photo uploaded, **then** both emails arrive from `quotes@<domain>` (not in spam) and the file appears in `uvm/prod` on Cloudinary.
- **Given** the site goes down, **when** detected, **then** an uptime alert is sent.

**Tasks**
- [ ] Netlify production environment variables (every key in `.env.example`, production values)
- [ ] Build command runs `prisma migrate deploy` against the Neon `main` branch
- [ ] Connect the custom domain in Netlify (DNS records at the registrar) + HTTPS certificate
- [ ] `BETTER_AUTH_URL` and Turnstile site domain set to the company domain
- [ ] Cloudflare Web Analytics + UptimeRobot monitor on the home page and a health endpoint
- [ ] Create the production admin account
- [ ] Production smoke test of every form and portal, then tag release `v1.0.0`

**Dependencies:** US-27, US-28, US-29, US-17

## US-31 · Documentation & operations runbook
id: US-31
epic: E8
labels: type:enabler, area:docs, priority:should, points:2
milestone: Day 7 — Release

**User story**
As the **operations admin**, I want a simple guide to using the back office, and as a **developer**, I want clear technical docs, so that the platform can be operated and maintained without the original author.

**Acceptance criteria**
- **Given** the README, **then** it explains the purpose, architecture, local setup, environment variables, testing and deployment.
- **Given** the runbook, **then** it lists every external service (Netlify, Neon, Cloudinary, Resend, Zoho, Cloudflare, UptimeRobot), its free-plan limits and who owns the account.
- **Given** the admin guide, **then** it covers pricing quotes, creating jobs, assigning drivers, approving applications and publishing content.
- **Given** the phase-2 items, **then** each exists as a backlog issue.

**Tasks**
- [ ] README with architecture diagram and screenshots
- [ ] `docs/ADMIN_GUIDE.md`
- [ ] `CHANGELOG.md` for v1.0.0
- [ ] Phase-2 issues: online payments, instant pricing, live GPS tracking

**Dependencies:** US-30
