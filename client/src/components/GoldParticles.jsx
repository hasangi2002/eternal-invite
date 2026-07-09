import { motion } from 'framer-motion';
import { useMemo, useEffect } from 'react';

const PARTICLE_COUNT = 28;
const EASE_LUXURY = [0.22, 1, 0.36, 1];

/**
 * GoldParticles
 * ------------------------------------------------------------------
 * Pure CSS/Framer Motion particle burst — no Lottie, no canvas.
 * Particles are laid out on a circle (angle = evenly spaced + jitter),
 * each animating outward from center with randomized distance, size,
 * delay, and duration so the burst reads as organic rather than a
 * perfect uniform ring.
 *
 * Self-contained: reports back via onDone once the burst has visually
 * finished, so the parent can unmount it and free up the DOM nodes.
 * ------------------------------------------------------------------
 */
export default function GoldParticles({ onDone }) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4;
        const distance = 90 + Math.random() * 140;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          size: 3 + Math.random() * 5,
          delay: Math.random() * 0.25,
          duration: 1.1 + Math.random() * 0.6,
        };
      }),
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="gold-particles-layer" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="gold-particle"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: EASE_LUXURY }}
        />
      ))}
    </div>
  );
}
