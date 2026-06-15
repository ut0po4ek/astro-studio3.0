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
