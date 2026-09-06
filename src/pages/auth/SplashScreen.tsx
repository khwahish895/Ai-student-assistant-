import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, BrainCircuit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { hasCompletedOnboarding, setHasSeenSplash } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasSeenSplash(true);
      if (!hasCompletedOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/login');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, navigate, setHasSeenSplash]);

  const handleSkip = () => {
    setHasSeenSplash(true);
    if (!hasCompletedOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#030B2C] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background glowing gradients & particle effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6D4CFF]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#00D9FF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Animated AI Icon with Glow */}
        <div className="relative mb-8">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#6D4CFF] via-[#00D9FF] to-[#6D4CFF] opacity-75 blur-md animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-2xl bg-[#07123F] border border-[#00D9FF]/40 p-4 shadow-2xl flex items-center justify-center">
            <BrainCircuit className="w-12 h-12 text-[#00D9FF] animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          AI STUDENT <span className="text-[#00D9FF]">ASSISTANT</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg text-slate-300 font-medium mb-8">
          Learn Smarter. Study Better.
        </p>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-[#0B1033] rounded-full overflow-hidden mb-6 border border-[#1A2359]">
          <div className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] rounded-full animate-[pulse_1.5s_infinite]" style={{ width: '100%' }}></div>
        </div>

        <p className="text-xs text-slate-400">
          Initializing intelligent learning core...
        </p>

        <button
          onClick={handleSkip}
          className="mt-8 text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors underline"
        >
          <span>Skip to app</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
