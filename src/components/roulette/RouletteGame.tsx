import React, { useState } from 'react';
import type { RouletteBet, RouletteColor } from '../../types/roulette';
import { RED_NUMBERS } from '../../types/roulette';
import { useCasino } from '../../context/CasinoContext';
import { RouletteWheel } from './RouletteWheel';
import { RouletteTable } from './RouletteTable';
import { ChipSelector } from '../common/ChipSelector';
import { RoulettePaytableModal } from './RoulettePaytableModal';
import { soundEngine } from '../../services/soundEngine';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  HelpCircle,
  TrendingUp,
  History,
  Dices,
} from 'lucide-react';

// Cryptographically fair random number from 0 to 36
const getRandomPocketNumber = (): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % 37;
};

export const RouletteGame: React.FC = () => {
  const { placeBet, awardPayout, refundBet, balance, selectedChip, showToast } = useCasino();

  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [previousBets, setPreviousBets] = useState<RouletteBet[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{
    number: number;
    color: RouletteColor;
  } | null>(null);
  const [recentNumbers, setRecentNumbers] = useState<
    { number: number; color: RouletteColor }[]
  >([]);
  const [lastPayout, setLastPayout] = useState<number | null>(null);
  const [isPaytableOpen, setIsPaytableOpen] = useState<boolean>(false);

  // Total amount currently wagered on table
  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  // Handle placing a chip on a spot
  const handlePlaceBet = (newBet: RouletteBet) => {
    if (isSpinning) return;

    if (balance < newBet.amount) {
      showToast('error', 'Insufficient Funds', 'Replenish demo credits in the top vault.');
      return;
    }

    const success = placeBet(newBet.amount);
    if (!success) return;

    setBets((prev) => {
      const idx = prev.findIndex(
        (b) => b.type === newBet.type && b.value === newBet.value
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], amount: copy[idx].amount + newBet.amount };
        return copy;
      }
      return [...prev, newBet];
    });
  };

  // Quick Bet: Lucky Straight Number
  const handleLuckyBet = () => {
    if (isSpinning) return;
    const luckyNum = getRandomPocketNumber();
    handlePlaceBet({
      type: 'straight',
      value: luckyNum,
      amount: selectedChip,
    });
    showToast('info', 'Lucky Number Bet', `Placed $${selectedChip} on number ${luckyNum}!`);
  };

  // Quick Bet: Red or Black
  const handleQuickColorBet = (color: 'red' | 'black') => {
    if (isSpinning) return;
    handlePlaceBet({
      type: color,
      amount: selectedChip,
    });
  };

  // Clear all bets from table and refund
  const handleClearBets = () => {
    if (isSpinning || bets.length === 0) return;
    refundBet(totalBet, `Refunded $${totalBet} in cleared bets.`);
    soundEngine.playChipClick();
    setBets([]);
  };

  // Double current bets
  const handleDoubleBets = () => {
    if (isSpinning || bets.length === 0) return;
    if (balance < totalBet) {
      showToast('error', 'Insufficient Funds', 'Cannot double: insufficient demo balance.');
      return;
    }
    const success = placeBet(totalBet);
    if (!success) return;

    soundEngine.playChipStack();
    setBets((prev) => prev.map((b) => ({ ...b, amount: b.amount * 2 })));
  };

  // Rebet previous round
  const handleRebet = () => {
    if (isSpinning || previousBets.length === 0) return;
    const prevTotal = previousBets.reduce((s, b) => s + b.amount, 0);
    if (balance < prevTotal) {
      showToast('error', 'Insufficient Funds', 'Cannot rebet: insufficient demo balance.');
      return;
    }
    const success = placeBet(prevTotal);
    if (!success) return;

    soundEngine.playChipStack();
    setBets([...previousBets]);
  };

  // Spin the European Roulette wheel
  const handleSpin = () => {
    if (isSpinning) return;

    // If no bets placed, auto-place selected chip on Red for quick play convenience
    let currentActiveBets = bets;
    if (currentActiveBets.length === 0) {
      if (balance < selectedChip) {
        showToast('error', 'Insufficient Funds', 'Replenish demo vault to place a wager.');
        return;
      }
      const success = placeBet(selectedChip);
      if (!success) return;
      currentActiveBets = [{ type: 'red', amount: selectedChip }];
      setBets(currentActiveBets);
      showToast('info', 'Quick Bet Placed', `Placed $${selectedChip} on RED to spin.`);
    }

    // Save for rebet
    setPreviousBets([...currentActiveBets]);
    setLastPayout(null);

    // Cryptographic uniform random pick 0-36 (guarantees not always 0)
    const chosenNumber = getRandomPocketNumber();
    setTargetNumber(chosenNumber);
    setIsSpinning(true);
  };

  // Wheel animation complete
  const handleSpinComplete = () => {
    if (targetNumber === null) return;

    const num = targetNumber;
    const isRed = RED_NUMBERS.includes(num);
    const isZero = num === 0;
    const color: RouletteColor = isZero ? 'green' : isRed ? 'red' : 'black';

    const result = { number: num, color };
    setLastResult(result);
    setRecentNumbers((prev) => [result, ...prev.slice(0, 9)]);

    // Full European Roulette Payout Evaluation Logic
    let totalWin = 0;
    const winningBetsDetails: string[] = [];

    bets.forEach((bet) => {
      let won = false;
      let multiplier = 0; // total return (stake + profit)

      if (bet.type === 'straight' && bet.value === num) {
        won = true;
        multiplier = 36; // 35:1 profit + 1x stake
        winningBetsDetails.push(`Straight ${num} (35:1)`);
      } else if (bet.type === 'red' && isRed) {
        won = true;
        multiplier = 2; // 1:1 profit + 1x stake
        winningBetsDetails.push('RED (1:1)');
      } else if (bet.type === 'black' && !isRed && !isZero) {
        won = true;
        multiplier = 2;
        winningBetsDetails.push('BLACK (1:1)');
      } else if (bet.type === 'even' && !isZero && num % 2 === 0) {
        won = true;
        multiplier = 2;
        winningBetsDetails.push('EVEN (1:1)');
      } else if (bet.type === 'odd' && !isZero && num % 2 !== 0) {
        won = true;
        multiplier = 2;
        winningBetsDetails.push('ODD (1:1)');
      } else if (bet.type === 'low' && num >= 1 && num <= 18) {
        won = true;
        multiplier = 2;
        winningBetsDetails.push('1-18 (1:1)');
      } else if (bet.type === 'high' && num >= 19 && num <= 36) {
        won = true;
        multiplier = 2;
        winningBetsDetails.push('19-36 (1:1)');
      } else if (bet.type === 'dozen1' && num >= 1 && num <= 12) {
        won = true;
        multiplier = 3; // 2:1 profit + 1x stake
        winningBetsDetails.push('1st 12 (2:1)');
      } else if (bet.type === 'dozen2' && num >= 13 && num <= 24) {
        won = true;
        multiplier = 3;
        winningBetsDetails.push('2nd 12 (2:1)');
      } else if (bet.type === 'dozen3' && num >= 25 && num <= 36) {
        won = true;
        multiplier = 3;
        winningBetsDetails.push('3rd 12 (2:1)');
      } else if (bet.type === 'col1' && !isZero && num % 3 === 1) {
        won = true;
        multiplier = 3;
        winningBetsDetails.push('Column 1 (2:1)');
      } else if (bet.type === 'col2' && !isZero && num % 3 === 2) {
        won = true;
        multiplier = 3;
        winningBetsDetails.push('Column 2 (2:1)');
      } else if (bet.type === 'col3' && !isZero && num % 3 === 0) {
        won = true;
        multiplier = 3;
        winningBetsDetails.push('Column 3 (2:1)');
      }

      if (won) {
        totalWin += bet.amount * multiplier;
      }
    });

    setLastPayout(totalWin);
    awardPayout(
      'roulette',
      totalBet,
      totalWin,
      `Roulette: ${num} ${color.toUpperCase()} • ${
        totalWin > 0 ? `Won $${totalWin} (${winningBetsDetails.join(', ')})` : 'No winning bets'
      }`
    );

    if (totalWin > 0) {
      if (totalWin >= totalBet * 4) {
        soundEngine.playBigWin();
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#ef4444', '#10b981'],
          });
        } catch {
          // Ignore
        }
      } else {
        soundEngine.playWinChime();
      }
      showToast(
        'win',
        `Winning Number: ${num} ${color.toUpperCase()}`,
        `Payout of $${totalWin.toLocaleString()} awarded to your balance!`
      );
    }

    setIsSpinning(false);
    setBets([]); // Clean table chips for next round
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#171a22] to-[#0f1116] border border-[#c5a059]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d2d] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#12141a] rounded-[10px] flex items-center justify-center font-cinzel font-black text-[#f4e0a5]">
              37
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-white tracking-wider flex items-center gap-2">
              <span>EUROPEAN ROULETTE</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#f4e0a5] border border-[#c5a059]/40 font-normal">
                Single Zero • 35:1 Straight
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              European 37-pocket sequence with 2.70% house edge. Interactive felt betting and physics ball animation.
            </p>
          </div>
        </div>

        {/* Quick Help Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaytableOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14161f] border border-white/10 hover:border-[#c5a059]/50 text-xs text-gray-300 hover:text-white transition-all cursor-pointer font-cinzel"
          >
            <HelpCircle className="w-4 h-4 text-[#c5a059]" />
            <span>Rules & Odds</span>
          </button>
        </div>
      </div>

      {/* Main Play Arena: Roulette Wheel on left, Table on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Animated SVG Wheel + Outcome Spotlight */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0f1117] border border-[#c5a059]/25 shadow-xl">
          <RouletteWheel
            isSpinning={isSpinning}
            targetNumber={targetNumber}
            onSpinComplete={handleSpinComplete}
            winningNumber={lastResult ? lastResult.number : null}
          />

          {/* Outcome Badge Spotlight */}
          <div className="w-full mt-3 p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-gray-400 font-cinzel uppercase font-semibold">Winning Pocket:</span>
              {lastResult ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold font-mono-num text-sm text-white border shadow-md ${
                      lastResult.color === 'green'
                        ? 'bg-[#0e6b38] border-emerald-400'
                        : lastResult.color === 'red'
                        ? 'bg-[#991e1e] border-rose-400'
                        : 'bg-[#18191d] border-gray-500'
                    }`}
                  >
                    {lastResult.number}
                  </span>
                  <span className="text-xs uppercase font-cinzel font-bold text-gray-200">
                    {lastResult.color} • {lastResult.number === 0 ? 'Zero' : lastResult.number % 2 === 0 ? 'Even' : 'Odd'}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic font-cinzel">Awaiting first spin...</span>
              )}
            </div>

            {lastPayout !== null && (
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block font-cinzel">Result:</span>
                <span
                  className={`text-sm font-bold font-mono-num ${
                    lastPayout > 0 ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  {lastPayout > 0 ? `+$${lastPayout.toLocaleString()}` : '$0'}
                </span>
              </div>
            )}
          </div>

          {/* Recent Numbers Strip */}
          <div className="w-full mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-cinzel">
              <History className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-[11px] uppercase font-semibold">Recent Pockets:</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {recentNumbers.length === 0 ? (
                <span className="text-[11px] text-gray-500 italic">No spins yet</span>
              ) : (
                recentNumbers.map((rn, idx) => (
                  <span
                    key={idx}
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono-num text-[11px] font-bold text-white border ${
                      rn.color === 'green'
                        ? 'bg-[#0e6b38] border-emerald-500/50'
                        : rn.color === 'red'
                        ? 'bg-[#991e1e] border-rose-500/50'
                        : 'bg-[#1c1d24] border-gray-600'
                    }`}
                  >
                    {rn.number}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Felt Board & Betting Surface */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <RouletteTable
            bets={bets}
            onPlaceBet={handlePlaceBet}
            disabled={isSpinning}
            winningNumber={lastResult ? lastResult.number : null}
          />
        </div>
      </div>

      {/* Bottom Bar: Chip Rack + Action Controls (Double, Clear, Spin, Lucky Bets) */}
      <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-2xl bg-[#12141c]/95 backdrop-blur-md border border-[#c5a059]/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        {/* Chip Denominations Tray */}
        <ChipSelector disabled={isSpinning} />

        {/* Quick Bet Shortcuts */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleLuckyBet}
            className="py-2 px-3 rounded-xl bg-[#1c1e28] hover:bg-[#282b3a] border border-white/10 text-[11px] font-cinzel text-gray-300 hover:text-[#f4e0a5] transition-all cursor-pointer flex items-center gap-1.5"
            title="Place chip on a random lucky straight number"
          >
            <Dices className="w-3.5 h-3.5 text-[#e2c176]" />
            <span>Lucky Number</span>
          </button>
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => handleQuickColorBet('red')}
            className="py-2 px-3 rounded-xl bg-[#7b1818]/60 hover:bg-[#991e1e] border border-rose-500/30 text-[11px] font-cinzel text-white transition-all cursor-pointer"
          >
            + Red
          </button>
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => handleQuickColorBet('black')}
            className="py-2 px-3 rounded-xl bg-[#18191d] hover:bg-[#282a33] border border-gray-600 text-[11px] font-cinzel text-gray-200 transition-all cursor-pointer"
          >
            + Black
          </button>
        </div>

        {/* Wager Summary & Main Actions */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 font-cinzel uppercase block">Table Bet</span>
            <span className="text-base font-bold font-mono-num text-[#e2c176]">
              ${totalBet.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSpinning || bets.length === 0}
              onClick={handleDoubleBets}
              className="py-2.5 px-3 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-white/10 text-xs font-cinzel font-semibold text-gray-200 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>2X</span>
            </button>

            <button
              type="button"
              disabled={isSpinning || bets.length === 0}
              onClick={handleClearBets}
              className="py-2.5 px-3 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-white/10 text-xs font-cinzel font-semibold text-rose-300 hover:text-rose-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear
            </button>

            {previousBets.length > 0 && bets.length === 0 && (
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleRebet}
                className="py-2.5 px-3.5 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-[#c5a059]/40 text-xs font-cinzel font-semibold text-[#f4e0a5] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rebet</span>
              </button>
            )}

            {/* Spin Primary CTA Button */}
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className={`py-2.5 px-6 sm:px-8 rounded-xl font-bold font-cinzel text-xs sm:text-sm tracking-widest text-black uppercase transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer ${
                isSpinning
                  ? 'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-98 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paytable Modal */}
      <RoulettePaytableModal
        isOpen={isPaytableOpen}
        onClose={() => setIsPaytableOpen(false)}
      />
    </div>
  );
};
