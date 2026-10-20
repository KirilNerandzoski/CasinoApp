import React from 'react';
import type { RouletteBet, RouletteBetType } from '../../types/roulette';
import { RED_NUMBERS } from '../../types/roulette';
import { CasinoChip } from '../common/CasinoChip';
import { useCasino } from '../../context/CasinoContext';
import { soundEngine } from '../../services/soundEngine';

interface RouletteTableProps {
  bets: RouletteBet[];
  onPlaceBet: (bet: RouletteBet) => void;
  disabled: boolean;
  winningNumber?: number | null;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({
  bets,
  onPlaceBet,
  disabled,
  winningNumber,
}) => {
  const { selectedChip } = useCasino();

  // Helper to find existing bet amount
  const getBetAmount = (type: RouletteBetType, value?: number): number => {
    const existing = bets.find(
      (b) => b.type === type && (value === undefined || b.value === value)
    );
    return existing ? existing.amount : 0;
  };

  const handleCellClick = (type: RouletteBetType, value?: number) => {
    if (disabled) return;
    soundEngine.playChipClick();
    onPlaceBet({
      type,
      value,
      amount: selectedChip,
    });
  };

  // 3 rows of numbers 1-36
  const row3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  const hasWin = winningNumber !== null && winningNumber !== undefined;
  const isRedWin = hasWin && RED_NUMBERS.includes(winningNumber);
  const isBlackWin = hasWin && winningNumber !== 0 && !RED_NUMBERS.includes(winningNumber);
  const isEvenWin = hasWin && winningNumber !== 0 && winningNumber % 2 === 0;
  const isOddWin = hasWin && winningNumber !== 0 && winningNumber % 2 !== 0;
  const isLowWin = hasWin && winningNumber >= 1 && winningNumber <= 18;
  const isHighWin = hasWin && winningNumber >= 19 && winningNumber <= 36;
  const isDozen1Win = hasWin && winningNumber >= 1 && winningNumber <= 12;
  const isDozen2Win = hasWin && winningNumber >= 13 && winningNumber <= 24;
  const isDozen3Win = hasWin && winningNumber >= 25 && winningNumber <= 36;
  const isCol1Win = hasWin && winningNumber !== 0 && winningNumber % 3 === 1;
  const isCol2Win = hasWin && winningNumber !== 0 && winningNumber % 3 === 2;
  const isCol3Win = hasWin && winningNumber !== 0 && winningNumber % 3 === 0;

  const renderNumberCell = (num: number) => {
    const isRed = RED_NUMBERS.includes(num);
    const amount = getBetAmount('straight', num);
    const isWinner = winningNumber === num;

    return (
      <button
        key={num}
        type="button"
        disabled={disabled}
        onClick={() => handleCellClick('straight', num)}
        className={`relative h-12 sm:h-14 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-150 border select-none ${
          isWinner
            ? 'border-[#fde047] ring-2 ring-[#fde047] bg-[#facc15] text-black shadow-[0_0_20px_rgba(250,204,21,0.8)] z-20 scale-105'
            : isRed
            ? 'border-[#d4af37]/35 bg-[#8c1d1d] hover:bg-[#aa2323] text-white'
            : 'border-[#d4af37]/35 bg-[#18191d] hover:bg-[#282a33] text-gray-100'
        } ${disabled ? 'opacity-90 cursor-default' : 'cursor-pointer hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.2)]'}`}
      >
        <span className="font-mono-num font-semibold z-10">{num}</span>

        {/* Placed Chip Display */}
        {amount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <CasinoChip value={selectedChip} size="xs" count={Math.ceil(amount / selectedChip)} />
            <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
              ${amount}
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl p-3 sm:p-5 bg-gradient-to-b from-[#133827] via-[#0e2c1e] to-[#071911] border-2 border-[#c5a059]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_60px_rgba(0,0,0,0.6)]">
      {/* Monte Carlo Felt Markings */}
      <div className="border border-[#d4af37]/40 rounded-xl p-2 sm:p-3 bg-[#0a2318]/50">
        {/* Table Title Banner */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#c5a059]/30 text-xs font-cinzel text-[#e2c176]">
          <span className="tracking-widest uppercase font-semibold">EUROPEAN SINGLE ZERO FELT</span>
          <span className="text-[10px] tracking-wider text-gray-300">PAYS 35 TO 1 ON STRAIGHT NUMBER</span>
        </div>

        {/* Main Grid: Zero on left, 12 columns of 3 rows in middle, Column 2:1 on right */}
        <div className="grid grid-cols-[38px_repeat(12,1fr)_44px] sm:grid-cols-[54px_repeat(12,1fr)_54px] gap-1">
          {/* 0 Pocket (Spans all 3 rows) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('straight', 0)}
            className={`row-span-3 rounded-l-lg border flex flex-col items-center justify-center text-white font-mono-num font-bold text-lg sm:text-xl transition-all relative ${
              winningNumber === 0
                ? 'border-[#fde047] ring-2 ring-[#fde047] bg-[#facc15] text-black shadow-[0_0_25px_rgba(250,204,21,0.9)] z-20 scale-102'
                : 'bg-[#0e5c33] hover:bg-[#147a44] border-[#d4af37]/40'
            } ${disabled ? 'opacity-90 cursor-default' : 'cursor-pointer hover:shadow-[inset_0_0_15px_rgba(255,255,255,0.25)]'}`}
          >
            <span className={winningNumber === 0 ? 'text-black' : 'text-white'}>0</span>
            {getBetAmount('straight', 0) > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip
                  value={selectedChip}
                  size="xs"
                  count={Math.ceil(getBetAmount('straight', 0) / selectedChip)}
                />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('straight', 0)}
                </span>
              </div>
            )}
          </button>

          {/* Row 3 (3 to 36) */}
          {row3.map(renderNumberCell)}

          {/* Column 3 (2 to 1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('col3')}
            className={`relative flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer border ${
              isCol3Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#17231c] hover:bg-[#203228] border-[#d4af37]/35 text-[#e2c176]'
            }`}
          >
            <span>2:1</span>
            {getBetAmount('col3') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('col3')}
                </span>
              </div>
            )}
          </button>

          {/* Row 2 (2 to 35) */}
          {row2.map(renderNumberCell)}

          {/* Column 2 (2 to 1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('col2')}
            className={`relative flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer border ${
              isCol2Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#17231c] hover:bg-[#203228] border-[#d4af37]/35 text-[#e2c176]'
            }`}
          >
            <span>2:1</span>
            {getBetAmount('col2') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('col2')}
                </span>
              </div>
            )}
          </button>

          {/* Row 1 (1 to 34) */}
          {row1.map(renderNumberCell)}

          {/* Column 1 (2 to 1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('col1')}
            className={`relative flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer border ${
              isCol1Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#17231c] hover:bg-[#203228] border-[#d4af37]/35 text-[#e2c176]'
            }`}
          >
            <span>2:1</span>
            {getBetAmount('col1') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('col1')}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Dozen Bets (1st 12, 2nd 12, 3rd 12) */}
        <div className="grid grid-cols-[38px_repeat(3,1fr)_44px] sm:grid-cols-[54px_repeat(3,1fr)_54px] gap-1 mt-1">
          <div /> {/* Spacer for Zero */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('dozen1')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer ${
              isDozen1Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-[#f4e0a5]'
            }`}
          >
            <span>1ST 12</span>
            {getBetAmount('dozen1') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('dozen1')}
                </span>
              </div>
            )}
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('dozen2')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer ${
              isDozen2Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-[#f4e0a5]'
            }`}
          >
            <span>2ND 12</span>
            {getBetAmount('dozen2') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('dozen2')}
                </span>
              </div>
            )}
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('dozen3')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-xs sm:text-sm font-cinzel font-bold transition-all cursor-pointer ${
              isDozen3Win
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-[#f4e0a5]'
            }`}
          >
            <span>3RD 12</span>
            {getBetAmount('dozen3') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('dozen3')}
                </span>
              </div>
            )}
          </button>
          <div /> {/* Spacer for Col */}
        </div>

        {/* Outside Bets (1-18, EVEN, RED, BLACK, ODD, 19-36) */}
        <div className="grid grid-cols-[38px_repeat(6,1fr)_44px] sm:grid-cols-[54px_repeat(6,1fr)_54px] gap-1 mt-1">
          <div />
          {/* 1 to 18 */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('low')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isLowWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-gray-200'
            }`}
          >
            <span>1 - 18</span>
            {getBetAmount('low') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('low')}
                </span>
              </div>
            )}
          </button>

          {/* Even */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('even')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isEvenWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-gray-200'
            }`}
          >
            <span>EVEN</span>
            {getBetAmount('even') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('even')}
                </span>
              </div>
            )}
          </button>

          {/* Red */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('red')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isRedWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_20px_rgba(250,204,21,0.9)] z-10'
                : 'bg-[#7b1818] hover:bg-[#991e1e] border-[#d4af37]/45 text-white'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rotate-45 border ${isRedWin ? 'bg-black border-black' : 'bg-[#ff4d4d] border-white/40'}`} />
              <span>RED</span>
            </div>
            {getBetAmount('red') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('red')}
                </span>
              </div>
            )}
          </button>

          {/* Black */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('black')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isBlackWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_20px_rgba(250,204,21,0.9)] z-10'
                : 'bg-[#18191d] hover:bg-[#282a33] border-[#d4af37]/45 text-gray-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rotate-45 border ${isBlackWin ? 'bg-black border-black' : 'bg-[#2b2d35] border-gray-400'}`} />
              <span>BLACK</span>
            </div>
            {getBetAmount('black') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('black')}
                </span>
              </div>
            )}
          </button>

          {/* Odd */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('odd')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isOddWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-gray-200'
            }`}
          >
            <span>ODD</span>
            {getBetAmount('odd') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('odd')}
                </span>
              </div>
            )}
          </button>

          {/* 19 to 36 */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleCellClick('high')}
            className={`relative h-10 sm:h-11 border flex items-center justify-center text-[11px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer ${
              isHighWin
                ? 'bg-[#facc15] text-black border-[#fde047] ring-2 ring-[#fde047] shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10'
                : 'bg-[#14261c] hover:bg-[#1d3728] border-[#d4af37]/35 text-gray-200'
            }`}
          >
            <span>19 - 36</span>
            {getBetAmount('high') > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CasinoChip value={selectedChip} size="xs" />
                <span className="absolute -bottom-1 text-[9px] font-bold font-mono-num bg-black/85 text-[#f4e0a5] px-1 rounded border border-[#c5a059]/60 leading-none">
                  ${getBetAmount('high')}
                </span>
              </div>
            )}
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
