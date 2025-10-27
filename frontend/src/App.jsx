import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import CalendarSettings from './pages/CalendarSettings';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Default route redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Contacts route */}
      <Route path="/contacts" element={<Contacts />} />

      {/* Calendar routes */}
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/calendar-settings" element={<CalendarSettings />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
