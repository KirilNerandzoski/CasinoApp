import React from 'react';
import type { ChipValue } from '../../types/casino';
import { useCasino } from '../../context/CasinoContext';
import { CasinoChip } from './CasinoChip';
import { Coins } from 'lucide-react';

const CHIPS: ChipValue[] = [5, 25, 100, 500, 1000];

interface ChipSelectorProps {
  className?: string;
  disabled?: boolean;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({ className = '', disabled = false }) => {
  const { selectedChip, setSelectedChip, balance } = useCasino();

  return (
    <div
      className={`relative inline-flex items-center gap-3 p-2 md:p-3 rounded-2xl bg-gradient-to-b from-[#1c1f28]/95 to-[#0f1117]/95 border border-[#c5a059]/30 shadow-[0_12px_24px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-3 border-r border-[#c5a059]/20 text-xs tracking-wider uppercase text-[#c5a059] font-cinzel">
        <Coins className="w-4 h-4 text-[#e2c176]" />
        <span>Chips</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {CHIPS.map((value) => {
          const isSelected = selectedChip === value;
          const isAffordable = balance >= value;

          return (
            <button
              key={value}
              type="button"
              disabled={disabled || !isAffordable}
              onClick={() => setSelectedChip(value)}
              className={`relative transition-all duration-200 outline-none rounded-full ${
                !isAffordable ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={!isAffordable ? 'Insufficient balance for this chip' : `Select $${value} chip`}
            >
              <CasinoChip
                value={value}
                size="md"
                isSelected={isSelected}
                animate={!disabled && isAffordable}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
