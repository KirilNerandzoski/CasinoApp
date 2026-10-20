import React from 'react';
import { X, HelpCircle, Flame, Sparkles } from 'lucide-react';

interface SlotsPaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PAYLINE_PATTERNS = [
  [1, 1, 1, 1, 1], // 1: Middle
  [0, 0, 0, 0, 0], // 2: Top
  [2, 2, 2, 2, 2], // 3: Bottom
  [0, 1, 2, 1, 0], // 4: V-shape
  [2, 1, 0, 1, 2], // 5: Inverted V
  [0, 0, 1, 2, 2], // 6
  [2, 2, 1, 0, 0], // 7
  [1, 2, 2, 2, 1], // 8
  [1, 0, 0, 0, 1], // 9
  [0, 1, 1, 1, 0], // 10
  [2, 1, 1, 1, 2], // 11
  [0, 1, 0, 1, 0], // 12
  [2, 1, 2, 1, 2], // 13
  [1, 0, 1, 0, 1], // 14
  [1, 2, 1, 2, 1], // 15
  [0, 0, 0, 1, 2], // 16
  [2, 2, 2, 1, 0], // 17
  [1, 1, 0, 1, 2], // 18
  [1, 1, 2, 1, 0], // 19
  [0, 2, 0, 2, 0], // 20
];

export const SlotsPaytableModal: React.FC<SlotsPaytableModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#181b23] to-[#0c0e12] border border-[#c5a059]/40 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-cinzel text-white tracking-wider">
              AURUM ROYALE PAYTABLE & FEATURE RULES
            </h3>
            <p className="text-xs text-gray-400">5-Reel • 20 Fixed Paylines • 96.8% Demo RTP</p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-gray-300">
          {/* Special Feature Bonus Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2a1e0b] to-[#120f08] border border-[#f59e0b]/40 space-y-1.5">
              <div className="flex items-center gap-2 text-[#facc15] font-cinzel font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>WILD SYMBOL</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Substitutes for all paying symbols except Scatter. 5 Wilds on any payline awards the grand jackpot of <strong>1,500x line bet</strong>!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2a1238] to-[#11071a] border border-purple-400/40 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-cinzel font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>SCATTER & FREE SPINS</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                3 or more Scatters anywhere triggers <strong>10 Free Spins</strong> with an automatic <strong>3X WIN MULTIPLIER</strong> on every winning combination!
              </p>
            </div>
          </div>

          {/* Symbol Payouts Table */}
          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Line Bet Multipliers
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c5a059]/30 bg-black/50 text-gray-400 font-cinzel text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3 text-center">3 of a Kind</th>
                    <th className="py-2.5 px-3 text-center">4 of a Kind</th>
                    <th className="py-2.5 px-3 text-right">5 of a Kind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono-num text-xs">
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-[#fef08a]">Imperial 777</td>
                    <td className="py-2 px-3 text-center text-gray-300">50x</td>
                    <td className="py-2 px-3 text-center text-gray-200">200x</td>
                    <td className="py-2 px-3 text-right font-bold text-[#e2c176]">1,000x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-[#e2c176]">Gold Bullion Ingot</td>
                    <td className="py-2 px-3 text-center text-gray-300">30x</td>
                    <td className="py-2 px-3 text-center text-gray-200">100x</td>
                    <td className="py-2 px-3 text-right font-bold text-[#e2c176]">500x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-sky-300">Sparkling Diamond</td>
                    <td className="py-2 px-3 text-center text-gray-300">20x</td>
                    <td className="py-2 px-3 text-center text-gray-200">75x</td>
                    <td className="py-2 px-3 text-right font-bold text-sky-400">350x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-amber-300">Golden Bell</td>
                    <td className="py-2 px-3 text-center text-gray-300">15x</td>
                    <td className="py-2 px-3 text-center text-gray-200">50x</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-400">200x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-gray-200">VIP Casino Chip</td>
                    <td className="py-2 px-3 text-center text-gray-300">10x</td>
                    <td className="py-2 px-3 text-center text-gray-200">35x</td>
                    <td className="py-2 px-3 text-right font-bold text-gray-200">150x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-amber-400">Gold Doubloon</td>
                    <td className="py-2 px-3 text-center text-gray-300">8x</td>
                    <td className="py-2 px-3 text-center text-gray-200">25x</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-400">100x</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-cinzel font-semibold text-rose-300">Ruby Cherry</td>
                    <td className="py-2 px-3 text-center text-gray-300">5x</td>
                    <td className="py-2 px-3 text-center text-gray-200">15x</td>
                    <td className="py-2 px-3 text-right font-bold text-rose-400">60x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 20 Paylines Diagrams Mini Grid */}
          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              20 Winning Paylines Map
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {PAYLINE_PATTERNS.map((pattern, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-black/50 border border-white/5 flex flex-col items-center"
                >
                  <span className="text-[10px] font-mono-num font-bold text-[#c5a059] mb-1">
                    Line {idx + 1}
                  </span>
                  <div className="grid grid-cols-5 gap-0.5 w-16 h-8">
                    {[0, 1, 2].map((r) =>
                      [0, 1, 2, 3, 4].map((c) => (
                        <div
                          key={`${r}-${c}`}
                          className={`w-full h-full rounded-[1px] ${
                            pattern[c] === r ? 'bg-[#facc15]' : 'bg-white/10'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#e2c176] to-[#c5a059] hover:brightness-110 transition-all cursor-pointer"
        >
          Return to Reels
        </button>
      </div>
    </div>
  );
};
