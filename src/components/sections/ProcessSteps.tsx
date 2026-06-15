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
          className="group"
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
