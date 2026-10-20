export type RouletteColor = 'red' | 'black' | 'green';

export interface RoulettePocket {
  number: number;
  color: RouletteColor;
  angle: number; // degrees on the wheel (0 - 360)
}

export type RouletteBetType =
  | 'straight'
  | 'red'
  | 'black'
  | 'even'
  | 'odd'
  | 'low' // 1-18
  | 'high' // 19-36
  | 'dozen1' // 1-12
  | 'dozen2' // 13-24
  | 'dozen3' // 25-36
  | 'col1'
  | 'col2'
  | 'col3';

export interface RouletteBet {
  type: RouletteBetType;
  value?: number; // For straight bets (0-36)
  amount: number;
}

export interface RouletteResult {
  number: number;
  color: RouletteColor;
  isEven: boolean;
  isHigh: boolean;
  dozen: 1 | 2 | 3 | null;
  column: 1 | 2 | 3 | null;
}

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// European wheel pocket order in clockwise order
export const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
