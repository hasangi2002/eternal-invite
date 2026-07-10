import { useMemo, useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import '../styles/fireflies.css';

/**
 * useReducedMotion
 * ------------------------------------------------------------------
 * Tiny custom hook (no external library) that reads the user's
 * prefers-reduced-motion setting and stays in sync if they change it
 * mid-session via OS accessibility settings.
 * ------------------------------------------------------------------
 */
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

const rand = (min, max) => Math.random() * (max - min) + min;

// Warm gold/champagne hues pulled from the design system's gold palette,
// so fireflies feel native to the luxury theme instead of generic yellow.
const GOLD_HUES = ['#F7ECD3', '#EDD9A8', '#E0C078', '#CFA355', '#B8863C'];

// Depth layers: each controls size, blur, opacity, glow radius, and speed.
// This is what makes the effect read as occupying real 3D space rather
// than a flat sprinkle of identical dots.
const DEPTH_LAYERS = [
  { key: 'far', size: [2, 3], blur: 2.5, opacity: [0.15, 0.35], glow: [6, 10], duration: [16, 24], ratio: 0.4 },
  { key: 'mid', size: [3, 4.5], blur: 1, opacity: [0.3, 0.55], glow: [9, 14], duration: [11, 17], ratio: 0.35 },
  { key: 'near', size: [4.5, 7], blur: 0, opacity: [0.55, 0.9], glow: [12, 20], duration: [7, 12], ratio: 0.25 },
];

/**
 * Builds one firefly's full random configuration up front. This is the
 * key performance decision: ALL randomness is resolved once, at
 * generation time, never recalculated during animation. Framer Motion
 * then just interpolates through fixed keyframe arrays using
 * GPU-accelerated transform/opacity — no per-frame JavaScript at all.
 */
function buildFireflyConfig(id, layer) {
  const wanderRadius = layer.key === 'near' ? 90 : layer.key === 'mid' ? 60 : 35;

  return {
    id,
    startX: rand(0, 100), // % of container width
    startY: rand(0, 100), // % of container height
    size: rand(layer.size[0], layer.size[1]),
    blur: layer.blur,
    glow: rand(layer.glow[0], layer.glow[1]),
    color: GOLD_HUES[Math.floor(rand(0, GOLD_HUES.length))],
    moveDuration: rand(layer.duration[0], layer.duration[1]),
    twinkleDuration: rand(2.5, 5.5),
    twinkleDelay: rand(0, 4),
    minOpacity: layer.opacity[0],
    maxOpacity: layer.opacity[1],
    // 4 random waypoints (px offsets), looping back to 0 for a seamless repeat
    xPath: [0, rand(-wanderRadius, wanderRadius), rand(-wanderRadius, wanderRadius), rand(-wanderRadius, wanderRadius), 0],
    yPath: [0, rand(-wanderRadius, wanderRadius), rand(-wanderRadius, wanderRadius), rand(-wanderRadius, wanderRadius), 0],
  };
}

/**
 * Firefly — a single glowing dot. Wrapped in React.memo since its config
 * never changes after generation, so it should never re-render once mounted.
 */
const Firefly = memo(function Firefly({ config, reducedMotion }) {
  const {
    startX, startY, size, blur, glow, color,
    moveDuration, twinkleDuration, twinkleDelay,
    minOpacity, maxOpacity, xPath, yPath,
  } = config;

  return (
    <motion.span
      className="firefly-dot"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${glow}px ${glow / 2}px ${color}`,
        filter: blur ? `blur(${blur}px)` : undefined,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: minOpacity, x: 0, y: 0, scale: 1 }}
      animate={
        reducedMotion
          ? { opacity: (minOpacity + maxOpacity) / 2 }
          : {
              x: xPath,
              y: yPath,
              opacity: [minOpacity, maxOpacity, minOpacity],
              scale: [0.85, 1.15, 0.85],
            }
      }
      transition={
        reducedMotion
          ? { duration: 1 }
          : {
              x: { duration: moveDuration, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: moveDuration, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: twinkleDuration, repeat: Infinity, ease: 'easeInOut', delay: twinkleDelay },
              scale: { duration: twinkleDuration, repeat: Infinity, ease: 'easeInOut', delay: twinkleDelay },
            }
      }
    />
  );
});

/**
 * Fireflies
 * ------------------------------------------------------------------
 * Reusable ambient background effect. Drop it inside any relatively- or
 * absolutely-positioned parent — it fills that parent and stays fully
 * non-interactive (pointer-events: none), so it never blocks clicks on
 * content sitting above it.
 *
 * Usage:
 *   <div style={{ position: 'relative' }}>
 *     <Fireflies count={30} />
 *     ...your content, above it in stacking order...
 *   </div>
 *
 * Performance notes:
 *  - Default 30 fireflies = 30 DOM nodes total, each a single <span>.
 *  - Only `transform` and `opacity` are animated — both are GPU-composited
 *    and never trigger layout/reflow.
 *  - All random values are generated once via useMemo, not per frame.
 *  - Respects prefers-reduced-motion automatically.
 * ------------------------------------------------------------------
 */
export default function Fireflies({ count = 30, className = '' }) {
  const reducedMotion = useReducedMotion();

  const fireflies = useMemo(() => {
    const configs = [];
    let id = 0;
    DEPTH_LAYERS.forEach((layer) => {
      const layerCount = Math.round(count * layer.ratio);
      for (let i = 0; i < layerCount; i++) {
        configs.push(buildFireflyConfig(id++, layer));
      }
    });
    return configs;
  }, [count]);

  return (
    <div className={`fireflies-container ${className}`} aria-hidden="true">
      {fireflies.map((config) => (
        <Firefly key={config.id} config={config} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
