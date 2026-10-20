import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { Crown, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import type { GameType } from '../../types/casino';

export const Footer: React.FC = () => {
  const { setActiveGame } = useCasino();

  const handleNav = (game: GameType) => {
    setActiveGame(game);
  };

  return (
    <footer className="mt-20 border-t border-[#c5a059]/20 bg-[#07080a] text-gray-400 text-xs">
      {/* Monte Carlo Badges Ticker */}
      <div className="border-b border-white/5 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-gray-300 font-cinzel text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#e2c176]" />
            <span className="tracking-wider">CRYPTOGRAPHIC RNG ALGORITHM</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#e2c176]" />
            <span className="tracking-wider">100% NON-WAGERING DEMO PLATFORM</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#e2c176]" />
            <span className="tracking-wider">CERTIFIED VIP SIMULATION SUITE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c5a059]/20 border border-[#c5a059]/50 flex items-center justify-center text-[#f4e0a5]">
              <Crown className="w-4 h-4" />
            </div>
            <span className="font-cinzel text-base font-bold tracking-widest text-white">
              CASINO PRIVÉ
            </span>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            The Monte Carlo VIP simulator crafted for gaming purists. Featuring authentic European Single Zero Roulette, Vegas Strip Blackjack, and Aurum Royale 5-Reel Slot Mechanics.
          </p>
        </div>

        {/* Quick Nav */}
        <div>
          <h5 className="font-cinzel font-bold text-white uppercase tracking-wider mb-3 text-xs">
            Gaming Salons
          </h5>
          <ul className="space-y-2 text-[12px]">
            <li>
              <button
                onClick={() => handleNav('roulette')}
                className="hover:text-[#f4e0a5] transition-colors"
              >
                European Roulette (Single 0)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('blackjack')}
                className="hover:text-[#f4e0a5] transition-colors"
              >
                VIP Blackjack (3:2 Natural)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('slots')}
                className="hover:text-[#f4e0a5] transition-colors"
              >
                Aurum Royale (5-Reel 20-Payline)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('lobby')}
                className="hover:text-[#f4e0a5] transition-colors"
              >
                Grand Reception Lobby
              </button>
            </li>
          </ul>
        </div>

        {/* Game Rules / Fair Play */}
        <div>
          <h5 className="font-cinzel font-bold text-white uppercase tracking-wider mb-3 text-xs">
            Simulation Standards
          </h5>
          <ul className="space-y-2 text-[12px] text-gray-400">
            <li>European Single Zero (2.7% House Edge)</li>
            <li>Dealer Stands on All 17s (S17 Rule)</li>
            <li>Splits & Double-Down Allowed</li>
            <li>High-Precision Audio Synthesis</li>
          </ul>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="p-4 rounded-xl bg-[#12141c] border border-white/5 space-y-2">
          <h5 className="font-cinzel font-bold text-[#f4e0a5] uppercase tracking-wider text-[11px]">
            Complimentary Practice Platform
          </h5>
          <p className="text-[11px] text-gray-400 leading-normal">
            This website is strictly a frontend casino demonstration for entertainment and web development demonstration purposes only. All currency displayed is fictitious demo credits with zero cash value. No real-money gambling is supported.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-4 text-center text-gray-500 text-[11px] font-cinzel">
        <p>© 2026 CASINO PRIVÉ. ALL RIGHTS RESERVED. HIGH-ROLLER DEMO SYSTEM.</p>
      </div>
    </footer>
  );
};
