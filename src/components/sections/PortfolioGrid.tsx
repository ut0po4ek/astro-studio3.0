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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Grid cards — scale up from slightly below with spring
const fadeUp = {
  hidden: { opacity: 0, y: 48, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

// Featured card — clip-path reveal from top, like a curtain opening
const clipReveal = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

interface CardProps {
  project: Project;
  basePath: string;
  prefersReduced: boolean;
  featured?: boolean;
}

function PortfolioCard({ project, basePath, prefersReduced, featured = false }: CardProps) {
  return (
    <motion.a
      href={`${basePath}/${project.slug}`}
      className="portfolio-card group relative block overflow-hidden rounded-2xl"
      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
      whileHover={prefersReduced ? {} : { y: -5, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      aria-label={`Кейс: ${project.title}`}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: featured ? '21/9' : '4/3' }}
      >
        <motion.img
          src={project.image.src}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          whileHover={prefersReduced ? {} : { scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(12,12,20,0.82) 0%, rgba(12,12,20,0.2) 45%, transparent 100%)',
        }} />

        {/* Hover accent overlay */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(129,140,248,0.28) 0%, rgba(192,132,252,0.18) 100%)',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Tags top-left */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '70%' }}>
          {project.tags.slice(0, featured ? 4 : 2).map((tag) => (
            <span key={tag} style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: '100px',
              background: 'rgba(12,12,20,0.6)', color: 'rgba(226,232,240,0.9)',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(129,140,248,0.3)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow badge top-right — animates on card hover via CSS */}
        <div
          className="arrow-badge"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: '2.25rem', height: '2.25rem', borderRadius: '50%',
            background: 'rgba(12,12,20,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(129,140,248,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(226,232,240,0.85)" strokeWidth="1.5" aria-hidden="true">
            <line x1="0" y1="12" x2="12" y2="0"/>
            <polyline points="4,0 12,0 12,8"/>
          </svg>
        </div>

        {/* Featured: title overlaid on image bottom */}
        {featured && (
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.75rem', right: '1.75rem' }}>
            <p style={{
              fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(129,140,248,0.85)', marginBottom: '0.4rem',
            }}>
              Featured Project
            </p>
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 300,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              {project.title}
            </h3>
          </div>
        )}
      </div>

      {/* Non-featured: text below image */}
      {!featured && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h3
              style={{
                fontSize: '0.9375rem', fontWeight: 500,
                color: 'var(--color-fg)', letterSpacing: '-0.01em',
                transition: 'color 300ms ease',
              }}
              className="group-hover:text-[var(--color-accent)]"
            >
              {project.title}
            </h3>
            <svg
              style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-fg-subtle)', transition: 'all 300ms ease' }}
              className="group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"
              aria-hidden="true"
            >
              <line x1="0" y1="14" x2="14" y2="0"/>
              <polyline points="5,0 14,0 14,9"/>
            </svg>
          </div>
          <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.75rem', lineHeight: 1.65 }} className="line-clamp-2">
            {project.shortDescription}
          </p>
        </div>
      )}

      {/* Featured: description strip below image */}
      {featured && (
        <div style={{
          padding: '1rem 1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border)',
        }}>
          <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.8125rem', lineHeight: 1.6, maxWidth: '65%' }} className="line-clamp-1">
            {project.shortDescription}
          </p>
          <span className="hidden sm:flex case-open-link" style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--color-accent)',
            alignItems: 'center', gap: '0.35rem',
          }}>
            Открыть кейс
            <svg className="case-open-arrow" width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="0" y1="14" x2="14" y2="0"/>
              <polyline points="5,0 14,0 14,9"/>
            </svg>
          </span>
        </div>
      )}
    </motion.a>
  );
}

export default function PortfolioGrid({ projects, basePath = '/portfolio' }: Props) {
  const prefersReduced = useReducedMotion();
  const [featured, ...rest] = projects;

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      variants={stagger}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Featured card — clip-path curtain reveal */}
      {featured && (
        <motion.div variants={clipReveal} style={{ overflow: 'hidden', borderRadius: '1rem' }}>
          <PortfolioCard project={featured} basePath={basePath} prefersReduced={!!prefersReduced} featured />
        </motion.div>
      )}

      {/* Remaining cards: equal-width grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: '1rem' }}>
          {rest.map((project) => (
            <motion.div key={project.slug} variants={fadeUp}>
              <PortfolioCard project={project} basePath={basePath} prefersReduced={!!prefersReduced} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
