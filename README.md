# CASINO PRIVÉ | High-Roller Monte Carlo Suite

A premium frontend-only React casino demo website crafted with a sophisticated black-and-gold aesthetic, realistic game interfaces, smooth physical animations, and pure Web Audio soundscapes.

> **DEMO ONLY**: 100% simulated fake-money platform. No backend, no real deposits, no real-money gambling.

---

## ⚜️ Highlights & Architectural Features

### 1. Aesthetic & Design System
- **Obsidian & 24K Gold Theme**: Matte black surfaces , brushed brass and gold borders, and rich velvet surfaces.
- **Bespoke Typography**: Luxury serif fonts paired with crisp tabular numerals and modern clean UI sans-serif.
- **Physical Feel**: Avoids generic neon/purple gradients, bubbly cartoon shapes, and visual clutter, delivering an authentic Monte Carlo VIP salon atmosphere.

### 2. Physical Web Audio Synthesis Engine
- Built entirely on the **Web Audio API** — **zero external audio file dependencies** and **zero 404 missing audio errors**.
- Tactile ceramic chip clicks & stacking sounds.
- Felt card slide and 3D card flip effects.
- Mechanical slot reel whirrs, staggered stopping thuds, and winning gold arpeggio chimes.
- European roulette ball rattling across pocket frets and decelerating into the winning pocket.
- Master volume slider and instant mute toggle with persistent state in `localStorage`.

### 3. European Roulette (Single Zero)
- Authentic **37-pocket European sequence** (pockets 0 to 36) with a 2.70% house edge.
- Smooth SVG/Canvas wheel with counter-rotating gold ball and realistic deceleration physics.
- Full interactive felt betting table:
  - **Inside Bets**: Straight numbers (0-36) paying **35:1**.
  - **Outside Bets**: Red/Black, Even/Odd, 1-18 (Low) / 19-36 (High) paying **1:1**.
  - **Dozens & Columns**: 1st 12, 2nd 12, 3rd 12, and 2:1 column bets.
- Placed chip stacks showing exact amount on each cell.
- Quick actions: **2X Double Bets**, **Clear Table**, and **Rebet Previous Round**.
- Winning pocket announcement spotlight and recent numbers ribbon.
- Interactive **Rules & Paytable Modal**.

### 4. VIP Blackjack (Vegas Strip / Monte Carlo Rules)
- 4-deck balanced shoe with realistic shuffle and dealing animations.
- **Natural Blackjack** pays **3:2**.
- **Dealer Rules**: Draws to 16, stands on all 17s (S17 rule).
- Complete player actions:
  - **Hit**: Draw additional cards with auto soft/hard Ace calculation (e.g. "Soft 17" vs "Hard 17").
  - **Stand**: Conclude hand.
  - **Double Down**: Double original stake on initial 2 cards, receive exactly one card, and stand.
  - **Pairs Split**: When dealt matching cards, split into Hand 1 and Hand 2, each played independently.
  - **Insurance**: Offered when dealer upcard is an Ace (costs half initial bet, pays 2:1 if dealer has Blackjack).
- Golden celebratory confetti on natural blackjacks.
- Interactive **Rules & Paytable Modal**.

### 5. Aurum Royale Slots (5-Reel 20-Payline)
- 5 reels x 3 rows luxury video slot machine.
- **20 Fixed Paylines** with SVG animated payline tracing overlay highlighting winning combinations.
- Variable bet per line ($1, $2, $5, $10, $25, $50) and **MAX BET** button.
- **Wild Lion Crest**: Substitutes for any regular symbol; 5 Wilds pay **1,500x line bet**.
- **Scatter Jewels & Free Spins**: 3 or more Scatters trigger **10 Free Spins with a 3X Win Multiplier**.
- Staggered reel deceleration with mechanical stopping sounds.
- **Auto Spin** mode (10 spins).
- Interactive **Paytable Modal** with visual payline diagrams.

### 6. Demo Bankroll & Session Analytics
- Starts with **$10,000 complimentary demo funds** (saved automatically in `localStorage`).
- **Instant Vault Reload**: Replenish demo funds ($1k, $5k, $10k, $25k, $50k) at any time.
- **Executive Analytics Dashboard**:
  - Live Net Profit / Loss with colored profit indicators.
  - Win Rate %, Total Wagered, Total Won, Biggest Win.
  - Salon activity breakdown across Roulette, Blackjack, and Slots.
  - Complete 50-entry **Wager Ledger** with timestamps, game details, and profit/loss.
  - One-click session reset.

---

## 🛠️ Technology Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Web Audio API** (Hardware-accelerated sound synthesizer)
- **Lucide React** (Crisp vector iconography)
- **Canvas Confetti** (High-roller celebration animations)
