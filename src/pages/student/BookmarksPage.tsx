import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Bot,
  FileText,
  FileSpreadsheet,
  HelpCircle,
  Search,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const BookmarksPage: React.FC = () => {
  const { bookmarks, toggleBookmark } = useData();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesType = filterType === 'all' || b.contentType === filterType;
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.snippet && b.snippet.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>Saved Bookmarks & AI Answers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Easily review critical AI responses, definitions, and study notes you've saved.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type pills */}
        <div className="flex items-center flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Saved' },
            { id: 'ai_answer', label: 'AI Responses' },
            { id: 'note', label: 'Study Notes' },
            { id: 'pdf_summary', label: 'PDF Summaries' },
            { id: 'quiz', label: 'Quiz Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === tab.id
                  ? 'bg-[#6D4CFF] text-white shadow-md shadow-[#6D4CFF]/20'
                  : 'bg-white dark:bg-[#07123F] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1A2359] hover:border-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved bookmarks..."
            className="w-full bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF]"
          />
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-12 text-center text-slate-400 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359]">
          <Bookmark className="w-12 h-12 mx-auto mb-3 text-slate-400 stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Bookmarks Found</h3>
          <p className="text-xs max-w-sm mx-auto mt-1">
            Tap the bookmark icon on any AI Tutor explanation, note, or document to save it here for quick reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] hover:border-[#6D4CFF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                    {bm.subjectName || 'Academic Reference'}
                  </span>
                  <button
                    onClick={() => toggleBookmark(bm.contentType, bm.contentId, bm.title)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  {bm.title}
                </h3>
                {bm.snippet && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {bm.snippet}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1A2359] flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {new Date(bm.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    if (bm.contentType === 'note') navigate('/notes');
                    else if (bm.contentType === 'pdf_summary') navigate('/documents');
                    else if (bm.contentType === 'quiz') navigate('/quizzes');
                    else navigate('/ai-tutor');
                  }}
                  className="text-xs font-bold text-[#6D4CFF] dark:text-[#00D9FF] hover:underline flex items-center space-x-1"
                >
                  <span>Open Item</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
