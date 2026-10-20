import React from 'react';
import type { ChipValue } from '../../types/casino';

interface CasinoChipProps {
  value: ChipValue;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  onClick?: () => void;
  count?: number;
  className?: string;
  animate?: boolean;
}

const CHIP_CONFIGS: Record<
  ChipValue,
  {
    bg: string;
    border: string;
    accent: string;
    textColor: string;
    label: string;
    innerBg: string;
    rimPattern: string;
  }
> = {
  5: {
    bg: '#8B1E22', // Ruby Red
    border: '#d4af37',
    accent: '#ef4444',
    textColor: '#ffffff',
    label: '$5',
    innerBg: '#5c1215',
    rimPattern: '#d4af37',
  },
  25: {
    bg: '#0F5132', // Emerald Green
    border: '#d4af37',
    accent: '#10b981',
    textColor: '#ffffff',
    label: '$25',
    innerBg: '#09311e',
    rimPattern: '#d4af37',
  },
  100: {
    bg: '#18191c', // Deep Obsidian Black
    border: '#e2c176',
    accent: '#facc15',
    textColor: '#e8c779',
    label: '$100',
    innerBg: '#0d0e10',
    rimPattern: '#c5a059',
  },
  500: {
    bg: '#491D6E', // Royal Purple
    border: '#e2c176',
    accent: '#a855f7',
    textColor: '#f3e8ff',
    label: '$500',
    innerBg: '#2f1247',
    rimPattern: '#d4af37',
  },
  1000: {
    bg: '#b8860b', // Pure 24K Burnished Gold
    border: '#fff3cd',
    accent: '#fef08a',
    textColor: '#1a1405',
    label: '$1K',
    innerBg: '#8c6d2d',
    rimPattern: '#ffffff',
  },
};

const SIZE_CONFIGS = {
  xs: { width: 26, height: 26, fontSize: 'text-[9px]' },
  sm: { width: 36, height: 36, fontSize: 'text-[11px]' },
  md: { width: 48, height: 48, fontSize: 'text-[13px]' },
  lg: { width: 62, height: 62, fontSize: 'text-[16px]' },
  xl: { width: 78, height: 78, fontSize: 'text-[20px]' },
};

export const CasinoChip: React.FC<CasinoChipProps> = ({
  value,
  size = 'md',
  isSelected = false,
  onClick,
  count,
  className = '',
  animate = true,
}) => {
  const config = CHIP_CONFIGS[value] || CHIP_CONFIGS[25];
  const dimensions = SIZE_CONFIGS[size];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative select-none inline-flex items-center justify-center rounded-full transition-transform duration-200 cursor-pointer ${
        isSelected ? '-translate-y-2 scale-105 filter drop-shadow-[0_8px_16px_rgba(212,175,55,0.4)]' : ''
      } ${animate ? 'hover:-translate-y-1 hover:brightness-110 active:scale-95' : ''} ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <radialGradient id={`chip-grad-${value}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="60%" stopColor={config.bg} stopOpacity="1" />
            <stop offset="100%" stopColor={config.innerBg} stopOpacity="1" />
          </radialGradient>
          <radialGradient id={`gold-ring-${value}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fff8e7" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#7a5c1e" />
          </radialGradient>
        </defs>

        {/* Outer Shadow Edge */}
        <circle cx="50" cy="50" r="48" fill="#111" opacity="0.4" />

        {/* Outer Base Rim */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={`url(#chip-grad-${value})`}
          stroke={config.border}
          strokeWidth="2.5"
        />

        {/* Edge Inserts (Casino Chip Striping) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={angle}
            x="46"
            y="4"
            width="8"
            height="10"
            rx="2"
            fill={config.rimPattern}
            opacity="0.9"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}

        {/* Inner Gold Foil Inlay */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={`url(#gold-ring-${value})`}
          strokeWidth="2"
          strokeDasharray="3 3"
        />

        {/* Center Metallic Disc */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill={config.innerBg}
          stroke={config.border}
          strokeWidth="1.5"
        />

        {/* Inner Highlight Ring */}
        <circle cx="50" cy="50" r="23" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* Denomination Text */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill={config.textColor}
          fontWeight="bold"
          fontSize="21"
          fontFamily="'Cinzel', serif"
          style={{
            letterSpacing: '-0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {config.label}
        </text>
      </svg>

      {/* Selected Indicator Glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full border-2 border-[#f4e0a5] animate-ping opacity-25 pointer-events-none" />
      )}

      {/* Chip Stack Count Badge */}
      {count && count > 1 && (
        <div className="absolute -top-1 -right-1 bg-[#12141a] text-[#f4e0a5] border border-[#c5a059] text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded-full shadow-lg leading-tight pointer-events-none">
          x{count}
        </div>
      )}
    </div>
  );
};
