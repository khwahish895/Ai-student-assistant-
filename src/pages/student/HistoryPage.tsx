import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Bot,
  FileText,
  FileSpreadsheet,
  HelpCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const HistoryPage: React.FC = () => {
  const { history } = useData();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filtered = history.filter((item) => {
    const matchesType = filterType === 'all' || item.activityType === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-[#00D9FF]" />
            <span>Academic Study History & Audit Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete chronological record of all AI sessions, quiz attempts, and generated notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'ai_question', label: 'AI Tutor Queries' },
            { id: 'quiz_taken', label: 'Quiz Submissions' },
            { id: 'note_generated', label: 'Notes Created' },
            { id: 'pdf_summarized', label: 'PDF Summaries' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === btn.id
                  ? 'bg-[#6D4CFF] text-white shadow-md'
                  : 'bg-white dark:bg-[#07123F] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1A2359]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search study history..."
            className="w-full bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF]"
          />
        </div>
      </div>

      {/* Timeline List */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No history entries found matching criteria.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-[#1A2359] ml-4 sm:ml-6 space-y-6">
            {filtered.map((item) => {
              let Icon = Bot;
              let iconBg = 'bg-blue-500';
              if (item.activityType === 'quiz_taken') {
                Icon = HelpCircle;
                iconBg = 'bg-amber-500';
              } else if (item.activityType === 'note_generated') {
                Icon = FileText;
                iconBg = 'bg-purple-500';
              } else if (item.activityType === 'pdf_summarized') {
                Icon = FileSpreadsheet;
                iconBg = 'bg-emerald-500';
              }

              return (
                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-3 top-1 w-6 h-6 rounded-full ${iconBg} text-white flex items-center justify-center ring-4 ring-white dark:ring-[#07123F] shadow-sm`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1A2359] text-slate-700 dark:text-slate-300">
                          {item.subjectName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {item.score !== undefined && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400">
                          Score: {item.score}%
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (item.activityType === 'quiz_taken') navigate('/quizzes');
                          else if (item.activityType === 'note_generated') navigate('/notes');
                          else if (item.activityType === 'pdf_summarized') navigate('/documents');
                          else navigate('/ai-tutor');
                        }}
                        className="text-xs font-semibold text-[#6D4CFF] dark:text-[#00D9FF] hover:underline flex items-center space-x-1"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
