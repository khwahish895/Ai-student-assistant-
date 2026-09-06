import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TeacherAssignmentsPage: React.FC = () => {
  const { showToast } = useData();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [dueDate, setDueDate] = useState('2026-04-20');
  const [description, setDescription] = useState('');

  const [assignments, setAssignments] = useState([
    {
      id: 'a1',
      title: 'Lab 3: Implementing Banker\'s Deadlock Avoidance in C++',
      subject: 'Operating Systems',
      dueDate: '2026-04-18',
      submissions: 34,
      totalStudents: 42,
      status: 'Open',
    },
    {
      id: 'a2',
      title: 'Assignment 4: SQL Query Optimization & B+ Tree Index Analysis',
      subject: 'Database Management Systems',
      dueDate: '2026-04-22',
      submissions: 40,
      totalStudents: 42,
      status: 'Open',
    },
    {
      id: 'a3',
      title: 'Term Project: Distributed Key-Value Store with Raft Consensus',
      subject: 'Computer Networks',
      dueDate: '2026-05-10',
      submissions: 12,
      totalStudents: 38,
      status: 'In Progress',
    },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setAssignments([
      ...assignments,
      {
        id: `a-${Date.now()}`,
        title,
        subject,
        dueDate,
        submissions: 0,
        totalStudents: 42,
        status: 'Open',
      },
    ]);

    showToast('Assignment published to enrolled students', 'success');
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#6D4CFF]" />
            <span>Course Assignments & Lab Exercises</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish coursework deliverables, monitor completion rates, and use AI to evaluate code or essay submissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((asgn) => {
          const submissionPct = Math.round((asgn.submissions / asgn.totalStudents) * 100);

          return (
            <div
              key={asgn.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs hover:border-[#6D4CFF] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                    {asgn.subject}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {asgn.dueDate}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {asgn.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {asgn.submissions} of {asgn.totalStudents} submitted ({submissionPct}%)
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-32 hidden sm:block">
                  <div className="h-2 bg-slate-100 dark:bg-[#0B1033] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] rounded-full"
                      style={{ width: `${submissionPct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => showToast('Opening AI Grading Assistant for this assignment...', 'info')}
                  className="px-4 py-2 rounded-xl bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF] hover:bg-[#6D4CFF] hover:text-white font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Auto-Grade</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Publish Course Assignment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 4: Implementing Process Scheduling"
                  className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  >
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Database Management Systems">Database Management Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Specifications
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste problem specification, constraints, and submission guidelines..."
                  className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#6D4CFF] text-white font-bold text-sm shadow-md hover:bg-[#5B3CE6] transition-colors"
              >
                Publish Assignment to Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
