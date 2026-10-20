import React from 'react';
import { X, ShieldCheck, HelpCircle } from 'lucide-react';

interface BlackjackRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlackjackRulesModal: React.FC<BlackjackRulesModalProps> = ({
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
              VIP BLACKJACK RULES & PAYTABLE
            </h3>
            <p className="text-xs text-gray-400">Monte Carlo Standard 6-Deck Shoe</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-300">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-[#f4e0a5] font-cinzel font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#e2c176]" />
              <span>Standard VIP Payouts</span>
            </div>
            <ul className="space-y-1.5 text-gray-300 mt-2">
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Natural Blackjack (Ace + 10-val):</span>
                <span className="font-bold text-[#e2c176] font-mono-num">Pays 3 to 2</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Standard Hand Win:</span>
                <span className="font-bold text-emerald-400 font-mono-num">Pays 1 to 1</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Insurance Bet (Dealer shows Ace):</span>
                <span className="font-bold text-[#e2c176] font-mono-num">Pays 2 to 1</span>
              </li>
              <li className="flex justify-between">
                <span>Push (Tie total):</span>
                <span className="font-bold text-amber-300 font-mono-num">Bet Returned</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Table Regulations
            </h4>
            <div className="space-y-1.5 text-gray-400 leading-relaxed text-[11px]">
              <p>• Dealer must draw cards to 16 and stand on all 17s (hard and soft).</p>
              <p>• Aces count as 1 or 11, automatically optimized for the highest non-busting hand.</p>
              <p>• <strong>Double Down:</strong> Double original wager on the initial 2 cards to receive exactly one additional card.</p>
              <p>• <strong>Split:</strong> When dealt a pair of equal cards (e.g. 8-8 or J-K), split into two independent active hands with matched stakes.</p>
            </div>
          </div>
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
