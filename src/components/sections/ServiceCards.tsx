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
            initial={prefersReduced ? {} : { opacity: 0, x: -56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
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
              }}
              whileHover={prefersReduced ? {} : { x: 18 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

              {/* Number — independent scale+fade entrance */}
              <motion.span
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
                  transition: 'color 0.35s ease',
                  position: 'relative',
                  fontVariantNumeric: 'tabular-nums',
                  display: 'block',
                }}
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 + 0.15 }}
                aria-hidden="true"
              >
                {num}
              </motion.span>

              {/* Title + label badge on same line */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                      fontWeight: 400,
                      color: isOpen ? 'var(--color-accent)' : 'var(--color-fg)',
                      letterSpacing: '-0.015em',
                      lineHeight: 1.2,
                      transition: 'color 0.35s ease',
                    }}
                  >
                    {service.title}
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: isOpen ? 'var(--color-accent)' : 'var(--color-fg-subtle)',
                      background: isOpen ? 'rgba(129,140,248,0.12)' : 'transparent',
                      padding: '2px 7px',
                      borderRadius: '100px',
                      border: `1px solid ${isOpen ? 'rgba(129,140,248,0.3)' : 'var(--color-border)'}`,
                      transition: 'color 0.35s ease, background 0.35s ease, border-color 0.35s ease',
                      lineHeight: '1.6',
                    }}
                  >
                    {service.label}
                  </span>
                </div>
              </div>

              {/* Toggle icon — SVG + perfectly centered */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
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
                  flexShrink: 0,
                  transition: 'border-color 0.35s ease, color 0.35s ease',
                  position: 'relative',
                }}
                aria-hidden="true"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  aria-hidden="true"
                  style={{ display: 'block', flexShrink: 0 }}
                >
                  <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.span>
            </motion.button>

            {/* Expanded description — aligned to title column via same grid */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3.5rem 1fr 3rem',
                      gap: '1.5rem',
                      padding: '0.25rem 0.75rem 2rem',
                    }}
                  >
                    {/* Accent dot aligned with number column */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '0.3rem' }}>
                      <span style={{
                        display: 'block',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--gradient-accent)',
                        flexShrink: 0,
                      }} />
                    </div>
                    {/* Description aligned with title */}
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-fg-muted)',
                        lineHeight: 1.85,
                        margin: 0,
                      }}
                    >
                      {service.description}
                    </p>
                    {/* Spacer for toggle column */}
                    <div />
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
