# Scroll Animations & UI Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить 5 визуальных улучшений: кривую scroll-линию на главной, две новых анимации появления на странице услуг, glow-анимацию чисел в разделе «Как мы работаем» и разделение active/hover состояний в хедере.

**Architecture:** Три слоя изменений — CSS-варианты в `global.css` (новые `data-reveal` типы + `@keyframes`), JS-функции в `BaseLayout.astro` (scroll-линия), и точечные правки в трёх страницах/компонентах. Все изменения используют существующую IntersectionObserver-инфраструктуру.

**Tech Stack:** Astro, TypeScript, CSS custom properties, SVG `strokeDashoffset` animation, IntersectionObserver API.

---

## File Map

| Файл | Что меняется |
|------|-------------|
| `src/styles/global.css` | + `scale-bounce`, `flip-3d` data-reveal variants; + `@keyframes num-glow`; + delay utilities (80/160/320/400/480ms) |
| `src/layouts/BaseLayout.astro` | + `initScrollLine()` function, scroll listener |
| `src/pages/index.astro` | + `data-scroll-line-region` + SVG на `<main>` |
| `src/components/sections/ServicesGrid.astro` | `data-reveal` → `data-reveal="scale-bounce"`, обновить stagger delays |
| `src/pages/services.astro` | `data-reveal` → `data-reveal="flip-3d"` на 4 карточках serviceTypes |
| `src/pages/about.astro` | + `.process-step` класс, + `<script>` с glow-observer |
| `src/components/layout/Header.astro` | CSS: active link = accent + dot, hover = белый + underline |

---

## Task 1: CSS — новые reveal-варианты и keyframes

**Files:**
- Modify: `src/styles/global.css` (после блока `[data-reveal="fade"]`, строка ~390)

- [ ] **Добавить `scale-bounce` и `flip-3d` variants после строки `[data-reveal="fade"] { transform: none; }`**

```css
/* Spring scale-in for service cards */
[data-reveal="scale-bounce"] {
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity   550ms cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 3D perspective flip for site-type cards */
[data-reveal="flip-3d"] {
  opacity: 0;
  transform: perspective(600px) rotateX(-18deg) translateY(14px);
  transition:
    opacity   650ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Добавить delay utilities в секцию Delay utilities (после строки `[data-reveal-delay="800"]`)**

```css
[data-reveal-delay="80"]   { transition-delay: 80ms; }
[data-reveal-delay="160"]  { transition-delay: 160ms; }
[data-reveal-delay="320"]  { transition-delay: 320ms; }
[data-reveal-delay="480"]  { transition-delay: 480ms; }
```

- [ ] **Добавить `@keyframes num-glow` в конец секции MOTION SYSTEM (перед секцией VIEW TRANSITIONS)**

```css
/* Process step number glow-in animation */
@keyframes num-glow {
  0%   {
    color: var(--color-border);
    text-shadow: none;
  }
  50%  {
    color: var(--color-accent);
    text-shadow: 0 0 18px var(--num-glow-color, rgba(201,169,110,0.45));
  }
  100% {
    color: color-mix(in srgb, var(--color-accent) 55%, transparent);
    text-shadow: 0 0 8px var(--num-glow-color-soft, rgba(201,169,110,0.14));
  }
}

.process-num-glow {
  animation: num-glow 1100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Glow color tokens per theme */
:root[data-theme="dark"] {
  --num-glow-color:      rgba(201, 169, 110, 0.45);
  --num-glow-color-soft: rgba(201, 169, 110, 0.14);
}
:root[data-theme="light"],
:root:not([data-theme="dark"]) {
  --num-glow-color:      rgba(232, 103, 58, 0.40);
  --num-glow-color-soft: rgba(232, 103, 58, 0.12);
}
```

- [ ] **Добавить reduced-motion overrides для новых классов в секцию `@media (prefers-reduced-motion: reduce)`**

Найти строку `[data-reveal],` в reduced-motion блоке и добавить следующее после всего блока `[data-reveal]` / `.reveal`:

```css
  .process-num-glow {
    animation: none !important;
    color: color-mix(in srgb, var(--color-accent) 55%, transparent) !important;
    text-shadow: none !important;
  }
```

- [ ] **Запустить dev-сервер и убедиться что CSS компилируется без ошибок**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio" && npm run dev 2>&1 | head -20
```
Ожидается: `Local: http://localhost:4321/` без ошибок компиляции.

- [ ] **Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-studio"
git add src/styles/global.css
git commit -m "feat: add scale-bounce, flip-3d reveal variants and num-glow keyframes"
```

---

## Task 2: Header — разделение active и hover состояний

**Files:**
- Modify: `src/components/layout/Header.astro` (секция `/* ─── Nav links ───*/`, строки ~245-265)

- [ ] **Заменить блок `.header-nav-link[aria-current="page"]` на новую версию с точкой**

Найти и заменить:
```css
  .header-nav-link[aria-current="page"] { color: var(--h-text); }
  .header-nav-link[aria-current="page"]::after { right: 0; }
```

На:
```css
  /* Active: accent color + persistent underline + dot indicator */
  .header-nav-link[aria-current="page"] {
    color: var(--color-accent);
  }
  .header-nav-link[aria-current="page"]::after {
    right: 0;
    background: var(--color-accent);
  }
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

- [ ] **Проверить в браузере**: открыть `http://localhost:4321/services` — ссылка «Услуги» должна быть акцентным цветом с точкой снизу. При наведении на другие ссылки — белый цвет с underline (без точки).

- [ ] **Коммит**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: differentiate header active (accent+dot) vs hover (white+underline)"
```

---

## Task 3: ServicesGrid — scale-bounce анимация

**Files:**
- Modify: `src/components/sections/ServicesGrid.astro`

- [ ] **Заменить `data-reveal` и `data-reveal-delay` на каждой карточке**

Найти блок `.map((service, i) => (` и заменить атрибуты `data-reveal` и `data-reveal-delay` так, чтобы:
- карточки 0,1,2 (первая строка) получили delays 0, 80, 160ms
- карточки 3,4,5 (вторая строка) получили delays 320, 400, 480ms (пауза между строками)

```astro
{services.map((service, i) => (
  <div
    class="group flex flex-col gap-4 p-8 border-[var(--color-border)] transition-colors duration-300 hover:bg-[var(--color-bg-warm)]"
    data-reveal="scale-bounce"
    data-reveal-delay={([0, 80, 160, 320, 400, 480])[i]}
  >
```

- [ ] **Проверить в браузере**: открыть `http://localhost:4321/services` → прокрутить до «Что мы делаем» → карточки должны появляться с упругим scale-эффектом, волной по строкам.

- [ ] **Коммит**

```bash
git add src/components/sections/ServicesGrid.astro
git commit -m "feat: scale-bounce reveal animation for ServicesGrid cards"
```

---

## Task 4: Services page — flip-3d для «Какой сайт вам нужен»

**Files:**
- Modify: `src/pages/services.astro`

- [ ] **Найти блок `serviceTypes.map((s, i)` и заменить атрибуты reveal**

Найти:
```astro
            data-reveal
            data-reveal-delay={i * 60}
```

Заменить на:
```astro
            data-reveal="flip-3d"
            data-reveal-delay={i * 80}
```

- [ ] **Проверить в браузере**: открыть `http://localhost:4321/services` → прокрутить до «Какой сайт вам нужен» → карточки появляются с 3D-переворотом сверху, со stagger.

- [ ] **Коммит**

```bash
git add src/pages/services.astro
git commit -m "feat: flip-3d reveal animation for service type cards"
```

---

## Task 5: About page — glow-анимация чисел процесса

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Добавить класс `process-step` и `process-num` к элементам в секции «Как мы работаем»**

Найти блок `process.map((step, i) =>` и добавить классы:

```astro
        <div
          class="process-step group grid grid-cols-1 md:grid-cols-[3rem_1fr] gap-4 md:gap-8 py-8 border-b border-[var(--color-border)] last:border-0"
          data-reveal={i % 2 === 0 ? 'left' : 'right'}
          data-reveal-delay={i * 80}
          data-process-index={i}
        >
          <span
            class="process-num font-light transition-colors duration-300 group-hover:text-[var(--color-accent)]"
            style="font-size: clamp(1.25rem, 3vw, 1.75rem); letter-spacing: -0.03em; color: var(--color-border);"
          >
            {step.num}
          </span>
```

(Изменения: `process-step` на обёртке, `data-process-index={i}`, `process-num` на span с числом)

- [ ] **Добавить `<script>` для glow-observer в конец `about.astro`** (после существующего `<script>`)

```astro
<script>
  function initProcessGlow() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll<HTMLElement>('.process-step').forEach((step) => {
      if (step.dataset.glowBound === 'true') return;
      step.dataset.glowBound = 'true';

      const numEl = step.querySelector<HTMLElement>('.process-num');
      if (!numEl) return;

      if (reduced) {
        numEl.style.color = 'color-mix(in srgb, var(--color-accent) 55%, transparent)';
        return;
      }

      const index = Number(step.dataset.processIndex ?? 0);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            numEl.style.animationDelay = `${index * 150}ms`;
            numEl.classList.add('process-num-glow');
            observer.unobserve(step);
          });
        },
        { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
      );
      observer.observe(step);
    });
  }

  document.addEventListener('astro:page-load', initProcessGlow);
  initProcessGlow();
</script>
```

- [ ] **Проверить в браузере**: открыть `http://localhost:4321/about` → прокрутить до «Как мы работаем» → числа 01–05 должны разгораться золотым glow по очереди. Hover на строке → число становится полностью акцентным (100%).

- [ ] **Коммит**

```bash
git add src/pages/about.astro
git commit -m "feat: golden glow animation on process step numbers in about page"
```

---

## Task 6: SVG scroll-линия — CSS и разметка

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css` (добавить CSS для линии)

- [ ] **Добавить CSS переменные линии в `global.css`**

Блок `:root, [data-theme="dark"]` начинается на строке ~8. Добавить в конец этого блока (перед закрывающей `}`):
```css
  --scroll-line-track:    rgba(201, 169, 110, 0.14);
  --scroll-line-progress: #c9a96e;
  --scroll-line-glow:     rgba(201, 169, 110, 0.22);
```

Блок `[data-theme="light"]` начинается на строке ~75. Добавить в конец этого блока (перед закрывающей `}`):
```css
  --scroll-line-track:    rgba(26, 26, 26, 0.09);
  --scroll-line-progress: #e8673a;
  --scroll-line-glow:     rgba(232, 103, 58, 0.18);
```

Затем добавить CSS-классы для линии в конец `global.css` (перед `@media (prefers-reduced-motion)` или в конце файла):

```css
/* ═══════════════════════════════════════════════════
   SCROLL LINE
═══════════════════════════════════════════════════ */
.scroll-line-wrap {
  position: absolute;
  inset: 0 clamp(1.5rem, 6vw, 6rem);
  z-index: 0;
  pointer-events: none;
  opacity: 0.9;
}

.scroll-line-wrap svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.scroll-line-wrap path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.scroll-line-track {
  stroke: var(--scroll-line-track);
  stroke-width: 1;
  stroke-dasharray: 2 16;
}

.scroll-line-progress {
  stroke: var(--scroll-line-progress);
  stroke-width: 2;
  filter: drop-shadow(0 0 8px var(--scroll-line-glow));
  transition: stroke 240ms ease;
}

@media (max-width: 768px) {
  .scroll-line-wrap {
    inset: 0 auto 0 clamp(0.75rem, 3vw, 1.5rem);
    width: clamp(2.5rem, 12vw, 5rem);
    opacity: 0.45;
  }
  .scroll-line-track { stroke-width: 0.8; }
  .scroll-line-progress { stroke-width: 1.4; }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-line-progress {
    transition: none;
    stroke-dashoffset: 0 !important;
  }
}
```

- [ ] **Добавить SVG-разметку в `index.astro`**

Открыть `src/pages/index.astro`. Найти `<main>` и:
1. Добавить `data-scroll-line-region` и `style="position: relative;"` к `<main>`
2. Добавить SVG сразу после открывающего тега `<main>`:

```astro
<main data-scroll-line-region style="position: relative;">
  <div class="scroll-line-wrap" aria-hidden="true">
    <svg viewBox="0 0 1000 5200" preserveAspectRatio="none" focusable="false">
      <path
        class="scroll-line-track"
        d="M 500 60 C 180 380 820 780 420 1180 C 120 1500 780 1880 380 2280 C 80 2600 820 2980 460 3380 C 180 3680 780 4060 380 4460 C 200 4760 700 5000 500 5200"
      />
      <path
        class="scroll-line-progress"
        d="M 500 60 C 180 380 820 780 420 1180 C 120 1500 780 1880 380 2280 C 80 2600 820 2980 460 3380 C 180 3680 780 4060 380 4460 C 200 4760 700 5000 500 5200"
      />
    </svg>
  </div>
  <HeroSplit />
  ...
```

- [ ] **Запустить dev-сервер**, открыть `http://localhost:4321` — SVG должен быть в DOM (проверить через DevTools), но линия пока не анимирована (JS ещё не добавлен).

- [ ] **Коммит**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: add scroll line SVG markup and CSS to main page"
```

---

## Task 7: Scroll-линия — JavaScript анимация

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (в `<script>`, добавить после существующих функций)

- [ ] **Добавить функцию `initScrollLine` в существующий `<script>` блок**

Найти конец `<script>` блока (перед закрывающим `</script>`) и добавить:

```typescript
      // ── Scroll Line ─────────────────────────────────────
      let scrollLineFrame = 0;

      function updateScrollLine() {
        scrollLineFrame = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const viewport = window.innerHeight || document.documentElement.clientHeight;

        document.querySelectorAll<HTMLElement>('[data-scroll-line-region]').forEach((region) => {
          const path = region.querySelector<SVGPathElement>('.scroll-line-progress');
          if (!path) return;

          if (reduced) {
            const len = path.dataset.pathLength
              ? Number(path.dataset.pathLength)
              : path.getTotalLength();
            path.dataset.pathLength = String(len);
            path.style.strokeDasharray = String(len);
            path.style.strokeDashoffset = '0';
            return;
          }

          const len = path.dataset.pathLength
            ? Number(path.dataset.pathLength)
            : path.getTotalLength();
          if (!path.dataset.pathLength) path.dataset.pathLength = String(len);

          path.style.strokeDasharray = String(len);

          const rect = region.getBoundingClientRect();
          const scrollable = rect.height - viewport * 0.5;
          const scrolled = viewport * 0.65 - rect.top;
          const progress = Math.min(1, Math.max(0, scrolled / Math.max(scrollable, viewport * 0.5)));

          path.style.strokeDashoffset = String((len * (1 - progress)).toFixed(2));
        });
      }

      function requestScrollLine() {
        if (scrollLineFrame) return;
        scrollLineFrame = window.requestAnimationFrame(updateScrollLine);
      }

      function initScrollLine() {
        requestScrollLine();
        if (document.documentElement.dataset.scrollLineBound === 'true') return;
        document.documentElement.dataset.scrollLineBound = 'true';
        window.addEventListener('scroll', requestScrollLine, { passive: true });
        window.addEventListener('resize', requestScrollLine, { passive: true });
      }
```

- [ ] **Добавить вызов `initScrollLine()` рядом с каждым `initReveal()` вызовом**

В BaseLayout.astro три строки с `initReveal()` (около строк 240-242):
```typescript
      document.addEventListener('DOMContentLoaded', initReveal);
      document.addEventListener('astro:page-load', initReveal);
      initReveal();
```
Заменить на:
```typescript
      document.addEventListener('DOMContentLoaded', () => { initReveal(); initScrollLine(); });
      document.addEventListener('astro:page-load', () => { initReveal(); initScrollLine(); });
      initReveal();
      initScrollLine();
```

- [ ] **Добавить сброс в `astro:before-swap` handler** (строка ~212, внутри коллбека)

Найти `document.addEventListener('astro:before-swap', () => {` и добавить в конец коллбека (перед `}`):
```typescript
        document.querySelectorAll<SVGPathElement>('.scroll-line-progress').forEach((p) => {
          delete p.dataset.pathLength;
        });
        scrollLineFrame = 0;
```

- [ ] **Проверить в браузере**: открыть `http://localhost:4321`, прокрутить страницу — кривая линия должна рисоваться по мере скролла, менять цвет при переключении темы.

- [ ] **Коммит**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: scroll-driven SVG line animation on main page"
```

---

## Task 8: Финальная проверка

- [ ] **Проверить главную страницу** (`/`): scroll-линия рисуется плавно, адаптируется к теме, на мобильном становится боковой и полупрозрачной.

- [ ] **Проверить страницу услуг** (`/services`):
  - Секция «Что мы делаем»: карточки появляются с упругим scale, волной по строкам
  - Секция «Какой сайт вам нужен»: карточки переворачиваются с 3D-эффектом

- [ ] **Проверить страницу «О студии»** (`/about`): числа 01–05 разгораются золотым glow при скролле, hover даёт 100% акцентный цвет.

- [ ] **Проверить header на всех страницах**: активная ссылка — акцентный цвет + точка снизу; hover — белый/тёмный цвет + underline.

- [ ] **Проверить `prefers-reduced-motion`**: в DevTools → Rendering → Emulate prefers-reduced-motion → все анимации должны быть мгновенными, scroll-линия всегда полностью нарисована.

- [ ] **Проверить обе темы**: светлая и тёмная — scroll-линия, числа и hover-цвета должны корректно меняться.
