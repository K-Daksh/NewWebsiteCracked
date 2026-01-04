import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Check if hovering over a clickable element
            const target = e.target;
            const isClickable = (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.onclick !== null ||
                window.getComputedStyle(target).cursor === 'pointer' || 
                target.closest('a') !== null || 
                target.closest('button') !== null
            );
            
            setLinkHovered(isClickable);
        };

        const onMouseDown = () => {
            setClicked(true);
        };

        const onMouseUp = () => {
            setClicked(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        addEventListeners();
        return () => removeEventListeners();
    }, []);

    const cursorClasses = `fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out flex items-center justify-center`;

    return (
        <div 
             className={cursorClasses}
             style={{ 
                 left: `${position.x}px`, 
                 top: `${position.y}px`,
                 transform: `translate(-50%, -50%) scale(${clicked ? 0.9 : 1})`,
                 opacity: hidden ? 0 : 1
             }}
        >
             {/* Ring */}
             <div className={`absolute inset-0 rounded-full border border-white transition-all duration-300 ${linkHovered ? 'scale-150 opacity-100 bg-white/20' : 'scale-100 opacity-50'}`} />
             
             {/* Dot */}
             <div className={`w-1.5 h-1.5 bg-white rounded-full transition-all duration-300 ${linkHovered ? 'opacity-0' : 'opacity-100'}`} />
        </div>
    );
};

export default Cursor;
