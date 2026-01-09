import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LiquidButton } from './LiquidButton';
import BrandedSpinner from './BrandedSpinner';

// Individual Slide Component to handle loading state independently
const Slide = ({ src, width, index }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div 
            className="relative h-full shrink-0 flex items-center justify-center bg-black overflow-hidden"
            style={{ width: width || '100%' }}
        >
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <BrandedSpinner size={30} />
                </div>
            )}
            <img
                src={src}
                draggable="false"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                alt={`Slide ${index + 1}`}
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
    );
};

// ImageSlider Component - True Draggable Slider with Pixel Precision
export const ImageSlider = ({ images }) => {
    const [index, setIndex] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef(null);
    const [clientWidth, setClientWidth] = useState(0);

    // Measure container width for pixel-perfect sliding
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setClientWidth(containerRef.current.offsetWidth);
            }
        };

        // Initial measure
        updateWidth();

        // Use ResizeObserver for robust updates (e.g., modal resizing)
        const resizeObserver = new ResizeObserver(() => {
            updateWidth();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    // Animate x when index or width changes
    useEffect(() => {
        if (clientWidth > 0) {
            const controls = animate(x, -index * clientWidth, { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            });
            return controls.stop;
        }
    }, [index, clientWidth, x]);

    const handleDragEnd = (e, { offset, velocity }) => {
        const swipe = offset.x; // Distance dragged

        if (swipe < -50 || velocity.x < -500) {
            // Swiped Left -> Next Slide
            if (index < images.length - 1) {
                setIndex(index + 1);
            } else {
                // Bounce back if at end
                animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
            }
        } else if (swipe > 50 || velocity.x > 500) {
            // Swiped Right -> Prev Slide
            if (index > 0) {
                setIndex(index - 1);
            } else {
                // Bounce back if at start
                animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
            }
        } else {
            // Not enough swipe -> Snap back
            animate(x, -index * clientWidth, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        if (index < images.length - 1) setIndex(index + 1);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        if (index > 0) setIndex(index - 1);
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-64 md:h-80 bg-black overflow-hidden group rounded-2xl border border-white/5 touch-none"
            onClick={(e) => e.stopPropagation()} 
        >
            <motion.div 
                className="flex h-full cursor-grab active:cursor-grabbing"
                style={{ x }}
                drag="x"
                // Drag constraints allows overdrag resistance
                dragConstraints={{ left: -((images.length - 1) * clientWidth), right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
            >
                {images.map((img, i) => (
                    <Slide key={i} src={img} width={clientWidth} index={i} />
                ))}
            </motion.div>

            {/* Controls */}
            {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className={`pointer-events-auto transition-opacity duration-300 ${index === 0 ? 'opacity-0' : 'opacity-100'}`}>
                        <LiquidButton onClick={prevSlide} className="w-10 h-10">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </LiquidButton>
                    </div>
                    <div className={`pointer-events-auto transition-opacity duration-300 ${index === images.length - 1 ? 'opacity-0' : 'opacity-100'}`}>
                        <LiquidButton onClick={nextSlide} className="w-10 h-10">
                            <ChevronRight className="w-5 h-5 text-white" />
                        </LiquidButton>
                    </div>
                </div>
            )}

            {/* Pagination Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                    {images.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 ease-out ${idx === index ? 'bg-purple-400 w-8 opacity-100' : 'bg-white w-2 opacity-30'}`} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
