import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  lightText?: boolean; // if true, text is white/gold; if false, black/gold
}

export function LogoIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  // Resolve sizing
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const currentSize = sizeMap[size];

  return (
    <svg
      className={`${currentSize} ${className} flex-shrink-0`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Deep luxurious navy gradient matching the uploaded logo canvas */}
        <radialGradient id="logoBgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1E3F" />
          <stop offset="60%" stopColor="#051025" />
          <stop offset="100%" stopColor="#020712" />
        </radialGradient>

        {/* Premium metallic dual-tone gold gradient */}
        <linearGradient id="logoGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9F5E8" />
          <stop offset="25%" stopColor="#E9D092" />
          <stop offset="50%" stopColor="#C8A261" />
          <stop offset="75%" stopColor="#9C7938" />
          <stop offset="100%" stopColor="#DFBF7E" />
        </linearGradient>

        <linearGradient id="logoGold2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6623" />
          <stop offset="35%" stopColor="#C8A261" />
          <stop offset="70%" stopColor="#DFBF7E" />
          <stop offset="100%" stopColor="#FFF4D0" />
        </linearGradient>

        {/* Fine gold border gradient */}
        <linearGradient id="logoBorder" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="50%" stopColor="#C8A261" />
          <stop offset="100%" stopColor="#8A6623" />
        </linearGradient>
      </defs>

      {/* Dark premium medallion background with fine gold outline */}
      <circle cx="50" cy="50" r="47" fill="url(#logoBgGrad)" stroke="url(#logoBorder)" strokeWidth="1.8" />

      {/* Futuristic networking connection node visual overlays mirroring the exact background elements */}
      <g opacity="0.25">
        <circle cx="25" cy="25" r="1" fill="#FFFFFF" />
        <circle cx="80" cy="20" r="1" fill="#FFFFFF" />
        <circle cx="85" cy="65" r="1.2" fill="#FFFFFF" />
        <circle cx="15" cy="75" r="1" fill="#FFFFFF" />
        <circle cx="75" cy="80" r="0.8" fill="#FFFFFF" />
        <line x1="25" y1="25" x2="80" y2="20" stroke="#FFFFFF" strokeWidth="0.2" />
        <line x1="80" y1="20" x2="85" y2="65" stroke="#FFFFFF" strokeWidth="0.2" />
        <line x1="85" y1="65" x2="75" y2="80" stroke="#FFFFFF" strokeWidth="0.2" />
        <line x1="15" y1="75" x2="25" y2="25" stroke="#FFFFFF" strokeWidth="0.2" />
        <line x1="25" y1="25" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="0.15" />
        <line x1="80" y1="20" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="0.15" />
      </g>

      {/* Outer shield frame wrapper */}
      <g transform="translate(0, -6)">
        {/* Double-layered gold shield rim */}
        <path
          d="M50 24 C62 25 67 29 67 40 C67 52.5 58.5 61.5 50 67 C41.5 61.5 33 52.5 33 40 C33 29 38 25 50 24 Z"
          fill="none"
          stroke="url(#logoGold2)"
          strokeWidth="1.2"
          opacity="0.5"
        />
        
        {/* Actual shield geometry from selection */}
        <path
          d="M50 26 C60.5 26.8 65 30 65 40 C65 51 57.5 59.5 50 64.5 C42.5 59.5 35 51 35 40 C35 30 39.5 26.8 50 26 Z"
          fill="none"
          stroke="url(#logoGold1)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Dynamic intertwined monogram glyph representing 'S' and '9' together */}
        {/* The '9' head loop (upper right quadrant, nesting elegantly) */}
        <path
          d="M50 34 C55.5 34 59.5 37.5 59.5 42.5 C59.5 47.5 55.5 51 50 51 C45 51 41.5 48.5 41 43"
          stroke="url(#logoGold1)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* The 'S' sweeping flow curving outwards from left, crossing under 9's base */}
        <path
          d="M39 37 C41.5 31.5 46 29 50 29 M39 37 C41 45.5 45.5 51 50 55 C54.5 51 59 45.5 61 37"
          stroke="url(#logoGold2)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Centered tail loop of '9' completing into an infinity gate bottom edge */}
        <path
          d="M50 51 C50 51.5 49 57 45.5 59 C42 61 39 57.5 41.5 53"
          stroke="url(#logoGold1)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Pure elegance: Mini banner wording at bottom of medallion (visible at lg/xl sizes) */}
      <g transform="translate(0, 1)">
        <text
          x="50"
          y="79"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.2"
        >
          SIDCO9
        </text>
        <text
          x="50"
          y="87"
          textAnchor="middle"
          fill="#DFBF7E"
          fontSize="4.5"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.8"
        >
          VENTURES
        </text>
      </g>
    </svg>
  );
}

export default function Logo({ className = '', size = 'md', withText = true, lightText = true }: LogoProps) {
  // Brand name color styling based on theme setting
  const titleColor = lightText ? 'text-white' : 'text-black';
  const subtitleColor = lightText ? 'text-white/50' : 'text-black/50';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* High-fidelity custom render matching the attached gold shield structure */}
      <LogoIcon size={size} />

      {withText && (
        <div className="flex flex-col text-left">
          <span className={`font-sans font-black tracking-widest uppercase ${titleColor} ${
            size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-lg' : 'text-xs'
          }`}>
            sidco9 <span className="font-light opacity-80">Ventures</span>
          </span>
          <span className={`font-mono font-bold tracking-widest uppercase text-brand-gold ${subtitleColor} ${
            size === 'sm' ? 'text-[6px] mt-[-2px]' : size === 'lg' ? 'text-[9px] mt-[-1px]' : 'text-[7.5px] mt-[-2px]'
          }`}>
            Global Wealth Advisor
          </span>
        </div>
      )}
    </div>
  );
}
