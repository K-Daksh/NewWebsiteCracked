import React from 'react';

// CSS-based animated silk/wave background (no Three.js required)
const Silk = ({ 
  color = '#1a1a2e', 
  speed = 5,
  opacity = 1 
}) => {
  return (
    <div 
      className="w-full h-full absolute inset-0 overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {/* Animated gradient layers */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(100, 100, 180, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(60, 60, 120, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(80, 80, 140, 0.1) 0%, transparent 60%)
          `,
          opacity,
        }}
      />
      
      {/* Animated wave layer 1 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(100, 100, 180, 0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: `silkWave ${speed * 2}s ease-in-out infinite`,
        }}
      />
      
      {/* Animated wave layer 2 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, rgba(80, 80, 160, 0.15) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: `silkWave ${speed * 2.5}s ease-in-out infinite reverse`,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes silkWave {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Silk;
