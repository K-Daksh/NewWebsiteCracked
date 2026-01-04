import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LiquidButton } from './LiquidButton';

// ImageSlider Component - Optimized with Drag/Swipe Support
export const ImageSlider = memo(({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handlePrevClick = useCallback((e) => {
    e.stopPropagation();
    prevSlide();
  }, [prevSlide]);

  const handleNextClick = useCallback((e) => {
    e.stopPropagation();
    nextSlide();
  }, [nextSlide]);

  // Drag Handler
  const onDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  return (
    <motion.div 
        className="relative w-full h-64 md:h-80 bg-black/50 overflow-hidden group rounded-2xl border border-white/5 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on drag
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          draggable="false" // Prevent native browser image drag
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, zIndex: 1 }}
          exit={{ opacity: 0, zIndex: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <div className="pointer-events-auto">
            <LiquidButton onClick={handlePrevClick} className="w-10 h-10">
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-purple-200" />
            </LiquidButton>
        </div>
        <div className="pointer-events-auto">
            <LiquidButton onClick={handleNextClick} className="w-10 h-10">
                <ChevronRight className="w-5 h-5 text-white group-hover:text-purple-200" />
            </LiquidButton>
        </div>
      </div>

      {/* Modern Pagination Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ease-out ${idx === currentIndex ? 'bg-purple-400 w-8 opacity-100' : 'bg-white w-2 opacity-30'}`} 
          />
        ))}
      </div>
    </motion.div>
  );
});

ImageSlider.displayName = 'ImageSlider';
