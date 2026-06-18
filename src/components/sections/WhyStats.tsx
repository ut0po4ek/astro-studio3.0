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
    const controls = animate(count, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
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

export default function WhyStats({ items }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((w, i) => (
        <motion.div
          key={w.title}
          className="group"
          style={{
            display: 'grid',
            gridTemplateColumns: '7rem 1fr',
            gap: '2rem',
            alignItems: 'start',
            padding: '1.75rem 0.5rem',
            borderTop: '1px solid var(--color-border)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={prefersReduced ? {} : { opacity: 0, x: i % 2 === 0 ? -44 : 44, y: 8 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
        >
          {/* Hover bg */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(129,140,248,0.05) 0%, transparent 60%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />

          {/* Stat */}
          <div
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 200,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              position: 'relative',
              zIndex: 1,
              paddingTop: '0.125rem',
            }}
          >
            {w.statNum !== undefined ? (
              <AnimatedNumber to={w.statNum} suffix={w.statSuffix ?? ''} />
            ) : (
              w.stat ?? ''
            )}
          </div>

          {/* Title + description */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3
              style={{
                fontSize: 'clamp(0.9375rem, 1.4vw, 1.05rem)',
                fontWeight: 500,
                color: 'var(--color-fg)',
                marginBottom: '0.4rem',
                letterSpacing: '-0.01em',
              }}
            >
              {w.title}
            </h3>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-fg-muted)',
                lineHeight: 1.7,
                maxWidth: '38ch',
              }}
            >
              {w.description}
            </p>
          </div>
        </motion.div>
      ))}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />
    </div>
  );
}
