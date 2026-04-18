# Components Quick Reference

A dev-facing cheat sheet of the reusable HTML/CSS patterns used across the LeadStart site. Each entry lists the minimal HTML snippet, required classes, available variants, and notes.

For the underlying design tokens (colors, radii, shadows, gradients), see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

## Buttons

```html
<a href="#" class="btn btn-primary">Book Intro Call</a>
```

Base class: `.btn` — flex layout, 2px border, radius `var(--r-btn)`, padding `12px 22px`, Poppins 600.

**Variants:**

| Class | Use when |
|-------|----------|
| `.btn-primary` | Primary CTA. Gradient fill, white text, glow shadow. |
| `.btn-secondary` | Neumorphic outlined button. Pairs with primary as a "ghost" option. |
| `.btn-ghost` | Transparent, primary-colored border + text. |
| `.btn-on-dark` | White fill, primary text — for use on dark/gradient backgrounds. |
| `.btn-ghost-on-dark` | Transparent with white border — for CTA bands. |

**Size modifiers:** `.btn-sm` (smaller padding/font), `.btn-lg` (larger).

**With icon** (preferred): embed an inline `<svg>` at the end — styled via `currentColor` to inherit text color.

```html
<a href="/contact.html" class="btn btn-primary btn-lg">
  Book Intro Call
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
</a>
```

---

## Pill (glass)

A small label pill with a colored dot, sits above section/page headlines.

```html
<span class="pill-glass">
  <span class="dot"></span>
  Built for commercial cleaning companies
</span>
```

Uses `backdrop-filter: blur(10px)`, translucent white background, `--r-pill` (9999px) for full rounding. The `.dot` is a solid primary-colored circle.

---

## Badge

Inline label for cards (e.g. "Most Popular", "On your intro call").

```html
<span class="badge badge-primary">Most Popular</span>
<span class="badge badge-soft">On your intro call</span>
```

**Variants:** `.badge-primary`, `.badge-soft`, `.badge-mint`, `.badge-flame`.

On pricing cards, add `.featured-badge` to the primary variant for absolute-positioning at the top.

---

## Card

Base container used throughout the site.

```html
<article class="card">
  <h3>Title</h3>
  <p>Body copy.</p>
</article>
```

Base class: `.card` — white gradient background, radius `var(--r-card)`, neumorphic shadow (`--shadow-md`), 2px translucent border.

**Modifiers:**
- `.card-hover` — adds lift + shadow intensification on hover
- `.card-gradient-border` — animated gradient border (used on featured pricing)
- `.process-card` — adds top padding for the `.step-number` badge
- `.contact-card` — adds inner spacing for stacked `.contact-item` rows
- `.price-card` — pricing-card layout with `.tier`, `.price`, `.leads-label`

---

## Step number

Numbered gradient circle, 56×56, used on process cards.

```html
<div class="step-number">1</div>
```

Sits above the card title. Background uses `--btn-primary-grad`, white bold text, `--btn-primary-glow` shadow.

---

## Icon chip

Small square icon container for feature cards.

```html
<div class="icon-chip" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Lucide-style icon path -->
  </svg>
</div>
```

48×48, soft blue gradient background (`--primary-soft` → `--primary-bg`), 2px white border, inner SVG inherits primary color.

---

## Check list

Bulleted list where each item gets a stylized checkmark instead of a bullet.

```html
<ul class="check-list">
  <li>Dedicated sending domains</li>
  <li>Double-verified prospect list</li>
</ul>
```

Checkmarks are rendered via a CSS `background-image` with an inline SVG — no extra markup needed per item.

---

## FAQ accordion

Native `<details>` with custom styling + JS-smoothed expand/collapse.

```html
<div class="faq-list" data-accordion-group>
  <details class="faq-item" data-accordion>
    <summary>
      Question text?
      <span class="faq-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </span>
    </summary>
    <div class="faq-body">
      <p>Answer text.</p>
    </div>
  </details>
  <!-- repeat... -->
</div>
```

- `data-accordion-group` on the wrapper enables single-open-at-a-time behavior.
- `data-accordion` on each `<details>` enables JS animation (without it, it still works as a plain `<details>` but without the smooth max-height transition).
- The `.faq-icon` SVG (plus sign) is rotated 45° on open via CSS to become an ×.

Script: `assets/js/accordion.js`.

---

## Pricing card

```html
<article class="price-card">
  <span class="tier">Starter</span>
  <div class="price">$500<span class="suffix">/ month</span></div>
  <div class="leads-label">5–10 qualified leads / mo</div>
  <ul>
    <li>Feature one</li>
    <li>Feature two</li>
  </ul>
  <a href="/contact.html" class="btn btn-secondary">Book Intro Call</a>
</article>
```

Featured variant (the middle card): add `.featured` to the article and include a `.featured-badge`.

```html
<article class="price-card featured">
  <span class="badge badge-primary featured-badge">Most Popular</span>
  <!-- ... -->
</article>
```

Featured cards scale to `1.03` on desktop and use the gradient border treatment.

---

## Guarantee ribbon

Full-width horizontal callout used below pricing grids.

```html
<div class="guarantee-ribbon">
  <span class="shield" aria-hidden="true">
    <svg><!-- shield-check icon --></svg>
  </span>
  <div>
    <strong>Money-back guarantee on every plan.</strong> Details...
  </div>
</div>
```

Soft-blue gradient background, 2px dashed-feel border, shield icon on the left.

---

## CTA band

Full-width section with gradient background, used as the closing push on every inner page.

```html
<section class="cta-band">
  <div class="container">
    <h2>Ready to grow beyond referrals?</h2>
    <p>Subhead copy.</p>
    <div class="row">
      <a href="/contact.html" class="btn btn-on-dark btn-lg">Book Intro Call</a>
      <a href="tel:+14252869732" class="btn btn-ghost-on-dark btn-lg">Call: 425-286-9732</a>
    </div>
  </div>
</section>
```

Gradient background `#125FA0 → #1E8FE8 → #47A5ED`, white text, white-fill button and white-border ghost button to read on dark.

---

## Page hero

Smaller hero for inner pages (about, pricing, services, contact, 404).

```html
<section class="page-hero">
  <div class="container-narrow">
    <span class="pill-glass mb-20"><span class="dot"></span> Label</span>
    <h1>Page headline.</h1>
    <p class="lead">Opening sentence that sets up the page.</p>
  </div>
</section>
```

Shorter vertical padding than the homepage hero. No decorative visual — text-only.

---

## Site header (nav)

Identical across every page. Has a sticky glass bar, an inline nav list, a right-side CTA button, and a hamburger that appears below 900px.

```html
<header class="site-header">
  <div class="nav">
    <a href="/" class="logo" aria-label="LeadStart home">...</a>
    <nav aria-label="Primary">
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <!-- ... -->
      </ul>
    </nav>
    <a href="/contact.html" class="btn btn-primary btn-sm nav-cta">Book Intro Call</a>
    <button class="hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileDrawer">
      <span></span>
    </button>
  </div>
</header>

<div class="mobile-drawer" id="mobileDrawer">
  <ul class="mobile-drawer-links">...</ul>
  <a href="/contact.html" class="btn btn-primary">Book Intro Call</a>
</div>
```

- Mark the current page's nav link with `class="active"` in both the primary nav and the drawer.
- `nav.js` toggles `.scrolled` on the header when `scrollY > 12` and handles drawer open/close, body scroll lock, and Escape key.

---

## Footer

Identical across every page. Four-column grid, collapses to 2-col / 1-col on smaller screens.

```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">... logo + blurb ...</div>
      <div><h5>Product</h5><ul>...</ul></div>
      <div><h5>Company</h5><ul>...</ul></div>
      <div>
        <h5>Get in touch</h5>
        <a href="tel:+14252869732" class="phone-link">... 425-286-9732</a>
        <a href="/contact.html" class="btn btn-primary btn-sm">Book Intro Call</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year">2026</span> LeadStart. All rights reserved.</span>
      <ul class="footer-bottom-links">...</ul>
    </div>
  </div>
</footer>
```

`<span id="year">` is populated by a 1-line inline script at the bottom of every page.

---

## Form controls

All form inputs use the same base `.input`, `.select`, `.textarea` classes. Wrap each field in a `.form-group` with a `.form-label`.

```html
<div class="form-group">
  <label class="form-label" for="email">Email</label>
  <input class="input" id="email" name="email" type="email" autocomplete="email" required />
</div>

<div class="form-group">
  <label class="form-label" for="volume">Volume</label>
  <select class="select" id="volume" name="volume">
    <option value="">Select an option</option>
    <option value="5-10">5–10 / month</option>
  </select>
</div>

<div class="form-group">
  <label class="form-label" for="message">Message</label>
  <textarea class="textarea" id="message" name="message" rows="4"></textarea>
</div>
```

Use `.grid.grid-2` around two `.form-group` wrappers to put them side-by-side on wider screens.

All controls: 2px border, radius `var(--r-input)`, focus state brings border to primary with a soft glow.

---

## Reveal animation

Any element can fade in on scroll by adding `data-reveal`:

```html
<h2 data-reveal>Section heading</h2>
<p data-reveal data-reveal-delay="0.1s">Body copy.</p>
<div class="row" data-reveal data-reveal-delay="0.2s">...</div>
```

`reveal.js` uses `IntersectionObserver` to add `.is-visible` once the element enters the viewport. CSS handles the fade + translateY. If the user has `prefers-reduced-motion: reduce`, all elements are marked visible immediately — no animation fires.

Use `data-reveal-delay` in seconds to stagger a group.

---

## Utilities

Inherited from `base.css`:

- **Spacing:** `mb-12`, `mb-16`, `mb-20`, `mb-24`, `mb-32`, `mt-16`, `mt-20`, `mt-24`
- **Type:** `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-muted`, `text-grad`, `font-600`, `font-700`
- **Layout:** `row` (flex, 16px gap), `stack` (flex column, 16px gap), `stack-lg` (24px gap)

Use utilities sparingly; prefer adding component-specific CSS when a pattern repeats 2+ times.
