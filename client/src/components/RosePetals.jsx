import { useMemo, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import '../styles/rose-petals.css';

const rand = (min, max) => Math.random() * (max - min) + min;

// Wine, blush, and an occasional gold petal — pulled from the design
// system's secondary/gold palettes so petals feel native to the luxury
// theme rather than generic red confetti.
const PETAL_COLORS = [
  'var(--color-secondary-300)',
  'var(--color-secondary-400)',
  'var(--color-secondary-500)',
  'var(--color-secondary-600)',
  'var(--color-gold-200)',
];

/**
 * Builds one petal's full random configuration up front. Like the
 * Fireflies component, all randomness is resolved once at generation
 * time — Framer Motion then just interpolates fixed keyframes using
 * GPU-accelerated transform/opacity, no per-frame JavaScript.
 */
function buildPetalConfig(id) {
  const fallDuration = rand(9, 16);

  return {
    id,
    size: rand(10, 22),                 // px, petal width
    startXPercent: rand(-5, 105),        // % across container, slightly beyond edges
    fallDuration,
    swayRange: rand(30, 90),             // px of horizontal wind drift
    swayDuration: rand(4, 7),
    tumbleDuration: rand(3, 6),
    rotateDirection: Math.random() < 0.5 ? 1 : -1,
    rotateTurns: rand(1.5, 3),           // full rotations over one fall cycle
    delay: rand(0, fallDuration),        // staggers petals across the fall cycle
    opacity: rand(0.45, 0.9),
    color: PETAL_COLORS[Math.floor(rand(0, PETAL_COLORS.length))],
  };
}

const Petal = memo(function Petal({ config, active, reducedMotion }) {
  const {
    size, startXPercent, fallDuration, swayRange, swayDuration,
    tumbleDuration, rotateDirection, rotateTurns, delay, opacity, color,
  } = config;

  const baseStyle = {
    left: `${startXPercent}%`,
    top: '-8vh', // fixed starting point above the container — never animated
    width: size,
    height: size * 0.85,
    backgroundColor: color,
  };

  if (reducedMotion) {
    return (
      <span
        className="rose-petal"
        style={{ ...baseStyle, top: `${rand(0, 90)}%`, opacity: opacity * 0.5 }}
      />
    );
  }

  const totalRotation = 360 * rotateTurns * rotateDirection;

  return (
    <motion.span
      className="rose-petal"
      style={baseStyle}
      animate={
        active
          ? {
              y: ['0vh', '112vh'],
              x: [0, swayRange, -swayRange * 0.6, swayRange * 0.35, 0],
              rotateZ: [0, totalRotation],
              rotateX: [0, 35, -25, 15, 0],
              opacity: [0, opacity, opacity, opacity * 0.6, 0],
            }
          : {}
      }
      transition={{
        y: { duration: fallDuration, repeat: Infinity, ease: 'linear', delay },
        x: { duration: swayDuration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay },
        rotateZ: { duration: fallDuration, repeat: Infinity, ease: 'linear', delay },
        rotateX: { duration: tumbleDuration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay },
        opacity: { duration: fallDuration, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    />
  );
});

/**
 * RosePetals
 * ------------------------------------------------------------------
 * Reusable falling rose petal effect. Pure CSS + Framer Motion.
 *
 * Usage — drop inside any relatively-positioned container:
 *   <section style={{ position: 'relative', minHeight: '100vh' }}>
 *     <RosePetals count={22} />
 *     <YourContent />
 *   </section>
 *
 * Props:
 *   count     — number of petals (default 22). ~15–30 is the sweet spot;
 *               beyond that, diminishing visual return for the DOM cost.
 *   className — optional extra class for positioning/z-index overrides.
 *
 * Performance:
 *  - Animates only transform (x/y/rotateZ/rotateX) and opacity — never
 *    top/left, which would trigger layout on every frame.
 *  - All random config generated once via useMemo, never recalculated.
 *  - Petal component is memoized — parent re-renders never touch it.
 *  - Pauses entirely via useInView when scrolled out of the viewport.
 *  - pointer-events: none — never blocks clicks on real content.
 *  - Respects prefers-reduced-motion (static, dim petals instead).
 * ------------------------------------------------------------------
 */
export default function RosePetals({ count = 22, className = '' }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.05 });
  const reducedMotion = usePrefersReducedMotion();

  const petals = useMemo(
    () => Array.from({ length: count }, (_, i) => buildPetalConfig(i)),
    [count]
  );

  return (
    <div ref={containerRef} className={`rose-petals-container ${className}`} aria-hidden="true">
      {petals.map((config) => (
        <Petal key={config.id} config={config} active={isInView} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
