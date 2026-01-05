import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, User } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/events': 'Events Manager',
  '/stats': 'Stats Manager',
  '/testimonials': 'Testimonials Manager',
  '/faqs': 'FAQs Manager',
  '/milestones': 'Milestones Manager',
  '/settings': 'Site Settings',
  '/gallery': 'Image Gallery',
};

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role || 'Admin'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
