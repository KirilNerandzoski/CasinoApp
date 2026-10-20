import React, { useState, useEffect, useRef } from 'react';
import type { SlotSymbolId } from '../../types/slots';
import { SlotSymbolView } from './SlotSymbolView';
import { soundEngine } from '../../services/soundEngine';

interface SlotReelColumnProps {
  reelIndex: number;
  currentSymbols: SlotSymbolId[];
  targetSymbols: SlotSymbolId[];
  isSpinning: boolean;
  stopDelay: number;
  onReelStop: (reelIndex: number) => void;
  winningRows: number[];
}

const FILLER_POOL: SlotSymbolId[] = [
  'seven', 'crown', 'diamond', 'ingot', 'bell', 'chip', 'coin', 'cherry',
  'wild', 'scatter', 'crown', 'seven', 'diamond', 'ingot', 'bell',
];

export const SlotReelColumn: React.FC<SlotReelColumnProps> = ({
  reelIndex,
  currentSymbols,
  targetSymbols,
  isSpinning,
  stopDelay,
  onReelStop,
  winningRows,
}) => {
  // Strip has 24 symbols: 3 current + 18 scrolling filler + 3 target
  const [strip, setStrip] = useState<SlotSymbolId[]>(currentSymbols);
  const [offsetPercent, setOffsetPercent] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);

  const prevIsSpinning = useRef(false);

  useEffect(() => {
    if (isSpinning && !prevIsSpinning.current) {
      // 1. Build a 24-symbol continuous scrolling strip:
      // 3 initial symbols + 18 cycling symbols + 3 target symbols
      const filler: SlotSymbolId[] = [];
      for (let i = 0; i < 18; i++) {
        filler.push(FILLER_POOL[Math.floor(Math.random() * FILLER_POOL.length)]);
      }

      const fullStrip = [...currentSymbols, ...filler, ...targetSymbols];
      setStrip(fullStrip);
      setOffsetPercent(0);
      setIsAnimating(false);
      setHasLanded(false);

      // Distance in percentage of strip's own height:
      // (24 - 3) / 24 * 100% = 87.5%
      const targetPercent = ((fullStrip.length - 3) / fullStrip.length) * 100;

      // Start scrolling smoothly on next paint so 0% is registered
      const startTimer = setTimeout(() => {
        setIsAnimating(true);
        setOffsetPercent(targetPercent);
      }, 35);

      // Mechanical brake and bounce when stop delay expires
      const stopTimer = setTimeout(() => {
        setIsAnimating(false);
        setHasLanded(true);
        soundEngine.playReelStop(reelIndex);
        onReelStop(reelIndex);
      }, stopDelay);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(stopTimer);
      };
    }

    prevIsSpinning.current = isSpinning;
  }, [isSpinning, stopDelay, reelIndex, currentSymbols, targetSymbols, onReelStop]);

  const isAtTarget = !isSpinning && hasLanded;

  return (
    <div
      className={`relative h-60 sm:h-72 md:h-84 rounded-xl bg-gradient-to-b from-[#0f1118] via-[#141620] to-[#0f1118] border border-[#c5a059]/30 overflow-hidden shadow-inner select-none transition-shadow duration-300 ${
        hasLanded && !isSpinning ? 'shadow-[inset_0_0_15px_rgba(212,175,55,0.25)]' : ''
      }`}
    >
      {/* Cylindrical 3D Shadow Masks (Simulates curved drum edges) */}
      <div className="absolute top-0 inset-x-0 h-7 sm:h-9 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-7 sm:h-9 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20 pointer-events-none" />

      {/* Subtle Drum Glare */}
      <div className="absolute inset-y-0 inset-x-2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none z-10" />

      {/* Vertically Scrolling Symbols Strip (Always 100% visible) */}
      <div
        className={`w-full will-change-transform ${
          isAnimating ? 'filter blur-[0.8px]' : ''
        }`}
        style={{
          transform: `translateY(-${offsetPercent}%)`,
          transitionProperty: 'transform',
          transitionDuration: isAnimating ? `${stopDelay}ms` : '0ms',
          // Realistic mechanical brake: rapid descent, gentle deceleration, spring recoil
          transitionTimingFunction: 'cubic-bezier(0.15, 0.88, 0.25, 1.04)',
        }}
      >
        {strip.map((symbolId, idx) => {
          const isFinalVisibleRow = idx >= strip.length - 3;
          const visibleRowIndex = idx - (strip.length - 3);
          const isWinning = isAtTarget && isFinalVisibleRow && winningRows.includes(visibleRowIndex);

          return (
            <div
              key={`${symbolId}-${idx}`}
              className="h-20 sm:h-24 md:h-28 flex items-center justify-center p-1 sm:p-2"
            >
              <SlotSymbolView
                id={symbolId}
                isWinning={isWinning}
                size="md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
