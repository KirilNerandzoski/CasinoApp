import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { X, TrendingUp, TrendingDown, RotateCcw, Clock, Award, History, BarChart2 } from 'lucide-react';

export const StatsModal: React.FC = () => {
  const {
    isStatsModalOpen,
    setIsStatsModalOpen,
    stats,
    transactions,
    resetAllStats,
    balance,
  } = useCasino();

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  if (!isStatsModalOpen) return null;

  const netProfit = stats.totalWon - stats.totalWagered;
  const isProfitable = netProfit >= 0;
  const winRate =
    stats.totalBetsPlaced > 0
      ? ((transactions.filter((t) => t.netProfit > 0).length / stats.totalBetsPlaced) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#181b23] to-[#0c0e12] border border-[#c5a059]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#e2c176]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cinzel text-white tracking-wider">
                VIP SESSION ANALYTICS
              </h3>
              <p className="text-xs text-gray-400">
                Live performance tracking & verified wager ledger
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 px-6 bg-[#11131a]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider font-cinzel border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#c5a059] text-[#f4e0a5]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Performance Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider font-cinzel border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'border-[#c5a059] text-[#f4e0a5]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>Wager Ledger</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono-num">
              {transactions.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Primary Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Current Balance</span>
                  <div className="text-xl font-bold font-mono-num text-[#e2c176] mt-1">
                    ${balance.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Net P/L</span>
                  <div
                    className={`text-xl font-bold font-mono-num mt-1 flex items-center gap-1 ${
                      isProfitable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isProfitable ? '+' : ''}${netProfit.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Win Rate</span>
                  <div className="text-xl font-bold font-mono-num text-white mt-1">
                    {winRate}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Total Wagered</span>
                  <div className="text-lg font-bold font-mono-num text-gray-200 mt-1">
                    ${stats.totalWagered.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Total Won</span>
                  <div className="text-lg font-bold font-mono-num text-emerald-300 mt-1">
                    ${stats.totalWon.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-cinzel">Biggest Win</span>
                  <div className="text-lg font-bold font-mono-num text-[#fef08a] mt-1 flex items-center gap-1">
                    <Award className="w-4 h-4 text-[#e2c176]" />
                    ${stats.biggestWin.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Game Volume Breakdown */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-cinzel">
                  Activity by VIP Salon Game
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-gray-400 font-cinzel">Roulette Spins</div>
                    <div className="text-lg font-bold font-mono-num text-white mt-1">
                      {stats.gamesPlayed.roulette}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-gray-400 font-cinzel">Blackjack Hands</div>
                    <div className="text-lg font-bold font-mono-num text-white mt-1">
                      {stats.gamesPlayed.blackjack}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-gray-400 font-cinzel">Slots Spins</div>
                    <div className="text-lg font-bold font-mono-num text-white mt-1">
                      {stats.gamesPlayed.slots}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-cinzel">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No wagers recorded yet in this session.</p>
                </div>
              ) : (
                transactions.map((tx) => {
                  const isWin = tx.netProfit > 0;
                  const isPush = tx.netProfit === 0;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs hover:border-[#c5a059]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 font-mono-num text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div>
                          <span className="font-semibold text-white font-cinzel">
                            {tx.gameName}
                          </span>
                          <span className="text-gray-400 block text-[11px]">
                            {tx.details}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-gray-400 block text-[11px]">
                          Bet: ${tx.betAmount.toLocaleString()}
                        </span>
                        <span
                          className={`font-bold font-mono-num ${
                            isWin
                              ? 'text-emerald-400'
                              : isPush
                              ? 'text-amber-300'
                              : 'text-rose-400'
                          }`}
                        >
                          {isWin ? `+$${tx.netProfit.toLocaleString()}` : isPush ? '$0 (Push)' : `-$${tx.betAmount.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/50">
          <button
            onClick={resetAllStats}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-cinzel transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session Data</span>
          </button>

          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="py-2 px-5 rounded-lg text-xs font-bold font-cinzel tracking-wider text-black bg-gradient-to-r from-[#e2c176] to-[#c5a059] hover:brightness-110 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
