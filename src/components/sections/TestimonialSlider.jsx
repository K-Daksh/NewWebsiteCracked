import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { LiquidCard } from '../common/LiquidCard';
import { LiquidButton } from '../common/LiquidButton';
import { useData } from '../../context/DataContext';

// Liquid Glass Testimonial Slider
export const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { testimonials: contextTestimonials } = useData();
  
  // Use testimonials from context or fallback to static
  const testimonials = contextTestimonials.length > 0 
    ? contextTestimonials 
    : [
        {
          id: 1,
          name: "Priya Sharma",
          role: "Senior Frontend Developer",
          company: "TechNova",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          text: "Cracked Digital transformed my career trajectory."
        },
        {
          id: 2,
          name: "Rahul Verma",
          role: "CTO",
          company: "InnovateX",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          text: "The quality of talent we hired through Cracked is exceptional."
        },
      ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="mt-20 md:mt-28 max-w-5xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10 text-center">Community Voices</h3>
        
        {/* Integrated Container - Arrows flush with card */}
        <div className="flex items-stretch rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden" 
             style={{ 
              backdropFilter: 'blur(12px) saturate(190%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}>
          {/* Left Arrow - Flush with card, no border separation visually */}
          <button 
            onClick={prevTestimonial}
            className="shrink-0 w-12 md:w-16 flex items-center justify-center bg-transparent transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white group-hover:scale-125 transition-all duration-300" />
          </button>

          {/* Card - No rounded corners, fills space */}
          <motion.div 
            className="flex-1 p-6 md:p-10 min-h-[280px] md:min-h-[300px] flex flex-col justify-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 50;
              if (offset.x < -swipeThreshold) {
                nextTestimonial();
              } else if (offset.x > swipeThreshold) {
                prevTestimonial();
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pointer-events-none" // pointer-events-none to prevent text selection while dragging
              >
                {/* Image with Glow */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -inset-3 bg-purple-500/30 blur-xl rounded-full -z-10" />
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left flex-1">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-white/30 mb-3 mx-auto md:mx-0" />
                  <p className="text-base md:text-lg text-white/90 leading-relaxed font-light italic mb-4 md:mb-6 select-none">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <div>
                    <h4 className="text-white font-bold text-base md:text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-purple-400 text-xs md:text-sm">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Arrow - Flush with card */}
          <button 
            onClick={nextTestimonial}
            className="shrink-0 w-12 md:w-16 flex items-center justify-center bg-transparent transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white group-hover:scale-125 transition-all duration-300" />
          </button>
        </div>
    </div>
  );
};
