export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: CardSuit;
  rank: CardRank;
  value: number; // base value (11 for Ace)
  faceUp: boolean;
}

export type HandOutcome = 'in_play' | 'won' | 'lost' | 'push' | 'blackjack' | 'bust';

export interface BlackjackHand {
  id: string;
  cards: Card[];
  bet: number;
  isStood: boolean;
  isDoubled: boolean;
  isSplit: boolean;
  outcome?: HandOutcome;
  payout?: number;
}

export type BlackjackPhase =
  | 'betting'
  | 'dealing'
  | 'insurance_prompt'
  | 'player_turn'
  | 'dealer_turn'
  | 'payout'
  | 'round_over';
