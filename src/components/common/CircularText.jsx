import React from 'react';
import { motion } from 'framer-motion';

const CircularText = ({ 
  text = "CRACKED ✦ DIGITAL ✦ ", 
  spinDuration = 15,
  className = '' 
}) => {
  const letters = Array.from(text);
  
  return (
    <motion.div
      className={`relative flex items-center justify-center w-[200px] h-[200px] rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: spinDuration,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {letters.map((letter, i) => {
        const rotation = (360 / letters.length) * i;
        return (
          <span
            key={i}
            className="absolute top-0 left-1/2 text-2xl font-bold text-white select-none whitespace-pre"
            style={{
              height: '50%', // Half of container height = radius
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${rotation}deg)`,
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
