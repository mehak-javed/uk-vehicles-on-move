# Runbook: running the website

Everything the site depends on, who should own it, and what to do when
something goes wrong. Account logins and keys are **not** stored here: keep
them in a password manager.

## Services

| Service                  | Used for                                     | Plan / limits (check the provider for current numbers)                   | Account owner |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------------ | ------------- |
| **GitHub**               | Code, pull requests, automated checks        | Free                                                                     | Developer     |
| **Netlify** (or Vercel)  | Hosting, HTTPS, deploys, preview links       | Free plan has monthly bandwidth and build limits; paid for the live site | Client        |
| **Domain registrar**     | The company domain and its DNS               | Yearly renewal                                                           | Client        |
| **Resend**               | Sending form emails                          | Free: about 3,000 emails/month, 100/day                                  | Client        |
| **Cloudinary**           | Private storage for CVs, licences, photos    | Free: 25 credits/month (storage + bandwidth)                             | Client        |
| **Cloudflare Turnstile** | Spam protection on the forms                 | Free                                                                     | Client        |
| **Company mailbox**      | Receives the form emails (e.g. Zoho, Google) | Depends on provider                                                      | Client        |

"Developer" accounts can move to the client later; for the others, the
client creates the account and invites the developer as a team member.

## Routine checks (monthly)

- [ ] Send a test contact form on the live site: both emails arrive.
- [ ] Resend → **Emails**: no bounced or failed emails.
- [ ] Cloudinary → usage under the free limit; delete old uploads that are
      no longer needed (CVs and licences of past applicants).
- [ ] Netlify → **Usage**: bandwidth and build minutes under the limit.
- [ ] GitHub → **Security**: no open Dependabot alerts.
- [ ] Domain renewal date is more than a month away.

## When something goes wrong

**A form says "Sorry, we couldn't send your form"**

1. Netlify → **Logs → Functions**: look for lines starting `[email]`.
2. "Email is not configured": `RESEND_API_KEY` or `EMAIL_COMPANY_INBOX`
   is missing in Netlify. Add it and redeploy.
3. "Resend error 403": the sending domain isn't verified, or the key was
   revoked. Check Resend → Domains and API keys.
4. "Resend error 429": the daily/monthly limit is reached. Upgrade the
   Resend plan.

**"We can't accept files right now" on the Drive With Us form**
Cloudinary keys are missing or wrong in Netlify. Check the three
`CLOUDINARY_*` variables and redeploy.

**"The security check did not pass"**
The Turnstile keys don't match, or the site's domain isn't in the widget's
hostname list in Cloudflare.

**A change didn't appear on the live site**
Netlify → **Deploys**: if the latest deploy failed, open it to see why. The
live site keeps the last working version until a deploy succeeds.
Changing an environment variable needs **Trigger deploy**.

**The site is down**
Check [Netlify status](https://www.netlifystatus.com). Roll back from
Netlify → **Deploys** → choose the last good deploy → **Publish deploy**.

## Rotating keys (if a key may have leaked)

1. Create a new key in the provider (Resend / Cloudinary / Cloudflare).
2. Update it in Netlify's environment variables and in your `.env.local`.
3. Trigger a deploy, test a form, then delete the old key.

## Privacy housekeeping

Form emails contain personal data. Delete driver applications and incident
reports from the inbox and Cloudinary once they are no longer needed, in line
with the [privacy policy](../src/app/privacy/page.tsx).
