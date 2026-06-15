import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Service {
  icon: string;
  title: string;
  description: string;
  label: string;
}

interface Props {
  services: Service[];
}

export default function ServiceCards({ services }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {services.map((service, i) => {
        const isOpen = active === i;
        const num = String(i + 1).padStart(2, '0');

        return (
          <motion.div
            key={service.title}
            initial={prefersReduced ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
          >
            <motion.button
              onClick={() => setActive(isOpen ? null : i)}
              style={{
                display: 'grid',
                gridTemplateColumns: '3.5rem 1fr auto',
                alignItems: 'center',
                gap: '1.5rem',
                width: '100%',
                padding: '1.5rem 0.75rem',
                background: 'none',
                border: 'none',
                borderTop: '1px solid var(--color-border)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0',
              }}
              whileHover={prefersReduced ? {} : { paddingLeft: '1.25rem' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Hover background */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(129,140,248,0.06) 0%, transparent 100%)',
                  opacity: 0,
                  borderRadius: '0.5rem',
                  pointerEvents: 'none',
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />

              {/* Number */}
              <span
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 200,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  background: isOpen ? 'var(--gradient-accent)' : undefined,
                  WebkitBackgroundClip: isOpen ? 'text' : undefined,
                  WebkitTextFillColor: isOpen ? 'transparent' : undefined,
                  backgroundClip: isOpen ? 'text' : undefined,
                  color: isOpen ? 'transparent' : 'var(--color-fg-subtle)',
                  transition: 'color 0.3s ease',
                  position: 'relative',
                  fontVariantNumeric: 'tabular-nums',
                }}
                aria-hidden="true"
              >
                {num}
              </span>

              {/* Title + label */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', position: 'relative' }}>
                <span
                  style={{
                    fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                    fontWeight: 400,
                    color: isOpen ? 'var(--color-accent)' : 'var(--color-fg)',
                    letterSpacing: '-0.015em',
                    lineHeight: 1.2,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {service.title}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-fg-subtle)',
                    fontWeight: 500,
                  }}
                >
                  {service.label}
                </span>
              </div>

              {/* Plus/minus */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  border: isOpen
                    ? '1px solid var(--color-accent)'
                    : '1px solid var(--color-border)',
                  color: isOpen ? 'var(--color-accent)' : 'var(--color-fg-muted)',
                  fontSize: '1.25rem',
                  fontWeight: 200,
                  lineHeight: 1,
                  flexShrink: 0,
                  transition: 'border-color 0.3s, color 0.3s',
                  position: 'relative',
                }}
                aria-hidden="true"
              >
                +
              </motion.span>
            </motion.button>

            {/* Expanded description */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      paddingLeft: '5.75rem',
                      paddingBottom: '1.75rem',
                      paddingRight: '1rem',
                      background: 'linear-gradient(90deg, rgba(129,140,248,0.03) 0%, transparent 80%)',
                      borderRadius: '0 0 0.5rem 0.5rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-fg-muted)',
                        lineHeight: 1.8,
                        maxWidth: '520px',
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Bottom border */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />
    </div>
  );
}
