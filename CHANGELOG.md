# Changelog

All notable changes to this project. Format based on
[Keep a Changelog](https://keepachangelog.com/en-GB/1.1.0/).

## [Unreleased]

### Removed

- The News page and news articles, and their links in the menu, footer
  and sitemap.

## [1.0.0] – 2026-11-17

First version for client review.

### Pages

- Home: full-screen hero video, about teaser, services, latest news,
  announcement banner and UK coverage map.
- About, Services (with FAQs), Gallery, News and news articles, Contact.
- Get a Quote (4 steps), Drive With Us, Report an Incident.
- Privacy policy, Cookie policy, Terms & conditions.
- Branded 404 and error pages.

### Forms and email

- All four forms email the company inbox and send the customer a
  confirmation with a reference.
- Cloudflare Turnstile spam protection.
- CVs, licences and incident photos stored privately on Cloudinary and
  attached to the company email.

### Design and accessibility

- Transparent sticky header that adapts to dark and light sections.
- Responsive from 375 px phones to wide desktops; keyboard and
  screen-reader friendly; Lighthouse 100 for accessibility, best practices
  and SEO.

### Search, privacy and security

- Sitemap, robots.txt, canonical links, social sharing previews and
  LocalBusiness structured data.
- Cookie banner with Accept, Decline and Preferences; no tracking or
  analytics.
- Security headers (Content Security Policy, HSTS and others).

### Quality

- 43 unit tests and 42 browser tests (desktop and phone), run on every pull
  request.
