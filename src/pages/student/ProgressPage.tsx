import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const ProgressPage: React.FC = () => {
  const { progress, showToast } = useData();

  const weeklyProgressData = [
    { week: 'Week 1', hours: 14, quizzes: 82 },
    { week: 'Week 2', hours: 18, quizzes: 80 },
    { week: 'Week 3', hours: 22, quizzes: 86 },
    { week: 'Week 4', hours: 26, quizzes: 88 },
  ];

  const subjectBreakdown = [
    { subject: 'Data Structures & Algorithms', proficiency: 88, hours: 9.5 },
    { subject: 'Database Management Systems', proficiency: 84, hours: 6.2 },
    { subject: 'Computer Networks', proficiency: 76, hours: 5.0 },
    { subject: 'Operating Systems', proficiency: 68, hours: 3.8 },
  ];

  const handleDownloadReport = () => {
    const content = `# AI Student Assistant - Academic Progress Report\n\n**Generated:** ${new Date().toLocaleDateString()}\n**Overall Average Score:** ${
      progress?.averageScore || 84
    }%\n**Total Study Hours:** ${progress?.totalStudyHours || 24.5} hrs\n**Current Streak:** ${
      progress?.currentStreak || 7
    } Days\n\n## Strong Areas\n${(progress?.strongTopics || []).map((t) => `- ${t}`).join('\n')}\n\n## Priority Revision Topics\n${(
      progress?.weakTopics || []
    )
      .map((t) => `- ${t}`)
      .join('\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Progress_Report.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress report downloaded successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span>Learning Analytics & Progress</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time evaluation of study consistency, quiz accuracies, and knowledge retention.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0B1033] hover:bg-slate-200 dark:hover:bg-[#1A2359] border border-slate-200 dark:border-[#1A2359] text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Overall Accuracy</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {progress?.averageScore || 84}%
          </p>
          <p className="text-xs text-emerald-500 font-semibold mt-1">+4% from last semester</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {progress?.totalStudyHours || 24.5} hrs
          </p>
          <p className="text-xs text-[#00D9FF] font-semibold mt-1">On schedule for target</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {progress?.currentStreak || 7} Days
          </p>
          <p className="text-xs text-amber-500 font-semibold mt-1">Best: 14 Days</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Quizzes Solved</span>
            <FileText className="w-4 h-4 text-[#6D4CFF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {progress?.completedQuizzesCount || 18}
          </p>
          <p className="text-xs text-[#6D4CFF] font-semibold mt-1">94 questions answered</p>
        </div>
      </div>

      {/* Weak and Strong Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-500 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Proven Strong Concepts (80%+ Mastery)
            </h3>
          </div>

          <div className="space-y-3">
            {(progress?.strongTopics || [
              'Binary Search Tree Rotations & Traversal',
              'SQL Joins & Group By Aggregations',
              'TCP 3-Way Handshake Connection Protocol',
            ]).map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between"
              >
                <span>{t}</span>
                <span className="text-emerald-500 font-bold text-[11px]">Mastered</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas requiring revision */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center space-x-2 text-rose-500 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Priority Focus Areas (Requires Revision)
            </h3>
          </div>

          <div className="space-y-3">
            {(progress?.weakTopics || [
              'Deadlock Detection & Bankers Algorithm',
              'Subnetting & CIDR Network Masking',
              'B+ Tree Indexing in Relational Engines',
            ]).map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between"
              >
                <span>{t}</span>
                <span className="text-rose-500 font-bold text-[11px]">Revise Topic</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Chart and Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Study Hours per Month
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2359" opacity={0.2} />
                <XAxis dataKey="week" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07123F',
                    border: '1px solid #1A2359',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="hours" fill="#6D4CFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Subject Proficiency Distribution
          </h3>
          <div className="space-y-4">
            {subjectBreakdown.map((sb) => (
              <div key={sb.subject}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {sb.subject}
                  </span>
                  <span className="font-bold text-[#00D9FF]">{sb.proficiency}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-[#0B1033] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] rounded-full"
                    style={{ width: `${sb.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
