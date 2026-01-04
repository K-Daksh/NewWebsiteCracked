import { useEffect, useRef } from 'react';

/**
 * Enables "drag to scroll" functionality for the entire window/page.
 * Simulates mobile touch scrolling on desktop.
 */
export const useWindowDragScroll = (enabled = true) => {
    const isDown = useRef(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);

    useEffect(() => {
        if (!enabled) return;

        const handleMouseDown = (e) => {
            // Ignore if clicking on interactive elements to allow normal interaction
            if (e.target.closest('button, a, input, textarea, .no-drag')) return;

            isDown.current = true;
            startY.current = e.pageY;
            startScrollTop.current = window.scrollY || document.documentElement.scrollTop;

            // Optional: Change cursor to grabbing? 
            // User has custom cursor, so maybe not needed or handled by custom cursor logic.
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
        };

        const handleMouseLeave = () => {
            isDown.current = false;
            document.body.style.userSelect = '';
        };

        const handleMouseUp = () => {
            isDown.current = false;
            document.body.style.userSelect = '';
        };

        const handleMouseMove = (e) => {
            if (!isDown.current) return;
            e.preventDefault();
            const y = e.pageY;
            const walk = (y - startY.current) * 1.5; // Scroll-fast multiplier (1.5x speed)
            window.scrollTo({
                top: startScrollTop.current - walk,
                behavior: 'auto' // Instant scroll for direct control
            });
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            document.body.style.userSelect = '';
        };
    }, [enabled]);
};
