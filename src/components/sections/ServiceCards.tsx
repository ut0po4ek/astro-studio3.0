import { motion, useReducedMotion } from 'framer-motion';

interface Service {
  icon: string;
  title: string;
  description: string;
  label: string;
}

interface Props {
  services: Service[];
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export default function ServiceCards({ services }: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      variants={container}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {services.map((service) => (
        <motion.div
          key={service.title}
          variants={cardVariant}
          whileHover={prefersReduced ? {} : { scale: 1.02, y: -3 }}
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="group flex flex-col gap-4 p-8 rounded-xl"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient hover overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'var(--gradient-accent)', borderRadius: '0.75rem' }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.4 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <motion.span
              className="text-2xl"
              style={{ color: 'var(--color-border)', fontStyle: 'normal' }}
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-hidden="true"
            >
              {service.icon}
            </motion.span>
            <span
              className="tag-chip"
              style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {service.label}
            </span>
          </div>

          <h3
            className="font-medium"
            style={{ fontSize: '1rem', color: 'var(--color-fg)', letterSpacing: 0, position: 'relative' }}
          >
            {service.title}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-fg-muted)', position: 'relative' }}
          >
            {service.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
