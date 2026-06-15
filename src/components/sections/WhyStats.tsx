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
