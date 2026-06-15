# Astro Studio 2.0 — Premium Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade astro-studio into a premium portfolio site (2.0) with Dark Tech Indigo + Lavender Mist design system, React islands, and Framer Motion v11+ animations throughout every section.

**Architecture:** Copy astro-studio source into the already-created `astro-studio 2.0` directory, update design tokens in `global.css`, add `@astrojs/react` + `framer-motion`, then progressively convert key sections to animated React islands while leaving server code and content data untouched.

**Tech Stack:** Astro 6, Tailwind CSS v4, React 19, Framer Motion v11, TypeScript, Netlify Functions

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add react, react-dom, @astrojs/react, framer-motion |
| `astro.config.mjs` | Modify | Add react() integration |
| `tsconfig.json` | Modify | Add JSX react-jsx preset |
| `src/styles/global.css` | Modify | Replace all design tokens, add gradient utilities |
| `src/components/layout/Header.astro` | Modify | Gradient logo, indigo nav underline, indigo mobile menu |
| `src/components/layout/Footer.astro` | Modify | Gradient border-top, gradient logo, hover underlines |
| `src/components/layout/PageTransition.tsx` | Create | AnimatePresence page fade |
| `src/components/layout/BaseLayout.astro` | Modify | Add PageTransition + CustomCursor islands |
| `src/components/sections/HeroSplit.astro` | Modify | Animated orbs, grid pattern, indigo scroll-line |
| `src/components/sections/HeroText.tsx` | Create | Stagger word-reveal island |
| `src/components/sections/ProjectSlider.tsx` | Create | Drag + spring physics island |
| `src/components/sections/ServiceCards.tsx` | Create | Stagger + hover gradient island |
| `src/components/sections/ServicesGrid.astro` | Modify | Replace static cards with ServiceCards island |
| `src/components/sections/PortfolioGrid.tsx` | Create | whileInView stagger + hover overlay island |
| `src/components/sections/FeaturedWork.astro` | Modify | Use PortfolioGrid island |
| `src/components/sections/ProcessSteps.tsx` | Create | Connecting lines + stagger island |
| `src/components/sections/ProcessSection.astro` | Modify | Use ProcessSteps island |
| `src/components/sections/WhyStats.tsx` | Create | Animated counters island |
| `src/components/sections/WhySection.astro` | Modify | Use WhyStats island |
| `src/components/sections/CtaSection.astro` | Modify | Animated orb bg, pulsing button glow |
| `src/components/sections/ContactSection.astro` | Modify | Floating labels, indigo focus states |
| `src/components/ui/CustomCursor.tsx` | Create | Magnetic cursor island |
| `src/components/ui/Button.astro` | Modify | Gradient primary variant, gradient border secondary |
| `src/components/portfolio/CaseGallery.tsx` | Create | Lightbox with AnimatePresence + layoutId |
| `src/components/portfolio/TagFilter.tsx` | Create | Animated filter pills with layoutId highlight |
| `src/pages/index.astro` | Modify | Wire all islands |
| `src/pages/portfolio/index.astro` | Modify | TagFilter island + PortfolioGrid island |
| `src/pages/portfolio/[slug].astro` | Modify | Parallax hero + CaseGallery island |
| `src/pages/services.astro` | Modify | Indigo tokens, FAQ accordion |
| `src/pages/about.astro` | Modify | Indigo tokens, WhyStats island |
| `src/pages/contacts.astro` | Modify | Indigo tokens |

---

## Task 1: Project Setup — Copy source and install dependencies

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Copy astro-studio into astro-studio 2.0**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land"
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.astro' \
  "astro-studio/" "astro-studio 2.0/"
```

- [ ] **Step 2: Update package.json — add React + Framer Motion**

Replace `"astro-studio 2.0/package.json"` with:

```json
{
  "name": "astro-studio-v2",
  "type": "module",
  "version": "2.0.0",
  "description": "Astro Studio 2.0 — premium portfolio site",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.9",
    "@astrojs/react": "^4.3.0",
    "@astrojs/sitemap": "^3.7.2",
    "@netlify/functions": "^5.2.2",
    "@tailwindcss/vite": "^4.3.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "astro": "^6.3.1",
    "framer-motion": "^11.18.0",
    "nodemailer": "^8.0.7",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.3.0",
    "typescript": "^6.0.3"
  },
  "devDependencies": {
    "@types/nodemailer": "^8.0.0"
  }
}
```

- [ ] **Step 3: Update astro.config.mjs — add React integration**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

const site = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://astro-studio-v2.netlify.app';

export default defineConfig({
  site,
  redirects: {
    '/portfolio/portofino': '/portfolio/piccolino',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), sitemap()],
});
```

- [ ] **Step 4: Update tsconfig.json — enable React JSX**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true,
    "allowImportingTsExtensions": true
  }
}
```

- [ ] **Step 5: Install dependencies**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0"
npm install
```

Expected: `npm install` completes without errors, `node_modules/framer-motion` exists.

- [ ] **Step 6: Verify dev server starts**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0"
npm run dev
```

Expected: `localhost:4321` opens and shows original astro-studio design (gold accent). No errors in terminal.

- [ ] **Step 7: Commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0"
git add package.json astro.config.mjs tsconfig.json
git commit -m "feat: add React + Framer Motion integration"
```

---

## Task 2: Design Tokens — Replace global.css color system

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace all CSS custom properties in `:root` / `[data-theme="dark"]`**

Find the block starting with `:root,` and replace it with:

```css
:root,
[data-theme="dark"] {
  --color-bg:            #0c0c14;
  --color-bg-warm:       #111124;
  --color-bg-dark:       #0a0a12;
  --color-bg-elevated:   #111124;
  --color-bg-subtle:     #0a0a12;
  --color-fg:            #e2e8f0;
  --color-fg-muted:      #64748b;
  --color-fg-subtle:     #334155;
  --color-accent:        #818cf8;
  --color-accent-2:      #c084fc;
  --color-accent-dark:   #6366f1;
  --color-border:        rgba(129, 140, 248, 0.12);
  --color-border-dark:   rgba(129, 140, 248, 0.07);
  --color-border-bright: rgba(129, 140, 248, 0.28);

  --gradient-accent: linear-gradient(135deg, #818cf8, #c084fc);
  --gradient-glow:   radial-gradient(ellipse at center, rgba(129,140,248,0.15) 0%, transparent 70%);

  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout:  cubic-bezier(0.4, 0, 0.2, 1);

  /* Buttons */
  --btn-primary-bg:           #818cf8;
  --btn-primary-text:         #ffffff;
  --btn-primary-border:       #818cf8;
  --btn-primary-hover-bg:     #6366f1;
  --btn-primary-hover-text:   #ffffff;
  --btn-primary-hover-border: #6366f1;

  --btn-secondary-bg:           transparent;
  --btn-secondary-text:         #e2e8f0;
  --btn-secondary-border:       rgba(129, 140, 248, 0.30);
  --btn-secondary-hover-bg:     rgba(129, 140, 248, 0.08);
  --btn-secondary-hover-text:   #e2e8f0;
  --btn-secondary-hover-border: rgba(129, 140, 248, 0.55);

  --btn-accent-bg:           #818cf8;
  --btn-accent-text:         #ffffff;
  --btn-accent-border:       #818cf8;
  --btn-accent-hover-bg:     #6366f1;
  --btn-accent-hover-text:   #ffffff;
  --btn-accent-hover-border: #6366f1;

  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         #64748b;
  --btn-ghost-border:       transparent;
  --btn-ghost-hover-bg:     rgba(129, 140, 248, 0.06);
  --btn-ghost-hover-text:   #e2e8f0;
  --btn-ghost-hover-border: transparent;

  /* Glass / Header */
  --glass-hero-bg:       rgba(12, 12, 20, 0.40);
  --glass-hero-border:   rgba(129, 140, 248, 0.10);
  --glass-hero-text:     rgba(226, 232, 240, 0.95);
  --glass-hero-text-m:   rgba(226, 232, 240, 0.50);
  --glass-hero-cta-bd:   rgba(129, 140, 248, 0.40);
  --glass-scroll-bg:     rgba(12, 12, 20, 0.90);
  --glass-scroll-border: rgba(129, 140, 248, 0.12);
  --glass-scroll-text:   rgba(226, 232, 240, 0.95);
  --glass-scroll-text-m: rgba(226, 232, 240, 0.50);
  --glass-scroll-cta-bd: rgba(129, 140, 248, 0.40);

  /* Legacy compat */
  --button-primary-bg:             #818cf8;
  --button-primary-hover-bg:       #6366f1;
  --button-secondary-bg:           rgba(129, 140, 248, 0.06);
  --button-secondary-border:       rgba(129, 140, 248, 0.25);
  --button-secondary-hover-bg:     rgba(129, 140, 248, 0.12);
  --button-secondary-hover-border: rgba(129, 140, 248, 0.45);

  /* Scroll Line */
  --scroll-line-track:    rgba(129, 140, 248, 0.14);
  --scroll-line-progress: #818cf8;
  --scroll-line-glow:     rgba(129, 140, 248, 0.30);
}
```

- [ ] **Step 2: Replace `[data-theme="light"]` block**

```css
[data-theme="light"] {
  --color-bg:            #f5f3ff;
  --color-bg-warm:       #ede9fe;
  --color-bg-dark:       #1e1b4b;
  --color-bg-elevated:   #ffffff;
  --color-bg-subtle:     #ede9fe;
  --color-fg:            #1e1b4b;
  --color-fg-muted:      #6b7280;
  --color-fg-subtle:     #9ca3af;
  --color-accent:        #4f46e5;
  --color-accent-2:      #9333ea;
  --color-accent-dark:   #4338ca;
  --color-border:        rgba(79, 70, 229, 0.12);
  --color-border-dark:   rgba(79, 70, 229, 0.07);
  --color-border-bright: rgba(79, 70, 229, 0.28);

  --gradient-accent: linear-gradient(135deg, #4f46e5, #9333ea);
  --gradient-glow:   radial-gradient(ellipse at center, rgba(79,70,229,0.12) 0%, transparent 70%);

  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout:  cubic-bezier(0.4, 0, 0.2, 1);

  /* Buttons */
  --btn-primary-bg:           #4f46e5;
  --btn-primary-text:         #ffffff;
  --btn-primary-border:       #4f46e5;
  --btn-primary-hover-bg:     #4338ca;
  --btn-primary-hover-text:   #ffffff;
  --btn-primary-hover-border: #4338ca;

  --btn-secondary-bg:           transparent;
  --btn-secondary-text:         #1e1b4b;
  --btn-secondary-border:       rgba(79, 70, 229, 0.30);
  --btn-secondary-hover-bg:     rgba(79, 70, 229, 0.06);
  --btn-secondary-hover-text:   #1e1b4b;
  --btn-secondary-hover-border: rgba(79, 70, 229, 0.55);

  --btn-accent-bg:           #4f46e5;
  --btn-accent-text:         #ffffff;
  --btn-accent-border:       #4f46e5;
  --btn-accent-hover-bg:     #4338ca;
  --btn-accent-hover-text:   #ffffff;
  --btn-accent-hover-border: #4338ca;

  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         #6b7280;
  --btn-ghost-border:       transparent;
  --btn-ghost-hover-bg:     rgba(79, 70, 229, 0.05);
  --btn-ghost-hover-text:   #1e1b4b;
  --btn-ghost-hover-border: transparent;

  /* Glass / Header */
  --glass-hero-bg:       rgba(245, 243, 255, 0.80);
  --glass-hero-border:   rgba(79, 70, 229, 0.10);
  --glass-hero-text:     rgba(30, 27, 75, 0.95);
  --glass-hero-text-m:   rgba(30, 27, 75, 0.55);
  --glass-hero-cta-bd:   rgba(79, 70, 229, 0.35);
  --glass-scroll-bg:     rgba(245, 243, 255, 0.94);
  --glass-scroll-border: rgba(79, 70, 229, 0.10);
  --glass-scroll-text:   rgba(30, 27, 75, 0.95);
  --glass-scroll-text-m: rgba(30, 27, 75, 0.55);
  --glass-scroll-cta-bd: rgba(79, 70, 229, 0.40);

  /* Legacy */
  --button-primary-bg:             #4f46e5;
  --button-primary-hover-bg:       #4338ca;
  --button-secondary-bg:           rgba(79, 70, 229, 0.05);
  --button-secondary-border:       rgba(79, 70, 229, 0.25);
  --button-secondary-hover-bg:     rgba(79, 70, 229, 0.10);
  --button-secondary-hover-border: rgba(79, 70, 229, 0.40);

  /* Scroll Line */
  --scroll-line-track:    rgba(79, 70, 229, 0.09);
  --scroll-line-progress: #4f46e5;
  --scroll-line-glow:     rgba(79, 70, 229, 0.22);
}
```

- [ ] **Step 3: Add gradient text utility + grid pattern utility + glow utility to `@layer utilities`**

Add after the existing `.bento-grid` block at the end of the utilities layer:

```css
/* Gradient text — applies accent gradient as text color */
.gradient-text {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Grid pattern background for dark sections */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
[data-theme="light"] .bg-grid-pattern {
  background-image:
    linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Gradient glow orb */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform;
  pointer-events: none;
}

/* Pulsing glow for CTA button */
@keyframes pulse-glow {
  0%   { box-shadow: 0 0 0 0 rgba(129,140,248,0.45); }
  70%  { box-shadow: 0 0 0 18px rgba(129,140,248,0); }
  100% { box-shadow: 0 0 0 0 rgba(129,140,248,0); }
}
[data-theme="light"] {
  @keyframes pulse-glow {
    0%   { box-shadow: 0 0 0 0 rgba(79,70,229,0.40); }
    70%  { box-shadow: 0 0 0 18px rgba(79,70,229,0); }
    100% { box-shadow: 0 0 0 0 rgba(79,70,229,0); }
  }
}
.btn-pulse { animation: pulse-glow 2.2s infinite; }

/* Animated orbs in hero/cta */
@keyframes orb-drift-1 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(60px, -40px) scale(1.15); }
}
@keyframes orb-drift-2 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-50px, 60px) scale(0.9); }
}
@keyframes orb-drift-3 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 50px) scale(1.1); }
}
.orb-1 { animation: orb-drift-1 22s ease-in-out infinite alternate; }
.orb-2 { animation: orb-drift-2 28s ease-in-out infinite alternate; }
.orb-3 { animation: orb-drift-3 18s ease-in-out infinite alternate; }

/* portfolio card -- gradient hover */
.portfolio-card:hover {
  border-color: rgba(129, 140, 248, 0.35);
  box-shadow: 0 20px 60px rgba(129,140,248,0.12);
}
[data-theme="light"] .portfolio-card:hover {
  border-color: rgba(79,70,229,0.25);
  box-shadow: 0 20px 60px rgba(79,70,229,0.08);
}

/* tag-chip active/hover — indigo */
.tag-chip.active,
.tag-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(129,140,248,0.08);
}
[data-theme="light"] .tag-chip.active,
[data-theme="light"] .tag-chip:hover {
  background: rgba(79,70,229,0.06);
}
```

- [ ] **Step 4: Update `html` base styles — add Inter font features**

Find the `html` rule in `@layer base` and update:

```css
html {
  font-family: system-ui, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-feature-settings: "cv01", "cv03", "cv04";
  background-color: var(--color-bg);
  color: var(--color-fg);
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 5: Update `num-glow` keyframes to indigo**

Replace the `num-glow` animation values:

```css
@keyframes num-glow {
  0%   {
    color: var(--color-border);
    text-shadow: none;
  }
  50%  {
    color: var(--color-accent);
    text-shadow: 0 0 18px var(--num-glow-color, rgba(129,140,248,0.50));
  }
  100% {
    color: color-mix(in srgb, var(--color-accent) 55%, transparent);
    text-shadow: 0 0 8px var(--num-glow-color-soft, rgba(129,140,248,0.18));
  }
}
```

And update the glow token rules:

```css
:root[data-theme="dark"],
:root:not([data-theme="light"]) {
  --num-glow-color:      rgba(129, 140, 248, 0.50);
  --num-glow-color-soft: rgba(129, 140, 248, 0.18);
}
:root[data-theme="light"] {
  --num-glow-color:      rgba(79, 70, 229, 0.45);
  --num-glow-color-soft: rgba(79, 70, 229, 0.14);
}
```

- [ ] **Step 6: Verify tokens render in browser**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0"
npm run dev
```

Open `localhost:4321`. The hero background should be `#0c0c14`, accent color should be indigo `#818cf8`. Portfolio cards should have indigo border on hover. Theme toggle switches to lavender `#f5f3ff`.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: replace design tokens — Dark Tech Indigo + Lavender Mist"
```

---

## Task 3: Button.astro — Gradient primary + gradient border secondary

**Files:**
- Modify: `src/components/ui/Button.astro`

- [ ] **Step 1: Replace primary button with gradient background**

Open `src/components/ui/Button.astro`. Find the `btn-primary` class and the inline style logic. Update the component to inject gradient for primary variant:

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'submit';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  pulse?: boolean;
  [key: string]: unknown;
}

const {
  href,
  variant = 'primary',
  size = 'md',
  type = 'button',
  class: className = '',
  disabled = false,
  pulse = false,
  ...rest
} = Astro.props;

const classes = [
  'btn',
  `btn-${variant}`,
  `btn-${size}`,
  pulse ? 'btn-pulse' : '',
  className,
].filter(Boolean).join(' ');
---

{href ? (
  <a href={href} class={classes} {...rest}>
    <slot />
  </a>
) : (
  <button type={type} class={classes} disabled={disabled} {...rest}>
    <slot />
  </button>
)}
```

- [ ] **Step 2: Add gradient overrides to global.css `btn-primary` section**

After the existing `.btn-primary` rules, add:

```css
/* Gradient primary — indigo→violet bg */
.btn-primary {
  background: var(--gradient-accent);
  background-color: transparent; /* fallback overridden by gradient */
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 0 0 rgba(129,140,248,0);
  transition:
    box-shadow     360ms var(--ease-out),
    transform      360ms var(--ease-out),
    filter         360ms var(--ease-out);
}
.btn-primary:hover:not(:disabled):not([aria-disabled="true"]) {
  transform: translateY(-2px);
  box-shadow: 0 0 28px rgba(129,140,248,0.40);
  filter: brightness(1.1);
}
[data-theme="light"] .btn-primary:hover:not(:disabled):not([aria-disabled="true"]) {
  box-shadow: 0 0 28px rgba(79,70,229,0.35);
}
```

- [ ] **Step 3: Verify in browser — primary buttons should show indigo→violet gradient**

Open `localhost:4321`. Hero "Обсудить проект" button should be gradient. No white text issues.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Button.astro src/styles/global.css
git commit -m "feat: gradient primary button + pulse utility"
```

---

## Task 4: Header — Gradient logo + indigo nav underline

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Update logo to split gradient**

Find the logo `<a>` element. Replace `{siteConfig.shortName}` with:

```astro
<a
  href="/"
  class="header-logo text-sm font-medium tracking-[0.15em] uppercase flex items-center gap-0"
  aria-label={`${siteConfig.name} — на главную`}
>
  <span>Astro</span><span class="gradient-text">&nbsp;Studio</span>
</a>
```

- [ ] **Step 2: Update nav underline colour to gradient in `<style>`**

Find `.header-nav-link::after` and update:

```css
.header-nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 100%;
  height: 1px;
  background: var(--gradient-accent);
  transition: right 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 3: Update active dot to gradient**

Find `.header-nav-link[aria-current="page"]` `::before` pseudo-element and update:

```css
.header-nav-link[aria-current="page"] {
  color: var(--color-accent);
}
.header-nav-link[aria-current="page"]::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gradient-accent);
}
```

- [ ] **Step 4: Update mobile menu border and CTA border to indigo**

In `.mobile-menu` style, update the hardcoded `#3a3630` border values:

```css
.mobile-menu {
  --mobile-menu-text: #e2e8f0;
  background: var(--color-bg-dark);
  ...
}
```

Replace all `border-[#3a3630]` in the mobile menu HTML with `border-[var(--color-border-bright)]`.

- [ ] **Step 5: Update mobile menu `--mobile-menu-text` for light theme**

After `.mobile-menu` rule add:

```css
[data-theme="light"] .mobile-menu {
  --mobile-menu-text: #1e1b4b;
  background: var(--color-bg-subtle);
}
```

- [ ] **Step 6: Verify — logo shows "Astro" plain + "Studio" gradient, nav underline is indigo**

Open `localhost:4321`. Hover nav links — underline should animate in as indigo/violet gradient.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: header gradient logo + indigo nav underline"
```

---

## Task 5: Footer — Gradient border + gradient logo

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Read current footer**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/components/layout/Footer.astro"
```

- [ ] **Step 2: Add gradient top border and gradient logo**

Replace the footer's top border style with a pseudo-element gradient. At the top of `<footer>` element add a `before` pseudo approach via inline style, or use a wrapper div:

```astro
<footer class="relative" style="background: var(--color-bg-dark);">
  <!-- Gradient top border -->
  <div
    aria-hidden="true"
    style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--color-accent),var(--color-accent-2),transparent);"
  ></div>

  <div class="container-site pt-16 pb-8">
    <!-- Logo -->
    <div class="flex items-center gap-0 text-sm font-medium tracking-[0.15em] uppercase mb-4">
      <span style="color:var(--color-fg);">Astro</span>
      <span class="gradient-text">&nbsp;Studio</span>
    </div>
    <!-- ... rest of footer content unchanged ... -->
  </div>
</footer>
```

- [ ] **Step 3: Add hover gradient underline on footer links**

In footer `<style>` block add:

```css
.footer-link {
  position: relative;
  padding-bottom: 1px;
  transition: color 200ms ease;
}
.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 100%;
  height: 1px;
  background: var(--gradient-accent);
  transition: right 280ms var(--ease-out);
}
.footer-link:hover::after { right: 0; }
.footer-link:hover { color: var(--color-fg); }
```

Apply class `footer-link` to all nav `<a>` elements in the footer.

- [ ] **Step 4: Verify footer gradient border renders**

Open `localhost:4321`, scroll to bottom. Gradient line should appear at top of footer.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: footer gradient border + gradient logo + hover underlines"
```

---

## Task 6: HeroSplit — Animated orbs + grid pattern

**Files:**
- Modify: `src/components/sections/HeroSplit.astro`

- [ ] **Step 1: Add orbs and grid pattern to hero background**

Inside `<section id="hero">`, after the opening tag and before the existing `hero-curve-wrap`, add:

```astro
<!-- Animated gradient orbs -->
<div class="orb orb-1" style="width:600px;height:600px;top:-100px;left:-150px;background:radial-gradient(ellipse,rgba(129,140,248,0.22) 0%,transparent 70%);" aria-hidden="true"></div>
<div class="orb orb-2" style="width:500px;height:500px;top:30%;right:-100px;background:radial-gradient(ellipse,rgba(192,132,252,0.18) 0%,transparent 70%);" aria-hidden="true"></div>
<div class="orb orb-3" style="width:400px;height:400px;bottom:0;left:40%;background:radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%);" aria-hidden="true"></div>

<!-- Grid pattern overlay -->
<div class="absolute inset-0 bg-grid-pattern pointer-events-none" aria-hidden="true"></div>
```

Also add `overflow: hidden` to the section to contain orbs:

```astro
<section
  id="hero"
  class="relative min-h-screen flex items-center overflow-hidden"
  style="background: var(--color-bg);"
  aria-label="Главный экран"
>
```

- [ ] **Step 2: Update hero-curve stroke to indigo**

Find `stroke="var(--color-accent)"` — this already uses the token, so the scroll-line color updates automatically. Verify `.scroll-line-progress` uses `--scroll-line-progress` (already does).

- [ ] **Step 3: Update the hero badge to indigo**

Find the badge `<span>`:

```astro
<span class="inline-block text-[10px] font-medium tracking-[0.25em] uppercase border border-[var(--color-border-bright)] text-[var(--color-accent)] px-3 py-1.5 rounded-full" style="background: rgba(129,140,248,0.06);">
  Web Studio / Design &amp; Development
</span>
```

- [ ] **Step 4: Update hero H1 accent word to gradient**

Find the `<em>` inside H1. Replace:

```astro
<h1
  class="font-light leading-[1.05]"
  style="font-size: clamp(2.5rem, 7vw, 5.5rem); letter-spacing: -0.03em; color: var(--color-fg);"
  data-reveal
  data-reveal-delay="100"
>
  Создаём сайты,<br />
  которые <em class="gradient-text" style="font-style:normal;">выглядят</em><br />
  дорого и продают
</h1>
```

- [ ] **Step 5: Update stat values to accent colour**

Find the stats map `{ value: '4', ... }`. The `value` spans use `text-[var(--color-accent)]` — already correct, will render indigo automatically.

- [ ] **Step 6: Verify orbs render, hero looks premium**

Open `localhost:4321`. Should see slow-drifting indigo/violet orbs in the background. Grid pattern subtle but visible. Gradient text on "выглядят".

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/HeroSplit.astro
git commit -m "feat: hero animated gradient orbs + grid pattern + gradient text"
```

---

## Task 7: HeroText.tsx — Stagger word-reveal React island

**Files:**
- Create: `src/components/sections/HeroText.tsx`
- Modify: `src/components/sections/HeroSplit.astro`

- [ ] **Step 1: Create HeroText.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const word = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const accentWord = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
  },
};

const subtitle = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
  },
};

const buttons = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.72 },
  },
};

const stats = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.88 },
  },
};

interface Props {
  ctaHref: string;
  portfolioHref: string;
  ctaLabel: string;
  statsItems: { value: string; label: string }[];
}

export default function HeroText({ ctaHref, portfolioHref, ctaLabel, statsItems }: Props) {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? { initial: 'visible', animate: 'visible' }
    : { initial: 'hidden', animate: 'visible' };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Badge */}
      <motion.div variants={word} {...motionProps}>
        <span
          className="inline-block text-[10px] font-medium tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
          style={{
            border: '1px solid var(--color-border-bright)',
            color: 'var(--color-accent)',
            background: 'rgba(129,140,248,0.06)',
          }}
        >
          Web Studio / Design &amp; Development
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-light leading-[1.05]"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-fg)',
        }}
        variants={container}
        {...motionProps}
      >
        <motion.span variants={word} style={{ display: 'inline-block' }}>Создаём</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>сайты,</motion.span>
        <br />
        <motion.span variants={word} style={{ display: 'inline-block' }}>которые</motion.span>
        {' '}
        <motion.em
          variants={accentWord}
          style={{
            fontStyle: 'normal',
            display: 'inline-block',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          выглядят
        </motion.em>
        <br />
        <motion.span variants={word} style={{ display: 'inline-block' }}>дорого</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>и</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>продают</motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="leading-relaxed max-w-md"
        style={{
          color: 'var(--color-fg-muted)',
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
        }}
        variants={subtitle}
        {...motionProps}
      >
        Astro Studio — web-studio для брендов, которым нужен современный сайт, лендинг или визуальная упаковка под запуск.
      </motion.p>

      {/* CTA buttons */}
      <motion.div className="flex flex-wrap gap-3" variants={buttons} {...motionProps}>
        <a
          href={ctaHref}
          className="btn btn-primary btn-lg btn-pulse"
        >
          {ctaLabel}
        </a>
        <a href={portfolioHref} className="btn btn-secondary btn-lg">
          Смотреть портфолио
        </a>
      </motion.div>

      {/* Stat divider */}
      <motion.div
        style={{ height: '1px', background: 'var(--color-border)', transformOrigin: 'left center' }}
        initial={prefersReduced ? {} : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
      />

      {/* Stats */}
      <motion.div className="flex flex-wrap gap-6" variants={stats} {...motionProps}>
        {statsItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span
              className="font-medium text-lg"
              style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {item.value}
            </span>
            <span
              className="text-xs tracking-wide uppercase"
              style={{ color: 'var(--color-fg-subtle)' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Update HeroSplit.astro to use HeroText island**

Replace the entire `<!-- Left: text -->` column in `HeroSplit.astro` with:

```astro
---
import Button from '../ui/Button.astro';
import ProjectSliderIsland from './ProjectSlider';
import HeroText from './HeroText';
import { siteConfig } from '../../config/site';

const statsItems = [
  { value: '4', label: 'проекта' },
  { value: '100%', label: 'адаптивность' },
  { value: '→', label: 'запуск под ключ' },
];
---
...
<!-- Left: text -->
<div class="flex flex-col gap-6 lg:gap-8">
  <HeroText
    client:load
    ctaHref={siteConfig.cta.href}
    portfolioHref="/portfolio"
    ctaLabel={siteConfig.cta.label}
    statsItems={statsItems}
  />
</div>
```

Remove the old static badge, h1, p, buttons, stat-line, and stats divs — they are now inside HeroText.tsx.

- [ ] **Step 3: Remove now-unused `data-reveal` attributes from HeroSplit left column**

The static `data-reveal` attributes are replaced by FM animations. Remove them from the left column (they still work on the right column slider until Task 8).

- [ ] **Step 4: Verify stagger animation**

Hard-refresh `localhost:4321`. Words should appear one-by-one with blur-in effect, then subtitle fades, then buttons appear.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroText.tsx src/components/sections/HeroSplit.astro
git commit -m "feat: HeroText React island with stagger word-reveal animation"
```

---

## Task 8: ProjectSlider.tsx — Drag + spring physics island

**Files:**
- Create: `src/components/sections/ProjectSlider.tsx`
- Modify: `src/components/sections/HeroSplit.astro`

- [ ] **Step 1: Create ProjectSlider.tsx**

```tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Project {
  slug: string;
  title: string;
  tags: string[];
  image: { src: string };
  liveUrl?: string;
}

interface Props {
  projects: Project[];
}

export default function ProjectSlider({ projects }: Props) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const prefersReduced = useReducedMotion();

  const goTo = (idx: number) => setCurrent((idx + projects.length) % projects.length);

  const handleDragStart = (_: unknown, info: { point: { x: number } }) => {
    dragStartX.current = info.point.x;
    setIsDragging(true);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false);
    if (info.offset.x < -50) goTo(current + 1);
    else if (info.offset.x > 50) goTo(current - 1);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/10' }}>
      {/* Offset decorative border */}
      <motion.div
        className="absolute pointer-events-none rounded-xl"
        style={{
          inset: 0,
          border: '1px solid var(--color-border-bright)',
          zIndex: 0,
        }}
        initial={prefersReduced ? {} : { opacity: 0, x: 8, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      />

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag={prefersReduced ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={prefersReduced ? {} : { opacity: 0 }}
          whileDrag={{ rotate: isDragging ? -1.5 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
        >
          <img
            src={projects[current].image.src}
            alt={projects[current].title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            draggable={false}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,20,0.75) 0%, rgba(12,12,20,0.1) 50%, transparent 100%)' }} />
          {/* Caption */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {projects[current].tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: '100px',
                    background: 'rgba(129,140,248,0.25)', color: 'rgba(226,232,240,0.9)',
                    backdropFilter: 'blur(8px)', border: '1px solid rgba(129,140,248,0.3)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ color: 'rgba(226,232,240,0.92)', fontSize: '0.875rem', fontWeight: 500 }}>
              {projects[current].title}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators with layoutId */}
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '6px', zIndex: 10 }}>
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Слайд ${i + 1}`}
            style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 16 }}
          >
            {i === current ? (
              <motion.span
                layoutId="slider-dot-active"
                style={{
                  display: 'block', height: 6, width: 24, borderRadius: 3,
                  background: 'var(--gradient-accent)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            ) : (
              <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(226,232,240,0.35)' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update HeroSplit.astro right column to use ProjectSlider island**

In HeroSplit.astro, find the `<!-- Right: slider -->` column. Replace `<ProjectSlider />` (the old .astro) with the new React island:

```astro
---
// At top of frontmatter, add:
import ProjectSliderIsland from './ProjectSlider';
import { getFeaturedProjects } from '../../data/portfolio';
const sliderProjects = getFeaturedProjects().map(p => ({
  slug: p.slug,
  title: p.title,
  tags: p.tags,
  image: { src: p.image.src },
  liveUrl: p.liveUrl,
}));
---

<!-- Right: slider -->
<div class="relative" data-reveal data-reveal-delay="200">
  <ProjectSliderIsland client:load projects={sliderProjects} />
</div>
```

- [ ] **Step 3: Delete old ProjectSlider.astro to avoid confusion**

```bash
rm "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/components/sections/ProjectSlider.astro"
```

- [ ] **Step 4: Verify slider works — drag left/right changes slide with spring**

Open `localhost:4321`. Drag the hero slider left/right. Should spring back if not enough offset, should change slide if offset > 50px. Dots should animate with `layoutId`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProjectSlider.tsx src/components/sections/HeroSplit.astro
git commit -m "feat: ProjectSlider React island — drag gesture + spring physics + layoutId dots"
```

---

## Task 9: ServiceCards.tsx — Stagger + hover gradient island

**Files:**
- Create: `src/components/sections/ServiceCards.tsx`
- Modify: `src/components/sections/ServicesGrid.astro`

- [ ] **Step 1: Create ServiceCards.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';

interface Service {
  icon: string;
  title: string;
  description: string;
  label: string;
}

interface Props {
  services: Service[];
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function ServiceCards({ services }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      variants={container}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {services.map((service) => (
        <motion.div
          key={service.title}
          variants={cardVariant}
          whileHover={prefersReduced ? {} : { scale: 1.02, y: -3 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="group flex flex-col gap-4 p-8 rounded-xl"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient hover overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'var(--gradient-accent)', borderRadius: '0.75rem' }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.4 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <motion.span
              className="text-2xl"
              style={{ color: 'var(--color-border)', fontStyle: 'normal' }}
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-hidden="true"
            >
              {service.icon}
            </motion.span>
            <span
              className="tag-chip"
              style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {service.label}
            </span>
          </div>

          <h3
            className="font-medium"
            style={{ fontSize: '1rem', color: 'var(--color-fg)', letterSpacing: 0, position: 'relative' }}
          >
            {service.title}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-fg-muted)', position: 'relative' }}
          >
            {service.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Update ServicesGrid.astro to use ServiceCards island**

```astro
---
import SectionHeading from '../ui/SectionHeading.astro';
import ServiceCards from './ServiceCards';

const services = [
  { icon: '◻', title: 'Web Design', description: 'Проектируем современные интерфейсы для сайтов, лендингов и digital-продуктов.', label: 'Design' },
  { icon: '◈', title: 'Лендинги', description: 'Создаём продающие страницы для услуг, продуктов, мероприятий и запусков.', label: 'Landing' },
  { icon: '◉', title: 'Разработка', description: 'Верстаем адаптивные сайты, подключаем формы, интеграции и готовим к запуску.', label: 'Dev' },
  { icon: '◫', title: 'E-commerce', description: 'Разрабатываем интернет-магазины с понятной структурой покупки и удобным UX.', label: 'E-comm' },
  { icon: '◬', title: '3D Visuals', description: 'Создаём объёмные визуалы, промо-графику и эффектные hero-сцены для бренда.', label: '3D' },
  { icon: '◪', title: 'Brand & UI', description: 'Помогаем бренду выглядеть цельно: от визуальной системы до деталей интерфейса.', label: 'Brand' },
];
---

<section id="services" class="section-padding" style="background: var(--color-bg);">
  <div class="container-site">
    <SectionHeading
      label="Услуги"
      title="Что мы делаем"
      subtitle="Проектируем структуру сайта вокруг цели: заявки, продажи, доверие."
      class="mb-12"
    />
    <ServiceCards client:visible services={services} />
  </div>
</section>
```

- [ ] **Step 3: Verify service cards stagger in on scroll**

Scroll to services section. Cards should animate in sequentially with spring bounce. Hover should show subtle gradient overlay + scale.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ServiceCards.tsx src/components/sections/ServicesGrid.astro
git commit -m "feat: ServiceCards React island — stagger + spring hover + gradient overlay"
```

---

## Task 10: PortfolioGrid.tsx — whileInView stagger + hover overlay

**Files:**
- Create: `src/components/sections/PortfolioGrid.tsx`
- Modify: `src/components/sections/FeaturedWork.astro`

- [ ] **Step 1: Create PortfolioGrid.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  image: { src: string };
}

interface Props {
  projects: Project[];
  basePath?: string;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PortfolioGrid({ projects, basePath = '/portfolio' }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
      variants={container}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {projects.map((project) => (
        <motion.div key={project.slug} variants={card}>
          <motion.a
            href={`${basePath}/${project.slug}`}
            className="portfolio-card group relative block overflow-hidden rounded-xl"
            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
            whileHover={prefersReduced ? {} : { y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            aria-label={`Кейс: ${project.title}`}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <motion.img
                src={project.image.src}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                whileHover={prefersReduced ? {} : { scale: 1.07 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,20,0.75) 0%, rgba(12,12,20,0.1) 50%, transparent 100%)' }} />

              {/* Hover slide-up overlay */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '1.25rem',
                  background: 'linear-gradient(to top, rgba(129,140,248,0.55) 0%, transparent 60%)',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Открыть кейс →
                </span>
              </motion.div>

              {/* Case Study badge */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '100px', background: 'rgba(12,12,20,0.55)', color: 'rgba(226,232,240,0.85)', backdropFilter: 'blur(8px)' }}>
                  Case Study
                </span>
              </div>

              {/* Tags */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', maxWidth: '60%' }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '100px', background: 'rgba(129,140,248,0.25)', color: 'rgba(226,232,240,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(129,140,248,0.3)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <h3
                  style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-fg)', letterSpacing: 0, transition: 'color 300ms ease' }}
                  className="group-hover:text-[var(--color-accent)]"
                >
                  {project.title}
                </h3>
                <svg
                  style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-fg-subtle)', transition: 'all 300ms ease' }}
                  className="group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <line x1="0" y1="14" x2="14" y2="0"/>
                  <polyline points="5,0 14,0 14,9"/>
                </svg>
              </div>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.75rem', lineHeight: 1.6 }} className="line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Update FeaturedWork.astro to use PortfolioGrid island**

```astro
---
import SectionHeading from '../ui/SectionHeading.astro';
import PortfolioGrid from './PortfolioGrid';
import Button from '../ui/Button.astro';
import { getFeaturedProjects } from '../../data/portfolio';

const featured = getFeaturedProjects().slice(0, 4).map(p => ({
  slug: p.slug,
  title: p.title,
  shortDescription: p.shortDescription,
  tags: p.tags,
  image: { src: p.image.src },
}));
---

<section class="section-padding" style="background: var(--color-bg-warm);">
  <div class="container-site">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <SectionHeading
        label="Portfolio"
        title="Избранные проекты"
        subtitle="Сайты, лендинги и визуальные решения, которые мы создаём для бизнеса."
      />
      <Button href="/portfolio" variant="secondary" size="sm" class="shrink-0">
        Все проекты →
      </Button>
    </div>
    <PortfolioGrid client:visible projects={featured} />
  </div>
</section>
```

- [ ] **Step 3: Verify portfolio cards stagger + hover overlay**

Scroll to portfolio section. Cards stagger in. Hover shows indigo gradient overlay with "Открыть кейс →". Card lifts `y(-4px)`.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/PortfolioGrid.tsx src/components/sections/FeaturedWork.astro
git commit -m "feat: PortfolioGrid island — whileInView stagger + hover slide-up overlay"
```

---

## Task 11: ProcessSteps.tsx + WhyStats.tsx islands

**Files:**
- Create: `src/components/sections/ProcessSteps.tsx`
- Create: `src/components/sections/WhyStats.tsx`
- Modify: `src/components/sections/ProcessSection.astro`
- Modify: `src/components/sections/WhySection.astro`

- [ ] **Step 1: Read current ProcessSection.astro and WhySection.astro**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/components/sections/ProcessSection.astro"
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/components/sections/WhySection.astro"
```

- [ ] **Step 2: Create ProcessSteps.tsx**

```tsx
import { motion, useReducedMotion } from 'framer-motion';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export default function ProcessSteps({ steps }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          className="process-step group"
          style={{
            display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
            padding: '1.5rem', borderRadius: '0.75rem',
            border: '1px solid transparent',
            position: 'relative',
          }}
          initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
          whileHover={prefersReduced ? {} : {
            x: 4,
            borderColor: 'var(--color-border-bright)',
            backgroundColor: 'var(--color-bg-elevated)',
          }}
        >
          {/* Connecting line (not on last item) */}
          {i < steps.length - 1 && (
            <motion.div
              style={{
                position: 'absolute', left: '2.75rem', top: '100%',
                width: '1px', height: '100%', transformOrigin: 'top',
                background: 'linear-gradient(to bottom, var(--color-border-bright), transparent)',
                zIndex: 0,
              }}
              initial={prefersReduced ? {} : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 + 0.4 }}
            />
          )}

          {/* Number */}
          <motion.span
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 200,
              letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0, width: '3rem',
              color: 'var(--color-border)',
              position: 'relative', zIndex: 1,
            }}
            whileInView={{ color: 'var(--color-accent)', textShadow: '0 0 18px rgba(129,140,248,0.4)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 + 0.2 }}
            aria-hidden="true"
          >
            {step.number}
          </motion.span>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-fg)', marginBottom: '0.375rem' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: 1.65 }}>
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create WhyStats.tsx**

```tsx
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, useReducedMotion } from 'framer-motion';

function AnimatedNumber({ to, suffix = '' }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView || prefersReduced) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [isInView, to, count, prefersReduced]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

interface WhyItem {
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  statNum?: number;
  statSuffix?: string;
}

interface Props {
  items: WhyItem[];
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function WhyStats({ items }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      variants={container}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {items.map((w) => (
        <motion.div
          key={w.title}
          variants={item}
          className="why-card"
          style={{
            padding: '1.5rem 1.75rem', borderRadius: '0.75rem',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}
        >
          {w.statNum !== undefined && (
            <div
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 200,
                letterSpacing: '-0.03em', lineHeight: 1,
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              <AnimatedNumber to={w.statNum} suffix={w.statSuffix ?? ''} />
            </div>
          )}
          {w.stat && !w.statNum && (
            <div style={{ fontSize: '1.75rem', fontWeight: 200, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {w.stat}
            </div>
          )}
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-fg)' }}>{w.title}</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', lineHeight: 1.65 }}>{w.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 4: Update ProcessSection.astro to pass steps data to island**

Read the existing steps data from ProcessSection.astro. Replace the static grid with:

```astro
---
import SectionHeading from '../ui/SectionHeading.astro';
import ProcessSteps from './ProcessSteps';

const steps = [
  { number: '01', title: 'Бриф и анализ', description: 'Изучаем задачу, аудиторию и конкурентов. Определяем цели сайта и ключевые сценарии.' },
  { number: '02', title: 'Дизайн', description: 'Проектируем структуру, создаём дизайн в Figma. Согласовываем и вносим правки.' },
  { number: '03', title: 'Разработка', description: 'Верстаем адаптивный сайт, подключаем формы, анимации и интеграции.' },
  { number: '04', title: 'Запуск', description: 'Тестируем, оптимизируем и запускаем. Передаём всё необходимое для дальнейшей работы.' },
];
---

<section id="process" class="section-padding" style="background: var(--color-bg-dark);">
  <div class="container-site">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      <SectionHeading
        label="Процесс"
        title="Как мы работаем"
        subtitle="Прозрачный процесс без неожиданностей — от брифа до запуска."
      />
      <ProcessSteps client:visible steps={steps} />
    </div>
  </div>
</section>
```

- [ ] **Step 5: Update WhySection.astro to use WhyStats island**

Read WhySection.astro. Replace static why-cards with:

```astro
---
import SectionHeading from '../ui/SectionHeading.astro';
import WhyStats from './WhyStats';

const whyItems = [
  { stat: '→', title: 'Под ключ', description: 'От идеи до запущенного сайта — без лишних согласований и ожидания.' },
  { statNum: 100, statSuffix: '%', title: 'Адаптивность', description: 'Каждый проект идеально работает на любом устройстве и в любом браузере.' },
  { stat: '∞', title: 'Внимание к деталям', description: 'Типографика, анимации, переходы — всё выверено до последнего пикселя.' },
  { statNum: 4, title: 'Завершённых проекта', description: 'Реальные кейсы с живыми ссылками. Смотри, как выглядит результат.' },
  { stat: '0', title: 'Generic-решений', description: 'Никаких шаблонов и конструкторов — только авторский дизайн под твою задачу.' },
  { stat: '24h', title: 'Время ответа', description: 'Отвечаем на вопросы в рабочие дни. Держим тебя в курсе на каждом этапе.' },
];
---

<section id="why" class="section-padding" style="background: var(--color-bg);">
  <div class="container-site">
    <SectionHeading
      label="Почему мы"
      title="Что делает нас другими"
      subtitle="Работаем быстро, качественно и без воды."
      class="mb-12"
    />
    <WhyStats client:visible items={whyItems} />
  </div>
</section>
```

- [ ] **Step 6: Verify in browser**

Scroll to Process section — steps should animate in from left with stagger, numbers glow indigo, connecting lines draw in between steps. Hover lifts and shows indigo border.

Scroll to Why section — cards stagger in with spring, number counters animate from 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ProcessSteps.tsx src/components/sections/WhyStats.tsx \
  src/components/sections/ProcessSection.astro src/components/sections/WhySection.astro
git commit -m "feat: ProcessSteps + WhyStats islands — connecting lines + animated counters"
```

---

## Task 12: CtaSection + ContactSection — Premium polish

**Files:**
- Modify: `src/components/sections/CtaSection.astro`
- Modify: `src/components/sections/ContactSection.astro`

- [ ] **Step 1: Update CtaSection.astro with animated orbs + pulse button**

Read the current file, then add orbs inside and update the CTA button to use `pulse` prop:

```astro
<section id="cta" class="section-padding relative overflow-hidden" style="background: var(--color-bg-dark);">
  <!-- Orbs -->
  <div class="orb orb-1" style="width:500px;height:500px;top:-100px;left:-100px;background:radial-gradient(ellipse,rgba(129,140,248,0.18) 0%,transparent 70%);" aria-hidden="true"></div>
  <div class="orb orb-2" style="width:400px;height:400px;bottom:-80px;right:-80px;background:radial-gradient(ellipse,rgba(192,132,252,0.15) 0%,transparent 70%);" aria-hidden="true"></div>
  <!-- Grid pattern -->
  <div class="absolute inset-0 bg-grid-pattern pointer-events-none" aria-hidden="true"></div>

  <div class="container-site relative z-10 text-center">
    <!-- content unchanged, but add gradient text to headline -->
    <!-- and add pulse prop to primary button -->
    <Button href={siteConfig.cta.href} variant="primary" size="lg" pulse>
      {siteConfig.cta.label}
    </Button>
  </div>
</section>
```

Read the actual CTA content from the file and preserve all text, adding only the orbs, grid, gradient headline, and pulse to button.

- [ ] **Step 2: Update ContactSection.astro — floating labels + indigo focus**

Find all `<input>` and `<textarea>` elements in ContactSection. Update the field styles so on focus:
- `border-color` transitions to `var(--color-accent)`
- `box-shadow: 0 0 0 3px rgba(129,140,248,0.12)`

Add to the ContactSection `<style>` block:

```css
.contact-field:focus-within label {
  transform: translateY(-1.25rem) scale(0.8);
  color: var(--color-accent);
}
.contact-field input:focus,
.contact-field textarea:focus,
.contact-field select:focus {
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 3px rgba(129,140,248,0.12);
}
[data-theme="light"] .contact-field input:focus,
[data-theme="light"] .contact-field textarea:focus {
  box-shadow: 0 0 0 3px rgba(79,70,229,0.10);
}
```

- [ ] **Step 3: Verify CTA has orbs + pulse button**

Open `localhost:4321`. Scroll to CTA — should see slow-drifting indigo/violet orbs. Primary button should pulse glow.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CtaSection.astro src/components/sections/ContactSection.astro
git commit -m "feat: CtaSection animated orbs + pulse button, ContactSection indigo focus states"
```

---

## Task 13: CustomCursor.tsx — Magnetic cursor

**Files:**
- Create: `src/components/ui/CustomCursor.tsx`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create CustomCursor.tsx**

```tsx
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [label, setLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isLink = el.closest('a, button');
      const isCard = el.closest('.portfolio-card');
      if (isCard) {
        setLabel('Открыть');
        setIsHovering(true);
      } else if (isLink) {
        setLabel('');
        setIsHovering(true);
      }
    };

    const onLeave = () => {
      setIsHovering(false);
      setLabel('');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'exclusion',
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? (label ? 64 : 36) : 8,
          height: isHovering ? (label ? 64 : 36) : 8,
          opacity: isHovering ? 0.85 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          borderRadius: '50%',
          background: 'var(--gradient-accent, linear-gradient(135deg,#818cf8,#c084fc))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap',
              mixBlendMode: 'normal',
            }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add CustomCursor to BaseLayout.astro**

In `src/layouts/BaseLayout.astro`, inside `<body>` before `<slot />`, add:

```astro
---
// Add to imports
import CustomCursor from '../components/ui/CustomCursor';
---

<body>
  <CustomCursor client:load />
  <slot />
</body>
```

Also add `cursor: none` to `body` in the layout's `<style>` or in `global.css`:

```css
@media (hover: hover) and (pointer: fine) {
  body { cursor: none; }
  a, button { cursor: none; }
}
```

- [ ] **Step 3: Verify custom cursor on desktop**

Open `localhost:4321` on a desktop browser. The default cursor should be hidden. A small indigo dot should follow the mouse with spring lag. Hovering links should expand the dot. Hovering portfolio cards should show "Открыть" label.

- [ ] **Step 4: Verify mobile — cursor not visible, default cursor works**

Open `localhost:4321` on mobile emulation. No custom cursor dot. Touch interactions work normally.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CustomCursor.tsx src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: CustomCursor magnetic spring cursor with portfolio card label"
```

---

## Task 14: CaseGallery.tsx + Portfolio slug page — Parallax + Lightbox

**Files:**
- Create: `src/components/portfolio/CaseGallery.tsx`
- Modify: `src/pages/portfolio/[slug].astro`

- [ ] **Step 1: Read current [slug].astro**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/pages/portfolio/[slug].astro"
```

- [ ] **Step 2: Create CaseGallery.tsx**

```tsx
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Props {
  images: GalleryImage[];
}

export default function CaseGallery({ images }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={() => setSelected(i)}
            className="relative overflow-hidden rounded-lg"
            style={{ aspectRatio: '4/3', cursor: 'pointer', display: 'block', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            layoutId={`gallery-thumb-${i}`}
            aria-label={`Открыть изображение ${i + 1}`}
          >
            <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <span style={{ color: '#fff', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Открыть</span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(10,10,18,0.95)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              layoutId={`gallery-thumb-${selected}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '0.75rem', overflow: 'hidden', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selected].src}
                alt={images[selected].alt}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
              />
            </motion.div>

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Закрыть"
              style={{
                position: 'fixed', top: '1.5rem', right: '1.5rem',
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)',
                color: '#e2e8f0', fontSize: '1.125rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>

            {/* Prev / Next */}
            {selected > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
                aria-label="Предыдущее"
                style={{ position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                ←
              </button>
            )}
            {selected < images.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
                aria-label="Следующее"
                style={{ position: 'fixed', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Update portfolio/[slug].astro — parallax hero + CaseGallery island**

Find the hero image section in `[slug].astro`. Add parallax wrapper and replace static gallery with island:

At the top of the frontmatter, add import:
```astro
import CaseGallery from '../../components/portfolio/CaseGallery';
```

Replace the hero image block with:
```astro
<!-- Hero with parallax via CSS -->
<div class="case-hero relative overflow-hidden" style="height: clamp(340px, 55vw, 640px);">
  <div class="case-hero-img-wrap">
    <img
      src={project.image.src}
      alt={project.title}
      class="case-hero-img"
      loading="eager"
    />
  </div>
  <div class="absolute inset-0" style="background: linear-gradient(to bottom, transparent 40%, var(--color-bg) 100%);"></div>
</div>
```

Add in `<style>`:
```css
.case-hero { position: relative; }
.case-hero-img-wrap {
  position: absolute; inset: -20%;
  will-change: transform;
}
.case-hero-img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }

@supports (animation-timeline: scroll()) {
  .case-hero-img-wrap {
    animation: parallax-drift linear both;
    animation-timeline: scroll(root);
    animation-range: 0 50vh;
  }
  @keyframes parallax-drift {
    from { transform: translateY(0); }
    to   { transform: translateY(15%); }
  }
}
```

Replace the existing static gallery component usage with:
```astro
{project.galleryDark && project.galleryDark.length > 0 && (
  <CaseGallery
    client:visible
    images={project.galleryDark.map((img, i) => ({
      src: img.src,
      alt: `${project.title} — скриншот ${i + 1}`,
    }))}
  />
)}
```

- [ ] **Step 4: Verify parallax hero + lightbox**

Open `/portfolio/photographer`. Scroll — hero image should drift upward slower than scroll. Click any gallery thumbnail — lightbox opens with shared element animation. Arrow keys navigate between images. Click outside or × to close.

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/CaseGallery.tsx src/pages/portfolio/[slug].astro
git commit -m "feat: CaseGallery lightbox island + CSS scroll-driven parallax hero"
```

---

## Task 15: Portfolio index — TagFilter + AnimatePresence

**Files:**
- Create: `src/components/portfolio/TagFilter.tsx`
- Modify: `src/pages/portfolio/index.astro`

- [ ] **Step 1: Create TagFilter.tsx**

```tsx
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  category: string;
  image: { src: string };
}

interface Props {
  projects: Project[];
  allTags: string[];
}

export default function TagFilter({ projects, allTags }: Props) {
  const [activeTag, setActiveTag] = useState('Все');
  const prefersReduced = useReducedMotion();

  const tags = ['Все', ...allTags];
  const filtered = activeTag === 'Все'
    ? projects
    : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="tag-chip"
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {activeTag === tag && (
              <motion.span
                layoutId="tag-filter-active"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '100px',
                  background: 'var(--gradient-accent)',
                  zIndex: 0,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, color: activeTag === tag ? '#fff' : 'inherit' }}>
              {tag}
            </span>
          </button>
        ))}
      </div>

      {/* Grid with AnimatePresence */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
        layout={!prefersReduced}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.a
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="portfolio-card group relative block overflow-hidden rounded-xl"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              layout={!prefersReduced}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReduced ? {} : { y: -4 }}
              aria-label={`Кейс: ${project.title}`}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <motion.img
                  src={project.image.src}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  whileHover={prefersReduced ? {} : { scale: 1.07 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,20,0.7) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '100px', background: 'rgba(129,140,248,0.25)', color: 'rgba(226,232,240,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(129,140,248,0.3)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-fg)', marginBottom: '0.375rem' }}>{project.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', lineHeight: 1.6 }} className="line-clamp-2">{project.shortDescription}</p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Update portfolio/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import TagFilter from '../../components/portfolio/TagFilter';
import { portfolio } from '../../data/portfolio';
import { siteConfig } from '../../config/site';

const allTags = [...new Set(portfolio.flatMap(p => p.tags))].sort();
const projects = portfolio.map(p => ({
  slug: p.slug,
  title: p.title,
  shortDescription: p.shortDescription,
  tags: p.tags,
  category: p.category,
  image: { src: p.image.src },
}));
---

<BaseLayout title="Портфолио — Astro Studio" description="Все проекты студии: сайты, лендинги и visual-решения.">
  <Header />
  <main>
    <!-- Hero -->
    <section class="section-padding relative overflow-hidden" style="background: var(--color-bg);">
      <div class="orb orb-1" style="width:400px;height:400px;top:-80px;right:-80px;background:radial-gradient(ellipse,rgba(129,140,248,0.15) 0%,transparent 70%);" aria-hidden="true"></div>
      <div class="absolute inset-0 bg-grid-pattern pointer-events-none" aria-hidden="true"></div>
      <div class="container-site relative z-10">
        <div class="max-w-2xl" data-reveal>
          <span class="label-tag mb-4 block">Portfolio</span>
          <h1 class="mb-4" style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 200; letter-spacing: -0.03em; line-height: 1.05; color: var(--color-fg);">
            Работы <span class="gradient-text">студии</span>
          </h1>
          <p style="color: var(--color-fg-muted); font-size: clamp(1rem, 1.5vw, 1.125rem); line-height: 1.7; max-width: 480px;">
            Сайты, лендинги и visual-решения, которые мы создаём для брендов.
          </p>
        </div>
      </div>
    </section>

    <!-- TagFilter + Grid -->
    <section class="section-padding" style="background: var(--color-bg);">
      <div class="container-site">
        <TagFilter client:load projects={projects} allTags={allTags} />
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verify filter animations**

Open `/portfolio`. Click different tag pills — active pill gets gradient background with `layoutId` spring transition. Cards fade in/out with `AnimatePresence`.

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/TagFilter.tsx src/pages/portfolio/index.astro
git commit -m "feat: portfolio TagFilter with layoutId pill + AnimatePresence card transitions"
```

---

## Task 16: Services, About, Contacts — Polish + FAQ accordion

**Files:**
- Modify: `src/pages/services.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contacts.astro`

- [ ] **Step 1: Read all three pages**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/pages/services.astro"
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/pages/about.astro"
cat "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/src/pages/contacts.astro"
```

- [ ] **Step 2: Add FAQ accordion to services.astro**

After `<ServicesGrid />` import and usage, add an inline FAQ component at the bottom of the page using a `<details>` element with CSS animation (no FM needed here):

```astro
<!-- FAQ section in services.astro -->
<section class="section-padding" style="background: var(--color-bg-dark);">
  <div class="container-site max-w-3xl">
    <h2 class="mb-10" style="font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 200; letter-spacing: -0.03em; color: var(--color-fg);">
      Часто задаваемые <span class="gradient-text">вопросы</span>
    </h2>
    {[
      { q: 'Сколько стоит разработка сайта?', a: 'Стоимость зависит от объёма и сложности. Лендинг — от 50 000 ₽, полноценный сайт — от 120 000 ₽. Точная цена после обсуждения задачи.' },
      { q: 'Сколько времени занимает проект?', a: 'Лендинг — 2–3 недели, многостраничный сайт — 4–8 недель. Сроки фиксируем в договоре.' },
      { q: 'Работаете ли вы с иностранными клиентами?', a: 'Да, работаем с клиентами из любой страны. Общаемся на русском и английском языках.' },
      { q: 'Как происходит оплата?', a: 'Разбиваем на 2–3 части: аванс перед стартом, промежуточный платёж и финальный — после приёмки.' },
      { q: 'Предоставляете ли исходные файлы?', a: 'Да, передаём все исходники: Figma-файлы, код, ассеты. После оплаты всё ваше.' },
    ].map((item) => (
      <details class="faq-item">
        <summary class="faq-q">{item.q}</summary>
        <div class="faq-a">{item.a}</div>
      </details>
    ))}
  </div>
</section>
```

Add to the page `<style>`:
```css
.faq-item {
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
}
.faq-item:first-of-type { border-top: 1px solid var(--color-border); }
.faq-q {
  list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  font-size: 0.9375rem; font-weight: 500; color: var(--color-fg); padding: 0.25rem 0;
  gap: 1rem;
}
.faq-q::after { content: '+'; color: var(--color-accent); font-size: 1.25rem; transition: transform 250ms ease; }
details[open] .faq-q::after { content: '−'; }
.faq-a {
  color: var(--color-fg-muted); font-size: 0.875rem; line-height: 1.7;
  padding: 0.75rem 0 0.25rem; max-height: 0; overflow: hidden;
  transition: max-height 350ms var(--ease-out), padding 350ms var(--ease-out);
}
details[open] .faq-a { max-height: 200px; }
```

- [ ] **Step 3: Update about.astro — use WhyStats island for studio values**

Import and add `<WhyStats client:visible items={valuesItems} />` in the about page body, passing the studio values data (see Task 11 Step 5 `whyItems` array).

- [ ] **Step 4: Verify FAQ accordion animates open/close**

Open `/services`. Click FAQ questions — they should smoothly expand/collapse.

- [ ] **Step 5: Commit**

```bash
git add src/pages/services.astro src/pages/about.astro src/pages/contacts.astro
git commit -m "feat: services FAQ accordion, about WhyStats island, contacts polish"
```

---

## Task 17: Final build check + mobile polish

**Files:**
- All above files

- [ ] **Step 1: Run production build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0"
npm run build
```

Expected: Build completes with no TypeScript errors. `dist/` folder created.

- [ ] **Step 2: Fix any TypeScript errors**

If `npm run build` shows type errors, fix them. Common issues:
- React island props typed incorrectly (check `image.src` — Astro `ImageMetadata` vs `{ src: string }`)
- Missing `client:*` directive on islands
- Framer Motion import path — use `import { motion } from 'framer-motion'`

- [ ] **Step 3: Run astro check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 4: Test mobile responsiveness**

Open `localhost:4321` with browser DevTools mobile emulation (iPhone 14 / 390px). Check:
- Hero text doesn't overflow on mobile
- No horizontal scroll
- Custom cursor NOT visible
- Service cards stack to 1 column
- Portfolio cards stack to 1 column
- Mobile menu opens/closes correctly

- [ ] **Step 5: Test reduced motion**

In Chrome DevTools → Rendering → Emulate CSS media: `prefers-reduced-motion: reduce`. Open site. All FM animations should be instant/disabled. Verify no layout shifts.

- [ ] **Step 6: Test theme switching**

Click theme toggle. Dark → Light should animate smoothly in 240ms. All indigo/lavender tokens should update. Portfolio cards, buttons, service cards should all reflect the light theme correctly.

- [ ] **Step 7: Commit final**

```bash
git add -A
git commit -m "fix: build verification + mobile + reduced motion + theme polish"
```

---

## Task 18: Preview + Netlify deploy check

- [ ] **Step 1: Test production preview**

```bash
npm run preview
```

Open `localhost:4321`. Click through all pages: Home → Portfolio → /portfolio/photographer → /portfolio/piccolino → /services → /about → /contacts. Verify no broken images, no JS errors in console.

- [ ] **Step 2: Verify contact form endpoint**

In `src/config/site.ts` update `url` and `forms.source` if needed:

```ts
export const siteConfig = {
  name: 'Astro Studio',
  shortName: 'Astro Studio',
  description: 'Создаём сайты, лендинги и digital-дизайн для бизнеса.',
  url: (import.meta.env.PUBLIC_SITE_URL ?? 'https://astro-studio-v2.netlify.app').replace(/\/$/, ''),
  // ... rest unchanged
  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Astro Studio 2.0',
  },
};
```

- [ ] **Step 3: Update .gitignore**

```bash
echo ".superpowers/" >> "/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0/.gitignore"
```

- [ ] **Step 4: Final commit**

```bash
git add .gitignore src/config/site.ts
git commit -m "chore: update site config + ignore .superpowers dir"
```

---

## Self-Review: Spec Coverage Check

| Spec Requirement | Covered in Task |
|---|---|
| Dark Tech Indigo tokens | Task 2 |
| Lavender Mist light tokens | Task 2 |
| Gradient text utility | Task 2 |
| Grid pattern background | Task 2, 6, 15 |
| Animated gradient orbs | Task 6, 12 |
| Gradient primary button + pulse | Task 3 |
| Header gradient logo + nav underline | Task 4 |
| Footer gradient border | Task 5 |
| HeroSplit orbs + pattern | Task 6 |
| HeroText stagger word reveal | Task 7 |
| ProjectSlider drag + spring + layoutId | Task 8 |
| ServiceCards stagger + hover gradient | Task 9 |
| PortfolioGrid whileInView + hover overlay | Task 10 |
| ProcessSteps connecting lines + stagger | Task 11 |
| WhyStats animated counters | Task 11 |
| CtaSection orbs + pulse button | Task 12 |
| ContactSection floating labels + focus states | Task 12 |
| CustomCursor magnetic spring | Task 13 |
| CaseGallery lightbox + layoutId | Task 14 |
| Portfolio slug parallax hero | Task 14 |
| TagFilter layoutId pill + AnimatePresence | Task 15 |
| Services FAQ accordion | Task 16 |
| About WhyStats island | Task 16 |
| `useReducedMotion` in all islands | Tasks 7–15 |
| Mobile cursor disabled | Task 13 |
| `npm run build` passes | Task 17 |
| Theme switching | Task 17 |
