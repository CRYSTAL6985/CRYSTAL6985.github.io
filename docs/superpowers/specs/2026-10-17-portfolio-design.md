# Portfolio site: design

Date: 2026-10-17. Agreed in chat with Ali; he approved building it ("make it").

## Why

Ali wants a site to link from Freelancer, Upwork and Ponisha profiles that wins him
**website** jobs. He noticed freelancers with their own site get the most contracts.
It replaces the TinDog course page at `crystal6985.github.io` (TinDog now lives at
`crystal6985.github.io/tindog/`).

## Goals

- Show his finished work. Today that is one project: ABRISHAM, a live boutique shop.
- Say plainly what he offers: websites built with WordPress or custom Node.js.
- Make it easy to contact him on Telegram (primary), GitHub, and email.
- Be in English and Persian, each a full page, with a switch between them.
- Look good enough that the site itself is proof of the work.

## Non-goals

- No blog or posts feed for now. He may add posts later; nothing is built for them yet.
- No CMS, no server, no build step. Adding a project means editing HTML and pushing.
- No projects that aren't websites or apps we built (no IELTS app, no Persian slides,
  no CodeHabit).

## Anti-goals (would make it a failure even if it works)

- Text that reads as AI-written: slogans like "I build websites that go live", filler
  verbs, cute wordplay. Copy is in Ali's own voice, lightly cleaned up.
- Claims he can't back up on a call: no "expert", "senior", years of experience, or
  invented stats or reply-time promises.
- The AI-default look: purple glow on dark, cream and gold, Inter everywhere.
- The word "crystal" anywhere on the page. He wants his real name only.

## Decided by Ali

- **Name:** Ali Mahmoudi / علی محمودی. English letters on the English page, Persian on
  the Persian page.
- **Voice:** "starting my web dev journey, open to your ideas". Two ways to build:
  WordPress (cheaper, quicker, client edits it) and custom Node.js (costs more, built
  exactly for the business).
- **Look:** the "Karun night" direction: deep river green background, light text, one
  lime accent.
- **Hosting:** free GitHub Pages now, paid domain later.
- **Telegram:** @CRYSTAL69855. **Email:** he will send it later.

## Claude's calls (he can override)

- Plain HTML + CSS, a few lines of JS at most. English at `/`, Persian at `/fa/`.
- One theme (dark). The chosen palette is a dark one, so there is no light mode.
- Fonts self-hosted (Manrope for Latin, Vazirmatn for Persian), so the page doesn't
  depend on Google Fonts loading from Iran.
- ABRISHAM is a case study section on the homepage, not a separate page, while it is
  the only project. Real screenshots from the live site, desktop and phone.
- No prices on the page; "WordPress costs less" is enough until he picks real numbers.
- The email button stays out until he gives the address (no broken link).
- AI coding agents are mentioned once, plainly, as how he works.
- No photo of him unless he provides one.

## Content facts (ABRISHAM)

Live at https://abrishambtq.ir. Built with Node.js, Express and SQLite. Persian and
English with right-to-left layout. Catalogue with categories and filters, cart, customer
accounts, an admin panel with a two-step sign-in (password plus emailed code), and
automatic database backups. Hosted on Parspack with its own domain and SSL. The shop
belongs to his uncle. Online payment (ZarinPal) is not live yet, so the page must not
claim it.

## Done means

- Both pages pass a check: every local link and image resolves, no em dashes, and both
  languages have the same sections.
- Readable at phone width with no sideways scroll.
- Live at `https://crystal6985.github.io/` and `/fa/`, checked with a real browser.
