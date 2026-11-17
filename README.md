# UK Vehicles On Move

Website for a UK vehicle delivery company: company information, services,
gallery and news, plus four forms (quote request, contact, driver
application, incident report) that are sent by email.

There is no database and no login. Every form submission goes to the
company inbox by email, and the customer gets a confirmation email with a
reference.

- **Launch guide:** [docs/LAUNCH.md](docs/LAUNCH.md)
- **Running the site (services, accounts, limits):** [docs/RUNBOOK.md](docs/RUNBOOK.md)
- **Changing text, photos and news:** [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md)
- **Email, spam check and uploads setup:** [docs/FORMS-EMAIL-SETUP.md](docs/FORMS-EMAIL-SETUP.md)
- **Ways of working:** [CONTRIBUTING.md](CONTRIBUTING.md) · **Changes:** [CHANGELOG.md](CHANGELOG.md)

## How it works

```
Visitor's browser
  │  pages (pre-rendered, served from Netlify's CDN)
  │
  ├─ fills in a form ──▶ Next.js server action (Netlify function)
  │                        ├─ checks the data again (same rules as the browser)
  │                        ├─ checks Cloudflare Turnstile (spam protection)
  │                        └─ sends 2 emails through Resend
  │                             ├─ company inbox (all details, reply-to = customer)
  │                             └─ customer confirmation (reference number)
  │
  └─ CV / licence / photos ──▶ uploaded straight to Cloudinary (private files),
                               using a slot signed by the server, then
                               attached to the company email
```

## Tech stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 ·
shadcn/ui · React Hook Form + Zod · Resend · Cloudinary · Cloudflare
Turnstile · Netlify · GitHub Actions · Vitest · Playwright

## Project layout

| Folder               | What's inside                                                  |
| -------------------- | -------------------------------------------------------------- |
| `src/app`            | Pages (one folder per page), sitemap, robots, 404 / error page |
| `src/components`     | Page sections, forms, header, footer, UI building blocks       |
| `src/content`        | Text and lists shown on the site: services, gallery, news      |
| `src/config/site.ts` | Navigation, contact details (from environment variables)       |
| `src/lib/validation` | Form rules, shared by the browser and the server               |
| `src/lib/server`     | Email sending, spam check, upload security (server only)       |
| `public`             | Images, logo, hero video                                       |
| `tests`              | `unit` (Vitest) and `e2e` (Playwright browser tests)           |

## Getting started

Requirements: Node.js 24 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
```

With no keys in `.env.local` the site still works: emails are printed in the
terminal, the spam check is skipped and uploads are listed by name only.
See [docs/FORMS-EMAIL-SETUP.md](docs/FORMS-EMAIL-SETUP.md) to connect the
real services.

## Environment variables

All variables are listed with comments in [`.env.example`](.env.example).
Real values live only in `.env.local` (your computer) and in Netlify's
environment variables. Never commit them.

| Group           | Variables                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Site            | `NEXT_PUBLIC_SITE_URL`                                                                            |
| Company details | `NEXT_PUBLIC_COMPANY_NAME`, `…_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_COMPANY_EMAIL` |
| Email (Resend)  | `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_COMPANY_INBOX`                                             |
| Uploads         | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`       |
| Spam protection | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                          |
| Social links    | `NEXT_PUBLIC_SOCIAL_FACEBOOK`, `…_INSTAGRAM`, `…_TIKTOK`, `…_LINKEDIN`                            |

## Scripts

| Command                           | What it does                                          |
| --------------------------------- | ----------------------------------------------------- |
| `npm run dev`                     | Development server on http://localhost:3000           |
| `npm run build` / `npm start`     | Production build / run it                             |
| `npm run lint`                    | ESLint                                                |
| `npm run typecheck`               | TypeScript type checking                              |
| `npm run format` / `format:check` | Prettier write / check                                |
| `npm test`                        | Unit tests (Vitest)                                   |
| `npm run test:e2e`                | Browser tests (Playwright); run `npm run build` first |

The first time you run browser tests, install the test browser with
`npx playwright install chromium`. Tests never send real emails.

## Deployment

Netlify builds the site from GitHub. Merging into `main` deploys the live
site; every pull request gets its own preview link. GitHub Actions runs
format, lint, typecheck, unit tests, build and browser tests on every pull
request, and `main` requires them to pass. Full steps:
[docs/LAUNCH.md](docs/LAUNCH.md).

Commits follow [Conventional Commits](https://www.conventionalcommits.org/),
checked by commitlint in a Git hook.
