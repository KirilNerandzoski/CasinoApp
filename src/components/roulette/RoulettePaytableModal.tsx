import React from 'react';
import { X, HelpCircle, ShieldCheck } from 'lucide-react';

interface RoulettePaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoulettePaytableModal: React.FC<RoulettePaytableModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181b23] to-[#0c0e12] border border-[#c5a059]/40 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto">
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
              EUROPEAN ROULETTE RULES & PAYTABLE
            </h3>
            <p className="text-xs text-gray-400">Monte Carlo Single Zero Standard</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-300">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-[#f4e0a5] font-cinzel font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#e2c176]" />
              <span>Single Zero Advantage (97.30% RTP)</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Unlike American roulette which features both 0 and 00 (5.26% house edge), European roulette has only a single green zero, reducing the house edge to 2.70%.
            </p>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c5a059]/30 text-gray-400 font-cinzel text-[11px] uppercase tracking-wider">
                <th className="py-2">Bet Type</th>
                <th className="py-2">Pockets</th>
                <th className="py-2 text-right">Standard Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              <tr>
                <td className="py-2.5 font-semibold text-white">Straight Up (Plein)</td>
                <td className="py-2.5 text-gray-400">Single number (0-36)</td>
                <td className="py-2.5 text-right font-bold text-[#e2c176] font-mono-num">35 : 1</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-white">Columns (Colonne)</td>
                <td className="py-2.5 text-gray-400">12 numbers (1st, 2nd, 3rd)</td>
                <td className="py-2.5 text-right font-bold text-[#e2c176] font-mono-num">2 : 1</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-white">Dozens (Douzaine)</td>
                <td className="py-2.5 text-gray-400">1-12, 13-24, or 25-36</td>
                <td className="py-2.5 text-right font-bold text-[#e2c176] font-mono-num">2 : 1</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-white">Red / Black (Rouge / Noir)</td>
                <td className="py-2.5 text-gray-400">18 colored numbers</td>
                <td className="py-2.5 text-right font-bold text-emerald-400 font-mono-num">1 : 1</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-white">Even / Odd (Pair / Impair)</td>
                <td className="py-2.5 text-gray-400">18 numbers</td>
                <td className="py-2.5 text-right font-bold text-emerald-400 font-mono-num">1 : 1</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-white">Low / High (Manque / Passe)</td>
                <td className="py-2.5 text-gray-400">1-18 or 19-36</td>
                <td className="py-2.5 text-right font-bold text-emerald-400 font-mono-num">1 : 1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#e2c176] to-[#c5a059] hover:brightness-110 transition-all cursor-pointer"
        >
          Return to Table
        </button>
      </div>
    </div>
  );
};
