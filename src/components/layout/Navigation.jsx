import React from 'react';
import { motion } from 'framer-motion';
import GlassSurface from '../common/GlassSurface';

export const Navigation = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'hire', label: 'Hire' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-6 flex justify-center pointer-events-none">
      {/* Liquid Glass Navigation Container */}
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={9999}
        borderWidth={0.07}
        blur={11}
        brightness={50}
        opacity={0.93}
        displace={0.5}
        backgroundOpacity={0.1}
        saturation={1}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="pointer-events-auto max-w-[90vw] overflow-x-auto no-scrollbar"
      >
        {/* Content Layer: Buttons */}
        <div className="flex items-center gap-1 px-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => { e.stopPropagation(); setActivePage(item.id); }}
              className={`relative px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap pointer-events-auto cursor-pointer ${
                activePage === item.id ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {activePage === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full border border-white/30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    boxShadow: `
                      inset 0 1px 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1),
                      0 2px 8px rgba(0, 0, 0, 0.2)
                    `,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
                />
              )}
              <span className="relative z-10 tracking-wide font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </GlassSurface>
    </nav>
  );
};
