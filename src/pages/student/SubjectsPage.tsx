import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  ArrowRight,
  Sparkles,
  FileText,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';

export const SubjectsPage: React.FC = () => {
  const { subjects, refreshAll, showToast } = useData();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setAdding(true);
    try {
      await api.createSubject({
        name,
        code: code || 'CS-NEW',
        description,
        semester: '6th Semester',
        credits: 4,
        topics: ['Unit 1: Fundamentals', 'Unit 2: Core Architectures', 'Unit 3: Advanced Optimization'],
      });
      showToast(`Subject "${name}" added!`, 'success');
      setShowAddModal(false);
      setName('');
      setCode('');
      setDescription('');
      refreshAll();
    } catch (err) {
      console.error(err);
      showToast('Error adding subject', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-[#6D4CFF]" />
            <span>Curriculum & Academic Subjects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enrolled course subjects with topic roadmaps, generated notes, and test coverage.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subj) => (
          <div
            key={subj.id}
            className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                  {subj.code}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {subj.credits} Credits • {subj.semester}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {subj.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {subj.description}
              </p>

              {/* Topics preview */}
              {subj.topics && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1A2359]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Syllabus Topics:
                  </p>
                  <div className="space-y-1">
                    {subj.topics.slice(0, 3).map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shrink-0" />
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-[#1A2359] flex items-center justify-between">
              <button
                onClick={() => navigate(`/notes`)}
                className="text-xs font-semibold text-[#6D4CFF] dark:text-[#00D9FF] hover:underline flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>

              <button
                onClick={() => navigate(`/quizzes`)}
                className="text-xs font-semibold text-amber-500 hover:underline flex items-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quizzes</span>
              </button>

              <button
                onClick={() => navigate(`/ai-tutor`)}
                className="px-3 py-1.5 rounded-xl bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF] text-xs font-bold hover:bg-[#6D4CFF] hover:text-white transition-colors"
              >
                Ask Tutor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Academic Subject
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Cloud Computing"
                  className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS-605"
                  className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief curriculum description..."
                  className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={adding || !name.trim()}
                className="w-full py-3 px-4 rounded-xl bg-[#6D4CFF] text-white font-bold text-sm shadow-md hover:bg-[#5B3CE6] transition-colors disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Save Subject to Portfolio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
