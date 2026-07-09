import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from './Envelope';
import InvitationLetter from './InvitationLetter';
import GoldParticles from './GoldParticles';
import '../styles/envelope.css';

const EASE_LUXURY = [0.22, 1, 0.36, 1];

/**
 * EnvelopeIntro
 * ------------------------------------------------------------------
 * Orchestrates the full cinematic "open your invitation" sequence:
 *
 *   floating envelope -> click -> flap opens -> letter slides out ->
 *   gold particles + glow -> letter unfolds -> music starts -> auto-navigate
 *
 * This component owns ONLY the sequencing (a small state machine).
 * Envelope, InvitationLetter, and GoldParticles are presentational and
 * reusable independently — each reports back via an onXComplete callback
 * rather than knowing anything about what comes next.
 *
 * Usage:
 *   <EnvelopeIntro musicSrc="/audio/wedding-theme.mp3" navigateTo="/invitation" />
 *
 * Requires react-router-dom's <BrowserRouter> to be an ancestor (for useNavigate).
 * ------------------------------------------------------------------
 */
export default function EnvelopeIntro({
  musicSrc = '/audio/wedding-theme.mp3',
  navigateTo = '/invitation',
  // How long the fully-unfolded letter stays on screen before auto-navigating.
  // Increase this if you want people to have more time to read it.
  autoNavigateDelay = 4500,
}) {
  const [step, setStep] = useState('floating'); // floating | opening | sliding | unfolding | done
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleEnvelopeClick = useCallback(() => {
    if (step !== 'floating') return;
    setStep('opening');
  }, [step]);

  // Fired by <Envelope> once the flap's opening rotation finishes
  const handleFlapOpened = useCallback(() => {
    setStep('sliding');
    setShowParticles(true);

    // Start music here — still inside the call stack triggered by the
    // user's click, which satisfies browser autoplay-with-gesture policies.
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // If autoplay is still blocked for some reason, fail silently —
        // the visual sequence should never be blocked by audio.
      });
    }
  }, []);

  // Fired by <InvitationLetter> once it has fully slid out of the envelope
  const handleSlideComplete = useCallback(() => {
    setStep('unfolding');
  }, []);

  // Fired by <InvitationLetter> once the unfold animation finishes
  const handleUnfoldComplete = useCallback(() => {
    setStep('done');
    window.setTimeout(() => {
      navigate(navigateTo);
    }, autoNavigateDelay);
  }, [navigate, navigateTo, autoNavigateDelay]);

  return (
    <div className="envelope-intro-stage">
      <audio ref={audioRef} src={musicSrc} preload="auto" />

      {/* Soft ambient glow layer behind everything — intensifies once the letter appears */}
      <motion.div
        className="envelope-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 'sliding' || step === 'unfolding' ? 0.9 : 0.25 }}
        transition={{ duration: 1.2, ease: EASE_LUXURY }}
      />

      <div className="envelope-perspective-wrapper">
        <Envelope step={step} onClick={handleEnvelopeClick} onFlapOpened={handleFlapOpened} />

        <AnimatePresence>
          {(step === 'sliding' || step === 'unfolding' || step === 'done') && (
            <InvitationLetter
              step={step}
              onSlideComplete={handleSlideComplete}
              onUnfoldComplete={handleUnfoldComplete}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showParticles && <GoldParticles onDone={() => setShowParticles(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {step === 'floating' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="envelope-hint"
          >
            Tap to open
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}