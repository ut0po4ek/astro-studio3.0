# Astro Studio 2.0 — Premium Portfolio Design Spec

**Date:** 2026-06-15  
**Target repo:** `/Users/utopo4ek/Projects/Portfolio land/astro-studio 2.0`  
**Source reference:** `/Users/utopo4ek/Projects/Portfolio land/astro-studio`  
**Stack:** Astro + Tailwind + React Islands + Framer Motion v11+

---

## 1. Цель и контекст

Портфолио веб-студии Astro Studio с примерами работ (case studies). Максимально впечатляющий, продающий дизайн с богатыми анимациями. Каждая секция должна вызывать реакцию «вау» — не generic, а характерный и утончённый premium.

Контент (тексты, проекты, изображения) берётся из `astro-studio` без изменений. Мы меняем дизайн-систему, добавляем анимации и полируем каждый компонент.

---

## 2. Дизайн-система

### 2.1 Цветовые токены

**Dark theme (default)**
```css
--color-bg:           #0c0c14   /* deep cool dark */
--color-bg-elevated:  #111124   /* card/panel bg */
--color-bg-subtle:    #0a0a12   /* deepest sections */
--color-fg:           #e2e8f0
--color-fg-muted:     #64748b
--color-fg-subtle:    #334155
--color-accent:       #818cf8   /* indigo */
--color-accent-2:     #c084fc   /* violet */
--color-border:       rgba(129, 140, 248, 0.12)
--color-border-bright: rgba(129, 140, 248, 0.28)
--gradient-accent:    linear-gradient(135deg, #818cf8, #c084fc)
--gradient-glow:      radial-gradient(ellipse at center, rgba(129,140,248,0.15) 0%, transparent 70%)
```

**Light theme**
```css
--color-bg:           #f5f3ff   /* lavender mist */
--color-bg-elevated:  #ffffff
--color-bg-subtle:    #ede9fe
--color-fg:           #1e1b4b   /* deep indigo text */
--color-fg-muted:     #6b7280
--color-fg-subtle:    #9ca3af
--color-accent:       #4f46e5
--color-accent-2:     #9333ea
--color-border:       rgba(79, 70, 229, 0.12)
--color-border-bright: rgba(79, 70, 229, 0.28)
--gradient-accent:    linear-gradient(135deg, #4f46e5, #9333ea)
--gradient-glow:      radial-gradient(ellipse at center, rgba(79,70,229,0.12) 0%, transparent 70%)
```

**Shared**
```css
--ease-spring:        cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-out:           cubic-bezier(0.16, 1, 0.3, 1)
--ease-inout:         cubic-bezier(0.4, 0, 0.2, 1)
```

### 2.2 Типографика

- Шрифт: **Inter** (уже установлен) + `font-feature-settings: "cv01", "cv03", "cv04"`
- Headings: `font-weight: 200–300`, `letter-spacing: -0.03em`, `line-height: 1.05–1.1`
- Размеры H1: `clamp(2.5rem, 7vw, 5.5rem)` — крупнее чем в v1
- Accent word в заголовках: gradient text через `background-clip: text`
- Body: `font-size: clamp(0.9375rem, 1.2vw, 1.0625rem)`, `line-height: 1.75`

### 2.3 Паттерн-фон

Subtle grid pattern поверх всех dark-секций:
```css
background-image:
  linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px);
background-size: 40px 40px;
```

### 2.4 Кнопки

- **Primary:** gradient bg (#818cf8 → #c084fc), белый текст, `box-shadow: 0 0 24px rgba(129,140,248,0.35)` при hover
- **Secondary:** прозрачный фон, gradient border (через pseudo-element), fill-from-left при hover
- **Ghost:** нет рамки, при hover — gradient underline
- Все кнопки: `border-radius: 6px`, transition `360ms ease-out`, `translateY(-2px)` при hover

---

## 3. Компоненты и анимации

### 3.1 CustomCursor (новый)

**Файл:** `src/components/ui/CustomCursor.tsx` (React island, `client:load`)

- Маленький dot `8px` следует за курсором с `lerp` (lag 0.12) через `useAnimationFrame`
- При наведении на ссылки/кнопки: расширяется до `40px`, становится полупрозрачным, смешивает `mix-blend-mode: exclusion`
- При наведении на карточки портфолио: появляется label «Открыть →» внутри курсора
- На мобильных: компонент не рендерится

### 3.2 Header

**Файл:** `src/components/layout/Header.astro`

- Начальное состояние (hero): прозрачный, `backdrop-blur: 0`
- После скролла 60px: `backdrop-blur: 20px`, `background: rgba(12,12,20,0.85)`, `border-bottom: 1px solid var(--color-border)`
- Логотип: «Astro» обычным цветом, «Studio» — gradient text
- Nav links: при hover — gradient underline slide-in из левого края (300ms)
- CTA кнопка в хедере: gradient border (secondary variant)
- Theme toggle: иконка луны/солнца с `rotate` анимацией (180deg, 300ms spring)
- Мобильное меню: fullscreen overlay с stagger-анимацией пунктов (Framer Motion)

### 3.3 HeroSplit

**Файл:** `src/components/sections/HeroSplit.astro` + `src/components/sections/HeroText.tsx`

**Фон:**
- 2–3 animated gradient orb'а (радиальные градиенты): медленно движутся по `keyframes` (`20s infinite alternate`), blur `80px`, opacity `0.3–0.4`
- Цвета orb'ов: `#818cf8`, `#c084fc`, `#6366f1`
- Поверх — grid pattern (см. 2.3)
- `scroll-line` остаётся, цвет меняется на indigo

**HeroText.tsx (React island, client:load):**
- Заголовок разбивается на слова, каждое — отдельный `motion.span`
- `staggerChildren: 0.06`, `y: 40 → 0`, `opacity: 0 → 1`, `filter: blur(8px) → blur(0)`
- Easing: `[0.16, 1, 0.3, 1]`
- Слово-акцент («выглядят»/«продают»): дополнительная задержка + gradient text появляется через `opacity`
- После появления заголовка — slide-up абзаца (200ms delay)

**Правая колонка (ProjectSlider.tsx, client:load):**
- Drag gesture с `dragConstraints`, `dragElastic: 0.1`
- Spring physics при отпускании: `stiffness: 300, damping: 30`
- Offset border: анимация `translate(0,0)` с `spring` при mount
- Slide indicators: `layoutId` для smooth dot transition
- При drag — легкий `rotate` (-2deg → +2deg) в зависимости от направления

**Stats strip:**
- Animated counters: `useMotionValue` + `useTransform`, считают от 0 до значения за 1.2s при появлении

### 3.4 TrustStrip

**Файл:** `src/components/sections/TrustStrip.astro`

- Без изменений логики, только цвета → indigo
- При hover на chip: `scale(1.05)`, gradient border появляется

### 3.5 ServicesGrid

**Файл:** `src/components/sections/ServicesGrid.astro` + `ServiceCards.tsx`

**ServiceCards.tsx (React island, client:visible):**
- Карточки входят с `staggerChildren: 0.08`, `y: 30 → 0`, `opacity: 0 → 1` (spring)
- Hover state: `scale(1.02)`, border переходит в gradient (через CSS custom property)
- Иконка при hover: `rotate(10deg)` + цвет меняется на gradient
- Subtle gradient background появляется при hover (opacity 0 → 0.06, transition 400ms)
- `whileTap: { scale: 0.98 }`

### 3.6 FeaturedWork / PortfolioGrid

**Файл:** `src/components/sections/FeaturedWork.astro` + `PortfolioGrid.tsx`

**PortfolioGrid.tsx (React island, client:visible):**
- Стаггер карточек: `staggerChildren: 0.1`, `y: 40 → 0`, `scale: 0.97 → 1`
- Hover: image `scale(1.08)` (600ms ease-out), overlay opacity увеличивается
- Overlay при hover: slide-up блок с названием + короткое описание + стрелка
- `whileHover` на карточке: subtle `y(-4px)`, `box-shadow` усиливается
- Custom cursor при наведении: показывает «Открыть →»

### 3.7 ProcessSection

**Файл:** `src/components/sections/ProcessSection.astro` + `ProcessSteps.tsx`

**ProcessSteps.tsx (React island, client:visible):**
- Номера шагов: `num-glow` анимация при появлении (уже есть, адаптируем под indigo)
- Connecting line между шагами: `scaleX: 0 → 1` с задержкой после появления шага
- Каждый шаг входит с `x: -20 → 0` + `opacity: 0 → 1`, stagger 120ms
- Hover на шаге: subtle `x(4px)` + border highlight

### 3.8 WhySection

**Файл:** `src/components/sections/WhySection.astro` + `WhyStats.tsx`

**WhyStats.tsx (React island, client:visible):**
- Animated number counters для всех цифровых значений
- При появлении: `useInView` → запускает `animate()` через `useMotionValue`
- Карточки с преимуществами: stagger `0.07s`, `scale: 0.95 → 1` + `opacity`

### 3.9 CtaSection

**Файл:** `src/components/sections/CtaSection.astro`

- Фон: animated gradient mesh — 3 orb'а медленно движутся (чисто CSS keyframes, не FM)
- Заголовок: gradient text полный (весь текст или только ключевое слово)
- Кнопка: pulsing glow animation `0 0 0 0 rgba(129,140,248,0.4)` → `0 0 0 20px transparent`

### 3.10 ContactSection

**Файл:** `src/components/sections/ContactSection.astro`

- Поля формы: при фокусе — `border-color` переходит в gradient, label поднимается (floating label)
- Submit кнопка: loading state с spinner анимацией, success state с checkmark (motion)
- Левая колонка: stagger появления контактных данных

### 3.11 Footer

**Файл:** `src/components/layout/Footer.astro`

- Верхний border: gradient `linear-gradient(90deg, transparent, #818cf8, #c084fc, transparent)`
- Логотип: gradient text
- Ссылки: hover — gradient underline

---

## 4. Страницы

### 4.1 Home (`/`)

Все секции в порядке:
1. HeroSplit (с orb'ами + HeroText island + ProjectSlider island)
2. TrustStrip (forward)
3. ServicesGrid (ServiceCards island)
4. TrustStrip (reverse)
5. FeaturedWork (PortfolioGrid island)
6. ProcessSection (ProcessSteps island)
7. WhySection (WhyStats island)
8. CtaSection
9. ContactSection
10. TrustStrip (reverse)

### 4.2 Portfolio (`/portfolio`)

- Hero секция: большой заголовок с gradient, subtitle
- TagFilter: pill-кнопки с animated active state (`layoutId` для highlight)
- Grid: masonry-подобный layout — 2 колонки десктоп, 1 мобиль
- Все карточки: одинаковая анимация входа (stagger от filter)
- При смене фильтра: `AnimatePresence` для плавного появления/исчезновения

### 4.3 Portfolio/[slug] (Case Study)

- **Hero:** fullscreen image с parallax (`useScroll` + `useTransform`, y: 0 → 100px)
- Gradient overlay поверх hero: `linear-gradient(to bottom, transparent 40%, var(--color-bg) 100%)`
- Мета-информация (теги, категория): stagger появление при load
- **Gallery:** `CaseGallery.tsx` (island) — при click открывается lightbox с `AnimatePresence`. `layoutId` используется для shared element transition внутри галереи (thumbnail → fullscreen). Переход карточка → кейс реализован через Astro View Transitions (не FM layoutId — несовместимо с MPA навигацией).
- **Color swatches:** при mount — круглые свотчи "разворачиваются" с `scale: 0 → 1` stagger
- **Next project:** превью следующего кейса с hover-эффектом

### 4.4 Services (`/services`)

- Расширенный ServicesGrid с детальными описаниями каждой услуги
- FAQ accordion: `AnimatePresence` для раскрытия/скрытия (height animation через `motion.div` с `overflow: hidden`)
- Блок процесса: как работаем — 4 шага с иконками

### 4.5 About (`/about`)

- Split layout: текст + изображение
- Animated stats (WhyStats island)
- Ценности студии — карточки с stagger анимацией

### 4.6 Contacts (`/contacts`)

- ContactSection как отдельная страница с больше пространством
- Карта или офис-инфо

---

## 5. Page Transitions

**Файл:** `src/components/layout/PageTransition.tsx` (island, `client:load`)

- Использует Astro View Transitions API + Framer Motion `AnimatePresence`
- При переходе: fade out текущей страницы (200ms), fade in новой (300ms) + лёгкий `y: 8px → 0`
- На переходе к кейсу портфолио: shared element transition через `layoutId` для карточки → hero (если технически возможно)

---

## 6. Глобальные эффекты

### Scroll-line
Оставляем CSS/JS анимацию из astro-studio, меняем цвет на `#818cf8`, glow → indigo.

### data-reveal система
Оставляем существующую систему для компонентов без React islands. Цвета обновятся автоматически через токены.

### Gradient orbs (Hero + CTA)
Чистый CSS: `@keyframes orb-drift` с `translate` + `scale` по разным осям, `20–30s`, `infinite alternate`, `will-change: transform`.

### Reduced motion
Все FM анимации: `useReducedMotion()` hook — если true, анимации мгновенные или отключены. CSS: `@media (prefers-reduced-motion: reduce)` уже в global.css.

---

## 7. Что НЕ меняем

- `src/server/` — contact form handlers
- `src/data/portfolio.ts` — контент проектов
- `src/assets/portfolio/` — изображения
- `netlify.toml`
- Существующая логика `astro.config.mjs` (только добавляем `@astrojs/react`)

---

## 8. Стек изменений

```
package.json        +@astrojs/react, +framer-motion, +react, +react-dom
astro.config.mjs    +react() интеграция
src/styles/global.css   полная замена токенов + новые утилиты
src/components/layout/Header.astro   рефакторинг + theme toggle
src/components/layout/Footer.astro   gradient border + стили
src/components/sections/HeroSplit.astro   orbs + паттерн
src/components/sections/HeroText.tsx      NEW React island
src/components/sections/ProjectSlider.tsx NEW React island
src/components/sections/ServiceCards.tsx  NEW React island
src/components/sections/PortfolioGrid.tsx NEW React island
src/components/sections/ProcessSteps.tsx  NEW React island
src/components/sections/WhyStats.tsx      NEW React island
src/components/ui/CustomCursor.tsx        NEW React island
src/components/portfolio/CaseGallery.tsx  NEW React island (lightbox)
src/components/layout/PageTransition.tsx  NEW React island
src/pages/index.astro        обновление импортов
src/pages/portfolio/*.astro  обновление grid + filter
src/pages/portfolio/[slug].astro  parallax hero + gallery island
```

---

## 9. Порядок реализации

1. **Setup:** copy astro-studio → astro-studio 2.0, установить зависимости, добавить react integration
2. **Tokens:** обновить `global.css` — дизайн-токены, утилиты, кнопки
3. **Layout:** Header + Footer + PageTransition
4. **Hero:** HeroSplit + orbs + HeroText island + ProjectSlider island
5. **Sections:** TrustStrip, ServiceCards, PortfolioGrid, ProcessSteps, WhyStats, CtaSection, ContactSection
6. **Pages:** Portfolio index (TagFilter + AnimatePresence), Portfolio slug (parallax + lightbox)
7. **CustomCursor**
8. **Polish:** critique → polish каждой секции, проверка мобиля, reduced motion
