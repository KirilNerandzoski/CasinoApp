export type GameType = 'lobby' | 'roulette' | 'blackjack' | 'slots';

export type ChipValue = 5 | 25 | 100 | 500 | 1000;

export interface BetTransaction {
  id: string;
  game: 'roulette' | 'blackjack' | 'slots';
  gameName: string;
  timestamp: number;
  betAmount: number;
  payout: number;
  netProfit: number;
  details: string;
}

export interface PlayerStats {
  startingBalance: number;
  totalBetsPlaced: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  gamesPlayed: {
    roulette: number;
    blackjack: number;
    slots: number;
  };
}
