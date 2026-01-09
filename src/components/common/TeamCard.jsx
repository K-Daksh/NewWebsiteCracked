import { useEffect, useRef } from 'react';
import { Linkedin, Mail } from 'lucide-react';

const TeamCard = ({
  name,
  role,
  image,
  linkedin,
  email,
  blurStrength = 0,
  color = 'white',
  metalness = 0,
  roughness = 0.1,
  overlayColor = 'transparent',
  displacementStrength = 20,
  noiseScale = 0.5,
  specularConstant = 1.2,
  grayscale = 0,
  glassDistortion = 0,
  className = '',
  style = {}
}) => {
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  };

  return (
    <div
      className={`relative w-full max-w-[200px] mx-auto aspect-[4/5] rounded-[16px] overflow-hidden bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset] isolate font-sans ${className}`}
      style={{ ...style, ...cssVariables }}
    >
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id={`metallic-displacement-${name}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <img
        src={image}
        alt={name}
        className="absolute top-0 left-0 w-full h-full object-cover scale-[1.2] z-0 opacity-100 transition-[filter] duration-300"
        style={{
          filter: `saturate(var(--saturation, 1)) contrast(110%) brightness(105%)`
        }}
      />

      <div className="absolute inset-0 z-10 opacity-[var(--roughness,0.4)] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.8%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23noiseFilter)%27%2F%3E%3C%2Fsvg%3E')] mix-blend-overlay" />

      <div className="absolute inset-0 z-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.05)_60%,rgba(255,255,255,0.1)_100%)] pointer-events-none mix-blend-overlay opacity-[var(--metalness,0.3)]" />

      <div className="absolute inset-0 rounded-[16px] p-[1px] bg-[linear-gradient(135deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.2)_100%)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] z-20 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 pb-2 text-[var(--text-color,white)] bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <div className="flex-1 flex flex-col justify-end items-center text-center mb-1.5 pt-12">
          <div className="text-center">
            <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.05em] m-0 mb-0.4 drop-shadow-md">{name}</h2>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] opacity-70 m-0 uppercase">{role}</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-1 border-t border-white/10 pt-1.5">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
          <a
            href={`mailto:${email}`}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
