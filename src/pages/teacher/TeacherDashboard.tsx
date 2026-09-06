import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const classData = [
    { subject: 'Data Structures', avgScore: 84, submissions: 42 },
    { subject: 'Operating Systems', avgScore: 71, submissions: 38 },
    { subject: 'DBMS', avgScore: 82, submissions: 40 },
    { subject: 'Networks', avgScore: 76, submissions: 35 },
  ];

  const strugglingStudents = [
    { name: 'Marcus Vance', subject: 'Operating Systems', avgScore: 54, status: 'Needs Intervention' },
    { name: 'Elena Rostova', subject: 'Networks', avgScore: 58, status: 'Missed 2 Quizzes' },
    { name: 'David Chen', subject: 'Data Structures', avgScore: 62, status: 'Falling Behind' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07123F] via-[#0B1033] to-[#121A50] border border-[#1A2359] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1A2359] text-[#6D4CFF] text-xs font-bold mb-3 border border-[#6D4CFF]/30">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Educator Control Deck</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.name || 'Professor'} 🎓
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl">
              Monitor student engagement, synthesize exam material using Gemini, and evaluate class-wide concept mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/teacher/content-generator')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center space-x-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <span>AI Material Generator</span>
            </button>
            <button
              onClick={() => navigate('/teacher/assignments')}
              className="px-4 py-2.5 rounded-xl bg-[#0B1033] border border-[#1A2359] text-slate-200 font-semibold text-xs sm:text-sm hover:bg-[#1A2359] transition-all"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#6D4CFF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">142</p>
          <p className="text-xs text-emerald-500 font-semibold mt-1">98% Active this week</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Class Avg Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">78.5%</p>
          <p className="text-xs text-emerald-500 font-semibold mt-1">+3.2% vs midterm</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">4</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Computer Science Dept</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Assignments Due</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">3</p>
          <p className="text-xs text-amber-500 font-semibold mt-1">15 submissions pending</p>
        </div>
      </div>

      {/* Class Analytics & Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance by Subject */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Performance Overview
              </h3>
              <p className="text-xs text-slate-400">Class average quiz score by subject</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2359" opacity={0.2} />
                <XAxis dataKey="subject" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07123F',
                    border: '1px solid #1A2359',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="avgScore" fill="#6D4CFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Struggling Students Alert */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-500 mb-3">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Intervention Needed
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Students scoring below 65% on recent AI practice assessments.
            </p>

            <div className="space-y-3">
              {strugglingStudents.map((st) => (
                <div
                  key={st.name}
                  className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{st.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {st.subject} • Score: <strong className="text-rose-500">{st.avgScore}%</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/teacher/students')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0B1033] hover:bg-slate-200 dark:hover:bg-[#121A50] text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>View All 142 Students</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
