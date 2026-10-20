import React from 'react';
import type { SlotSymbolId } from '../../types/slots';
import { Crown, Sparkles, Gem, Bell, Coins, Flame } from 'lucide-react';

interface SlotSymbolViewProps {
  id: SlotSymbolId;
  isWinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SlotSymbolView: React.FC<SlotSymbolViewProps> = ({
  id,
  isWinning = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-sm',
    lg: 'w-22 h-22 sm:w-26 sm:h-26 text-base',
  };

  const renderContent = () => {
    switch (id) {
      case 'wild':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <span className="text-[10px] font-cinzel font-black tracking-widest text-[#fef08a] bg-black/60 px-1 rounded mt-0.5 border border-[#f59e0b]/50">
              WILD
            </span>
          </div>
        );

      case 'scatter':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#a855f7] drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <span className="text-[9px] font-cinzel font-black tracking-widest text-[#f3e8ff] bg-purple-950/80 px-1 rounded mt-0.5 border border-purple-400/50">
              SCATTER
            </span>
          </div>
        );

      case 'crown':
        return (
          <div className="flex flex-col items-center justify-center">
            <Crown className="w-9 h-9 sm:w-11 sm:h-11 text-[#facc15] drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)]" />
            <span className="text-[9px] font-cinzel font-bold text-[#fef08a] tracking-wider mt-0.5">
              CROWN
            </span>
          </div>
        );

      case 'seven':
        return (
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-cinzel font-black tracking-tighter gold-gradient-text drop-shadow-[0_2px_10px_rgba(212,175,55,0.7)]">
              777
            </span>
            <span className="text-[8px] font-cinzel font-bold text-[#e2c176] tracking-widest -mt-0.5">
              ROYAL
            </span>
          </div>
        );

      case 'diamond':
        return (
          <div className="flex flex-col items-center justify-center">
            <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
            <span className="text-[9px] font-cinzel font-semibold text-sky-200 mt-0.5">
              DIAMOND
            </span>
          </div>
        );

      case 'ingot':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 sm:w-12 h-6 sm:h-7 rounded bg-gradient-to-tr from-[#785415] via-[#e2c176] to-[#fff3cd] border border-[#fef08a] shadow flex items-center justify-center text-[10px] font-mono-num font-bold text-black tracking-wider">
              999.9
            </div>
            <span className="text-[8px] font-cinzel font-bold text-[#e2c176] mt-0.5">
              GOLD BAR
            </span>
          </div>
        );

      case 'bell':
        return (
          <div className="flex flex-col items-center justify-center">
            <Bell className="w-8 h-8 sm:w-9 sm:h-9 text-[#facc15] drop-shadow-[0_2px_6px_rgba(250,204,21,0.5)]" />
            <span className="text-[9px] font-cinzel font-medium text-amber-200 mt-0.5">
              BELL
            </span>
          </div>
        );

      case 'chip':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-[#e2c176] bg-[#1a1b24] flex items-center justify-center text-xs font-cinzel font-bold text-[#f4e0a5] shadow">
              $100
            </div>
            <span className="text-[8px] font-cinzel font-semibold text-gray-300 mt-0.5">
              CHIP
            </span>
          </div>
        );

      case 'coin':
        return (
          <div className="flex flex-col items-center justify-center">
            <Coins className="w-8 h-8 sm:w-9 sm:h-9 text-[#f59e0b] drop-shadow" />
            <span className="text-[9px] font-cinzel font-medium text-amber-300 mt-0.5">
              DOUBLOON
            </span>
          </div>
        );

      case 'cherry':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center -space-x-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-rose-500 to-rose-950 border border-rose-300 shadow" />
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-rose-500 to-rose-950 border border-rose-300 shadow" />
            </div>
            <span className="text-[9px] font-cinzel font-medium text-rose-300 mt-0.5">
              CHERRY
            </span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative rounded-xl flex items-center justify-center select-none transition-all duration-300 ${sizeClasses[size]} ${
        isWinning
          ? 'bg-gradient-to-b from-[#3a2e13] to-[#1a1408] border-2 border-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105 z-10'
          : 'bg-gradient-to-b from-[#1b1e28] to-[#101217] border border-white/5 shadow-inner'
      }`}
    >
      {renderContent()}

      {/* Winning Shimmer Ring */}
      {isWinning && (
        <div className="absolute inset-0 rounded-xl border border-white/40 animate-ping opacity-25 pointer-events-none" />
      )}
    </div>
  );
};
