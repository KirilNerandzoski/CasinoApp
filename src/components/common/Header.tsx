import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Crown,
  Volume2,
  VolumeX,
  BarChart2,
  PlusCircle,
  Menu,
  X,
  Dices,
  Layers,
  Sparkles,
  Home,
} from 'lucide-react';
import type { GameType } from '../../types/casino';

export const Header: React.FC = () => {
  const {
    balance,
    activeGame,
    setActiveGame,
    isMuted,
    setIsMuted,
    setIsStatsModalOpen,
    setIsReloadModalOpen,
  } = useCasino();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { type: GameType; label: string; icon: React.ReactNode }[] = [
    { type: 'lobby', label: 'Grand Salon', icon: <Home className="w-4 h-4" /> },
    { type: 'roulette', label: 'Roulette', icon: <Dices className="w-4 h-4" /> },
    { type: 'blackjack', label: 'Blackjack', icon: <Layers className="w-4 h-4" /> },
    { type: 'slots', label: 'Aurum Slots', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const handleNavClick = (type: GameType) => {
    setActiveGame(type);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#c5a059]/25 bg-[#0a0b0e]/95 backdrop-blur-md">
      {/* Top micro banner: High Roller VIP Notice */}
      <div className="w-full bg-[#12141c] border-b border-white/5 py-1 px-4 text-center text-[11px] tracking-widest uppercase text-[#c5a059] flex items-center justify-center gap-2 font-cinzel">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>VIP DEMO EXPERIENCE • PRACTICE FUNDS ONLY • PROVABLY BALANCED RNG</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('lobby')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2416] via-[#1a1c24] to-[#0a0b0e] border border-[#c5a059]/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:border-[#c5a059] transition-all">
            <Crown className="w-5 h-5 text-[#f4e0a5]" />
            <div className="absolute inset-0 rounded-xl bg-[#c5a059]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-white">
                CASINO
              </span>
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest gold-gradient-text">
                PRIVÉ
              </span>
            </div>
            <span className="text-[9px] tracking-[0.25em] text-[#a9833b] uppercase block font-cinzel font-semibold -mt-1">
              Monte Carlo VIP
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeGame === item.type;
            return (
              <button
                key={item.type}
                onClick={() => handleNavClick(item.type)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c5a059]/20 to-[#997d3d]/10 text-[#f4e0a5] border border-[#c5a059]/40 shadow-[0_0_15px_rgba(197,160,89,0.15)] font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className={isActive ? 'text-[#e2c176]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Balance Pill, Audio, Stats, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* VIP Balance Display */}
          <div className="flex items-center rounded-xl bg-gradient-to-r from-[#171a22] to-[#101217] border border-[#c5a059]/40 shadow-[0_4px_16px_rgba(0,0,0,0.5)] p-1 pr-2 sm:pr-3">
            <div className="px-2.5 py-1 sm:py-1.5 rounded-lg bg-black/60 border border-[#c5a059]/20 flex flex-col text-left">
              <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-cinzel leading-tight font-semibold">
                VIP Balance
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono-num text-[#f4e0a5] leading-tight">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={() => setIsReloadModalOpen(true)}
              className="ml-1.5 sm:ml-2 p-1.5 rounded-lg bg-[#c5a059]/15 hover:bg-[#c5a059]/30 text-[#f4e0a5] border border-[#c5a059]/30 transition-all cursor-pointer"
              title="Deposit / Reload Demo Funds"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Button */}
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#141720] border border-white/10 hover:border-[#c5a059]/40 text-gray-300 hover:text-[#f4e0a5] transition-all cursor-pointer"
            title="Player Session Statistics"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#141720] border border-white/10 hover:border-[#c5a059]/40 text-gray-300 hover:text-[#f4e0a5] transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#e2c176]" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#141720] border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0e1017] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeGame === item.type;
            return (
              <button
                key={item.type}
                onClick={() => handleNavClick(item.type)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-cinzel uppercase tracking-wider text-left transition-colors ${
                  isActive
                    ? 'bg-[#c5a059]/20 text-[#f4e0a5] font-bold border border-[#c5a059]/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
