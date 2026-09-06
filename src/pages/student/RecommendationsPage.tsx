import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  HelpCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const RecommendationsPage: React.FC = () => {
  const { recommendations } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <Target className="w-6 h-6 text-[#6D4CFF]" />
          <span>AI Adaptive Recommendations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Dynamic learning pathways tailored to address your weak topics and maximize exam retention.
        </p>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] hover:border-[#6D4CFF] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                  {rec.subject}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.priority === 'high'
                      ? 'bg-rose-500/10 text-rose-500'
                      : rec.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {rec.priority.toUpperCase()} PRIORITY
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {rec.title}
              </h3>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-100 dark:border-[#1A2359] text-xs text-slate-600 dark:text-slate-300 mb-4">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Why AI recommends this: </span>
                {rec.reason}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1A2359] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Estimated: ~15 mins</span>
              <button
                onClick={() => navigate(rec.actionLink)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center space-x-1.5"
              >
                <span>Take Recommended Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
