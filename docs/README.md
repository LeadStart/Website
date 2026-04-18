# LeadStart Website

Marketing site for **LeadStart** — outbound lead generation and nurture, built for commercial cleaning companies.

This is a plain static site: HTML + CSS + vanilla JavaScript. No framework, no build step, no dependencies to install. Open any `.html` file in a browser and it works.

---

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/index.html` | Hero, 3-phase process, features, pricing teaser, FAQ, CTA |
| How It Works | `/services.html` | Deep dive on Setup / Outreach / Nurture + week-by-week timeline |
| Pricing | `/pricing.html` | Full 3-tier pricing, setup-fee explainer, billing FAQ |
| About | `/about.html` | Founder intro, why LeadStart exists, ICP, differentiators |
| Contact | `/contact.html` | Book intro call CTA, phone, email, contact form |
| 404 | `/404.html` | Brand-consistent error page |

---

## Local preview

Two options:

**1. Open directly**
Double-click `index.html`. It loads in your default browser. All internal links use absolute paths (`/about.html`), so some may 404 when opened via `file://` — use option 2 for full navigation.

**2. Local server (recommended)**
From the project root:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Links and asset paths resolve cleanly.

Or, if you have Node.js:

```bash
npx serve .
```

---

## Deploy

The site is a flat folder of static files. It can be dropped onto any host that serves static assets.

**Netlify** — drag the entire project folder into the Netlify dashboard's deploys area. Done.

**Vercel** — `vercel` from the project root, accept defaults.

**GitHub Pages** — push the folder to a repo, enable Pages on the `main` branch.

**Cloudflare Pages** — connect the repo, leave build command blank, set publish directory to `/`.

No environment variables. No build step. No runtime.

---

## File map

```
LeadStart Website/
├── index.html                 # Home
├── services.html              # How It Works
├── pricing.html               # Pricing
├── about.html                 # About
├── contact.html               # Contact
├── 404.html                   # Error page
│
├── assets/
│   ├── css/
│   │   ├── tokens.css         # Design tokens (CSS variables)
│   │   ├── base.css           # Reset, typography, body bg, utilities
│   │   ├── layout.css         # Container, sections, grids
│   │   ├── components.css     # Buttons, cards, nav, footer, forms
│   │   └── pages.css          # Page-specific layouts
│   ├── js/
│   │   ├── nav.js             # Mobile drawer, sticky header scroll
│   │   ├── accordion.js       # FAQ animation
│   │   └── reveal.js          # IntersectionObserver fade-ins
│   └── img/
│       ├── logo.svg
│       └── logo-mark.svg
│
├── docs/
│   ├── README.md              # This file
│   ├── DESIGN_SYSTEM.md       # Swatchboard reference + token docs
│   ├── CONTENT.md             # All copy, page by page
│   └── COMPONENTS.md          # Component quick-reference
│
├── robots.txt
├── sitemap.xml
└── favicon.ico (optional)
```

---

## Editing content

All copy lives in `docs/CONTENT.md` as the source of truth. Change copy there first, then update the HTML to match. This keeps a reviewable text log separate from markup.

## Editing design

All colors, fonts, radii, shadows, gradients live in `assets/css/tokens.css` as CSS custom properties. Every other stylesheet references variables only — no raw hex values. Change a token once, it updates everywhere.

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the full token reference and the upstream swatchboard source of truth.

## Adding a page

1. Copy `about.html` as a template (it has the simplest structure: hero + content sections).
2. Update `<title>`, `<meta name="description">`, and OpenGraph tags.
3. Add an entry to the nav in the new page, and optionally in every other page's nav.
4. Add the URL to `sitemap.xml`.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses `backdrop-filter` (glass effect), CSS custom properties, `clamp()`, `IntersectionObserver`, native `<details>`. All of these are supported in browsers < 2 years old. No polyfills needed.

## Accessibility

- Skip-to-content link on every page
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Keyboard-navigable: tab order matches visual order, visible focus rings using primary blue
- `prefers-reduced-motion` disables reveal animations
- ARIA labels on icon-only buttons (hamburger, logo)
- Color contrast passes WCAG AA — see `DESIGN_SYSTEM.md` contrast table

## Phone number

`425-286-9732` appears in the footer and contact page as a `tel:` link (`tel:+14252869732`). If it changes, search across all HTML files.
