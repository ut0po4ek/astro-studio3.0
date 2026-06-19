import { useState, useRef, useEffect, type RefObject } from 'react';
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

// Shared spring configs
// SPRING_ENTER: ζ ≈ 0.42 (underdamped) — visible overshoot so the spring
// bounce plays while the card is fully opaque.
const SPRING_ENTER  = { type: 'spring' as const, stiffness: 320, damping: 15, mass: 0.9 };
const SPRING_HOVER  = { type: 'spring' as const, stiffness: 420, damping: 26 };
const SPRING_ACCENT = { type: 'spring' as const, stiffness: 260, damping: 24 };

export default function TagFilter({ projects, allTags }: Props) {
  const [activeTag, setActiveTag] = useState('Все');
  // Hydration guard: motion.span with layoutId renders different inline styles
  // on SSR vs client — only render it after client-side mount to avoid mismatch.
  const [mounted, setMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const tags = ['Все', ...allTags];
  const filtered = activeTag === 'Все'
    ? projects
    : projects.filter((p) => p.tags.includes(activeTag));

  const changeTag = (tag: string) => {
    setActiveTag(tag);
  };

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => changeTag(tag)}
            className="tag-chip"
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {/* Only render the layoutId span after hydration — avoids SSR/client
                inline-style mismatch (inset vs top/right/bottom/left, etc.) */}
            {activeTag === tag && mounted && (
              <motion.span
                layoutId="tag-filter-active"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '100px',
                  background: 'var(--gradient-accent)', zIndex: 0,
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

      {/* Grid */}
      <motion.div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
        style={{ alignContent: 'start' }}
      >
        {/* mode="wait": all exits complete (140ms) before any enter starts.
            With compound key (slug+tag), a card exits as "slug-Все" then
            re-enters as "slug-<tag>" — two distinct elements, no visual ghost.
            The spring entrance plays unobstructed with full user attention. */}
        <AnimatePresence mode="wait">
          {filtered.map((project, index) => (
            <motion.a
              key={`${project.slug}-${activeTag}`}
              href={`/portfolio/${project.slug}`}
              className="portfolio-card group relative block rounded-xl"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                willChange: 'transform',
              }}
              // ── Enter / exit ──
              // Large y offset + scale delta make the spring motion unmistakable.
              // opacity completes at 300ms so the card is fully visible WHILE the
              // spring still overshoots (~480ms settle time) — the bounce is seen.
              // Exit gets its own fast inline transition so it doesn't fight the enter.
              initial={prefersReduced ? {} : { opacity: 0, y: 64, scale: 0.84 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? {} : {
                opacity: 0,
                scale: 0.92,
                y: -28,
                transition: { duration: 0.14, ease: 'easeIn' },
              }}
              transition={prefersReduced ? {} : {
                ...SPRING_ENTER,
                delay: index * 0.055,
                opacity: { duration: 0.30, ease: 'easeOut', delay: index * 0.055 },
              }}
              // ── Hover — spring lift + subtle scale ──
              whileHover={prefersReduced ? {} : {
                y: -9,
                scale: 1.02,
                transition: SPRING_HOVER,
              }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              aria-label={`Кейс: ${project.title}`}
            >
              {/* ── Image ── */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <motion.img
                  src={project.image.src}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  whileHover={prefersReduced ? {} : { scale: 1.10 }}
                  transition={{ type: 'spring', stiffness: 170, damping: 22 }}
                />

                {/* Dark gradient — always */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(8,8,18,0.82) 0%, rgba(8,8,18,0.08) 55%, transparent 100%)',
                  pointerEvents: 'none',
                }} />

                {/* Accent overlay — revealed on hover */}
                <motion.div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.32) 0%, rgba(167,139,250,0.22) 100%)',
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Tags */}
                <div style={{
                  position: 'absolute', top: '0.875rem', right: '0.875rem',
                  display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end',
                }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em',
                      textTransform: 'uppercase', padding: '2px 7px', borderRadius: '100px',
                      background: 'rgba(129,140,248,0.22)', color: 'rgba(226,232,240,0.92)',
                      backdropFilter: 'blur(6px)', border: '1px solid rgba(129,140,248,0.28)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow badge — rotates on card hover via CSS */}
                <div
                  className="arrow-badge"
                  style={{
                    position: 'absolute', bottom: '0.875rem', right: '0.875rem',
                    width: '2rem', height: '2rem', borderRadius: '50%',
                    background: 'rgba(10,10,20,0.52)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(129,140,248,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(226,232,240,0.85)" strokeWidth="1.5" aria-hidden="true">
                    <line x1="0" y1="12" x2="12" y2="0"/>
                    <polyline points="4,0 12,0 12,8"/>
                  </svg>
                </div>
              </div>

              {/* ── Card footer ── */}
              <div style={{ padding: '1.125rem 1.25rem' }}>
                <h3
                  style={{
                    fontSize: '0.9375rem', fontWeight: 500,
                    color: 'var(--color-fg)', letterSpacing: '-0.01em',
                    marginBottom: '0.3rem',
                  }}
                  className="group-hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  {project.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', lineHeight: 1.65 }} className="line-clamp-2">
                  {project.shortDescription}
                </p>
              </div>

              {/* Bottom gradient line — springs in on hover */}
              <motion.div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '2px', background: 'var(--gradient-accent)',
                  transformOrigin: 'left center',
                }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={SPRING_ACCENT}
              />
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
