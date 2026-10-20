import React, { useState, useRef } from 'react';
import type { Card, CardRank, CardSuit, BlackjackHand } from '../../types/blackjack';
import { useCasino } from '../../context/CasinoContext';
import { PlayingCard } from './PlayingCard';
import { ChipSelector } from '../common/ChipSelector';
import { CasinoChip } from '../common/CasinoChip';
import { BlackjackRulesModal } from './BlackjackRulesModal';
import { soundEngine } from '../../services/soundEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';

// Card values lookup
const RANK_VALUES: Record<CardRank, number> = {
  'A': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
};

const SUITS: CardSuit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Helper to create and shuffle a 6-deck shoe
const createDeck = (): Card[] => {
  const cards: Card[] = [];
  // 4 decks for standard VIP play
  for (let deck = 0; deck < 4; deck++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({
          id: `${deck}-${suit}-${rank}-${Math.random().toString(36).substring(2, 6)}`,
          suit,
          rank,
          value: RANK_VALUES[rank],
          faceUp: true,
        });
      }
    }
  }

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

// Hand value calculation with Ace optimization
export const calculateHandValue = (cards: Card[]) => {
  const visibleCards = cards.filter((c) => c.faceUp);
  let total = 0;
  let aces = 0;

  for (const card of visibleCards) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11;
    } else {
      total += card.value;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const isSoft = aces > 0 && total <= 21;
  const isBlackjack = visibleCards.length === 2 && total === 21 && cards.length === 2;
  const isBust = total > 21;

  return { total, isSoft, isBlackjack, isBust };
};

export const BlackjackGame: React.FC = () => {
  const { placeBet, awardPayout, refundBet, balance, selectedChip, showToast } = useCasino();

  // Deck Shoe
  const [deck, setDeck] = useState<Card[]>(() => createDeck());

  // Game state
  const [phase, setPhase] = useState<
    'betting' | 'dealing' | 'insurance_prompt' | 'player_turn' | 'dealer_turn' | 'round_over'
  >('betting');

  const [currentBet, setCurrentBet] = useState<number>(0);
  const [lastInitialBet, setLastInitialBet] = useState<number>(0);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerHands, setPlayerHands] = useState<BlackjackHand[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState<number>(0);
  const [insuranceBet, setInsuranceBet] = useState<number>(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const isResolvingRef = useRef(false);

  // Helper to draw a card from shoe
  const drawCard = (faceUp = true): { card: Card; newDeck: Card[] } => {
    let currentDeck = deck;
    if (currentDeck.length < 15) {
      currentDeck = createDeck();
    }
    const card = { ...currentDeck[0], faceUp };
    const newDeck = currentDeck.slice(1);
    setDeck(newDeck);
    return { card, newDeck };
  };

  // Add chip to bet circle in betting phase
  const handleAddBet = () => {
    if (phase !== 'betting') return;
    if (balance < selectedChip) {
      showToast('error', 'Insufficient Funds', 'Replenish demo funds in the vault.');
      return;
    }
    const success = placeBet(selectedChip);
    if (!success) return;

    soundEngine.playChipClick();
    setCurrentBet((prev) => prev + selectedChip);
  };

  // Clear current bet
  const handleClearBet = () => {
    if (phase !== 'betting' || currentBet === 0) return;
    refundBet(currentBet, `Refunded $${currentBet} bet.`);
    soundEngine.playChipClick();
    setCurrentBet(0);
  };

  // Double current bet during betting phase
  const handleDoubleBet = () => {
    if (phase !== 'betting' || currentBet === 0) return;
    if (balance < currentBet) {
      showToast('error', 'Insufficient Funds', 'Insufficient balance to double bet.');
      return;
    }
    const success = placeBet(currentBet);
    if (!success) return;

    soundEngine.playChipStack();
    setCurrentBet((prev) => prev * 2);
  };

  // Deal Initial Round
  const handleDeal = () => {
    if (phase !== 'betting' || currentBet === 0) return;

    isResolvingRef.current = false;
    setLastInitialBet(currentBet);
    setPhase('dealing');
    setInsuranceBet(0);

    let workingDeck = deck.length < 15 ? createDeck() : [...deck];

    // Card 1 to Player
    const p1 = { ...workingDeck[0], faceUp: true };
    workingDeck = workingDeck.slice(1);
    soundEngine.playCardSlide();

    // Card 1 to Dealer (Upcard)
    const d1 = { ...workingDeck[0], faceUp: true };
    workingDeck = workingDeck.slice(1);

    // Card 2 to Player
    const p2 = { ...workingDeck[0], faceUp: true };
    workingDeck = workingDeck.slice(1);

    // Card 2 to Dealer (Hole card: faceDown)
    const d2 = { ...workingDeck[0], faceUp: false };
    workingDeck = workingDeck.slice(1);

    setDeck(workingDeck);

    const initialPlayerHand: BlackjackHand = {
      id: 'hand-1',
      cards: [p1, p2],
      bet: currentBet,
      isStood: false,
      isDoubled: false,
      isSplit: false,
    };

    setPlayerHands([initialPlayerHand]);
    setDealerCards([d1, d2]);
    setActiveHandIndex(0);

    setTimeout(() => {
      const pVal = calculateHandValue([p1, p2]);
      const dUpVal = d1.rank;

      // Check insurance condition (Dealer upcard is Ace)
      if (dUpVal === 'A' && balance >= Math.floor(currentBet / 2)) {
        setPhase('insurance_prompt');
      } else if (pVal.isBlackjack) {
        // Player has natural Blackjack!
        handleRevealDealerAndResolve([initialPlayerHand], [d1, d2]);
      } else {
        setPhase('player_turn');
      }
    }, 600);
  };

  // Handle Insurance Acceptance or Decline
  const handleInsuranceChoice = (accept: boolean) => {
    if (accept) {
      const insCost = Math.floor(currentBet / 2);
      if (balance >= insCost) {
        placeBet(insCost);
        setInsuranceBet(insCost);
        soundEngine.playChipClick();
        showToast('info', 'Insurance Accepted', `$${insCost} placed on Insurance.`);
      }
    }

    // Check if dealer has natural blackjack
    const dFullVal = calculateHandValue([dealerCards[0], { ...dealerCards[1], faceUp: true }]);
    const pVal = calculateHandValue(playerHands[0].cards);

    if (dFullVal.isBlackjack || pVal.isBlackjack) {
      handleRevealDealerAndResolve(playerHands, dealerCards);
    } else {
      setPhase('player_turn');
    }
  };

  // Player Action: HIT
  const handleHit = () => {
    if (phase !== 'player_turn') return;
    const { card } = drawCard(true);
    soundEngine.playCardSlide();

    setPlayerHands((prev) => {
      const copy = [...prev];
      const curHand = copy[activeHandIndex];
      const updatedCards = [...curHand.cards, card];
      const handVal = calculateHandValue(updatedCards);

      copy[activeHandIndex] = {
        ...curHand,
        cards: updatedCards,
      };

      if (handVal.isBust) {
        copy[activeHandIndex].isStood = true;
        copy[activeHandIndex].outcome = 'bust';

        // Check if next split hand exists
        if (activeHandIndex < copy.length - 1) {
          setTimeout(() => setActiveHandIndex(activeHandIndex + 1), 500);
        } else {
          // All hands completed
          setTimeout(() => handleRevealDealerAndResolve(copy, dealerCards), 500);
        }
      } else if (handVal.total === 21) {
        // Auto stand on 21
        copy[activeHandIndex].isStood = true;
        if (activeHandIndex < copy.length - 1) {
          setTimeout(() => setActiveHandIndex(activeHandIndex + 1), 500);
        } else {
          setTimeout(() => handleRevealDealerAndResolve(copy, dealerCards), 500);
        }
      }

      return copy;
    });
  };

  // Player Action: STAND
  const handleStand = () => {
    if (phase !== 'player_turn') return;
    soundEngine.playButton();

    setPlayerHands((prev) => {
      const copy = [...prev];
      copy[activeHandIndex].isStood = true;

      if (activeHandIndex < copy.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
      } else {
        setTimeout(() => handleRevealDealerAndResolve(copy, dealerCards), 400);
      }
      return copy;
    });
  };

  // Player Action: DOUBLE DOWN
  const handleDoubleDown = () => {
    if (phase !== 'player_turn') return;
    const curHand = playerHands[activeHandIndex];
    if (curHand.cards.length !== 2) return;
    if (balance < curHand.bet) {
      showToast('error', 'Insufficient Funds', 'Cannot double down: insufficient demo balance.');
      return;
    }

    const success = placeBet(curHand.bet);
    if (!success) return;

    soundEngine.playChipStack();
    const { card } = drawCard(true);
    soundEngine.playCardSlide();

    setPlayerHands((prev) => {
      const copy = [...prev];
      const updatedCards = [...curHand.cards, card];
      copy[activeHandIndex] = {
        ...curHand,
        cards: updatedCards,
        bet: curHand.bet * 2,
        isDoubled: true,
        isStood: true,
      };

      if (activeHandIndex < copy.length - 1) {
        setTimeout(() => setActiveHandIndex(activeHandIndex + 1), 500);
      } else {
        setTimeout(() => handleRevealDealerAndResolve(copy, dealerCards), 600);
      }
      return copy;
    });
  };

  // Player Action: SPLIT
  const handleSplit = () => {
    if (phase !== 'player_turn') return;
    const curHand = playerHands[activeHandIndex];
    if (curHand.cards.length !== 2 || curHand.cards[0].rank !== curHand.cards[1].rank) return;
    if (balance < curHand.bet) {
      showToast('error', 'Insufficient Funds', 'Cannot split: insufficient demo balance for second hand.');
      return;
    }

    const success = placeBet(curHand.bet);
    if (!success) return;

    soundEngine.playChipStack();

    // Split cards into 2 hands and deal 1 card to each
    const { card: extra1 } = drawCard(true);
    const { card: extra2 } = drawCard(true);

    const hand1: BlackjackHand = {
      id: 'hand-1',
      cards: [curHand.cards[0], extra1],
      bet: curHand.bet,
      isStood: false,
      isDoubled: false,
      isSplit: true,
    };

    const hand2: BlackjackHand = {
      id: 'hand-2',
      cards: [curHand.cards[1], extra2],
      bet: curHand.bet,
      isStood: false,
      isDoubled: false,
      isSplit: true,
    };

    setPlayerHands([hand1, hand2]);
    setActiveHandIndex(0);
    showToast('info', 'Hand Split', 'Pair split into two active hands.');
  };

  // Dealer Turn & Resolution
  const handleRevealDealerAndResolve = (
    handsToResolve: BlackjackHand[],
    dCards: Card[]
  ) => {
    if (isResolvingRef.current) return;
    isResolvingRef.current = true;
    setPhase('dealer_turn');

    // Reveal hole card
    soundEngine.playCardFlip();
    const revealedDealer = dCards.map((c) => ({ ...c, faceUp: true }));
    setDealerCards(revealedDealer);

    // Check if all player hands busted
    const allBusted = handsToResolve.every((h) => calculateHandValue(h.cards).isBust);

    let curDCards = [...revealedDealer];
    let dVal = calculateHandValue(curDCards);

    // Dealer must draw to 16, stands on all 17s
    if (!allBusted) {
      while (dVal.total < 17) {
        const { card } = drawCard(true);
        curDCards.push(card);
        dVal = calculateHandValue(curDCards);
      }
    }

    setDealerCards(curDCards);

    // Final Payout Calculations
    setTimeout(() => {
      let roundTotalWinnings = 0;
      let totalWagered = handsToResolve.reduce((s, h) => s + h.bet, 0) + insuranceBet;
      let anyWin = false;
      let anyBlackjack = false;

      const finalHands = handsToResolve.map((hand) => {
        const pVal = calculateHandValue(hand.cards);
        let outcome: BlackjackHand['outcome'] = 'lost';
        let payout = 0;

        if (pVal.isBust) {
          outcome = 'bust';
          payout = 0;
        } else if (pVal.isBlackjack && !hand.isSplit) {
          if (dVal.isBlackjack) {
            outcome = 'push';
            payout = hand.bet; // return bet
          } else {
            outcome = 'blackjack';
            payout = hand.bet * 2.5; // 3:2 payout (returns 2.5x original bet)
            anyWin = true;
            anyBlackjack = true;
          }
        } else if (dVal.isBust) {
          outcome = 'won';
          payout = hand.bet * 2;
          anyWin = true;
        } else if (pVal.total > dVal.total) {
          outcome = 'won';
          payout = hand.bet * 2;
          anyWin = true;
        } else if (pVal.total === dVal.total) {
          outcome = 'push';
          payout = hand.bet;
        } else {
          outcome = 'lost';
          payout = 0;
        }

        roundTotalWinnings += payout;
        return { ...hand, outcome, payout };
      });

      // Handle Insurance Payout
      if (insuranceBet > 0 && dVal.isBlackjack) {
        const insPayout = insuranceBet * 3; // 2:1 profit + stake
        roundTotalWinnings += insPayout;
      }

      setPlayerHands(finalHands);

      // Record in casino ledger
      const summaryText = finalHands
        .map((h) => `${h.outcome?.toUpperCase()} ($${h.payout || 0})`)
        .join(', ');

      awardPayout('blackjack', totalWagered, roundTotalWinnings, `Blackjack: ${summaryText}`);

      // Single popup notification for the round outcome
      if (anyBlackjack) {
        soundEngine.playBigWin();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#10b981'],
          });
        } catch {
          // Ignore
        }
        showToast('jackpot', 'NATURAL BLACKJACK (3:2)', `Royal payout of $${roundTotalWinnings.toLocaleString()}!`);
      } else if (anyWin) {
        soundEngine.playWinChime();
        showToast('win', 'Hand Won!', `You collected $${roundTotalWinnings.toLocaleString()}!`);
      } else if (insuranceBet > 0 && dVal.isBlackjack) {
        soundEngine.playWinChime();
        showToast('win', 'Insurance Won!', `Insurance bet paid 2:1 (+$${insuranceBet * 3}).`);
      }

      setPhase('round_over');
    }, 700);
  };

  // Rebet and deal next hand
  const handleRebet = () => {
    isResolvingRef.current = false;
    if (balance < lastInitialBet) {
      showToast('error', 'Insufficient Funds', 'Cannot rebet: insufficient demo balance.');
      return;
    }
    const success = placeBet(lastInitialBet);
    if (!success) return;

    setCurrentBet(lastInitialBet);
    setPhase('betting');
    setPlayerHands([]);
    setDealerCards([]);
  };

  const handleNewRound = () => {
    isResolvingRef.current = false;
    setPhase('betting');
    setCurrentBet(0);
    setPlayerHands([]);
    setDealerCards([]);
  };

  const activeHand = playerHands[activeHandIndex];
  const canSplit =
    phase === 'player_turn' &&
    activeHand?.cards.length === 2 &&
    activeHand.cards[0].rank === activeHand.cards[1].rank &&
    playerHands.length === 1 &&
    balance >= activeHand.bet;

  const canDouble =
    phase === 'player_turn' &&
    activeHand?.cards.length === 2 &&
    balance >= activeHand.bet;

  const dealerValue = calculateHandValue(dealerCards);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#171a22] to-[#0f1116] border border-[#c5a059]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d2d] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#12141a] rounded-[10px] flex items-center justify-center font-cinzel font-black text-[#f4e0a5]">
              21
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-white tracking-wider flex items-center gap-2">
              <span>VIP MONTE CARLO BLACKJACK</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#f4e0a5] border border-[#c5a059]/40 font-normal">
                Pays 3:2
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Vegas Strip rules • Dealer stands on all 17s • Double Down & Pairs Split permitted
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRulesOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14161f] border border-white/10 hover:border-[#c5a059]/50 text-xs text-gray-300 hover:text-white transition-all cursor-pointer font-cinzel"
        >
          <HelpCircle className="w-4 h-4 text-[#c5a059]" />
          <span>Rules & Payouts</span>
        </button>
      </div>

      {/* Main Velvet Blackjack Table */}
      <div className="relative rounded-3xl p-6 sm:p-10 felt-green-surface border-4 border-[#c5a059]/50 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden min-h-[520px] flex flex-col justify-between">
        {/* Felt Gold Arc Markings */}
        <div className="absolute inset-4 rounded-2xl border border-[#d4af37]/30 pointer-events-none" />

        {/* Traditional Table Paytable Inscription */}
        <div className="text-center font-cinzel text-[#d4af37]/75 space-y-1 select-none pointer-events-none mb-6">
          <div className="text-sm sm:text-lg font-bold tracking-[0.25em] drop-shadow">
            BLACKJACK PAYS 3 TO 2
          </div>
          <div className="text-[10px] sm:text-xs tracking-[0.2em] text-[#e2c176]/65 font-medium">
            DEALER MUST DRAW TO 16 AND STAND ON ALL 17s • INSURANCE PAYS 2 TO 1
          </div>
        </div>

        {/* Dealer Zone (Top Center) */}
        <div className="flex flex-col items-center justify-center space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-cinzel uppercase tracking-widest text-[#f4e0a5] font-semibold">
              Dealer Hand
            </span>
            {dealerCards.length > 0 && dealerCards.some((c) => c.faceUp) && (
              <span className="text-xs font-mono-num font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-[#c5a059]/40">
                {dealerValue.total} {dealerValue.isSoft ? '(Soft)' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-28">
            {dealerCards.length === 0 ? (
              <div className="w-20 h-28 rounded-lg border-2 border-dashed border-[#c5a059]/30 flex items-center justify-center text-xs text-[#c5a059]/40 font-cinzel">
                Shoe
              </div>
            ) : (
              dealerCards.map((card) => (
                <PlayingCard key={card.id} card={card} />
              ))
            )}
          </div>
        </div>

        {/* Insurance Prompt Banner (When Dealer shows Ace) */}
        {phase === 'insurance_prompt' && (
          <div className="my-4 p-4 rounded-2xl bg-black/85 border border-[#e2c176] shadow-[0_0_30px_rgba(212,175,55,0.3)] max-w-md mx-auto text-center space-y-3 z-20 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-[#fef08a] font-cinzel font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Dealer shows Ace: Insurance Offered</span>
            </div>
            <p className="text-xs text-gray-300">
              Insurance wager costs ${Math.floor(currentBet / 2)} (half your bet) and pays 2:1 if Dealer has Blackjack.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleInsuranceChoice(false)}
                className="py-2 px-5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-cinzel font-bold cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={() => handleInsuranceChoice(true)}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black text-xs font-cinzel font-bold hover:brightness-110 cursor-pointer shadow"
              >
                Buy Insurance (${Math.floor(currentBet / 2)})
              </button>
            </div>
          </div>
        )}

        {/* Player Hands Zone (Bottom Center) */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mt-4 z-10">
          {playerHands.length === 0 ? (
            /* Empty Betting Circle */
            <div
              onClick={handleAddBet}
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-[#c5a059]/60 bg-black/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:border-[#c5a059] shadow-inner ${
                currentBet > 0 ? 'border-solid border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)]' : ''
              }`}
            >
              {currentBet === 0 ? (
                <div className="text-center p-2">
                  <span className="text-[11px] font-cinzel font-bold text-[#f4e0a5] block leading-tight">
                    PLACE BET
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    Click to add chip
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <CasinoChip value={selectedChip} size="sm" count={Math.ceil(currentBet / selectedChip)} />
                  <span className="text-xs font-mono-num font-bold text-[#f4e0a5] mt-1.5 bg-black/75 px-2 py-0.5 rounded-full border border-[#c5a059]/40">
                    ${currentBet}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Active Player Hand(s) */
            playerHands.map((hand, idx) => {
              const hVal = calculateHandValue(hand.cards);
              const isActive = phase === 'player_turn' && activeHandIndex === idx;

              return (
                <div
                  key={hand.id}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-black/40 border border-[#c5a059] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105'
                      : 'bg-black/20 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-cinzel uppercase tracking-wider text-[#f4e0a5]">
                      {playerHands.length > 1 ? `Hand ${idx + 1}` : 'Player Hand'}
                    </span>
                    <span
                      className={`text-xs font-mono-num font-bold px-2 py-0.5 rounded-full border ${
                        hVal.isBust
                          ? 'bg-rose-900/80 text-rose-200 border-rose-500'
                          : hVal.isBlackjack
                          ? 'bg-amber-900/80 text-[#fef08a] border-[#e2c176]'
                          : 'bg-black/60 text-white border-[#c5a059]/40'
                      }`}
                    >
                      {hVal.isBust ? 'BUST' : hVal.isBlackjack ? '21 (BJ)' : `${hVal.total} ${hVal.isSoft ? '(Soft)' : ''}`}
                    </span>
                  </div>

                  {/* Overlapping Cards */}
                  <div className="flex items-center justify-center -space-x-8 sm:-space-x-10 min-h-28">
                    {hand.cards.map((card) => (
                      <PlayingCard key={card.id} card={card} />
                    ))}
                  </div>

                  {/* Hand Bet Indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono-num font-semibold">
                    <span className="text-[10px] uppercase font-cinzel text-gray-400">Bet:</span>
                    <span className="text-[#e2c176]">${hand.bet}</span>
                    {hand.isDoubled && (
                      <span className="text-[9px] px-1 rounded bg-[#c5a059]/20 text-[#f4e0a5] border border-[#c5a059]/40">
                        2X
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Console */}
      <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-2xl bg-[#12141c]/95 backdrop-blur-md border border-[#c5a059]/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        {/* Chips Tray (Available in betting phase) */}
        <ChipSelector disabled={phase !== 'betting'} />

        {/* Game Phase Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {phase === 'betting' ? (
            <>
              {currentBet > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleDoubleBet}
                    className="py-2.5 px-3 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-white/10 text-xs font-cinzel font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                  >
                    2X Bet
                  </button>
                  <button
                    type="button"
                    onClick={handleClearBet}
                    className="py-2.5 px-3 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-white/10 text-xs font-cinzel font-semibold text-rose-300 hover:text-rose-200 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={currentBet === 0}
                onClick={handleDeal}
                className={`py-2.5 px-6 sm:px-8 rounded-xl font-bold font-cinzel text-xs sm:text-sm tracking-widest text-black uppercase transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer ${
                  currentBet === 0
                    ? 'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-98 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>DEAL HAND</span>
              </button>
            </>
          ) : phase === 'player_turn' ? (
            <>
              {canSplit && (
                <button
                  type="button"
                  onClick={handleSplit}
                  className="py-2.5 px-4 rounded-xl bg-[#1e2330] hover:bg-[#293042] border border-[#c5a059]/40 text-xs font-cinzel font-bold text-[#f4e0a5] transition-all cursor-pointer shadow flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>SPLIT</span>
                </button>
              )}

              {canDouble && (
                <button
                  type="button"
                  onClick={handleDoubleDown}
                  className="py-2.5 px-4 rounded-xl bg-[#1e2330] hover:bg-[#293042] border border-[#c5a059]/40 text-xs font-cinzel font-bold text-[#f4e0a5] transition-all cursor-pointer shadow flex items-center gap-1.5"
                >
                  <span>DOUBLE</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleHit}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                HIT
              </button>

              <button
                type="button"
                onClick={handleStand}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:brightness-110 text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                STAND
              </button>
            </>
          ) : phase === 'round_over' ? (
            <>
              {lastInitialBet > 0 && (
                <button
                  type="button"
                  onClick={handleRebet}
                  className="py-2.5 px-4 rounded-xl bg-[#181a24] hover:bg-[#222533] border border-[#c5a059]/40 text-xs font-cinzel font-semibold text-[#f4e0a5] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REBET (${lastInitialBet})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNewRound}
                className="py-2.5 px-6 sm:px-8 rounded-xl font-bold font-cinzel text-xs sm:text-sm tracking-widest text-black uppercase transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer bg-gradient-to-r from-[#fef08a] via-[#e2c176] to-[#c5a059] hover:brightness-110 active:scale-98 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>NEW HAND</span>
              </button>
            </>
          ) : (
            <div className="text-xs font-cinzel text-gray-400 py-2.5 px-4">
              Dealing cards...
            </div>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      <BlackjackRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};
