import { motion } from 'framer-motion';

const EASE_LUXURY = [0.22, 1, 0.36, 1];

/**
 * InvitationLetter
 * ------------------------------------------------------------------
 * Two independent animation layers, nested:
 *
 *  1. Outer layer — handles POSITION (sliding up and out of the envelope).
 *  2. Inner layer (.invitation-letter-fold) — handles the UNFOLD itself,
 *     via scaleY animating from a thin folded strip (0.12) up to full
 *     height (1), pivoted from `transform-origin: center top` so it reads
 *     as paper unfurling downward rather than just growing symmetrically.
 *
 * Content fades in only after the unfold is mostly complete, so text
 * doesn't appear squashed while the fold animation is still in progress.
 * ------------------------------------------------------------------
 */
export default function InvitationLetter({ step, onSlideComplete, onUnfoldComplete }) {
  const isSliding = step === 'sliding';
  const isUnfolding = step === 'unfolding' || step === 'done';

  return (
    <motion.div
      className="invitation-letter"
      initial={{ y: 60, scale: 0.55, opacity: 0 }}
      animate={{
        y: isUnfolding ? -150 : -70,
        scale: isUnfolding ? 1 : 0.82,
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: EASE_LUXURY }}
      onAnimationComplete={() => {
        if (isSliding) onSlideComplete();
      }}
    >
      <motion.div
        className="invitation-letter-fold"
        initial={{ scaleY: 0.12 }}
        animate={{ scaleY: isUnfolding ? 1 : 0.12 }}
        transition={{ duration: 1.8, ease: EASE_LUXURY, delay: isUnfolding ? 0.2 : 0 }}
        style={{ transformOrigin: 'center top' }}
        onAnimationComplete={() => {
          if (step === 'unfolding') onUnfoldComplete();
        }}
      >
        <motion.div
          className="invitation-letter-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isUnfolding ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <p className="invitation-eyebrow">Together with their families</p>
          <h1 className="invitation-names">Steve &amp; Jane</h1>
          <div className="invitation-divider" />
          <p className="invitation-detail">request the pleasure of your company</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}