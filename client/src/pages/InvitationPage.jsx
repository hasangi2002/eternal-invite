import Navbar from '../components/Navbar';

/**
 * InvitationPage
 * ------------------------------------------------------------------
 * Placeholder landing page reached after the envelope-opening sequence.
 * Navbar lives HERE (not in App.jsx) so it only appears once the user
 * has actually reached the invitation content — it should not float
 * over the envelope splash sequence on "/".
 * Replace the placeholder content below with the real cinematic
 * invitation sections (hero, story, gallery, RSVP, etc.) as they're built.
 * ------------------------------------------------------------------
 */
export default function InvitationPage() {
  return (
    <>
      <Navbar coupleInitials="S & J" />
      <div
        id="home"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-800)' }}>
          You're Invited
        </h1>
      </div>
    </>
  );
}
