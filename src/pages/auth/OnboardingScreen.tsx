import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, FileSpreadsheet, Target, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setHasCompletedOnboarding } = useAuth();

  const screens = [
    {
      title: 'Learn with AI',
      description: 'Ask questions and receive instant AI-powered explanations with real-world analogies, clean diagrams, and working code examples.',
      icon: Bot,
      color: 'from-[#6D4CFF] to-indigo-600',
      tag: 'AI TUTOR ENGINE',
      badge: 'Step 1 of 3',
      illustration: (
        <div className="relative w-64 h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-[#6D4CFF]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-[#07123F] border border-[#1A2359] rounded-2xl p-5 shadow-2xl w-full max-w-xs text-left">
            <div className="flex items-center space-x-2.5 mb-3 border-b border-[#1A2359] pb-2">
              <div className="w-7 h-7 rounded-lg bg-[#6D4CFF] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">AI Academic Tutor</span>
                <p className="text-[10px] text-emerald-400">Online & Ready</p>
              </div>
            </div>
            <div className="bg-[#0B1033] p-2.5 rounded-xl text-xs text-slate-300 mb-2 border border-[#1A2359]/60">
              "Explain deadlock conditions simply."
            </div>
            <div className="bg-[#6D4CFF]/15 p-2.5 rounded-xl text-xs text-[#00D9FF] border border-[#6D4CFF]/30">
              "Deadlock happens when 4 Coffman conditions hold: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait..."
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Turn Study Material into Knowledge',
      description: 'Upload lecture PDFs, textbooks, or notes to instantly generate key points, term definitions, exam summaries, and test questions.',
      icon: FileSpreadsheet,
      color: 'from-cyan-500 to-[#6D4CFF]',
      tag: 'DOCUMENT INTELLIGENCE',
      badge: 'Step 2 of 3',
      illustration: (
        <div className="relative w-64 h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-[#00D9FF]/20 rounded-full blur-2xl"></div>
          <div className="relative bg-[#07123F] border border-[#1A2359] rounded-2xl p-5 shadow-2xl w-full max-w-xs text-left">
            <div className="flex items-center justify-between mb-3 border-b border-[#1A2359] pb-2">
              <span className="text-xs font-bold text-white">Transport_Layer_Guide.pdf</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">100% Parsed</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></div>
                <span>TCP 3-Way Handshake (SYN, SYN-ACK, ACK)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></div>
                <span>Flow vs Congestion Control Algorithms</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></div>
                <span>5 High-Probability Exam Questions Extracted</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Personalized Learning & Masterplans',
      description: 'Get AI-generated quizzes, study plans prioritizing weak subjects, intelligent revision recommendations, and real-time progress analytics.',
      icon: Target,
      color: 'from-[#6D4CFF] to-fuchsia-600',
      tag: 'ADAPTIVE MASTERY',
      badge: 'Step 3 of 3',
      illustration: (
        <div className="relative w-64 h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-2xl"></div>
          <div className="relative bg-[#07123F] border border-[#1A2359] rounded-2xl p-5 shadow-2xl w-full max-w-xs text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Recommended Priority</span>
              <span className="text-xs text-[#00D9FF] font-bold">80% Accuracy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B1033] border border-[#1A2359] mb-2">
              <p className="text-xs font-semibold text-white">Revise Operating Systems</p>
              <p className="text-[10px] text-slate-400">Recent quiz had weak area in Semaphore synchronization.</p>
            </div>
            <div className="h-2 bg-[#0B1033] rounded-full overflow-hidden border border-[#1A2359]">
              <div className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    navigate('/login');
  };

  const current = screens[currentStep];

  return (
    <div className="min-h-screen bg-[#030B2C] text-white flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Header with Skip button */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#00D9FF]" />
          <span className="text-sm font-extrabold tracking-tight">AI STUDENT ASSISTANT</span>
        </div>
        <button
          onClick={handleFinish}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Skip to Login
        </button>
      </div>

      {/* Main card */}
      <div className="max-w-xl w-full mx-auto my-auto text-center py-6">
        {/* Step Badge */}
        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-[#07123F] border border-[#1A2359] text-[#00D9FF] mb-6">
          <span>{current.tag}</span>
          <span>•</span>
          <span className="text-slate-400">{current.badge}</span>
        </div>

        {/* Dynamic Graphic Illustration */}
        <div className="mb-8">{current.illustration}</div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
          {current.title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          {current.description}
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-[#00D9FF]' : 'w-2 bg-[#1A2359]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between max-w-xl w-full mx-auto">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-[#1A2359] text-slate-300 hover:text-white hover:bg-[#07123F] text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < screens.length - 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white hover:shadow-lg hover:shadow-[#6D4CFF]/30 text-sm font-semibold transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center space-x-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] via-[#5B3CE6] to-[#00D9FF] text-white hover:shadow-xl hover:shadow-[#00D9FF]/30 text-sm font-bold transition-all"
          >
            <span>Get Started</span>
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
