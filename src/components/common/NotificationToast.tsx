import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { Trophy, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useCasino();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        let borderClass = 'border-white/10';
        let bgGlow = 'rgba(255, 255, 255, 0.05)';

        if (toast.type === 'win') {
          icon = <Trophy className="w-5 h-5 text-[#facc15] shrink-0" />;
          borderClass = 'border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.25)]';
          bgGlow = 'rgba(212, 175, 55, 0.12)';
        } else if (toast.type === 'jackpot') {
          icon = <Sparkles className="w-5 h-5 text-[#fef08a] shrink-0 animate-bounce" />;
          borderClass = 'border-[#fde047] shadow-[0_0_30px_rgba(254,240,138,0.4)]';
          bgGlow = 'rgba(234, 179, 8, 0.2)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
          bgGlow = 'rgba(225, 29, 72, 0.1)';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl bg-[#12141a]/95 backdrop-blur-md border ${borderClass} transition-all duration-300 transform translate-y-0`}
            style={{ backgroundColor: bgGlow }}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white font-cinzel tracking-wide">
                {toast.title}
              </h4>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed font-sans">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
