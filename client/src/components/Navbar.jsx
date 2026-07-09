import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Details', href: '#details' },
  { label: 'RSVP', href: '#rsvp' },
];

const EASE_LUXURY = [0.22, 1, 0.36, 1];

export default function Navbar({ coupleInitials = 'E & H' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleLinkClick = (href) => (e) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 backdrop-blur-xl bg-[var(--glass-bg)] border-b border-[var(--color-gold-400)]/40 shadow-[var(--shadow-soft)]'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10">
          <a
            href="#home"
            onClick={handleLinkClick('#home')}
            className="font-script text-2xl md:text-3xl text-[var(--color-accent)] tracking-wide"
          >
            {coupleInitials}
          </a>

          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.filter((l) => l.href !== '#rsvp').map((link) => (
              <li
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <a
                  href={link.href}
                  onClick={handleLinkClick(link.href)}
                  className="font-body text-sm tracking-[0.08em] uppercase text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </a>
                {hoveredLink === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--color-accent)]"
                    transition={{ duration: 0.3, ease: EASE_LUXURY }}
                  />
                )}
              </li>
            ))}
          </ul>

          <a
            href="#rsvp"
            onClick={handleLinkClick('#rsvp')}
            className="hidden md:inline-flex btn btn-secondary"
          >
            RSVP
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[6px] z-50"
          >
            <motion.span
              animate={isMobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="w-6 h-[1.5px] bg-[var(--color-text-primary)] block origin-center"
            />
            <motion.span
              animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-[1.5px] bg-[var(--color-text-primary)] block"
            />
            <motion.span
              animate={isMobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="w-6 h-[1.5px] bg-[var(--color-text-primary)] block origin-center"
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden backdrop-blur-2xl bg-[var(--color-primary-950)]/90"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
              }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              {NAV_LINKS.filter((l) => l.href !== '#rsvp').map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: EASE_LUXURY }}
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick(link.href)}
                    className="font-display text-3xl text-[var(--color-cream-100)] hover:text-[var(--color-accent)] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: EASE_LUXURY }}
              >
                <a href="#rsvp" onClick={handleLinkClick('#rsvp')} className="btn btn-primary mt-4">
                  RSVP
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
