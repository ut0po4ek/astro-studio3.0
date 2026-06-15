import { motion, useReducedMotion } from 'framer-motion';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const word = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const accentWord = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
  },
};

const subtitle = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
  },
};

const buttons = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.72 },
  },
};

const statsVar = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.88 },
  },
};

interface Props {
  ctaHref: string;
  portfolioHref: string;
  ctaLabel: string;
  statsItems: { value: string; label: string }[];
}

export default function HeroText({ ctaHref, portfolioHref, ctaLabel, statsItems }: Props) {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? { initial: 'visible', animate: 'visible' }
    : { initial: 'hidden', animate: 'visible' };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Badge */}
      <motion.div variants={word} {...motionProps}>
        <span
          className="inline-block text-[10px] font-medium tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
          style={{
            border: '1px solid var(--color-border-bright)',
            color: 'var(--color-accent)',
            background: 'rgba(129,140,248,0.06)',
          }}
        >
          Web Studio / Design &amp; Development
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-light leading-[1.05]"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-fg)',
        }}
        variants={container}
        {...motionProps}
      >
        <motion.span variants={word} style={{ display: 'inline-block' }}>Создаём</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>сайты,</motion.span>
        <br />
        <motion.span variants={word} style={{ display: 'inline-block' }}>которые</motion.span>
        {' '}
        <motion.em
          variants={accentWord}
          style={{
            fontStyle: 'normal',
            display: 'inline-block',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          выглядят
        </motion.em>
        <br />
        <motion.span variants={word} style={{ display: 'inline-block' }}>дорого</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>и</motion.span>
        {' '}
        <motion.span variants={word} style={{ display: 'inline-block' }}>продают</motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="leading-relaxed max-w-md"
        style={{
          color: 'var(--color-fg-muted)',
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
        }}
        variants={subtitle}
        {...motionProps}
      >
        Astro Studio — web-studio для брендов, которым нужен современный сайт, лендинг или визуальная упаковка под запуск.
      </motion.p>

      {/* CTA buttons */}
      <motion.div className="flex flex-wrap gap-3" variants={buttons} {...motionProps}>
        <a
          href={ctaHref}
          className="btn btn-primary btn-lg btn-pulse"
        >
          {ctaLabel}
        </a>
        <a href={portfolioHref} className="btn btn-secondary btn-lg">
          Смотреть портфолио
        </a>
      </motion.div>

      {/* Stat divider */}
      <motion.div
        style={{ height: '1px', background: 'var(--color-border)', transformOrigin: 'left center' }}
        initial={prefersReduced ? {} : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
      />

      {/* Stats */}
      <motion.div className="flex flex-wrap gap-6" variants={statsVar} {...motionProps}>
        {statsItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span
              className="font-medium text-lg"
              style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {item.value}
            </span>
            <span
              className="text-xs tracking-wide uppercase"
              style={{ color: 'var(--color-fg-subtle)' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
