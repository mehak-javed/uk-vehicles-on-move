# UK Vehicles On Move

Website and vehicle-delivery operations platform: public marketing site, quote requests, driver recruitment, incident reporting, and admin / customer / driver portals.

- **Plan:** [PLAN.md](PLAN.md)
- **Backlog:** [docs/BACKLOG.md](docs/BACKLOG.md)
- **Ways of working:** [CONTRIBUTING.md](CONTRIBUTING.md)

## Tech stack

Next.js · TypeScript · Tailwind CSS · PostgreSQL (Neon) · Prisma · Better Auth · Cloudinary · Resend · Netlify · GitHub Actions

## Getting started

Requirements: Node.js 24 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                           | What it does                 |
| --------------------------------- | ---------------------------- |
| `npm run dev`                     | Start the development server |
| `npm run build`                   | Production build             |
| `npm run lint`                    | ESLint                       |
| `npm run typecheck`               | TypeScript type checking     |
| `npm run format` / `format:check` | Prettier write / check       |

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), checked by commitlint in a Git hook.
