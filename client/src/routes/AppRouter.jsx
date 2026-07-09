import { Routes, Route } from 'react-router-dom';
import EnvelopeIntro from '../components/EnvelopeIntro';
import InvitationPage from '../pages/InvitationPage';

/**
 * AppRouter
 * ------------------------------------------------------------------
 * Central route map. Add new routes here as pages get built —
 * this keeps App.jsx focused on providers/layout, not route definitions.
 * ------------------------------------------------------------------
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<EnvelopeIntro navigateTo="/invitation" />} />
      <Route path="/invitation" element={<InvitationPage />} />
    </Routes>
  );
}
