import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Props {
  images: GalleryImage[];
  imagesDark?: GalleryImage[];
  imagesLight?: GalleryImage[];
}

function ThemeToggle({
  active,
  onChange,
}: {
  active: 'dark' | 'light';
  onChange: (t: 'dark' | 'light') => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 0,
        padding: '3px',
        borderRadius: '999px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-elevated)',
        marginBottom: '1.5rem',
        position: 'relative',
      }}
      role="group"
      aria-label="Тема галереи"
    >
      {(['dark', 'light'] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '5px 14px',
            borderRadius: '999px',
            border: 'none',
            background: 'none',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: active === t ? 'var(--color-bg)' : 'var(--color-fg-muted)',
            transition: 'color 300ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          aria-pressed={active === t}
        >
          {active === t && (
            <motion.span
              layoutId="gallery-theme-pill"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '999px',
                background: 'var(--gradient-accent)',
                zIndex: -1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            />
          )}
          <span aria-hidden="true">{t === 'dark' ? '◑' : '◐'}</span>
          {t === 'dark' ? 'Тёмная' : 'Светлая'}
        </button>
      ))}
    </div>
  );
}

export default function CaseGallery({ images, imagesDark, imagesLight }: Props) {
  const hasThemes = !!imagesDark?.length && !!imagesLight?.length;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selected, setSelected] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const currentImages = hasThemes
    ? (theme === 'dark' ? imagesDark! : imagesLight!)
    : images;

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected(i => i !== null && i > 0 ? i - 1 : i), []);
  const next = useCallback(() => setSelected(i => i !== null && i < currentImages.length - 1 ? i + 1 : i), [currentImages.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close, prev, next]);

  // Lock scroll on both html + body (cross-browser)
  useEffect(() => {
    if (selected !== null) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <>
      {hasThemes && (
        <ThemeToggle active={theme} onChange={setTheme} />
      )}

      {/* Thumbnail grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hasThemes ? theme : 'static'}
          initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {currentImages.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(i)}
              className="relative overflow-hidden rounded-lg"
              style={{
                aspectRatio: '4/3',
                display: 'block',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                cursor: 'zoom-in',
              }}
              whileHover={prefersReduced ? {} : { scale: 1.03, borderColor: 'var(--color-accent)' }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              aria-label={`Открыть изображение ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(129,140,248,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <span style={{
                  color: '#fff', fontSize: '11px',
                  letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  Открыть
                </span>
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Lightbox — portal прямо в document.body.
          AnimatePresence ВНУТРИ портала: иначе он видит portal-объект,
          а не motion.div напрямую, и анимация не срабатывает. ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selected !== null && <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(6, 6, 14, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={close}
          >
            {/* ── Изображение ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? {} : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  lineHeight: 0,
                  // Отступы: сверху/снизу — место под крестик и градиент
                  maxWidth: 'calc(100vw - 9rem)',
                  maxHeight: 'calc(100vh - 5rem)',
                }}
              >
                <img
                  src={currentImages[selected].src}
                  alt={currentImages[selected].alt}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 5rem)',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: '0.625rem',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                  }}
                />
                {/* Счётчик */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  padding: '3px 12px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.08em',
                  fontWeight: 500,
                  lineHeight: '1.7',
                  whiteSpace: 'nowrap',
                }}>
                  {selected + 1} / {currentImages.length}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Декоративные градиенты (pointerEvents:none, не мешают кликам) ── */}
            {/* Сверху */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '5.5rem',
              background: 'linear-gradient(to bottom, rgba(6,6,14,0.8) 0%, transparent 100%)',
              pointerEvents: 'none', zIndex: 1,
            }} />
            {/* Слева */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '6rem',
              background: 'linear-gradient(to right, rgba(6,6,14,0.65) 0%, transparent 100%)',
              pointerEvents: 'none', zIndex: 1,
              opacity: selected > 0 ? 1 : 0, transition: 'opacity 0.2s',
            }} />
            {/* Справа */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '6rem',
              background: 'linear-gradient(to left, rgba(6,6,14,0.65) 0%, transparent 100%)',
              pointerEvents: 'none', zIndex: 1,
              opacity: selected < currentImages.length - 1 ? 1 : 0, transition: 'opacity 0.2s',
            }} />

            {/* ── Крестик — position:absolute (overlay уже inset:0 = весь вьюпорт) ── */}
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
              <motion.button
                onClick={(e) => { e.stopPropagation(); close(); }}
                aria-label="Закрыть"
                style={{
                  width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.22)' }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.15 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="13" y2="13"/>
                  <line x1="13" y1="1" x2="1" y2="13"/>
                </svg>
              </motion.button>
            </div>

            {/* ── Стрелка «назад» — wrapper div с translateY, motion только для hover ── */}
            {selected > 0 && (
              <div style={{
                position: 'absolute', left: '1.25rem', top: '50%',
                transform: 'translateY(-50%)', zIndex: 10,
              }}>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Предыдущее изображение"
                  style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.12, x: -2, background: 'rgba(255,255,255,0.22)' }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,1 4,7 9,13"/>
                  </svg>
                </motion.button>
              </div>
            )}

            {/* ── Стрелка «вперёд» ── */}
            {selected < currentImages.length - 1 && (
              <div style={{
                position: 'absolute', right: '1.25rem', top: '50%',
                transform: 'translateY(-50%)', zIndex: 10,
              }}>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Следующее изображение"
                  style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.12, x: 2, background: 'rgba(255,255,255,0.22)' }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5,1 10,7 5,13"/>
                  </svg>
                </motion.button>
              </div>
            )}

          </motion.div>}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
