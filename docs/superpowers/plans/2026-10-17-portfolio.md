# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A bilingual (English + Persian) one-page portfolio for Ali Mahmoudi on GitHub Pages.

**Architecture:** Static files only. `index.html` (English) and `fa/index.html` (Persian, RTL) share `assets/site.css`. A Node script `tools/check.mjs` is the test suite: it fails on broken local links/images, em dashes, or the two pages drifting apart.

**Tech Stack:** HTML, CSS, Node 24 (check script only, no dependencies), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-17-portfolio-design.md`

## Global Constraints

- Name: "Ali Mahmoudi" on `/`, "علی محمودی" on `/fa/`. The word "crystal" never appears in visible text.
- Palette: bg `#0F2624`, raised `#132E2B`, text `#E7EFEA`, muted `#93A9A3`, line `#2A4542`, accent `#C8F169`, text-on-accent `#0F2624`.
- Fonts self-hosted woff2: Manrope (400/600/800), Vazirmatn (400/600/800).
- No em dash or en dash in any page. No "expert", "senior", years of experience, invented numbers.
- Telegram: `https://t.me/CRYSTAL69855`. GitHub: `https://github.com/CRYSTAL6985`. Email: none yet.
- No payment claim for ABRISHAM.

## Review Focus

- Phone width (360px): no sideways scroll, nav fits on one line, buttons don't wrap → check.mjs can't see this; verify with a 360px headless screenshot in Task 3 and 4.
- Persian page with Latin words (Node.js, WordPress, URLs) must not scramble in RTL → wrap Latin runs in `<bdi>` or `dir="ltr"`; check in the Task 4 screenshot.
- Language switch must land on the matching page from both sides (`/` ↔ `/fa/`) → check.mjs asserts each page links to the other.
- Pages under `/fa/` must resolve relative asset paths (`../assets/...`) → check.mjs resolves every local `src`/`href` from the page's own folder.
- Images need width/height so the layout doesn't jump while loading → check.mjs asserts every `<img>` has `width`, `height`, `alt`.

---

### Task 1: Check script

**Files:**
- Create: `tools/check.mjs`, `package.json` (`"check": "node tools/check.mjs"`)
- Delete: TinDog files `index.html`, `style.css`, `images/` (TinDog is preserved in the `tindog` repo)

**Interfaces:**
- Produces: `npm run check` exits 0 when the site is valid, 1 with one line per problem otherwise.

- [ ] **Step 1:** Write `tools/check.mjs`. For each of `index.html` and `fa/index.html` it reports: missing file; any `—` or `–`; any local `src`/`href` (not `http`, `mailto:`, `#`) that does not resolve from the page's folder; any `<img>` without `alt`, `width` and `height`; the English page lacks a link to `fa/` or the Persian page lacks a link to `../`; the visible text contains "crystal" (case-insensitive, after stripping tags and URLs); the set of `<section id="...">` ids differs between the two pages.
- [ ] **Step 2:** Run `npm run check`. Expected: FAIL (`index.html missing`, `fa/index.html missing`).
- [ ] **Step 3:** Commit `chore: replace TinDog with portfolio check script`.

### Task 2: Assets

**Files:**
- Create: `assets/fonts/*.woff2`, `assets/img/abrisham-home.webp`, `abrisham-shop.webp`, `abrisham-product.webp`, `abrisham-phone.webp`

- [ ] **Step 1:** Download the six woff2 files (Latin subset for Manrope, Arabic+Latin for Vazirmatn).
- [ ] **Step 2:** Screenshot https://abrishambtq.ir with headless Chrome: home and shop at 1440×900, one product page at 1440×900, home at 390×844. Save as webp, quality ~80, longest side ≤1600px.
- [ ] **Step 3:** Confirm every file is under 300 KB. Commit `feat: add fonts and ABRISHAM screenshots`.

### Task 3: English page

**Files:**
- Create: `assets/site.css`, `index.html`

**Interfaces:**
- Produces: CSS classes reused by Task 4; section ids `work`, `services`, `contact`.

- [ ] **Step 1:** Write `index.html` with: nav (name, Work, Services, Contact, `فا` → `fa/`); hero with this copy:
  - H1: "Hi, I'm Ali Mahmoudi."
  - Lead: "I'm at the start of my web development journey, and I build websites for shops and small businesses. I'm open to your ideas."
  - Buttons: "See my work" (#work), "Message me on Telegram".
  - Image: ABRISHAM homepage.
- [ ] **Step 2:** `#work`: ABRISHAM case study using the content facts in the spec, live link, desktop + phone screenshots, tags Node.js / Express / SQLite / Persian + English.
- [ ] **Step 3:** `#services`: "Two ways I build" with WordPress (cheaper and quicker to launch; you edit text and photos yourself) and custom Node.js (costs more; made exactly for your business, faster, no plugins that break or get hacked), then "Not sure which you need? Tell me about your business and I'll suggest one." and one line that he works with AI coding agents.
- [ ] **Step 4:** `#contact`: Telegram (primary) and GitHub buttons. Footer "Ali Mahmoudi, 2026".
- [ ] **Step 5:** `npm run check` → only `fa/index.html missing`. Screenshot at 1440 and 360 wide; no overflow.
- [ ] **Step 6:** Commit `feat: English portfolio page`.

### Task 4: Persian page

**Files:**
- Create: `fa/index.html`

- [ ] **Step 1:** Same sections and ids as Task 3, `<html lang="fa" dir="rtl">`, Persian copy, `EN` → `../`, assets via `../assets/`.
- [ ] **Step 2:** `npm run check` → PASS. Screenshot at 1440 and 360; Latin words read correctly.
- [ ] **Step 3:** Commit `feat: Persian portfolio page`.

### Task 5: Publish

- [ ] **Step 1:** `git push origin main` (normal push, history kept).
- [ ] **Step 2:** Wait for Pages; `curl -s https://crystal6985.github.io/ | grep "Ali Mahmoudi"` and same for `/fa/` with `علی محمودی`. Headless screenshot of the live URL.
