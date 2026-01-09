import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

// Liquid Glass Draggable Testimonial Slider
export const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);
  const { testimonials: contextTestimonials } = useData();
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const [clientWidth, setClientWidth] = useState(0);

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

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setClientWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  // Animate x
  useEffect(() => {
    if (clientWidth > 0) {
      animate(x, -index * clientWidth, { 
        type: "spring", stiffness: 300, damping: 30 
      });
    }
  }, [index, clientWidth, x]);

  // Auto-change slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

    const handleDragEnd = (e, { offset, velocity }) => {
        const swipe = offset.x;
        if (swipe < -50 || velocity.x < -500) {
            if (index < testimonials.length - 1) setIndex(index + 1);
            else animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
        } else if (swipe > 50 || velocity.x > 500) {
            if (index > 0) setIndex(index - 1);
            else animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
        } else {
            animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
        }
    };



    const nextSlide = () => {
        if (index < testimonials.length - 1) setIndex(index + 1);
        else setIndex(0);
    };

    const prevSlide = () => {
        if (index > 0) setIndex(index - 1);
        else setIndex(testimonials.length - 1);
    };

  return (
    <div className="mt-20 md:mt-28 max-w-5xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10 text-center">Community Voices</h3>
        
        {/* Main Slider Container - Integrated Buttons */}
        <div 
          className="relative rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden flex items-stretch" 
          style={{ 
            backdropFilter: 'blur(12px) saturate(190%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}
        >
            {/* Integrated Left Button */}
            <button 
                onClick={prevSlide}
                className="hidden md:flex w-16 items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors duration-300 z-20 shrink-0 cursor-pointer text-white/50 hover:text-white"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

          {/* Slides Wrapper */}
          <div ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing flex-1 relative">
            <motion.div 
               className="flex h-full"
               style={{ x }}
               drag="x"
               dragConstraints={{ left: -((testimonials.length - 1) * clientWidth), right: 0 }}
               dragElastic={0.2}
               onDragEnd={handleDragEnd}
            >
              {testimonials.map((t, i) => (
                <div 
                    key={t.id || i}
                    className="min-w-full p-6 md:p-10 flex items-center justify-center shrink-0"
                    style={{ width: clientWidth || '100%' }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pointer-events-none select-none max-w-3xl mx-auto">
                        {/* Image */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover" draggable="false" />
                            </div>
                            <div className="absolute -inset-3 bg-purple-500/30 blur-xl rounded-full -z-10" />
                        </div>

                        {/* Text */}
                        <div className="text-center md:text-left flex-1">
                            <Quote className="w-6 h-6 md:w-8 md:h-8 text-white/30 mb-3 mx-auto md:mx-0" />
                            <p className="text-base md:text-lg text-white/90 leading-relaxed font-light italic mb-8 md:mb-6">
                                "{t.text}"
                            </p>
                            <div className="mb-4 md:mb-0">
                                <h4 className="text-white font-bold text-base md:text-lg">{t.name}</h4>
                                <p className="text-purple-400 text-xs md:text-sm">{t.role}, {t.company}</p>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
            </motion.div>
            
             {/* Pagination Dots (Inside Slide Wrapper to be centered relative to content) */}
             <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                {testimonials.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${i === index ? 'bg-purple-400 w-6 opacity-100' : 'bg-white w-1.5 opacity-20 hover:opacity-50 cursor-pointer'}`} 
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
          </div>


            {/* Integrated Right Button */}
            <button 
                onClick={nextSlide}
                className="hidden md:flex w-16 items-center justify-center border-l border-white/5 hover:bg-white/5 transition-colors duration-300 z-20 shrink-0 cursor-pointer text-white/50 hover:text-white"
                aria-label="Next testimonial"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

        </div>
    </div>
  );
};
