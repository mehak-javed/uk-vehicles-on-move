# Forms: email, spam protection and file uploads

The four website forms (Get a Quote, Contact, Drive With Us, Report an
Incident) send two emails each:

- **to the company inbox**, with all the details, and the customer set as
  "reply-to" so staff can answer directly;
- **to the customer**, confirming we received it, with their reference
  (for example `UVM-Q-7K3QH2`).

Driver CVs, licences and incident photos are uploaded to private storage
and attached to the company email.

| Service                                                                | Used for                     | Free plan              |
| ---------------------------------------------------------------------- | ---------------------------- | ---------------------- |
| [Resend](https://resend.com)                                           | Sending the emails           | 3,000 emails per month |
| [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) | Spam protection on the forms | Free                   |
| [Cloudinary](https://cloudinary.com)                                   | Private storage for uploads  | 25 credits per month   |

All keys go in `.env.local` on your computer, and in Netlify →
**Site configuration → Environment variables** for the live site. Never
commit them or paste them into chats, issues or pull requests.

## Trying the forms without any accounts

Leave the keys empty and run `npm run dev`. Every form still works: the
emails are printed in the terminal instead of being sent, the spam check is
skipped, and uploaded files are listed by name but not stored.

## 1. Resend (emails)

1. Sign up at resend.com and create an **API key** with "Sending access".
2. In `.env.local` set:
   - `RESEND_API_KEY` = the key (starts with `re_`)
   - `EMAIL_COMPANY_INBOX` = the address(es) that should receive the forms,
     comma-separated
   - `EMAIL_FROM` = `UK Vehicles On Move <onboarding@resend.dev>` for now
3. **Before the domain is verified**, Resend only delivers to the email
   address of your Resend account. So for testing, use that address as
   `EMAIL_COMPANY_INBOX` and as the customer email in the form.
4. **For the live site** (US-17): in Resend → Domains, add the company domain
   and add the DNS records it shows. When it says "Verified", change
   `EMAIL_FROM` to something like
   `UK Vehicles On Move <noreply@company-domain>`.

## 2. Cloudflare Turnstile (spam protection)

1. In the Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Add the hostnames `localhost` and the live domain. Widget mode: **Managed**.
3. Copy the keys into:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = the site key
   - `TURNSTILE_SECRET_KEY` = the secret key

The check usually passes on its own; visitors only see a puzzle when
something looks suspicious.

## 3. Cloudinary (file uploads)

1. Sign up at cloudinary.com. On the dashboard, copy the **Cloud name**,
   **API key** and **API secret** into:
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_FOLDER` = `uvm/dev` on your computer, `uvm/prod` on Netlify
2. **Important:** go to **Settings → Security** and turn on **"Allow
   delivery of PDF and ZIP files"**. Without it, PDF CVs and licences
   cannot be attached to the email.

Files are stored as **private** ("authenticated") files: they can only be
opened with the signed links in the company email.

## After changing `.env.local`

Stop `npm run dev` (Ctrl + C) and start it again: environment variables are
only read when the server starts. On Netlify, trigger a new deploy.
