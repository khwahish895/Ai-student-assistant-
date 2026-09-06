import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FileText, HelpCircle, File, ArrowRight } from 'lucide-react';
import * as api from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    subjects: any[];
    notes: any[];
    quizzes: any[];
    documents: any[];
  }>({ subjects: [], notes: [], quizzes: [], documents: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ subjects: [], notes: [], quizzes: [], documents: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ subjects: [], notes: [], quizzes: [], documents: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query);
        if (res?.results) {
          setResults(res.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.subjects.length + results.notes.length + results.quizzes.length + results.documents.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-[#1A2359]">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, study notes, quizzes, documents..."
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {loading && (
            <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-[#6D4CFF] border-t-transparent rounded-full animate-spin"></span>
              <span>Searching academic library...</span>
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Trees", "Deadlock", "TCP", or "Database"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300">Quick Academic Search</p>
              <p className="text-xs mt-1">Type keywords like Operating Systems, Binary Trees, SQL, or Quizzes</p>
            </div>
          )}

          {/* Subjects */}
          {results.subjects.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#6D4CFF]" />
                Subjects ({results.subjects.length})
              </div>
              <div className="space-y-1">
                {results.subjects.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelect(`/subjects/${s.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1033] cursor-pointer group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#6D4CFF] dark:group-hover:text-[#00D9FF]">
                        {s.name} <span className="text-xs font-normal text-slate-400">({s.code})</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{s.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-[#00D9FF]" />
                Study Notes ({results.notes.length})
              </div>
              <div className="space-y-1">
                {results.notes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect(`/notes?id=${n.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1033] cursor-pointer group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#6D4CFF] dark:group-hover:text-[#00D9FF]">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {n.subjectName} • {n.difficulty} • {n.style}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {results.quizzes.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Quizzes ({results.quizzes.length})
              </div>
              <div className="space-y-1">
                {results.quizzes.map((qz) => (
                  <div
                    key={qz.id}
                    onClick={() => handleSelect(`/quizzes?id=${qz.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1033] cursor-pointer group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#6D4CFF] dark:group-hover:text-[#00D9FF]">
                        {qz.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {qz.subjectName} • {qz.totalQuestions} Questions • {qz.difficulty}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {results.documents.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <File className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                PDF Documents ({results.documents.length})
              </div>
              <div className="space-y-1">
                {results.documents.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect(`/documents?id=${d.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1033] cursor-pointer group transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#6D4CFF] dark:group-hover:text-[#00D9FF]">
                        {d.filename}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{d.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
