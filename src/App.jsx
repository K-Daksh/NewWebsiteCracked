import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { EventModal } from './components/modals/EventModal';
import { HelmetProvider } from 'react-helmet-async';
import DarkVeil from './components/backgrounds/DarkVeil';
import Cursor from './components/common/Cursor';
import BrandedSpinner from './components/common/BrandedSpinner';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then(module => ({ default: module.EventsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const HirePage = lazy(() => import('./pages/HirePage').then(module => ({ default: module.HirePage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(module => ({ default: module.BlogPostPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

import { useWindowDragScroll } from './hooks/useWindowDragScroll';
import { DataProvider, useData } from './context/DataContext';
import { AdminAuthProvider, useAdminAuth } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// Inner app component that uses the data context
const AppContent = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { loading: dataLoading } = useData();
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);
  const { isAuthenticated: isAdminAuthenticated, loading: adminLoading } = useAdminAuth();
  
  // Blog slug state
  const [blogSlug, setBlogSlug] = useState(null);

  // Manual Router Logic
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/index.html') {
        setActivePage('home');
      } else if (path === '/admin') {
        setActivePage('admin');
      } else if (path.startsWith('/blog/')) {
        const slug = path.split('/blog/')[1];
        if (slug) {
          setBlogSlug(slug);
          setActivePage('blog-post');
        } else {
          setActivePage('blog');
        }
      } else if (path === '/blog') {
        setActivePage('blog');
      } else if (path === '/events') {
        setActivePage('events');
      } else if (path === '/about') {
        setActivePage('about');
      } else if (path === '/hire') {
        setActivePage('hire');
      } else {
        // Unknown route -> 404
        setActivePage('404');
      }
    };

    // Check on mount
    handleLocation();

    // Listen for back/forward navigation
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Update URL when page changes (Pseudo-router)
  const navigateTo = (page, slug = null) => {
    setActivePage(page);
    setBlogSlug(slug);
    
    let path = '/';
    if (page === 'home') path = '/';
    else if (page === 'admin') path = '/admin';
    else if (page === 'blog-post' && slug) path = `/blog/${slug}`;
    else path = `/${page}`;
    
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading screen until both data is fetched AND minimum time has passed
  const isLoading = (dataLoading || !minLoadingComplete) && activePage !== 'admin';
  
  // Enable drag-to-scroll on desktop (mimic mobile feel)
  useWindowDragScroll(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let timer;

    if (!dataLoading) {
      // If data is ready (cached or fetched), finish loading quickly
      // Small delay (100ms) prevents flickering and ensures smooth transition
      timer = setTimeout(() => {
        setMinLoadingComplete(true);
      }, 100);
    } else {
      // If data is fetching, ensure minimum branding time
      timer = setTimeout(() => {
        setMinLoadingComplete(true);
      }, 2200);
    }

    return () => clearTimeout(timer);
  }, [dataLoading]);


  // Throttled mouse tracking for better performance
  const handleGlobalMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      rafRef.current = null;
    });
  }, [mouseX, mouseY]);

  const backgroundGradient = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.03), transparent 60%)`;

  // Admin Pages - Shown when activePage is 'admin'
  if (activePage === 'admin') {
    if (adminLoading) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#0a0a0a]">
          <AdminLogin onBack={() => navigateTo('home')} />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <AdminDashboard onBack={() => navigateTo('home')} />
      </div>
    );
  }

  // Main Website Content
  return (
    <div 
      className="min-h-screen w-full bg-[#030303] text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden relative cursor-none"
      onMouseMove={handleGlobalMouseMove}
    >
      <div className="hidden md:block">
        <Cursor />
      </div>

      {/* Global Style for hiding scrollbars and cursor only on desktop */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
             <BrandedSpinner size={60} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. DarkVeil Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          hueShift={0}
          speed={1.5}
          noiseIntensity={0.02}
          warpAmount={0.3}
        />
      </div>



      {/* 2. Navigation - Fixed Liquid Glass (No Collapse) */}
      <Navigation activePage={activePage} setActivePage={(page) => navigateTo(page)} />

      {/* 3. Main Content Area */}
      <main className="relative z-10 pt-28 sm:pt-32 min-h-screen">
        <Suspense fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
             <BrandedSpinner size={50} />
          </div>
        }>
          <AnimatePresence mode="wait">
            {activePage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <HomePage onEventSelect={setSelectedEvent} />
              </motion.div>
            )}

            {activePage === 'events' && (
               <motion.div
               key="events"
               initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
               transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
             >
               <EventsPage onEventSelect={setSelectedEvent} />
             </motion.div>
            )}

            {activePage === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <AboutPage />
              </motion.div>
            )}

            {activePage === 'hire' && (
              <motion.div
                key="hire"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <HirePage />
              </motion.div>
            )}

            {activePage === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <BlogPage onNavigate={(path) => {
                    // Manual extraction of slug for navigation
                    const slug = path.split('/')[1];
                    navigateTo('blog-post', slug);
                }} />
              </motion.div>
            )}

            {activePage === 'blog-post' && (
              <motion.div
                key="blog-post"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <BlogPostPage slug={blogSlug} onBack={() => navigateTo('blog')} />
              </motion.div>
            )}

            {activePage === '404' && (
              <motion.div
                key="404"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                <NotFoundPage onGoHome={() => navigateTo('home')} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* 4. Global Modal Layer */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>

      {/* 5. Scroll To Top Button */}
      <ScrollToTop />

      {/* 6. Detailed Footer - Compact Horizontal Layout */}
      <Footer setActivePage={(page) => navigateTo(page)} />

      {/* SVG Filter Definition for Glass Distortion */}
      <svg style={{ display: 'none' }}>
        <filter id="glass-distortion" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feDisplacementMap in="SourceGraphic" in2="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" result="displacementMap" />
          <feGaussianBlur stdDeviation="3 3" x="0%" y="0%" width="100%" height="100%" in="displacementMap" edgeMode="none" result="blur" />
        </filter>
      </svg>
    </div>
  );
};

// Main App component with DataProvider and AdminAuthProvider wrapper
const CrackedDigitalApp = () => {
  return (
    <HelmetProvider>
      <AdminAuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AdminAuthProvider>
    </HelmetProvider>
  );
};

export default CrackedDigitalApp;
