import React from 'react';
import { CasinoProvider, useCasino } from './context/CasinoContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { ReloadModal } from './components/common/ReloadModal';
import { StatsModal } from './components/common/StatsModal';
import { Lobby } from './components/lobby/Lobby';
import { RouletteGame } from './components/roulette/RouletteGame';
import { BlackjackGame } from './components/blackjack/BlackjackGame';
import { SlotsGame } from './components/slots/SlotsGame';

const CasinoAppContent: React.FC = () => {
  const { activeGame } = useCasino();

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c] text-[#e0e2ec]">
      {/* Top Header */}
      <Header />

      {/* Main Dynamic Game Salon */}
      <main className="flex-1">
        {activeGame === 'lobby' && <Lobby />}
        {activeGame === 'roulette' && <RouletteGame />}
        {activeGame === 'blackjack' && <BlackjackGame />}
        {activeGame === 'slots' && <SlotsGame />}
      </main>

      {/* Footer & Responsible Gaming Disclaimers */}
      <Footer />

      {/* Global Interactive Modals & Toast Manager */}
      <ReloadModal />
      <StatsModal />
      <NotificationToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CasinoProvider>
      <CasinoAppContent />
    </CasinoProvider>
  );
};

export default App;
