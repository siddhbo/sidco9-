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
        {/* Deep luxurious navy gradient matching the uploaded logo's dark radiant background */}
        <radialGradient id="logoBgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#143261" />
          <stop offset="55%" stopColor="#0B1C38" />
          <stop offset="100%" stopColor="#040B1A" />
        </radialGradient>

        {/* Premium metallic primary gold gradient (reflective highlights) */}
        <linearGradient id="logoGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2CC" />
          <stop offset="25%" stopColor="#E6C275" />
          <stop offset="50%" stopColor="#C49B45" />
          <stop offset="75%" stopColor="#9E7628" />
          <stop offset="100%" stopColor="#F5D792" />
        </linearGradient>

        {/* Premium metallic secondary gold gradient (deeper golden hues for 3D realism) */}
        <linearGradient id="logoGold2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#87611D" />
          <stop offset="30%" stopColor="#C49B45" />
          <stop offset="70%" stopColor="#F5D792" />
          <stop offset="100%" stopColor="#FFF9E6" />
        </linearGradient>

        {/* Fine gold border gradient for outer medallion ring */}
        <linearGradient id="logoBorder" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="50%" stopColor="#C49B45" />
          <stop offset="100%" stopColor="#87611D" />
        </linearGradient>

        {/* Shadow filter to separate overlapping ribbon layers */}
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Dark premium medallion background with fine gold outline as seen in the official logo image */}
      <circle cx="50" cy="50" r="47" fill="url(#logoBgGrad)" stroke="url(#logoBorder)" strokeWidth="1.8" />

      {/* Elegant high-tech network constellation lines from the uploaded logo edges */}
      <g opacity="0.18">
        <circle cx="20" cy="30" r="0.8" fill="#FFF" />
        <circle cx="82" cy="18" r="0.8" fill="#FFF" />
        <circle cx="88" cy="62" r="1" fill="#FFF" />
        <circle cx="12" cy="72" r="0.8" fill="#FFF" />
        <circle cx="78" cy="85" r="0.6" fill="#FFF" />
        <line x1="20" y1="30" x2="82" y2="18" stroke="#FFF" strokeWidth="0.15" />
        <line x1="82" y1="18" x2="88" y2="62" stroke="#FFF" strokeWidth="0.15" />
        <line x1="88" y1="62" x2="78" y2="85" stroke="#FFF" strokeWidth="0.15" />
        <line x1="12" y1="72" x2="20" y2="30" stroke="#FFF" strokeWidth="0.15" />
        <line x1="20" y1="30" x2="50" y2="45" stroke="#FFF" strokeWidth="0.1" />
        <line x1="82" y1="18" x2="50" y2="45" stroke="#FFF" strokeWidth="0.1" />
      </g>

      {/* Re-creation of the highly stylized, 3D ribbon-style "S & 9" Gold Shield Monogram */}
      <g transform="translate(0, -3.5)">
        {/* Layer 1: Right Shield Rim Swoop (Deep Gold) */}
        <path
          d="M 50 21.5 C 61 22.5 66.5 27 66.5 38.5 C 66.5 49 59.5 57 50 64.5 C 49.5 65 48.5 64.5 48.5 63.8 C 48.5 59.5 52 54 58 48 C 61.5 44.5 62.5 41 62.5 38.5 C 62.5 29 57.5 24.5 50 23.5 Z"
          fill="url(#logoGold2)"
          filter="url(#logoShadow)"
        />

        {/* Layer 2: Left Shield Rim Swoop (Shiny Gold) */}
        <path
          d="M 50 21.5 C 39 22.5 33.5 27 33.5 38.5 C 33.5 49 40.5 57 50 64.5 C 50.5 65 51.5 64.5 51.5 63.8 C 51.5 59.5 48 54 42 48 C 38.5 44.5 37.5 41 37.5 38.5 C 37.5 29 42.5 24.5 50 23.5 Z"
          fill="url(#logoGold1)"
          filter="url(#logoShadow)"
        />

        {/* Layer 3: Central Golden Stylized "9" Loop */}
        {/* Highly polished circular gold loop of the '9' key component */}
        <path
          d="M 53 29.5 C 58.5 29.5 62.5 33.5 62.5 39 C 62.5 44.5 58.5 48.5 53 48.5 C 47.5 48.5 43.5 44.5 43.5 39 C 43.5 33.5 47.5 29.5 53 29.5 Z M 53 34.5 C 50.5 34.5 48.5 36.5 48.5 39 C 48.5 41.5 50.5 43.5 53 43.5 C 55.5 43.5 57.5 41.5 57.5 39 C 57.5 36.5 55.5 34.5 53 34.5 Z"
          fill="url(#logoGold1)"
          filter="url(#logoShadow)"
        />

        {/* Layer 4: The 3D Swooping Stem of the "9" wrapping downwards to form the bottom gate */}
        <path
          d="M 57.5 39 C 57.5 47.5 51 55.5 43.5 58 C 42.5 58.5 41.5 57.5 42 56.5 C 43.5 53 49 48 51 43.5 Z"
          fill="url(#logoGold2)"
          filter="url(#logoShadow)"
        />

        {/* Layer 5: Elegant Inner S-Loop crossing over the lower quadrant */}
        <path
          d="M 39 36.5 C 42.5 31.5 47.5 31.5 49.5 33.5 C 48 35.5 44 35.5 41 39 C 38.5 42 39 46.5 42.5 50 C 40.5 47.5 38.5 42.5 39 36.5 Z"
          fill="url(#logoGold1)"
          filter="url(#logoShadow)"
        />
      </g>

      {/* Highly polished branding typography at the bottom of the medallion */}
      <g transform="translate(0, 0)">
        <text
          x="50"
          y="77.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.8"
        >
          SIDCO9
        </text>
        <text
          x="50"
          y="85.5"
          textAnchor="middle"
          fill="#E6C275"
          fontSize="5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.6"
        >
          VENTURES
        </text>
      </g>
    </svg>
  );
}

export default function Logo({ className = '', size = 'md', withText = true, lightText = true }: LogoProps) {
  // Brand name color styling based on theme setting
  const titleColor = lightText ? 'text-white' : 'text-[#06183A]';
  const subtitleColor = lightText ? 'text-white/50' : 'text-[#06183A]/60';

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* High-fidelity custom render matching the official gold shield structure */}
      <LogoIcon size={size} />

      {withText && (
        <div className="flex flex-col text-left">
          <span className={`font-sans font-black tracking-[0.16em] uppercase ${titleColor} ${
            size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-xl' : 'text-[13px]'
          }`}>
            sidco9 <span className="font-light opacity-80">Ventures</span>
          </span>
          <span className={`font-mono font-bold tracking-[0.22em] uppercase text-brand-gold ${subtitleColor} ${
            size === 'sm' ? 'text-[6px] mt-[-1px]' : size === 'lg' ? 'text-[9.5px] mt-[0px]' : 'text-[8px] mt-[-1px]'
          }`}>
            Global Wealth Advisor
          </span>
        </div>
      )}
    </div>
  );
}

