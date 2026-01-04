import React, { useEffect, useState } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';
// We'll fetch the image as a blob
import logoUrl from '../../assets/logo.png'; 

const FooterLogo = () => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const loadLogo = async () => {
            try {
                const response = await fetch(logoUrl);
                const blob = await response.blob();
                const result = await parseLogoImage(blob);
                setImageData(result.imageData);
            } catch (error) {
                console.error("Failed to load logo for metallic paint:", error);
            }
        };

        loadLogo();
    }, []);

    if (!imageData) {
        return <div className="text-2xl font-bold text-white tracking-tight">Cracked Digital</div>;
    }

    return (
        <div className="w-40 relative">
            <MetallicPaint 
                imageData={imageData} 
                params={{
                    patternScale: 1,
                    refraction: 0.015,
                    edge: 0,
                    patternBlur: 0.005,
                    liquid: 0.0,
                    speed: 0.3
                }} 
            />
        </div>
    );
};

export default FooterLogo;
