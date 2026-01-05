import React from 'react';

const BrandedSpinner = ({ size = 60 }) => {
  return (
    <div 
      style={{
        width: size,
        height: size,
        border: '4px solid rgba(255, 255, 255, 0.2)',
        borderTopColor: '#ffffff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        willChange: 'transform'
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BrandedSpinner;
