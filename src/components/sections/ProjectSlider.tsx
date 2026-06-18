import { useState, useEffect } from 'react';
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

const AUTOPLAY_INTERVAL = 4500;

/*
 * Emil Kowalski depth-shift transition.
 *
 * Exit:  slide recedes — scale down, drift sideways, blur out.
 *        Fast ease-in so it gets out of the way quickly.
 * Enter: new slide emerges from depth — spring physics on X + scale,
 *        blur clears as it settles. Feels physical, not mechanical.
 */
const slideVariants = {
  enter: (dir: number) => ({
    x:      dir > 0 ? '7%' : '-7%',
    scale:  0.93,
    opacity: 0,
    filter: 'blur(5px) brightness(0.75)',
  }),
  center: {
    x:      0,
    scale:  1,
    opacity: 1,
    filter: 'blur(0px) brightness(1)',
    transition: {
      x:       { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
      scale:   { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
      opacity: { duration: 0.28, ease: 'easeOut' },
      filter:  { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (dir: number) => ({
    x:      dir > 0 ? '-5%' : '5%',
    scale:  0.91,
    opacity: 0,
    filter: 'blur(8px) brightness(0.6)',
    transition: {
      x:       { duration: 0.22, ease: [0.55, 0, 1, 0.45] },
      scale:   { duration: 0.22, ease: [0.55, 0, 1, 0.45] },
      opacity: { duration: 0.18, ease: 'easeIn' },
      filter:  { duration: 0.20, ease: 'easeIn' },
    },
  }),
};

export default function ProjectSlider({ projects }: Props) {
  const [current, setCurrent]     = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused]   = useState(false);
  const [timerKey, setTimerKey]   = useState(0);
  const prefersReduced            = useReducedMotion();

  const goTo = (idx: number, dir: number) => {
    const next = ((idx % projects.length) + projects.length) % projects.length;
    setDirection(dir);
    setCurrent(next);
    setTimerKey(k => k + 1);
  };

  const advance = (delta: number) => goTo(current + delta, Math.sign(delta) || 1);

  useEffect(() => {
    if (isPaused || prefersReduced) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % projects.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, projects.length, prefersReduced, timerKey]);

  const handleDragStart = () => setIsPaused(true);
  const handleDragEnd   = (_: unknown, info: { offset: { x: number } }) => {
    setIsPaused(false);
    if (info.offset.x < -50) advance(1);
    else if (info.offset.x > 50) advance(-1);
  };

  return (
    <div style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
      <div className="relative w-full" style={{ aspectRatio: '16/10' }}>

        {/* ── Slide area ───────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            zIndex: 1,
            /*
             * Mask vignette — sides fade gently, top fades a little.
             * Bottom stays fully opaque so caption text and tag pills
             * remain readable; the dark caption gradient inside the image
             * already handles the blend into the hero background.
             */
            maskImage: [
              'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              'linear-gradient(to bottom, transparent 0%, black 9%, black 95%, transparent 100%)',
            ].join(', '),
            WebkitMaskImage: [
              'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              'linear-gradient(to bottom, transparent 0%, black 9%, black 95%, transparent 100%)',
            ].join(', '),
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in',
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={prefersReduced ? undefined : slideVariants}
              initial={prefersReduced ? { opacity: 0 } : 'enter'}
              animate={prefersReduced ? { opacity: 1 } : 'center'}
              exit={prefersReduced ? { opacity: 0 } : 'exit'}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag={prefersReduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.06}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ willChange: 'transform, opacity, filter' }}
              whileDrag={{ scale: 0.985 }}
            >
              <img
                src={projects[current].image.src}
                alt={projects[current].title}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top', display: 'block',
                  userSelect: 'none', pointerEvents: 'none',
                }}
                draggable={false}
              />

              {/* Dark caption gradient — inside image area */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(6,6,16,0.85) 0%, rgba(6,6,16,0.06) 52%, transparent 100%)',
                pointerEvents: 'none',
              }} />

              {/* Caption */}
              <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.5rem', right: '4rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  {projects[current].tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '9px', fontWeight: 500,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '100px',
                        background: 'rgba(129,140,248,0.22)',
                        color: 'rgba(226,232,240,0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(129,140,248,0.28)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p style={{
                  color: 'rgba(226,232,240,0.92)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  {projects[current].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        {!prefersReduced && (
          <div
            className="slider-progress-track"
            style={{
              position: 'absolute', bottom: '6px',
              left: '10%', right: '10%',
              height: '2px',
              background: 'rgba(148,163,184,0.22)',
              zIndex: 10,
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              key={`bar-${current}-${timerKey}`}
              style={{
                height: '100%',
                borderRadius: '2px',
                background: 'var(--gradient-accent)',
                willChange: 'width',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
            />
          </div>
        )}

        {/* ── Dot indicators ────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: '1.125rem', right: '1.25rem',
          display: 'flex', gap: '6px', zIndex: 10,
        }}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Слайд ${i + 1}`}
              style={{
                padding: 0, background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                width: 28, height: 16,
              }}
            >
              <span style={{
                display: 'block',
                height: '4px',
                width: i === current ? '22px' : '4px',
                borderRadius: i === current ? '2px' : '50%',
                background: i === current
                  ? 'var(--gradient-accent)'
                  : 'rgba(148,163,184,0.50)',
                boxShadow: i === current ? '0 0 8px rgba(129,140,248,0.5)' : 'none',
                transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.35s ease, background 0.25s ease',
              }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
