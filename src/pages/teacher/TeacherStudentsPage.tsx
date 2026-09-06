import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Mail,
  Award,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TeacherStudentsPage: React.FC = () => {
  const { showToast } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'struggling' | 'top'>('all');

  const students = [
    { id: '1', name: 'Alex Johnson', email: 'alex.j@university.edu', course: 'Computer Science', avgScore: 84, quizzesTaken: 18, lastActive: '10 mins ago', status: 'Good' },
    { id: '2', name: 'Marcus Vance', email: 'marcus.v@university.edu', course: 'Computer Science', avgScore: 54, quizzesTaken: 6, lastActive: '2 days ago', status: 'At Risk' },
    { id: '3', name: 'Elena Rostova', email: 'elena.r@university.edu', course: 'Computer Science', avgScore: 58, quizzesTaken: 8, lastActive: '1 day ago', status: 'Needs Review' },
    { id: '4', name: 'Sarah Miller', email: 'sarah.m@university.edu', course: 'Computer Science', avgScore: 92, quizzesTaken: 24, lastActive: 'Just now', status: 'Top Performer' },
    { id: '5', name: 'David Chen', email: 'david.c@university.edu', course: 'Computer Science', avgScore: 62, quizzesTaken: 9, lastActive: '3 hours ago', status: 'Needs Review' },
    { id: '6', name: 'Priya Sharma', email: 'priya.s@university.edu', course: 'Computer Science', avgScore: 89, quizzesTaken: 21, lastActive: '5 hours ago', status: 'Top Performer' },
    { id: '7', name: 'James Wilson', email: 'j.wilson@university.edu', course: 'Computer Science', avgScore: 78, quizzesTaken: 15, lastActive: 'Yesterday', status: 'Good' },
  ];

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'struggling') return s.avgScore < 70;
    if (filterMode === 'top') return s.avgScore >= 85;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-[#6D4CFF]" />
          <span>Student Cohort Analytics & Roster</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor individual student test completion rates, quiz averages, and trigger pedagogical interventions.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#6D4CFF] text-white shadow-md'
                : 'bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] text-slate-600 dark:text-slate-300'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setFilterMode('struggling')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'struggling'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] text-rose-500'
            }`}
          >
            At Risk (&lt;70%)
          </button>
          <button
            onClick={() => setFilterMode('top')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'top'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] text-emerald-500'
            }`}
          >
            Top Performers (&ge;85%)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by name or email..."
            className="w-full bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF]"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1A2359] bg-slate-50/50 dark:bg-[#0B1033]/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Degree</th>
                <th className="p-4">Quiz Average</th>
                <th className="p-4">Quizzes Completed</th>
                <th className="p-4">Last Active</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1A2359] text-xs">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-[#0B1033] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.email}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{s.course}</td>
                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        s.avgScore >= 85
                          ? 'text-emerald-500'
                          : s.avgScore < 70
                          ? 'text-rose-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {s.avgScore}%
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-200">{s.quizzesTaken} assessments</td>
                  <td className="p-4 text-slate-400">{s.lastActive}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Top Performer'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : s.status === 'At Risk'
                          ? 'bg-rose-500/10 text-rose-500'
                          : s.status === 'Needs Review'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => showToast(`Automated study reminder sent to ${s.name}`, 'success')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#121A50] text-[11px] font-semibold text-[#6D4CFF] dark:text-[#00D9FF]"
                    >
                      Send Guidance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
