import { motion } from 'framer-motion';

const EASE_LUXURY = [0.22, 1, 0.36, 1];

/**
 * Envelope
 * ------------------------------------------------------------------
 * Presentational, reusable envelope with a real 3D-hinged flap.
 *
 * 3D technique:
 *  - The parent (.envelope-perspective-wrapper, in EnvelopeIntro) sets
 *    `perspective` — this is what gives depth to any 3D rotation inside it.
 *  - `.envelope-flap` has `transform-style: preserve-3d` and
 *    `transform-origin: top center`, so rotateX() pivots around its top
 *    edge like a real hinge, not around its own center.
 *  - The flap has two faces (front/back), each with
 *    `backface-visibility: hidden`, so exactly one face is ever visible
 *    depending on rotation angle — this is what sells the "paper flap"
 *    illusion instead of it looking like a flat image spinning in place.
 * ------------------------------------------------------------------
 */
export default function Envelope({ step, onClick, onFlapOpened }) {
  const isFloating = step === 'floating';
  const isOpening = step === 'opening';
  const flapOpen = step !== 'floating';

  return (
    <motion.div
      className="envelope-body"
      role="button"
      tabIndex={0}
      aria-label="Open your invitation"
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: isFloating ? [0, -10, 0] : 0,
      }}
      transition={
        isFloating
          ? {
              y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.9 },
              scale: { duration: 0.9, ease: EASE_LUXURY },
            }
          : { duration: 0.6, ease: EASE_LUXURY }
      }
      whileHover={isFloating ? { scale: 1.03 } : undefined}
      style={{ cursor: isFloating ? 'pointer' : 'default' }}
    >
      {/* Back panel of the envelope */}
      <div className="envelope-back" />

      {/* Flap — rotates open around its top edge via CSS 3D transform */}
      <motion.div
        className="envelope-flap"
        initial={false}
        animate={{ rotateX: flapOpen ? -178 : 0 }}
        transition={{ duration: 1.2, ease: EASE_LUXURY }}
        onAnimationComplete={() => {
          if (isOpening) onFlapOpened();
        }}
        style={{ transformOrigin: 'top center' }}
      >
        <div className="envelope-flap-face envelope-flap-front" />
        <div className="envelope-flap-face envelope-flap-back" />
      </motion.div>

      {/* Front pocket — sits above the flap in stacking order so the
          letter appears to slide out from behind it */}
      <div className="envelope-front" />

      {/* Wax seal / monogram — only shown while closed */}
      {isFloating && <div className="envelope-seal">E&amp;H</div>}
    </motion.div>
  );
}