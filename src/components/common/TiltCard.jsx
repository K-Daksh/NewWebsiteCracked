import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springValues = {
  damping: 20,
  stiffness: 300,
  mass: 0.8
};

// TiltCard with glassmorphism styling
export const TiltCard = ({
  children,
  className = '',
  containerHeight = 'auto',
  containerWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  rounded = 'rounded-2xl',
  onClick = null
}) => {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative [perspective:800px] flex items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className={`relative [transform-style:preserve-3d] w-full h-full overflow-hidden group border border-white/10 ${rounded} ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
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

        {/* 3D Highlight effect */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Content Layer */}
        <div className="relative z-30 h-full w-full [transform:translateZ(20px)]">
          {children}
        </div>
      </motion.div>
    </figure>
  );
};

export default TiltCard;
