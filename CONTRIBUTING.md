# Ways of Working

## Backlog structure

- **Epic** (`type:epic`): a large business capability, e.g. _Operations back office_
- **User story** (`type:story`): a user-facing increment written as _As a … I want … so that …_ with Given/When/Then acceptance criteria
- **Enabler** (`type:enabler`): technical work that supports stories (CI, security, infrastructure)
- **Bug** (`type:bug`): a defect against an accepted story

Labels: `area:*` (frontend, backend, database, auth, admin, design, devops, email, security, testing, docs), `priority:must|should|could` (MoSCoW) and `points:1|2|3|5|8` (Fibonacci estimate).

**Board:** Backlog → Ready → In Progress → In Review → Done

## Definition of Ready

A story can move to **Ready** when:

- [ ] It follows the _As a / I want / so that_ format
- [ ] It has testable Given/When/Then acceptance criteria
- [ ] It is estimated, prioritised and linked to an epic
- [ ] Dependencies are done or not blocking
- [ ] Designs or content it needs are available (or a placeholder is agreed)

## Definition of Done

A story is **Done** when:

- [ ] All acceptance criteria are met and verified on the Netlify deploy preview
- [ ] Code is reviewed and approved through a pull request
- [ ] CI passes: lint, typecheck, build and tests
- [ ] New logic has unit tests; critical journeys have E2E coverage
- [ ] Inputs are validated server-side; every new query goes through the authorisation layer
- [ ] No secrets or personal data are committed
- [ ] The UI is responsive (375 / 768 / 1280 px) and keyboard-accessible
- [ ] Docs and `.env.example` are updated where relevant
- [ ] It is merged to `main` and the issue is closed

## Branching

Trunk-based development with short-lived branches from `main`:

```
feat/US-13-quote-submission
fix/US-07-postcode-validation
chore/US-01-ci-pipeline
docs/US-31-admin-guide
```

`main` is protected: a pull request and passing CI are required, and force-pushes are disabled.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint:

```
feat(quote): store quote requests and send confirmation email
fix(driver): prevent status update on unassigned jobs
chore(ci): add playwright job
```

## Pull requests

- One story per PR. Link it with `Closes #<issue>`
- Fill in the PR template, including test evidence (screenshots for UI changes)
- Squash-merge to keep `main` history linear

## Releases

Semantic versioning (`v1.0.0`) with tagged releases and `CHANGELOG.md`. Production deploys come from `main` through Netlify. Prisma migrations run with `prisma migrate deploy` during the production build.

## Security

Never commit secrets, credentials or customer data. Use `.env.local` (git-ignored) and document variable names in `.env.example`. Report vulnerabilities privately to the maintainers, not in public issues.

## Environments

The same code runs locally, on Netlify deploy previews and in production. Only environment variables change (see `.env.example` and PLAN.md §6). Never write files to the server's disk: uploads go to Cloudinary and data goes to PostgreSQL.
