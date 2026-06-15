import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Props {
  images: GalleryImage[];
}

export default function CaseGallery({ images }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={() => setSelected(i)}
            className="relative overflow-hidden rounded-lg"
            style={{ aspectRatio: '4/3', cursor: 'pointer', display: 'block', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            layoutId={`gallery-thumb-${i}`}
            aria-label={`Открыть изображение ${i + 1}`}
          >
            <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <span style={{ color: '#fff', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Открыть</span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(10,10,18,0.95)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              layoutId={`gallery-thumb-${selected}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '0.75rem', overflow: 'hidden', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selected].src}
                alt={images[selected].alt}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
              />
            </motion.div>

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Закрыть"
              style={{
                position: 'fixed', top: '1.5rem', right: '1.5rem',
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)',
                color: '#e2e8f0', fontSize: '1.125rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>

            {/* Prev */}
            {selected > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
                aria-label="Предыдущее"
                style={{ position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                ←
              </button>
            )}
            {/* Next */}
            {selected < images.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
                aria-label="Следующее"
                style={{ position: 'fixed', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
