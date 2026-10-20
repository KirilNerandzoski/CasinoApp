import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Crown,
  Dices,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Coins,
  BarChart2,
} from 'lucide-react';
import type { GameType } from '../../types/casino';

export const Lobby: React.FC = () => {
  const { setActiveGame, balance, stats, setIsReloadModalOpen, setIsStatsModalOpen } = useCasino();

  const handleGameSelect = (game: GameType) => {
    setActiveGame(game);
  };

  const gameCards = [
    {
      id: 'roulette' as GameType,
      title: 'European Roulette',
      badge: 'Single Zero • 97.3% RTP',
      desc: 'The traditional Monte Carlo single zero wheel. Place inside numbers, splits, dozens, columns, and outside colors with authentic 35:1 straight-up odds and realistic ball deceleration physics.',
      limits: 'Min $5 • Max $10,000',
      tag: 'FEATURED VIP',
      icon: <Dices className="w-8 h-8 text-[#e2c176]" />,
      actionText: 'Enter Roulette Salon',
      accentColor: 'from-[#17382c] to-[#0c1f18]',
      borderColor: 'border-[#10b981]/30 hover:border-[#10b981]/60',
      pocketsText: '37 Authentic French Pockets',
    },
    {
      id: 'blackjack' as GameType,
      title: 'VIP Blackjack',
      badge: 'Pays 3:2 • S17 Rule',
      desc: 'High-limit Vegas Strip & Monte Carlo blackjack. Dealer stands on all 17s. Full interactive support for natural 3:2 payouts, Double Down, Pairs Split, and Dealer Ace Insurance.',
      limits: 'Min $5 • Max $5,000',
      tag: 'HIGH ROLLER',
      icon: <Layers className="w-8 h-8 text-[#e2c176]" />,
      actionText: 'Take Seat at Table',
      accentColor: 'from-[#153427] to-[#0b1c15]',
      borderColor: 'border-[#c5a059]/30 hover:border-[#c5a059]/60',
      pocketsText: '4-Deck Balanced Shoe',
    },
    {
      id: 'slots' as GameType,
      title: 'Aurum Royale Slots',
      badge: '5-Reel • 20 Paylines',
      desc: 'Exclusive high-volatility 5x3 luxury video slot. Trigger the 1,500x Wild Lion Crest jackpot or land 3+ Scatters to activate 10 Free Spins with a persistent 3X win multiplier.',
      limits: 'Min $20 • Max $1,000',
      tag: 'JACKPOT 1,500X',
      icon: <Sparkles className="w-8 h-8 text-[#fef08a]" />,
      actionText: 'Spin Aurum Reels',
      accentColor: 'from-[#2e1d0d] to-[#140c05]',
      borderColor: 'border-[#f59e0b]/30 hover:border-[#f59e0b]/60',
      pocketsText: 'Free Spins & 3X Multiplier',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1b1c24] via-[#121319] to-[#0a0b0e] border border-[#c5a059]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Gold Radial Flare */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#c5a059]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-xs text-[#f4e0a5] font-cinzel font-semibold tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>EXECUTIVE VIP GAMING SUITE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wide leading-tight">
            THE PINNACLE OF <br />
            <span className="gold-gradient-text">MONTE CARLO GAMING</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Welcome to Casino Privé — an ultra-refined, interactive casino experience engineered with mathematically balanced RNG models, physical Web Audio synthesis, and zero real-money risk.
          </p>

          {/* Quick Bankroll & Action Pill */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-black/60 border border-[#c5a059]/30 shadow">
              <Coins className="w-5 h-5 text-[#e2c176]" />
              <div>
                <span className="text-[10px] uppercase font-cinzel text-gray-400 block leading-tight">
                  Available Demo Funds
                </span>
                <span className="text-lg font-bold font-mono-num text-[#f4e0a5] leading-tight">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsReloadModalOpen(true)}
              className="py-3 px-6 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              <span>Replenish Bankroll</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="py-3 px-5 rounded-xl font-cinzel font-semibold text-xs uppercase tracking-wider text-gray-300 hover:text-white bg-[#141620] hover:bg-[#1d202e] border border-white/10 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4 text-[#c5a059]" />
              <span>Session Stats ({stats.totalBetsPlaced} Plays)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Games Showcase Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white tracking-wider">
              FEATURED GAMING SALONS
            </h2>
            <p className="text-xs text-gray-400">
              Select a table or machine to begin interactive fake-money play.
            </p>
          </div>
          <span className="text-xs text-[#c5a059] font-cinzel tracking-wider uppercase hidden sm:block">
            3 Active Tables
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gameCards.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className={`group relative rounded-2xl p-6 bg-gradient-to-b ${game.accentColor} border ${game.borderColor} shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:border-[#c5a059] transition-colors shadow">
                    {game.icon}
                  </div>
                  <span className="text-[10px] font-cinzel font-bold tracking-widest px-2.5 py-1 rounded-full bg-black/60 text-[#f4e0a5] border border-[#c5a059]/30">
                    {game.tag}
                  </span>
                </div>

                {/* Title & Badge */}
                <div>
                  <h3 className="text-xl font-bold font-cinzel text-white group-hover:text-[#f4e0a5] transition-colors">
                    {game.title}
                  </h3>
                  <span className="text-xs text-[#c5a059] font-medium font-cinzel block mt-0.5">
                    {game.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              {/* Card Footer: Limits & Button */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono-num">
                  <span>{game.limits}</span>
                  <span className="text-emerald-400 font-cinzel font-semibold">{game.pocketsText}</span>
                </div>

                <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#202430] to-[#14161f] group-hover:from-[#c5a059] group-hover:to-[#a9833b] group-hover:text-black border border-white/10 group-hover:border-transparent text-xs font-cinzel font-bold text-center tracking-wider text-gray-200 transition-all flex items-center justify-center gap-2">
                  <span>{game.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Salon Standards & Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0e1017] border border-white/5">
        <div className="flex items-start gap-3 p-3">
          <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cinzel text-white uppercase tracking-wider">
              100% Risk Free
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Purely simulated entertainment demo. No real currency is accepted or deposited.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cinzel text-white uppercase tracking-wider">
              Web Audio Synthesis
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Zero-latency physical sound generation for ceramic chips, cards, and roulette frets.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cinzel text-white uppercase tracking-wider">
              Authentic Odds
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              European 35:1 payouts, Blackjack 3:2 naturals, and true mathematical probability.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3">
          <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176] shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cinzel text-white uppercase tracking-wider">
              Verified Session Log
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Complete transparency with recorded wager histories, net profit/loss, and hit rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
