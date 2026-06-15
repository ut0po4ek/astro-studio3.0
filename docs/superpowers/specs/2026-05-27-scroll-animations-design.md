# Scroll Animations & UI Polish — Design Spec
Date: 2026-05-27

## Overview
Four independent animation improvements across the astro-studio site, inspired by the restaurant-site menu page.

---

## 1. Curved Scroll Line — Main Page (`index.astro`)

### What
An SVG curved path overlaid on `<main>`, drawn progressively as the user scrolls — identical mechanic to `restaurant-site/src/pages/menu.astro`.

### Placement
- Container: `<main>` in `index.astro` gets `data-scroll-line-region`
- Line spans from TrustStrip through CtaSection (everything below Hero)
- SVG is `position: absolute; inset: 0; pointer-events: none; z-index: 0`

### SVG Structure
Two `<path>` elements with the same `d` value:
- `.scroll-line-track` — ghost dashed path: `stroke-dasharray: 2 16`, 1px
- `.scroll-line-progress` — animated progress: 2px, drawn via `strokeDashoffset`

### Colors (adaptive)
```
dark:  track = rgba(201,169,110,0.14)   progress = #c9a96e
       glow  = drop-shadow(0 0 8px rgba(201,169,110,0.22))
light: track = rgba(26,26,26,0.10)     progress = #e8673a
       glow  = drop-shadow(0 0 8px rgba(232,103,58,0.18))
```
Implemented via `--scroll-line-track` and `--scroll-line-progress` CSS vars driven by `[data-theme]`.

### JavaScript
New function `initScrollLine()` in `astro-studio/src/layouts/BaseLayout.astro` (existing `<script>`):
```
- getTotalLength() on first run, cache as data-path-length
- On scroll: progress = clamp((viewport*0.65 - rect.top) / scrollableHeight)
- strokeDashoffset = length * (1 - progress)
- rAF-throttled, passive scroll listener
- prefers-reduced-motion: set dashoffset to 0 immediately
```

---

## 2. ServicesGrid Animation — `ServicesGrid.astro` (`services.astro`)

### What
Cards scale in with elastic overshoot when scrolled into view.

### Spec
- New reveal type: `data-reveal="scale-bounce"`
- Transform: `scale(0.85) → scale(1)`, `opacity: 0 → 1`
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring-like overshoot)
- Duration: 550ms
- Stagger: row-aware — cards 1-3 delay 0/80/160ms, cards 4-6 delay 320/400/480ms (gap between rows)
- Implementation: add `scale-bounce` case to the global `data-reveal` IntersectionObserver in `global.css` + `BaseLayout.astro`

### Change in ServicesGrid.astro
Replace `data-reveal` with `data-reveal="scale-bounce"` on each service card.

---

## 3. "Какой сайт вам нужен" Cards — `services.astro`

### What
4 cards in a 2×2 grid animate in with a 3D perspective flip from the top.

### Spec
- New reveal type: `data-reveal="flip-3d"`
- Transform: `perspective(600px) rotateX(-18deg) translateY(14px)` → `rotateX(0) translateY(0)`
- Opacity: `0 → 1`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Duration: 650ms
- Stagger: i × 80ms (0, 80, 160, 240ms)

### Change in services.astro
Replace `data-reveal` with `data-reveal="flip-3d"` on the 4 service type cards.

---

## 4. Process Numbers Golden Glow — `about.astro`

### What
Numbers `01`–`05` in the "Как мы работаем" section animate from near-invisible to mid-gold with a glow burst when their step enters the viewport.

### Spec
- `IntersectionObserver` on each `.process-step` (new class added to the step wrapper `div`)
- When intersecting: add `.num-visible` class to the `<span>` containing the number
- CSS `@keyframes num-glow`:
  ```
  0%:   color: var(--color-border);         text-shadow: none
  50%:  color: var(--color-accent);         text-shadow: 0 0 18px rgba(accent, 0.45)
  100%: color: color-mix(in srgb, var(--color-accent) 55%, transparent)
        text-shadow: 0 0 8px rgba(accent, 0.14)
  ```
- Duration: 1100ms, stagger: step index × 150ms via `animation-delay`
- Hover (`group-hover`) still transitions to 100% accent — preserved hierarchy
- `prefers-reduced-motion`: skip animation, jump to final `color-mix` state
- Observer fires once (`{ once: true }`)

---

## 5. Header Active vs Hover — `Header.astro`

### What
Active nav link is visually distinct from hover: accent color text + small dot indicator below.

### Current state
Both hover and `[aria-current="page"]` render: full text color + underline. Indistinguishable.

### Spec
**Hover** (unchanged):
```css
.header-nav-link:hover { color: var(--h-text); }
.header-nav-link:hover::after { right: 0; background: var(--color-accent); }
```

**Active** (changed):
```css
.header-nav-link[aria-current="page"] {
  color: var(--color-accent);  /* was var(--h-text) */
}
.header-nav-link[aria-current="page"]::after {
  right: 0;
  background: var(--color-accent);  /* underline stays, now accent-colored */
}
/* New — dot indicator */
.header-nav-link[aria-current="page"]::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-accent);
}
```
The `::before` pseudo-element is free (currently unused on `.header-nav-link`).

---

## Files Changed
1. `src/layouts/BaseLayout.astro` — add `initScrollLine()` + `scale-bounce` / `flip-3d` reveal cases
2. `src/styles/global.css` — add CSS for `scale-bounce`, `flip-3d`, `num-glow` keyframes
3. `src/pages/index.astro` — add `data-scroll-line-region` + SVG markup to `<main>`
4. `src/components/sections/ServicesGrid.astro` — `data-reveal="scale-bounce"`
5. `src/pages/services.astro` — `data-reveal="flip-3d"` on 4 cards
6. `src/pages/about.astro` — add `.process-step` class + `<script>` for glow observer
7. `src/components/layout/Header.astro` — update active link CSS

## Out of Scope
- Mobile-specific path adjustments for scroll line (can tune post-launch)
- Animation on portfolio/contacts pages
