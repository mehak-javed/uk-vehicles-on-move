# Changing text and photos

There is no admin area: content lives in a few files in the project. Change
the file, open a pull request, check the Netlify preview link, then merge.
The live site updates a few minutes later.

| What to change                         | Where                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Phone, WhatsApp, public email, socials | Netlify environment variables (see [LAUNCH.md](LAUNCH.md)), then redeploy                      |
| Menu links, footer links, gold banner  | `src/config/site.ts` (`mainNav`, `footerNav`, `announcements`)                                 |
| Services (text, photos) and FAQs       | `src/content/services.ts`                                                                      |
| Homepage sections (steps, cities…)     | `src/content/home.ts`                                                                          |
| Gallery photos                         | `src/content/gallery.ts` + images in `public/gallery/`                                         |
| About page text                        | `src/app/about/page.tsx`                                                                       |
| Privacy, cookie and terms pages        | `src/app/privacy`, `src/app/cookies`, `src/app/terms` (and the date in `src/content/legal.ts`) |
| Hero video                             | `public/home/` (see below)                                                                     |

## Adding or replacing gallery photos

1. Put the photos in `public/gallery/` (JPG, about 1600 px on the long side).
2. In `src/content/gallery.ts`, add one entry per photo with its `alt` (what
   the photo shows) and its `width` and `height` in pixels. The list order is
   the order on the page.
3. Delete photos from `public/gallery/` that are no longer listed.

## Replacing the hero video

Keep it short (10 to 20 seconds), silent, and under about 6 MB. Provide
three files in `public/home/`: `hero.mp4` (1080p), `hero-mobile.mp4` (720p)
and `hero-poster.jpg` (the first frame). Keep the original 4K file outside
the project.

## Updating the legal pages

After changing the privacy, cookie or terms text, update
`LEGAL_LAST_UPDATED` and `LEGAL_LAST_UPDATED_ISO` in
`src/content/legal.ts` so the "Last updated" date is correct.
