import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';

export const FloatingAIButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show if already on AI Tutor page
  if (location.pathname === '/ai-tutor') return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 md:right-8 z-40 group">
      <button
        onClick={() => navigate('/ai-tutor')}
        className="relative flex items-center justify-center w-13 h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#6D4CFF] via-[#5B3CE6] to-[#00D9FF] text-white shadow-xl shadow-[#6D4CFF]/40 hover:scale-110 hover:shadow-2xl hover:shadow-[#00D9FF]/50 active:scale-95 transition-all duration-300"
        title="Ask AI Student Assistant"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00D9FF]"></span>
        </span>
        <Bot className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Hover tooltip for desktop */}
      <div className="hidden md:group-hover:flex absolute right-16 top-2 items-center bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none border border-slate-700">
        <Sparkles className="w-3.5 h-3.5 text-[#00D9FF] mr-1.5" />
        <span>Ask AI Tutor Anything</span>
      </div>
    </div>
  );
};
