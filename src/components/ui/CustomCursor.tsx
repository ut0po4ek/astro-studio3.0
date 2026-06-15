import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [label, setLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isCard = el.closest('.portfolio-card');
      const isLink = el.closest('a, button');
      if (isCard) {
        setLabel('Открыть');
        setIsHovering(true);
      } else if (isLink) {
        setLabel('');
        setIsHovering(true);
      }
    };

    const onLeave = () => {
      setIsHovering(false);
      setLabel('');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'exclusion',
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? (label ? 64 : 36) : 8,
          height: isHovering ? (label ? 64 : 36) : 8,
          opacity: isHovering ? 0.85 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          borderRadius: '50%',
          background: 'var(--gradient-accent, linear-gradient(135deg,#818cf8,#c084fc))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap',
              mixBlendMode: 'normal',
            }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
