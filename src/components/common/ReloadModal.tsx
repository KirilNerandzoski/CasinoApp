import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { X, Sparkles, ShieldAlert, Coins } from 'lucide-react';

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000, 50000];

export const ReloadModal: React.FC = () => {
  const { isReloadModalOpen, setIsReloadModalOpen, reloadBalance, balance } = useCasino();
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);

  if (!isReloadModalOpen) return null;

  const handleDeposit = () => {
    reloadBalance(selectedAmount);
    setIsReloadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181b23] to-[#0d0f14] border border-[#c5a059]/40 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          onClick={() => setIsReloadModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 mb-3 text-[#f4e0a5]">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-cinzel text-white tracking-wider">
            VIP DEMO VAULT
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Replenish your complimentary practice bankroll with instant fake-money credits.
          </p>
        </div>

        {/* Current Balance */}
        <div className="flex items-center justify-between p-3.5 mb-5 rounded-xl bg-black/40 border border-white/5">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-cinzel">Current Balance</span>
          <span className="text-base font-bold font-mono-num text-[#e2c176]">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Amount Selector */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-cinzel">
            Select Replenish Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold font-mono-num transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black border-[#fef08a] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-102'
                      : 'bg-[#12141c] text-gray-300 border-white/10 hover:border-[#c5a059]/50'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#c5a059]/5 border border-[#c5a059]/20 text-[11px] text-gray-300 mb-6">
          <ShieldAlert className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
          <span>
            100% Free Practice Simulation. No real money, deposits, or withdrawals are permitted or involved.
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDeposit}
          className="w-full py-3.5 px-4 rounded-xl font-bold font-cinzel tracking-wider text-black bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>INSTANT DEMO REPLENISH</span>
        </button>
      </div>
    </div>
  );
};
