import { useState, useRef, useEffect } from 'react';
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

// Book page flip variants — rotates around Y axis with perspective on parent
const flipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 70 : -70,
    opacity: 0,
    scale: 0.88,
    filter: 'brightness(0.6)',
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    filter: 'brightness(1)',
    transition: {
      rotateY: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      opacity:  { duration: 0.25, ease: 'easeOut' },
      scale:    { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      filter:   { duration: 0.35, ease: 'easeOut' },
    },
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -70 : 70,
    opacity: 0,
    scale: 0.88,
    filter: 'brightness(0.6)',
    transition: {
      rotateY: { duration: 0.28, ease: [0.4, 0, 0.6, 1] },
      opacity:  { duration: 0.18, ease: 'easeIn' },
      scale:    { duration: 0.28, ease: [0.4, 0, 0.6, 1] },
      filter:   { duration: 0.2,  ease: 'easeIn' },
    },
  }),
};

export default function ProjectSlider({ projects }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const goTo = (idx: number, dir: number) => {
    const next = ((idx % projects.length) + projects.length) % projects.length;
    setDirection(dir);
    setCurrent(next);
  };

  const advance = (delta: number) => goTo(current + delta, Math.sign(delta) || 1);

  // Auto-play: always goes forward
  useEffect(() => {
    if (isPaused || prefersReduced) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % projects.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, projects.length, prefersReduced]);

  // Drag handlers
  const handleDragStart = () => setIsPaused(true);
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsPaused(false);
    if (info.offset.x < -50) advance(1);
    else if (info.offset.x > 50) advance(-1);
  };

  return (
    // Perspective wrapper — gives depth to the rotateY flip
    <div style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}>
      <div className="relative w-full rounded-xl" style={{ aspectRatio: '16/10' }}>

        {/* Offset decorative border */}
        <motion.div
          className="absolute pointer-events-none rounded-xl"
          style={{ inset: 0, border: '1px solid var(--color-border-bright)', zIndex: 0 }}
          initial={prefersReduced ? {} : { opacity: 0, x: 8, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        />

        {/* Slide area */}
        <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ zIndex: 1 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={prefersReduced ? undefined : flipVariants}
              initial={prefersReduced ? { opacity: 0 } : 'enter'}
              animate={prefersReduced ? { opacity: 1 } : 'center'}
              exit={prefersReduced ? { opacity: 0 } : 'exit'}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag={prefersReduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{
                borderRadius: '0.75rem',
                overflow: 'hidden',
                willChange: 'transform, opacity',
              }}
              whileDrag={{ scale: 0.98 }}
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

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(12,12,20,0.8) 0%, rgba(12,12,20,0.08) 48%, transparent 100%)',
              }} />

              {/* Caption */}
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '4rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  {projects[current].tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '100px',
                        background: 'rgba(129,140,248,0.22)', color: 'rgba(226,232,240,0.9)',
                        backdropFilter: 'blur(8px)', border: '1px solid rgba(129,140,248,0.28)',
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
        </div>

        {/* Progress bar — resets with each slide */}
        {!prefersReduced && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
            background: 'rgba(129,140,248,0.12)', zIndex: 10,
            borderRadius: '0 0 0.75rem 0.75rem',
          }}>
            <motion.div
              key={`bar-${current}`}
              style={{
                height: '100%', borderRadius: '0 0 0.75rem 0.75rem',
                background: 'var(--gradient-accent)',
                willChange: 'width',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
            />
          </div>
        )}

        {/* Dot indicators */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '6px', zIndex: 10 }}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Слайд ${i + 1}`}
              style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 16 }}
            >
              {i === current ? (
                <motion.span
                  layoutId="slider-dot-active"
                  style={{ display: 'block', height: 6, width: 24, borderRadius: 3, background: 'var(--gradient-accent)' }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              ) : (
                <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(226,232,240,0.3)' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
