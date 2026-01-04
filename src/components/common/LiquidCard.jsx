import React, { memo } from 'react';

// Simple glassmorphism card without GlassSurface
export const LiquidCard = memo(({ children, className = "", onClick, rounded = "rounded-3xl" }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden group border border-white/10 ${rounded} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transform: "translateZ(0)",
        willChange: onClick ? 'transform' : 'auto',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Gradient Tint Layer */}
      <div 
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-75`}
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      />

      {/* Shine/Gloss Layer */}
      <div 
        className={`absolute inset-0 z-20 pointer-events-none`}
        style={{
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255,255,255,0.02)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-30 h-full w-full">{children}</div>
    </div>
  );
});

LiquidCard.displayName = 'LiquidCard';

// Legacy export for compatibility
export const LiquidLayers = memo(({ rounded }) => null);
LiquidLayers.displayName = 'LiquidLayers';
