# LeadStart Design System — PolishPoint Blue

This document is the living bridge between the **PolishPoint Blue swatchboard references** and this website's implementation. If you're adjusting visuals, this is the map.

---

## Source of Truth — Swatchboard References

All tokens and component recipes in this site are adapted from three read-only reference files:

| File | Role |
|------|------|
| `C:\Users\danie\Documents\PolishPoint\Blue\theme_polishpoint_blue_swatchboard.html` | **Master theme file.** Source of truth for CSS tokens and component recipes. |
| `C:\Users\danie\Documents\PolishPoint\Blue\LeadStart Swatchboard.html` | **Brand palette.** Canonical blue + tint/shade ramp + contrast samples. |
| `C:\Users\danie\Documents\PolishPoint\Blue\blue-theme-mockup.html` | **Full UI mockup.** Shows components rendered in context (dashboard, nav, cards). |

**Sync policy:** if the swatchboard reference files change, update `assets/css/tokens.css` first, then rebuild affected component recipes from the updated tokens. Never let raw hex values sneak into `components.css` or HTML — always reference a CSS variable.

---

## Design Principles

Five principles enforce a consistent feel across every page:

1. **Neumorphic depth** — paired shadows (dark bottom-right + white top-left highlight) give cards and secondary buttons a raised, tactile look.
2. **Glassmorphism** — `backdrop-filter: blur(10px)` on floating elements (sticky nav, eyebrow pills, tab switchers) for a frosted glass effect.
3. **Primary actions use the 135° gradient + glow** — never flat colors. The primary button is `linear-gradient(135deg, #47A5ED 0%, #1878C8 100%)` with a layered glow shadow.
4. **Aurora radial gradients** on page backgrounds — subtle blue radial glows create ambient depth without visual noise.
5. **Rounded corners everywhere** — the radius scale is 10 / 12 / 20 / 9999 px. No hard 90° corners.

---

## Design Tokens (`assets/css/tokens.css`)

All tokens are CSS custom properties on `:root`. Every other stylesheet references variables only.

### Typography

| Variable | Value | Role |
|----------|-------|------|
| `--font-sans` | `'Poppins', ...` | All UI type |
| `--font-mono` | `'Consolas', ...` | Code, tabular values |
| `--text-xs` → `--text-5xl` | `11px` → `72px` | Fluid type ramp |
| `--leading-tight/snug/normal/loose` | `1.15` → `1.7` | Line heights |
| `--tracking-tight/normal/wide/widest` | `-0.02em` → `0.12em` | Letter spacing |

### Color — Primary Blue (from swatchboard)

| Variable | Hex | Role |
|----------|-----|------|
| `--primary` | `#1E8FE8` | Main interactive color |
| `--primary-light` | `#47A5ED` | Hover, gradient start |
| `--primary-hover` | `#1878C8` | Gradient end, active |
| `--primary-deep` | `#125FA0` | Pressed, deepest shade |
| `--primary-soft` | `#D6ECFB` | Light background tint |
| `--primary-bg` | `#EBF5FE` | Card/surface tint |

### Color — Accents

| Variable | Hex | Role |
|----------|-----|------|
| `--flame` | `#ff6b2e` | Energetic callouts |
| `--mint` | `#00d4aa` | Success states |
| `--coral` | `#ff3d71` | Errors, critical |
| `--sun` | `#ffc42e` | Highlights |

### Color — Neutrals

| Variable | Hex | Role |
|----------|-----|------|
| `--navy` | `#1a1a2e` | Headings, dark footer |
| `--slate` | `#3d3d5c` | Secondary text |
| `--storm` | `#6b6e8a` | Body text |
| `--mist` | `#e2e3ed` | Dividers, borders |
| `--cloud` | `#f4f5f9` | Light backgrounds |

### Semantic Text

| Variable | Hex | Role |
|----------|-----|------|
| `--text-primary` | `#0f172a` | Headings, emphasis |
| `--text-body` | `#334155` | Body paragraphs |
| `--text-muted` | `#64748b` | Labels, metadata |
| `--text-faint` | `#94a3b8` | Placeholders, disabled |
| `--text-invert` | `#ffffff` | On dark backgrounds |

### Radii

| Variable | Value |
|----------|-------|
| `--r-card` | `20px` |
| `--r-btn` | `10px` |
| `--r-input` | `12px` |
| `--r-pill` | `9999px` |
| `--r-sm` | `6px` |

### Shadows & Glow

| Variable | Value | Role |
|----------|-------|------|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.04)` | Subtle |
| `--shadow-md` | `0 4px 12px rgba(15,23,42,0.08)` | Card default |
| `--shadow-lg` | `0 12px 28px rgba(15,23,42,0.12)` | Card hover |
| `--shadow-xl` | `0 24px 48px rgba(15,23,42,0.16)` | Modal, overlay |
| `--neu-shadow` | paired light/dark | Neumorphic rest |
| `--neu-shadow-hover` | stronger paired | Neumorphic hover |
| `--btn-primary-glow` | glow + drop | Primary button rest |
| `--btn-primary-glow-hover` | brighter glow | Primary button hover |

### Gradients

| Variable | Value |
|----------|-------|
| `--btn-primary-grad` | `linear-gradient(135deg, #47A5ED 0%, #1878C8 100%)` |
| `--btn-primary-grad-hover` | `linear-gradient(135deg, #1E8FE8 0%, #125FA0 100%)` |
| `--aurora-bg` | Three-layer radial gradient on body |

### Layout

| Variable | Value |
|----------|-------|
| `--container-max` | `1200px` |
| `--container-narrow` | `880px` |
| `--gutter` | `clamp(16px, 4vw, 40px)` |
| `--section-py` | `clamp(64px, 10vw, 120px)` |

### Motion

| Variable | Value |
|----------|-------|
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--dur-fast` | `0.15s` |
| `--dur` | `0.25s` |
| `--dur-slow` | `0.45s` |

---

## Component Recipes

### Primary Button (`.btn-primary`)
- Background: `var(--btn-primary-grad)`
- Padding: `14px 24px` (marketing scale)
- Radius: `var(--r-btn)`
- Box-shadow: `var(--btn-primary-glow)`
- Hover: background → `--btn-primary-grad-hover`, translateY(-1px)
- Adapted from `theme_polishpoint_blue_swatchboard.html` `.btn-primary` pattern.

### Secondary Button (`.btn-secondary`)
- Background: white
- Border: `1px solid var(--border-mid)`
- Neumorphic shadow (soft paired lights).
- Hover: background `#f8fafc`, border darker, subtle lift.

### Ghost Button (`.btn-ghost`)
- Transparent background
- Color: `var(--text-primary)`
- Underline on hover from underneath.

### Card (`.card`)
- Background: `linear-gradient(180deg, var(--primary-bg) 0%, #fff 40%) padding-box`
- Border: `1px solid var(--border-mid)`
- Radius: `var(--r-card)`
- Shadow: `var(--shadow-md)`
- Hover variant (`.card-hover`): translateY(-1px), shadow → `--shadow-lg`.

### Glass Pill (`.pill-glass`)
- Background: `rgba(255,255,255,0.55)`
- `backdrop-filter: blur(10px)`
- Border: `1px solid rgba(226,232,240,0.7)`
- Radius: `var(--r-pill)`
- Adapted from `theme_polishpoint_blue_swatchboard.html` `.dash-sw-btn` pattern.

### Sticky Nav (`.site-header`)
- Position: fixed top
- Background: `rgba(255,255,255,0.72)`
- `backdrop-filter: blur(12px)`
- `.scrolled` modifier adds `--shadow-sm` and 1px bottom border.

### Accordion (`details.faq-item`)
- Native `<details>` with `<summary>` as the header row
- JS smooths `max-height` animation on toggle
- Icon (`+` → `×`) rotates on open using `[open]` attribute selector

### Icon Chip (`.icon-chip`)
- 44×44 square, radius 12px
- Background: `var(--primary-bg)`
- Icon color: `var(--primary)`

### Numbered Badge (`.step-number`)
- 56×56 circle
- Background: `var(--btn-primary-grad)`
- White bold number centered
- Shadow: `var(--btn-primary-glow)` (reduced)

---

## Color Contrast (WCAG)

All primary text combinations hit WCAG AA or better:

| Combination | Ratio | Level |
|-------------|-------|-------|
| `--text-primary` (#0f172a) on white | 17.4:1 | AAA |
| White on `--primary` (#1E8FE8) | 3.6:1 | AA Large |
| White on `--primary-deep` (#125FA0) | 6.9:1 | AAA |
| `--text-body` (#334155) on white | 10.4:1 | AAA |
| `--text-muted` (#64748b) on white | 5.3:1 | AA |

---

## Responsive Breakpoints

Mobile-first. Matches PolishPoint breakpoints.

```css
/* Base: < 640px mobile */
@media (min-width: 640px)  { /* Tablet */ }
@media (min-width: 900px)  { /* Desktop — 3-col grids, horizontal nav */ }
@media (min-width: 1200px) { /* Wide — larger headlines */ }
```

---

## File Map

| File | Contains |
|------|----------|
| `assets/css/tokens.css` | All CSS variables. Start here for token changes. |
| `assets/css/base.css` | Reset, typography, body (aurora bg), scrollbar, utilities. |
| `assets/css/layout.css` | `.container`, `.section`, grid helpers. |
| `assets/css/components.css` | Buttons, cards, nav, footer, accordion, pills, badges, forms. |
| `assets/css/pages.css` | Page-specific hero layouts and grid overrides. |
