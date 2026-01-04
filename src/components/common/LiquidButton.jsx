import React, { memo } from 'react';

// Simple glassmorphism button without GlassSurface
export const LiquidButton = memo(({ children, className = "", onClick, type = "button", rounded = "rounded-full" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative flex items-center justify-center outline-none select-none group ${rounded} ${className} transform-gpu transition-all duration-300 hover:scale-105 active:scale-95`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transform: "translateZ(0)",
      }}
    >
      {/* Shimmer Effect on Hover */}
      <div className={`absolute inset-0 ${rounded} overflow-hidden pointer-events-none`}>
        <div 
          className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
          }}
        />
      </div>

      {/* Glossy Highlight */}
      <div className={`absolute inset-0 ${rounded} pointer-events-none`}
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
        {children}
      </div>
    </button>
  );
});

LiquidButton.displayName = 'LiquidButton';
