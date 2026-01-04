import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { EventModal } from './components/modals/EventModal';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { AboutPage } from './pages/AboutPage';
import { HirePage } from './pages/HirePage';
import DarkVeil from './components/backgrounds/DarkVeil';
import Cursor from './components/common/Cursor';
import CircularText from './components/common/CircularText';

import { useWindowDragScroll } from './hooks/useWindowDragScroll';

const CrackedDigitalApp = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enable drag-to-scroll on desktop (mimic mobile feel)
  useWindowDragScroll(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

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
             <CircularText 
                text="CRACKED ✦ DIGITAL ✦ " 
                spinDuration={5} 
                className="scale-125 md:scale-150"
             />
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

      {/* 2. Interactive Reveal Light Overlay */}
      <motion.div 
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: backgroundGradient }}
      />

      {/* 2. Navigation - Fixed Liquid Glass (No Collapse) */}
      <Navigation activePage={activePage} setActivePage={setActivePage} />

      {/* 3. Main Content Area */}
      {/* 3. Main Content Area */}
      <main className="relative z-10 pt-28 sm:pt-32 min-h-screen">
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
        </AnimatePresence>
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
      <Footer setActivePage={setActivePage} />

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

export default CrackedDigitalApp;
