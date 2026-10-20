import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GameType, ChipValue, BetTransaction, PlayerStats } from '../types/casino';
import { soundEngine } from '../services/soundEngine';

interface ToastInfo {
  id: string;
  type: 'win' | 'info' | 'error' | 'jackpot';
  title: string;
  message: string;
}

interface CasinoContextType {
  balance: number;
  selectedChip: ChipValue;
  setSelectedChip: (chip: ChipValue) => void;
  activeGame: GameType;
  setActiveGame: (game: GameType) => void;
  transactions: BetTransaction[];
  stats: PlayerStats;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  toasts: ToastInfo[];
  showToast: (type: ToastInfo['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  placeBet: (amount: number) => boolean;
  awardPayout: (game: 'roulette' | 'blackjack' | 'slots', betAmount: number, payout: number, details: string) => void;
  refundBet: (amount: number, details?: string) => void;
  reloadBalance: (amount?: number) => void;
  resetAllStats: () => void;
  isStatsModalOpen: boolean;
  setIsStatsModalOpen: (open: boolean) => void;
  isReloadModalOpen: boolean;
  setIsReloadModalOpen: (open: boolean) => void;
}

const DEFAULT_STARTING_BALANCE = 10000;

const initialStats: PlayerStats = {
  startingBalance: DEFAULT_STARTING_BALANCE,
  totalBetsPlaced: 0,
  totalWagered: 0,
  totalWon: 0,
  biggestWin: 0,
  gamesPlayed: {
    roulette: 0,
    blackjack: 0,
    slots: 0,
  },
};

const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

export const CasinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Balance
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('casino_balance');
      return saved !== null ? parseFloat(saved) : DEFAULT_STARTING_BALANCE;
    } catch {
      return DEFAULT_STARTING_BALANCE;
    }
  });

  // Selected chip
  const [selectedChip, setSelectedChipState] = useState<ChipValue>(25);

  // Active game view
  const [activeGame, setActiveGameState] = useState<GameType>('lobby');

  // Transactions history
  const [transactions, setTransactions] = useState<BetTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('casino_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('casino_stats');
      return saved ? JSON.parse(saved) : initialStats;
    } catch {
      return initialStats;
    }
  });

  // Sound settings
  const [isMuted, setIsMutedState] = useState<boolean>(() => soundEngine.getMuted());
  const [volume, setVolumeState] = useState<number>(() => soundEngine.getVolume());

  // Modals
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isReloadModalOpen, setIsReloadModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('casino_balance', balance.toString());
    } catch {
      // Ignore
    }
  }, [balance]);

  // Sync transactions
  useEffect(() => {
    try {
      localStorage.setItem('casino_transactions', JSON.stringify(transactions.slice(0, 50)));
    } catch {
      // Ignore
    }
  }, [transactions]);

  // Sync stats
  useEffect(() => {
    try {
      localStorage.setItem('casino_stats', JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  const setSelectedChip = (chip: ChipValue) => {
    soundEngine.playChipClick();
    setSelectedChipState(chip);
  };

  const setActiveGame = (game: GameType) => {
    soundEngine.playButton();
    setActiveGameState(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setIsMuted = (muted: boolean) => {
    soundEngine.setMuted(muted);
    setIsMutedState(muted);
  };

  const setVolume = (vol: number) => {
    soundEngine.setVolume(vol);
    setVolumeState(vol);
  };

  const showToast = (type: ToastInfo['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    // Keep only one clean popup at a time to prevent duplicate bubbles
    setToasts([{ id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Places a bet. Deducts from balance if sufficient funds exist.
   */
  const placeBet = (amount: number): boolean => {
    if (amount <= 0) return false;
    if (balance < amount) {
      showToast('error', 'Insufficient Funds', 'Reload your VIP demo balance to continue betting.');
      return false;
    }

    setBalance((prev) => Math.max(0, prev - amount));
    return true;
  };

  /**
   * Refund bet in case of cancellation or round restart
   */
  const refundBet = (amount: number, details?: string) => {
    if (amount <= 0) return;
    setBalance((prev) => prev + amount);
    if (details) {
      showToast('info', 'Bet Cleared', details);
    }
  };

  /**
   * Record outcome and payout
   */
  const awardPayout = (
    game: 'roulette' | 'blackjack' | 'slots',
    betAmount: number,
    payout: number,
    details: string
  ) => {
    const netProfit = payout - betAmount;
    const gameNames = {
      roulette: 'European Roulette',
      blackjack: 'VIP Blackjack',
      slots: 'Aurum Royale Slots',
    };

    if (payout > 0) {
      setBalance((prev) => prev + payout);
    }

    // New transaction
    const newTx: BetTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      game,
      gameName: gameNames[game],
      timestamp: Date.now(),
      betAmount,
      payout,
      netProfit,
      details,
    };

    setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);

    // Update stats
    setStats((prev) => {
      const isWin = payout > betAmount;
      const biggest = payout > prev.biggestWin ? payout : prev.biggestWin;
      return {
        ...prev,
        totalBetsPlaced: prev.totalBetsPlaced + 1,
        totalWagered: prev.totalWagered + betAmount,
        totalWon: prev.totalWon + (isWin ? payout : 0),
        biggestWin: biggest,
        gamesPlayed: {
          ...prev.gamesPlayed,
          [game]: prev.gamesPlayed[game] + 1,
        },
      };
    });
  };

  const reloadBalance = (amount = DEFAULT_STARTING_BALANCE) => {
    setBalance(amount);
    soundEngine.playBigWin();
    showToast('jackpot', 'VIP Credit Refreshed', `Your demo bankroll has been replenished to $${amount.toLocaleString()}.`);
  };

  const resetAllStats = () => {
    setBalance(DEFAULT_STARTING_BALANCE);
    setTransactions([]);
    setStats(initialStats);
    localStorage.removeItem('casino_transactions');
    localStorage.removeItem('casino_stats');
    localStorage.setItem('casino_balance', DEFAULT_STARTING_BALANCE.toString());
    showToast('info', 'Stats Reset', 'Demo bankroll and session history have been reset.');
  };

  return (
    <CasinoContext.Provider
      value={{
        balance,
        selectedChip,
        setSelectedChip,
        activeGame,
        setActiveGame,
        transactions,
        stats,
        isMuted,
        setIsMuted,
        volume,
        setVolume,
        toasts,
        showToast,
        removeToast,
        placeBet,
        awardPayout,
        refundBet,
        reloadBalance,
        resetAllStats,
        isStatsModalOpen,
        setIsStatsModalOpen,
        isReloadModalOpen,
        setIsReloadModalOpen,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasino = (): CasinoContextType => {
  const context = useContext(CasinoContext);
  if (!context) {
    throw new Error('useCasino must be used within a CasinoProvider');
  }
  return context;
};
