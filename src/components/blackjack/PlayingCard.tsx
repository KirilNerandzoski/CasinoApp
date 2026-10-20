import React from 'react';
import type { Card } from '../../types/blackjack';

interface PlayingCardProps {
  card: Card;
  className?: string;
  isDealing?: boolean;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  className = '',
}) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  const getSuitSymbol = (suit: Card['suit']) => {
    switch (suit) {
      case 'spades':
        return '♠';
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
    }
  };

  const suitSymbol = getSuitSymbol(card.suit);

  return (
    <div
      className={`relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-34 rounded-lg select-none perspective-[1000px] transition-all duration-300 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div
        className={`relative w-full h-full rounded-lg transition-transform duration-500 transform-style-3d ${
          card.faceUp ? 'rotate-y-0' : 'rotate-y-180'
        }`}
      >
        {/* CARD FRONT FACE */}
        <div
          className={`absolute inset-0 w-full h-full rounded-lg bg-gradient-to-b from-[#ffffff] via-[#faf8f2] to-[#f0ece1] border border-[#d4af37]/60 p-1.5 sm:p-2 flex flex-col justify-between backface-hidden shadow-sm ${
            isRed ? 'text-[#a81c1c]' : 'text-[#16181e]'
          }`}
        >
          {/* Top Left Rank & Suit */}
          <div className="flex flex-col items-center leading-none self-start">
            <span className="font-bold text-xs sm:text-sm font-cinzel tracking-tighter">
              {card.rank}
            </span>
            <span className="text-xs sm:text-sm -mt-0.5">{suitSymbol}</span>
          </div>

          {/* Center Graphic */}
          <div className="self-center flex flex-col items-center justify-center opacity-85">
            {['J', 'Q', 'K'].includes(card.rank) ? (
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-current/30 flex items-center justify-center font-cinzel font-bold text-xs sm:text-base">
                {card.rank}
              </div>
            ) : card.rank === 'A' ? (
              <span className="text-2xl sm:text-3xl font-cinzel font-bold">{suitSymbol}</span>
            ) : (
              <span className="text-xl sm:text-2xl font-cinzel font-semibold">{suitSymbol}</span>
            )}
          </div>

          {/* Bottom Right Rank & Suit (Inverted) */}
          <div className="flex flex-col items-center leading-none self-end rotate-180">
            <span className="font-bold text-xs sm:text-sm font-cinzel tracking-tighter">
              {card.rank}
            </span>
            <span className="text-xs sm:text-sm -mt-0.5">{suitSymbol}</span>
          </div>

          {/* Luxury Gold Border Inset */}
          <div className="absolute inset-1 rounded-md border border-[#c5a059]/20 pointer-events-none" />
        </div>

        {/* CARD BACK FACE (Luxury Gold Leaf & Obsidian) */}
        <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-[#1b1c24] via-[#121319] to-[#0a0b0e] border-2 border-[#d4af37] p-1 rotate-y-180 backface-hidden shadow-inner">
          <div className="w-full h-full rounded border border-[#c5a059]/40 bg-[#161822] flex items-center justify-center relative overflow-hidden">
            {/* Fine Diamond Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
                backgroundSize: '8px 8px',
              }}
            />
            {/* Center Royal Seal */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#d4af37] flex items-center justify-center bg-black/60 shadow">
              <span className="text-[10px] sm:text-xs font-cinzel font-bold text-[#f4e0a5]">
                VIP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
