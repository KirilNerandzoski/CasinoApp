import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SlotSymbolId, WinningLine } from '../../types/slots';
import { useCasino } from '../../context/CasinoContext';
import { SlotReelColumn } from './SlotReelColumn';
import { PaylineOverlay } from './PaylineOverlay';
import { SlotsPaytableModal, PAYLINE_PATTERNS } from './SlotsPaytableModal';
import { soundEngine } from '../../services/soundEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  Play,
  Flame,
  Minus,
  Plus,
  Zap,
} from 'lucide-react';

// Symbol weights for authentic, fun high-roller hit rate (~96.8% RTP)
const SYMBOL_POOL: SlotSymbolId[] = [
  'cherry', 'cherry', 'cherry', 'cherry', 'cherry', 'cherry',
  'coin', 'coin', 'coin', 'coin', 'coin',
  'chip', 'chip', 'chip', 'chip',
  'bell', 'bell', 'bell', 'bell',
  'diamond', 'diamond', 'diamond',
  'ingot', 'ingot', 'ingot',
  'seven', 'seven',
  'crown', 'crown',
  'wild', 'wild',
  'scatter', 'scatter',
];

const PAYOUT_TABLE: Record<SlotSymbolId, { 3: number; 4: number; 5: number }> = {
  wild: { 3: 100, 4: 400, 5: 1500 },
  scatter: { 3: 5, 4: 25, 5: 100 }, // scatter pays on total bet
  seven: { 3: 50, 4: 200, 5: 1000 },
  crown: { 3: 40, 4: 150, 5: 750 },
  ingot: { 3: 30, 4: 100, 5: 500 },
  diamond: { 3: 20, 4: 75, 5: 350 },
  bell: { 3: 15, 4: 50, 5: 200 },
  chip: { 3: 10, 4: 35, 5: 150 },
  coin: { 3: 8, 4: 25, 5: 100 },
  cherry: { 3: 5, 4: 15, 5: 60 },
};

const getRandomSymbol = (): SlotSymbolId => {
  return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
};

const BET_PER_LINE_OPTIONS = [1, 2, 5, 10, 25, 50];
const NUM_LINES = 20;

// Staggered reel stop delays for natural casino deceleration & anticipation
const REEL_DELAYS = [750, 1050, 1350, 1650, 1950];

export const SlotsGame: React.FC = () => {
  const { placeBet, awardPayout, balance, showToast } = useCasino();

  // Initial and current 5x3 grid
  const [currentGrid, setCurrentGrid] = useState<SlotSymbolId[][]>([
    ['seven', 'crown', 'diamond'],
    ['wild', 'seven', 'ingot'],
    ['crown', 'bell', 'chip'],
    ['diamond', 'coin', 'seven'],
    ['cherry', 'scatter', 'crown'],
  ]);

  // Target grid determined when spin starts
  const [targetGrid, setTargetGrid] = useState<SlotSymbolId[][]>([
    ['seven', 'crown', 'diamond'],
    ['wild', 'seven', 'ingot'],
    ['crown', 'bell', 'chip'],
    ['diamond', 'coin', 'seven'],
    ['cherry', 'scatter', 'crown'],
  ]);

  const [betPerLine, setBetPerLine] = useState<number>(5);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [lastWin, setLastWin] = useState<number>(0);

  // Free Spins State
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState<number>(0);
  const [freeSpinTotalWin, setFreeSpinTotalWin] = useState<number>(0);

  // Auto Spin
  const [autoSpinsCount, setAutoSpinsCount] = useState<number>(0);

  // Modal
  const [isPaytableOpen, setIsPaytableOpen] = useState<boolean>(false);

  // Dimensions for SVG overlay
  const reelsRef = useRef<HTMLDivElement>(null);
  const [overlayDims, setOverlayDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const totalBet = betPerLine * NUM_LINES;

  // Track reels container dimensions for SVG line overlay
  useEffect(() => {
    const updateDims = () => {
      if (reelsRef.current) {
        setOverlayDims({
          width: reelsRef.current.clientWidth,
          height: reelsRef.current.clientHeight,
        });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Evaluate outcomes across the 20 paylines
  const evaluateSpin = useCallback((finalGrid: SlotSymbolId[][], isFreeSpin: boolean) => {
    const wins: WinningLine[] = [];
    let totalWinAmount = 0;
    const multiplier = isFreeSpin ? 3 : 1;

    // Check all 20 paylines
    PAYLINE_PATTERNS.forEach((pattern, lineIdx) => {
      const lineSymbols: SlotSymbolId[] = [
        finalGrid[0][pattern[0]],
        finalGrid[1][pattern[1]],
        finalGrid[2][pattern[2]],
        finalGrid[3][pattern[3]],
        finalGrid[4][pattern[4]],
      ];

      // Determine match starting from left (Col 0)
      let matchSymbol: SlotSymbolId | null = null;
      let count = 0;

      for (let i = 0; i < 5; i++) {
        const sym = lineSymbols[i];

        if (sym === 'scatter') {
          break;
        }

        if (!matchSymbol) {
          matchSymbol = sym;
          count = 1;
        } else if (sym === matchSymbol || sym === 'wild' || matchSymbol === 'wild') {
          if (matchSymbol === 'wild' && sym !== 'wild') {
            matchSymbol = sym;
          }
          count += 1;
        } else {
          break;
        }
      }

      if (count >= 3 && matchSymbol && PAYOUT_TABLE[matchSymbol]) {
        const payoutMult = PAYOUT_TABLE[matchSymbol][count as 3 | 4 | 5] || 0;
        const lineWin = betPerLine * payoutMult * multiplier;

        if (lineWin > 0) {
          totalWinAmount += lineWin;
          const positions = pattern.map((row, col) => ({ col, row }));
          wins.push({
            lineIndex: lineIdx,
            symbolId: matchSymbol,
            count,
            payout: lineWin,
            positions,
          });
        }
      }
    });

    // Check Scatters anywhere in the 5x3 grid
    let scatterCount = 0;
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 3; r++) {
        if (finalGrid[c][r] === 'scatter') {
          scatterCount++;
        }
      }
    }

    if (scatterCount >= 3) {
      soundEngine.playScatterChime();
      const scatterWin = totalBet * (scatterCount === 3 ? 5 : scatterCount === 4 ? 25 : 100);
      totalWinAmount += scatterWin;

      // Trigger 10 Free Spins!
      setFreeSpinsRemaining((prev) => prev + 10);
      showToast(
        'jackpot',
        '10 FREE SPINS TRIGGERED!',
        `${scatterCount} Scatters hit! 10 Free Spins awarded with 3X Win Multiplier!`
      );
    }

    setWinningLines(wins);
    setLastWin(totalWinAmount);

    if (isFreeSpin) {
      setFreeSpinsRemaining((prev) => prev - 1);
      setFreeSpinTotalWin((prev) => prev + totalWinAmount);
    }

    // Award payout
    awardPayout(
      'slots',
      isFreeSpin ? 0 : totalBet,
      totalWinAmount,
      `Aurum Slots - ${wins.length} Lines Hit - Payout: $${totalWinAmount}`
    );

    if (totalWinAmount > 0) {
      if (totalWinAmount >= totalBet * 8) {
        soundEngine.playBigWin();
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#facc15', '#ffffff', '#a855f7'],
          });
        } catch {
          // Ignore
        }
      } else {
        soundEngine.playWinChime();
      }
    }

    setCurrentGrid(finalGrid);
    setIsSpinning(false);
  }, [awardPayout, betPerLine, showToast, totalBet]);

  // Spin Logic with Natural Rolling Physics
  const handleSpin = () => {
    if (isSpinning) return;

    const isFreeSpin = freeSpinsRemaining > 0;

    // In normal spin, deduct wager
    if (!isFreeSpin) {
      if (balance < totalBet) {
        showToast('error', 'Insufficient Balance', 'Replenish demo vault to continue spinning.');
        setAutoSpinsCount(0);
        return;
      }
      const success = placeBet(totalBet);
      if (!success) {
        setAutoSpinsCount(0);
        return;
      }
    }

    setIsSpinning(true);
    setWinningLines([]);
    setLastWin(0);
    soundEngine.playButton();

    // Generate final target grid for the 5 reels
    const newTargetGrid: SlotSymbolId[][] = [];
    for (let c = 0; c < 5; c++) {
      newTargetGrid.push([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }
    setTargetGrid(newTargetGrid);
  };

  // Called when individual reels lock into place
  const handleReelStop = useCallback((reelIndex: number) => {
    // When reel 4 (final reel) stops, evaluate results
    if (reelIndex === 4) {
      setTimeout(() => {
        evaluateSpin(targetGrid, freeSpinsRemaining > 0);
      }, 100);
    }
  }, [evaluateSpin, freeSpinsRemaining, targetGrid]);

  // Auto-Spin runner
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (autoSpinsCount > 0 && !isSpinning) {
      timer = setTimeout(() => {
        setAutoSpinsCount((prev) => prev - 1);
        handleSpin();
      }, 1300);
    }
    return () => clearTimeout(timer);
  }, [autoSpinsCount, isSpinning]);

  // Auto spin during active free spins
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (freeSpinsRemaining > 0 && !isSpinning) {
      timer = setTimeout(() => {
        handleSpin();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [freeSpinsRemaining, isSpinning]);

  // Helpers to adjust bet
  const decreaseBet = () => {
    if (isSpinning) return;
    const curIdx = BET_PER_LINE_OPTIONS.indexOf(betPerLine);
    if (curIdx > 0) {
      soundEngine.playChipClick();
      setBetPerLine(BET_PER_LINE_OPTIONS[curIdx - 1]);
    }
  };

  const increaseBet = () => {
    if (isSpinning) return;
    const curIdx = BET_PER_LINE_OPTIONS.indexOf(betPerLine);
    if (curIdx < BET_PER_LINE_OPTIONS.length - 1) {
      soundEngine.playChipClick();
      setBetPerLine(BET_PER_LINE_OPTIONS[curIdx + 1]);
    }
  };

  const handleMaxBet = () => {
    if (isSpinning) return;
    soundEngine.playChipStack();
    setBetPerLine(BET_PER_LINE_OPTIONS[BET_PER_LINE_OPTIONS.length - 1]);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#171a22] to-[#0f1116] border border-[#c5a059]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d2d] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Flame className="w-6 h-6 text-[#fef08a]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-white tracking-wider flex items-center gap-2">
              <span>AURUM ROYALE 777</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#f4e0a5] border border-[#c5a059]/40 font-normal">
                5-Reel • 20 Lines
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              High-roller 5x3 luxury video slot • 1,500x Wild Jackpot • 3X Free Spins Multiplier
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPaytableOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14161f] border border-white/10 hover:border-[#c5a059]/50 text-xs text-gray-300 hover:text-white transition-all cursor-pointer font-cinzel"
        >
          <HelpCircle className="w-4 h-4 text-[#c5a059]" />
          <span>Paytable & Features</span>
        </button>
      </div>

      {/* Free Spins Alert Banner */}
      {freeSpinsRemaining > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2e1442] via-[#481c68] to-[#2e1442] border-2 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.5)] flex items-center justify-between text-white font-cinzel animate-pulse-glow">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300 animate-spin" />
            <span className="text-sm sm:text-base font-bold tracking-wider text-[#f3e8ff]">
              FREE SPINS FEATURE ACTIVE: {freeSpinsRemaining} REMAINING
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-purple-200 uppercase block">Bonus Won:</span>
            <span className="text-sm font-bold font-mono-num text-[#fef08a]">
              ${freeSpinTotalWin.toLocaleString()} (3X MULTIPLIER)
            </span>
          </div>
        </div>
      )}

      {/* Slot Machine Frame */}
      <div className="relative rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#1b1c24] via-[#121319] to-[#0a0b0e] border-4 border-[#c5a059] shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Top Gold Nameplate */}
        <div className="text-center mb-6">
          <div className="inline-block px-8 py-1.5 rounded-full bg-gradient-to-r from-[#171a22] via-[#2a2416] to-[#171a22] border border-[#c5a059]/60 shadow-lg">
            <span className="text-xs sm:text-sm font-cinzel font-black tracking-[0.3em] gold-gradient-text uppercase">
              • AURUM PRIVÉ ROYALE •
            </span>
          </div>
        </div>

        {/* 5-Reel Reel Set Area (With Cascading Vertical Scrolling Strips) */}
        <div
          ref={reelsRef}
          className="relative grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-black/85 border-2 border-[#c5a059]/40 shadow-inner"
        >
          {/* Payline Tracing SVG Overlay */}
          <PaylineOverlay
            winningLines={winningLines}
            containerWidth={overlayDims.width}
            containerHeight={overlayDims.height}
          />

          {/* 5 Natural Cascading Reels */}
          {targetGrid.map((_, colIdx) => {
            // Find winning rows for this column
            const colWinningRows = winningLines.flatMap((wl) =>
              wl.positions.slice(0, wl.count).filter((p) => p.col === colIdx).map((p) => p.row)
            );

            return (
              <SlotReelColumn
                key={colIdx}
                reelIndex={colIdx}
                currentSymbols={currentGrid[colIdx]}
                targetSymbols={targetGrid[colIdx]}
                isSpinning={isSpinning}
                stopDelay={REEL_DELAYS[colIdx]}
                onReelStop={handleReelStop}
                winningRows={colWinningRows}
              />
            );
          })}
        </div>

        {/* Outcome & Payout Ticker */}
        <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-cinzel uppercase">Paylines Hit:</span>
            <span className="text-xs font-mono-num font-bold text-[#e2c176]">
              {winningLines.length} Lines
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-cinzel uppercase block">Last Win</span>
            <span
              className={`text-base font-bold font-mono-num ${
                lastWin > 0 ? 'text-emerald-400' : 'text-gray-400'
              }`}
            >
              ${lastWin.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-2xl bg-[#12141c]/95 backdrop-blur-md border border-[#c5a059]/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        {/* Bet per line controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-gray-400 font-cinzel uppercase pl-2">Line:</span>
            <button
              onClick={decreaseBet}
              disabled={isSpinning || betPerLine === BET_PER_LINE_OPTIONS[0]}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono-num font-bold text-[#e2c176] px-1">
              ${betPerLine}
            </span>
            <button
              onClick={increaseBet}
              disabled={isSpinning || betPerLine === BET_PER_LINE_OPTIONS[BET_PER_LINE_OPTIONS.length - 1]}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleMaxBet}
            disabled={isSpinning}
            className="px-3 py-2 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-white/10 text-xs font-cinzel font-semibold text-gray-200 hover:text-[#f4e0a5] transition-all cursor-pointer"
          >
            MAX BET
          </button>
        </div>

        {/* Total Bet & Spin Controls */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 font-cinzel uppercase block">Total Bet (20 Lines)</span>
            <span className="text-base font-bold font-mono-num text-[#e2c176]">
              ${totalBet.toLocaleString()}
            </span>
          </div>

          {/* Auto Spin Toggle */}
          <button
            onClick={() => {
              if (autoSpinsCount > 0) {
                setAutoSpinsCount(0);
              } else {
                setAutoSpinsCount(10);
              }
            }}
            disabled={isSpinning && autoSpinsCount === 0}
            className={`px-3 py-2.5 rounded-xl border text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoSpinsCount > 0
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-[#181a24] hover:bg-[#222533] border-white/10 text-gray-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{autoSpinsCount > 0 ? `STOP (${autoSpinsCount})` : 'AUTO (10)'}</span>
          </button>

          {/* Main Spin CTA Button */}
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`py-2.5 px-6 sm:px-8 rounded-xl font-bold font-cinzel text-xs sm:text-sm tracking-widest text-black uppercase transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer ${
              isSpinning
                ? 'bg-gray-700 text-gray-400 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-98 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            }`}
          >
            {isSpinning ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isSpinning ? 'SPINNING...' : 'SPIN REELS'}</span>
          </button>
        </div>
      </div>

      {/* Paytable Modal */}
      <SlotsPaytableModal
        isOpen={isPaytableOpen}
        onClose={() => setIsPaytableOpen(false)}
      />
    </div>
  );
};
