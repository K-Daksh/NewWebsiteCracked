import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { LiquidButton } from './LiquidButton';

// Scroll To Top Component
export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <LiquidButton onClick={scrollToTop} className="w-12 h-12 md:w-14 md:h-14">
             <ArrowUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-purple-200 transition-colors" />
          </LiquidButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
