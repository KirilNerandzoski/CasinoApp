export type SlotSymbolId =
  | 'wild'
  | 'scatter'
  | 'crown'
  | 'seven'
  | 'diamond'
  | 'ingot'
  | 'bell'
  | 'chip'
  | 'coin'
  | 'cherry';

export interface SlotSymbol {
  id: SlotSymbolId;
  name: string;
  isWild?: boolean;
  isScatter?: boolean;
  payouts: {
    3: number; // 3 of a kind multiplier
    4: number; // 4 of a kind multiplier
    5: number; // 5 of a kind multiplier
  };
  color: string;
  iconName: string;
}

export interface WinningLine {
  lineIndex: number;
  symbolId: SlotSymbolId;
  count: number;
  payout: number;
  positions: { col: number; row: number }[]; // 5 positions for this payline
}

export interface SpinResult {
  grid: SlotSymbolId[][]; // 5 columns x 3 rows
  winningLines: WinningLine[];
  totalPayout: number;
  scatterCount: number;
  triggeredFreeSpins: boolean;
}
