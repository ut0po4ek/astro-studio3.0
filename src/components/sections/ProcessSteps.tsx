import { useState, useEffect } from 'react';
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
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const noHover = prefersReduced || isTouch;
  const enterDist = isTouch ? 24 : 52;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          className="process-step group"
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '4.5rem 1fr',
            gap: '1.75rem',
            padding: '2rem 4rem 2rem 1rem',
            minHeight: '10.5rem',
            borderTop: '1px solid var(--color-border)',
            cursor: 'default',
            overflow: 'hidden',
          }}
          initial={prefersReduced ? {} : { opacity: 0, x: i % 2 === 0 ? -enterDist : enterDist }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
          whileHover={noHover ? {} : {
            y: -6,
            transition: { type: 'spring', stiffness: 320, damping: 26 },
          }}
        >
          {/* Hover sweep — triggered by parent hover, no pointer events needed */}
          <motion.div
            aria-hidden="true"
            className="process-step-sweep"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(129,140,248,0.07) 0%, transparent 65%)',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 280ms ease',
            }}
          />

          {/* Giant background number — blooms in separately with scale */}
          <motion.span
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              translateY: '-50%',
              fontSize: 'clamp(5rem, 10vw, 8rem)',
              fontWeight: 200,
              letterSpacing: '-0.06em',
              lineHeight: 1,
              color: 'var(--color-border)',
              opacity: 0.35,
              pointerEvents: 'none',
              userSelect: 'none',
              fontVariantNumeric: 'tabular-nums',
              transition: 'color 0.5s ease, opacity 0.5s ease',
            }}
            className="step-bg-num"
            initial={prefersReduced ? {} : { opacity: 0, scale: 1.4 }}
            whileInView={{ opacity: 0.35, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 + 0.2 }}
          >
            {step.number}
          </motion.span>

          {/* Visible step number */}
          <motion.div
            style={{ paddingTop: '0.2rem', position: 'relative', zIndex: 1 }}
            initial={prefersReduced ? {} : { color: 'var(--color-border)' }}
            whileInView={{ color: 'var(--color-accent)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.11 + 0.25 }}
          >
            <span
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 200,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                display: 'block',
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 20px rgba(129,140,248,0.35)',
              }}
            >
              {step.number}
            </span>
          </motion.div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, paddingTop: '0.25rem' }}>
            <h3
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                fontWeight: 500,
                color: 'var(--color-fg)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em',
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-fg-muted)',
                lineHeight: 1.7,
                maxWidth: '32ch',
              }}
            >
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />
    </div>
  );
}
