import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  FileText,
  FileSpreadsheet,
  HelpCircle,
  Calendar,
  Flame,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { progress, recommendations, history, studyPlans } = useData();
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    task_1: true,
  });

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const chartData = [
    { day: 'Mon', hours: 2.5, score: 78 },
    { day: 'Tue', hours: 3.0, score: 82 },
    { day: 'Wed', hours: 4.2, score: 88 },
    { day: 'Thu', hours: 2.0, score: 80 },
    { day: 'Fri', hours: 3.8, score: 91 },
    { day: 'Sat', hours: 5.1, score: 85 },
    { day: 'Sun', hours: 3.5, score: 94 },
  ];

  const quickActions = [
    {
      title: 'Ask AI Tutor',
      desc: 'Instant academic answers, code, & step-by-step proofs',
      path: '/ai-tutor',
      icon: Bot,
      color: 'from-violet-600 to-indigo-600',
      badge: 'Interactive',
    },
    {
      title: 'Generate Notes',
      desc: 'Turn syllabus topics into structured revision notes',
      path: '/notes',
      icon: FileText,
      color: 'from-blue-600 to-cyan-600',
      badge: 'AI Powered',
    },
    {
      title: 'PDF Summarizer',
      desc: 'Upload lecture slides or research papers for summary & Q&A',
      path: '/documents',
      icon: FileSpreadsheet,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Doc AI',
    },
    {
      title: 'Generate Quiz',
      desc: 'Test your understanding with customized adaptive quizzes',
      path: '/quizzes',
      icon: HelpCircle,
      color: 'from-amber-500 to-orange-600',
      badge: 'Self-Test',
    },
    {
      title: 'Study Planner',
      desc: 'Personalized schedule targeted towards your upcoming exams',
      path: '/study-planner',
      icon: Calendar,
      color: 'from-fuchsia-600 to-pink-600',
      badge: 'Roadmap',
    },
  ];

  const todayTasks = [
    {
      id: 'task_1',
      title: 'Revise Binary Search Tree balancing operations',
      subject: 'Data Structures',
      duration: '45 mins',
    },
    {
      id: 'task_2',
      title: 'Practice 10 multiple-choice questions on Deadlock Prevention',
      subject: 'Operating Systems',
      duration: '30 mins',
    },
    {
      id: 'task_3',
      title: 'Summarize Chapter 4: Transport Layer flow control',
      subject: 'Computer Networks',
      duration: '40 mins',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07123F] via-[#0B1033] to-[#121A50] border border-[#1A2359] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#6D4CFF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-48 h-48 bg-[#00D9FF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1A2359] text-[#00D9FF] text-xs font-bold mb-3 border border-[#00D9FF]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Intelligent Learning Mode Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
              You're currently on a <strong className="text-amber-400">7-Day Study Streak</strong>! Keep up the momentum for your upcoming semester examinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/ai-tutor')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6D4CFF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => navigate('/quizzes')}
              className="px-4 py-2.5 rounded-xl bg-[#0B1033] hover:bg-[#1A2359] border border-[#1A2359] text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center space-x-2 shrink-0"
            >
              <Zap className="w-4 h-4 text-[#00D9FF]" />
              <span>Quick Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Time</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {progress?.totalStudyHours || 24.5} hrs
            </span>
            <span className="text-xs text-emerald-500 font-semibold ml-2">+3.2 hrs this week</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {progress?.averageScore || 84}%
            </span>
            <span className="text-xs text-slate-400 font-medium ml-2">
              ({progress?.completedQuizzesCount || 18} quizzes)
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Notes</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-[#6D4CFF]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {progress?.notesCount || 29}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-2">AI-formatted</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {progress?.currentStreak || 7} Days
            </span>
            <span className="text-xs text-amber-500 font-semibold ml-2">On Fire 🔥</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations Alert Bar */}
      {recommendations && recommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#6D4CFF]/10 border border-[#6D4CFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#6D4CFF] text-white shrink-0 mt-0.5 sm:mt-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#6D4CFF] dark:text-[#00D9FF] uppercase tracking-wider">
                  AI Recommendation
                </span>
                <span className="text-[10px] bg-[#6D4CFF]/20 text-[#6D4CFF] dark:text-[#00D9FF] px-2 py-0.5 rounded-full font-bold">
                  High Priority
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                {recommendations[0].title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {recommendations[0].reason}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(recommendations[0].actionLink || '/quizzes')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#6D4CFF] hover:bg-[#5B3CE6] text-white text-xs font-bold transition-colors shrink-0 flex items-center space-x-1.5"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Action Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Intelligent AI Learning Tools
          </h2>
          <span className="text-xs text-slate-400">Select any tool to begin</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group p-5 rounded-2xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] hover:border-[#6D4CFF] dark:hover:border-[#00D9FF] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#0B1033] text-slate-500 dark:text-slate-400">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#6D4CFF] dark:group-hover:text-[#00D9FF] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1A2359] flex items-center text-xs font-semibold text-[#6D4CFF] dark:text-[#00D9FF]">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Chart & Today's Study Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Trend */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Weekly Study Analytics
              </h3>
              <p className="text-xs text-slate-400">Hours spent & quiz proficiency</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6D4CFF]" />
                <span className="text-slate-500 dark:text-slate-400">Hours</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF]" />
                <span className="text-slate-500 dark:text-slate-400">Score %</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D4CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6D4CFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2359" opacity={0.2} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07123F',
                    border: '1px solid #1A2359',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#6D4CFF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#00D9FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Today's Targets
              </h3>
              <span className="text-xs font-semibold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-full">
                {Object.values(completedTasks).filter(Boolean).length} / {todayTasks.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {todayTasks.map((t) => {
                const isDone = !!completedTasks[t.id];
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200/80 dark:border-[#1A2359] hover:border-[#6D4CFF]'
                    }`}
                  >
                    <button className="mt-0.5 text-slate-400">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-xs font-semibold ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {t.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400">
                        <span>{t.subject}</span>
                        <span>•</span>
                        <span>{t.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1A2359]">
            <button
              onClick={() => navigate('/study-planner')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#0B1033] hover:bg-slate-200 dark:hover:bg-[#121A50] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Full AI Study Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent History / Activity Row */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Recent Study Activities
          </h3>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-[#6D4CFF] dark:text-[#00D9FF] hover:underline"
          >
            View all history
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1A2359]">
          {history.slice(0, 4).map((h) => (
            <div key={h.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B1033] text-[#6D4CFF] dark:text-[#00D9FF]">
                  {h.activityType === 'quiz_taken' ? (
                    <HelpCircle className="w-4 h-4" />
                  ) : h.activityType === 'note_generated' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {h.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {h.subjectName} • {new Date(h.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {h.score !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-400">
                    {h.score}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
