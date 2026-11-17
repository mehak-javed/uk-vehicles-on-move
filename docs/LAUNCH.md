# Launching the website on Netlify

The site is a Next.js app. Netlify builds it straight from GitHub: every
merge into `main` deploys automatically, and every pull request gets its own
preview link.

## 1. Create the site (about 10 minutes)

1. Sign in at [app.netlify.com](https://app.netlify.com) with GitHub.
2. **Add new site → Import an existing project → GitHub**, and choose the
   `uk-vehicles-on-move` repository.
3. Netlify reads `netlify.toml`, so leave the build settings as they are:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Before the first deploy, open **Site configuration → Environment
   variables** and add the variables below. Then **Deploys → Trigger deploy**.

## 2. Environment variables

Copy the values from your `.env.local`. Never put them in the repository.

| Variable                         | Value on Netlify                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | The site address, e.g. `https://your-site.netlify.app` (no `/` at the end). Change it to the company domain once connected. |
| `NEXT_PUBLIC_COMPANY_NAME`       | `UK Vehicles On Move`                                                                                                       |
| `NEXT_PUBLIC_COMPANY_PHONE`      | Company phone number shown on the site                                                                                      |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`    | WhatsApp number (leave empty to hide)                                                                                       |
| `NEXT_PUBLIC_COMPANY_EMAIL`      | Company email shown on the site                                                                                             |
| `RESEND_API_KEY`                 | Resend API key                                                                                                              |
| `EMAIL_COMPANY_INBOX`            | Where form emails go (comma-separated)                                                                                      |
| `EMAIL_FROM`                     | Leave empty until the domain is verified in Resend                                                                          |
| `CLOUDINARY_CLOUD_NAME`          | Cloudinary cloud name                                                                                                       |
| `CLOUDINARY_API_KEY`             | Cloudinary API key                                                                                                          |
| `CLOUDINARY_API_SECRET`          | Cloudinary API secret                                                                                                       |
| `CLOUDINARY_FOLDER`              | `uvm/prod`                                                                                                                  |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key (optional, recommended)                                                                                  |
| `TURNSTILE_SECRET_KEY`           | Turnstile secret key (optional, recommended)                                                                                |
| `NEXT_PUBLIC_SOCIAL_*`           | Social profile links (optional; icons are hidden when empty)                                                                |

Variables starting with `NEXT_PUBLIC_` are built into the pages, so after
changing one, trigger a new deploy.

If you use Turnstile, add the Netlify address (and later the company domain)
to the widget's hostnames in Cloudflare.

## 3. Check the live site

- [ ] Home page loads, the hero video plays
- [ ] Every menu link works, on a phone too
- [ ] Send the contact form: the company email and the confirmation arrive
- [ ] Send a Drive With Us application with a PDF: the files are attached
- [ ] `/sitemap.xml` and `/robots.txt` show the live address
- [ ] Run Lighthouse (Chrome DevTools) on the live home page

Until the domain is verified in Resend, form emails only reach the Resend
account's own address. That is fine for showing the site to the client.

## 4. Company domain and email (before real customers use it)

1. Netlify → **Domain management → Add a domain**, and follow the DNS steps.
   HTTPS is set up automatically.
2. Change `NEXT_PUBLIC_SITE_URL` to `https://company-domain` and redeploy.
3. Resend → **Domains → Add domain**, add the DNS records it shows, wait for
   "Verified", then set `EMAIL_FROM` to e.g.
   `UK Vehicles On Move <noreply@company-domain>` and set
   `EMAIL_COMPANY_INBOX` to the company inbox. Redeploy.
4. Add the domain to the Turnstile widget's hostnames.

## Security already in place

- Security headers on every page (Content Security Policy, HTTPS only,
  no framing, no MIME sniffing, strict referrer, no camera/mic/location).
- Every form is checked again on the server; spam check on every form.
- Uploaded files are private and only reach the company email.
- API keys are only used on the server.
