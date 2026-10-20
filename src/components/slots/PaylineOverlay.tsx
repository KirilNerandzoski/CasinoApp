import React from 'react';
import type { WinningLine } from '../../types/slots';

interface PaylineOverlayProps {
  winningLines: WinningLine[];
  containerWidth: number;
  containerHeight: number;
}

const LINE_COLORS = [
  '#facc15', // Gold
  '#38bdf8', // Sky
  '#f43f5e', // Rose
  '#4ade80', // Emerald
  '#c084fc', // Purple
  '#fb923c', // Orange
  '#2dd4bf', // Teal
];

export const PaylineOverlay: React.FC<PaylineOverlayProps> = ({
  winningLines,
  containerWidth,
  containerHeight,
}) => {
  if (winningLines.length === 0 || containerWidth <= 0 || containerHeight <= 0) return null;

  // Calculate coordinates for 5 columns x 3 rows
  const colStep = containerWidth / 5;
  const rowStep = containerHeight / 3;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
    >
      <defs>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {winningLines.map((line, idx) => {
        const color = LINE_COLORS[idx % LINE_COLORS.length];
        const points = line.positions.map((pos) => {
          const x = pos.col * colStep + colStep / 2;
          const y = pos.row * rowStep + rowStep / 2;
          return `${x},${y}`;
        });

        const pathData = `M ${points.join(' L ')}`;

        return (
          <g key={`${line.lineIndex}-${idx}`}>
            {/* Background glowing stroke */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#goldGlow)"
            />
            {/* Foreground crisp line */}
            <path
              d={pathData}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
            {/* Position marker nodes */}
            {line.positions.slice(0, line.count).map((pos, pIdx) => {
              const cx = pos.col * colStep + colStep / 2;
              const cy = pos.row * rowStep + rowStep / 2;
              return (
                <circle
                  key={pIdx}
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#goldGlow)"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};
