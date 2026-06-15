import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  category: string;
  image: { src: string };
}

interface Props {
  projects: Project[];
  allTags: string[];
}

export default function TagFilter({ projects, allTags }: Props) {
  const [activeTag, setActiveTag] = useState('Все');
  const prefersReduced = useReducedMotion();

  const tags = ['Все', ...allTags];
  const filtered = activeTag === 'Все'
    ? projects
    : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="tag-chip"
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {activeTag === tag && (
              <motion.span
                layoutId="tag-filter-active"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '100px',
                  background: 'var(--gradient-accent)',
                  zIndex: 0,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, color: activeTag === tag ? '#fff' : 'inherit' }}>
              {tag}
            </span>
          </button>
        ))}
      </div>

      {/* Grid with AnimatePresence */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
        layout={!prefersReduced}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.a
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="portfolio-card group relative block overflow-hidden rounded-xl"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              layout={!prefersReduced}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReduced ? {} : { y: -4 }}
              aria-label={`Кейс: ${project.title}`}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <motion.img
                  src={project.image.src}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  whileHover={prefersReduced ? {} : { scale: 1.07 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,20,0.7) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '100px', background: 'rgba(129,140,248,0.25)', color: 'rgba(226,232,240,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(129,140,248,0.3)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-fg)', marginBottom: '0.375rem' }}>{project.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', lineHeight: 1.6 }} className="line-clamp-2">{project.shortDescription}</p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
