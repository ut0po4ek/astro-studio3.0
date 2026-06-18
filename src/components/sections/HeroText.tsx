import { motion, useReducedMotion } from 'framer-motion';

// Editorial line-reveal: each line slides up through a clip mask
// This is the premium agency pattern — not per-word blur, but full-line reveals
const lineReveal = (delay: number) => ({
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    y: 28,
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      delay,
    },
  },
});

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  },
});

interface Props {
  ctaHref: string;
  portfolioHref: string;
  ctaLabel: string;
  statsItems: { value: string; label: string }[];
}

export default function HeroText({ ctaHref, portfolioHref, ctaLabel, statsItems }: Props) {
  const prefersReduced = useReducedMotion();
  const mp = prefersReduced
    ? { initial: 'visible', animate: 'visible' }
    : { initial: 'hidden', animate: 'visible' };

  return (
    <div className="flex flex-col gap-7 lg:gap-9">

      {/* Eyebrow label */}
      <motion.div variants={fadeUp(0)} {...mp}>
        <span
          className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.22em] uppercase"
          style={{ color: 'var(--color-fg-muted)' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 20,
              height: 1,
              background: 'var(--color-accent)',
              flexShrink: 0,
            }}
          />
          Web Studio — Design &amp; Development
        </span>
      </motion.div>

      {/* Display headline — editorial line-by-line reveal */}
      <h1
        className="font-light"
        style={{
          fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1.04,
          color: 'var(--color-fg)',
        }}
      >
        {/* Line 1 */}
        <div style={{ overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'block' }}
            variants={lineReveal(0.1)}
            {...mp}
          >
            Создаём сайты,
          </motion.span>
        </div>

        {/* Line 2 */}
        <div style={{ overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'block' }}
            variants={lineReveal(0.22)}
            {...mp}
          >
            которые{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              выглядят
            </em>
          </motion.span>
        </div>

        {/* Line 3 */}
        <div style={{ overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'block' }}
            variants={lineReveal(0.34)}
            {...mp}
          >
            дорого и продают
          </motion.span>
        </div>
      </h1>

      {/* Subtitle */}
      <motion.p
        className="max-w-sm leading-relaxed"
        style={{
          color: 'var(--color-fg-muted)',
          fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
          fontWeight: 300,
        }}
        variants={fadeUp(0.52)}
        {...mp}
      >
        Astro Studio — web-studio для брендов, которым нужен современный сайт,
        лендинг или визуальная упаковка под запуск.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-wrap gap-3 pt-1"
        variants={fadeUp(0.64)}
        {...mp}
      >
        <a href={ctaHref} className="btn btn-primary btn-lg btn-pulse">
          {ctaLabel}
        </a>
        <a href={portfolioHref} className="btn btn-secondary btn-lg">
          Портфолио
        </a>
      </motion.div>

      {/* Divider — gradient line with traveling shimmer */}
      <div style={{ position: 'relative', height: '1px', overflow: 'visible' }}>
        {/* Base line — reveals left → right */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, rgba(129,140,248,0.70) 0%, rgba(192,132,252,0.55) 45%, rgba(129,140,248,0.25) 75%, transparent 100%)',
            boxShadow: '0 0 6px rgba(129,140,248,0.20)',
          }}
          initial={prefersReduced ? {} : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.78 }}
        />

        {/* Shimmer particle — races across the line once after reveal */}
        {!prefersReduced && (
          <motion.div
            style={{
              position: 'absolute',
              top: '-3px',
              left: 0,
              width: '32px',
              height: '7px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.95), rgba(255,255,255,0.60), transparent)',
              filter: 'blur(1px)',
              boxShadow: '0 0 8px 2px rgba(129,140,248,0.40)',
            }}
            initial={{ x: '-32px', opacity: 0 }}
            animate={{ x: ['calc(0%)', 'calc(100% + 32px)'], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.7,
              ease: [0.4, 0, 0.6, 1],
              delay: 1.72,      /* reveal completes at 0.78+0.85=1.63s, shimmer fires 0.09s later */
              times: [0, 0.1, 0.85, 1],
              repeat: 0,
            }}
          />
        )}
      </div>

      {/* Stats */}
      <motion.div
        className="flex flex-wrap gap-8"
        variants={fadeUp(0.84)}
        {...mp}
      >
        {statsItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span
              className="font-medium"
              style={{
                fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
                background: 'var(--gradient-accent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              {item.value}
            </span>
            <span
              className="text-[10px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-fg-subtle)', fontWeight: 400 }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
