import { motion, useReducedMotion } from 'framer-motion';

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  image: { src: string };
}

interface Props {
  projects: Project[];
  basePath?: string;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PortfolioGrid({ projects, basePath = '/portfolio' }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
      variants={container}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {projects.map((project) => (
        <motion.div key={project.slug} variants={card}>
          <motion.a
            href={`${basePath}/${project.slug}`}
            className="portfolio-card group relative block overflow-hidden rounded-xl"
            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
            whileHover={prefersReduced ? {} : { y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            aria-label={`Кейс: ${project.title}`}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <motion.img
                src={project.image.src}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                whileHover={prefersReduced ? {} : { scale: 1.07 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,20,0.75) 0%, rgba(12,12,20,0.1) 50%, transparent 100%)' }} />

              {/* Hover slide-up overlay */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '1.25rem',
                  background: 'linear-gradient(to top, rgba(129,140,248,0.55) 0%, transparent 60%)',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Открыть кейс →
                </span>
              </motion.div>

              {/* Case Study badge */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '100px', background: 'rgba(12,12,20,0.55)', color: 'rgba(226,232,240,0.85)', backdropFilter: 'blur(8px)' }}>
                  Case Study
                </span>
              </div>

              {/* Tags */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', maxWidth: '60%' }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '100px', background: 'rgba(129,140,248,0.25)', color: 'rgba(226,232,240,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(129,140,248,0.3)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <h3
                  style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-fg)', letterSpacing: 0, transition: 'color 300ms ease' }}
                  className="group-hover:text-[var(--color-accent)]"
                >
                  {project.title}
                </h3>
                <svg
                  style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-fg-subtle)', transition: 'all 300ms ease' }}
                  className="group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <line x1="0" y1="14" x2="14" y2="0"/>
                  <polyline points="5,0 14,0 14,9"/>
                </svg>
              </div>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.75rem', lineHeight: 1.6 }} className="line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  );
}
