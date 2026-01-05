import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EventsManager from './pages/EventsManager.jsx';
import StatsManager from './pages/StatsManager.jsx';
import TestimonialsManager from './pages/TestimonialsManager.jsx';
import FaqsManager from './pages/FaqsManager.jsx';
import MilestonesManager from './pages/MilestonesManager.jsx';
import SettingsManager from './pages/SettingsManager.jsx';
import GalleryManager from './pages/GalleryManager.jsx';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="stats" element={<StatsManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="faqs" element={<FaqsManager />} />
        <Route path="milestones" element={<MilestonesManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="gallery" element={<GalleryManager />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
