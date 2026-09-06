import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';
import { StudyPlan } from '../../types';

export const StudyPlannerPage: React.FC = () => {
  const { studyPlans, subjects, addStudyPlan, showToast } = useData();

  const [activePlan, setActivePlan] = useState<StudyPlan | null>(studyPlans[0] || null);
  const [examDate, setExamDate] = useState('2026-05-15');
  const [dailyHours, setDailyHours] = useState(3.5);
  const [targetScore, setTargetScore] = useState(90);
  const [subjectKnowledge, setSubjectKnowledge] = useState<Record<string, number>>({
    'Data Structures & Algorithms': 75,
    'Operating Systems': 55,
    'Database Management Systems': 80,
    'Computer Networks': 60,
  });
  const [generating, setGenerating] = useState(false);

  const handleKnowledgeChange = (subj: string, val: number) => {
    setSubjectKnowledge((prev) => ({ ...prev, [subj]: val }));
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const payload = {
        examDate,
        dailyHours,
        targetScore,
        subjectsKnowledge: Object.entries(subjectKnowledge).map(([subj, prof]) => ({
          subject: subj,
          proficiency: prof,
        })),
      };

      const res = await api.generateStudyPlanAI(payload);
      if (res?.plan) {
        addStudyPlan(res.plan);
        setActivePlan(res.plan);
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating AI study plan.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleItem = async (planId: string, itemId: string) => {
    if (!activePlan) return;
    const item = activePlan.items.find((i) => i.id === itemId);
    const newCompleted = !item?.completed;

    const updatedItems = activePlan.items.map((i) =>
      i.id === itemId ? { ...i, completed: newCompleted } : i
    );
    const completedCount = updatedItems.filter((i) => i.completed).length;
    const progress = Math.round((completedCount / updatedItems.length) * 100);

    setActivePlan({
      ...activePlan,
      items: updatedItems,
      progress,
    });

    await api.toggleStudyPlanItem(planId, itemId, newCompleted);
    showToast(newCompleted ? 'Task completed! Keep it up!' : 'Task unmarked', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-fuchsia-500" />
          <span>Intelligent AI Study Planner</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adaptive preparation roadmap that automatically balances revision based on exam deadlines and knowledge gaps.
        </p>
      </div>

      {/* Generator Form Card */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-fuchsia-500 uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Configure Adaptive Target Roadmap</span>
        </div>

        <form onSubmit={handleGeneratePlan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Examination Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Available Daily Study: {dailyHours} Hours
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full mt-2 accent-fuchsia-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Score Goal: {targetScore}%
              </label>
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full mt-2 accent-fuchsia-500"
              />
            </div>
          </div>

          {/* Subject proficiency sliders */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Current Subject Proficiency Assessment (Lower % gets more automated study allocation)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.keys(subjectKnowledge).map((subj) => (
                <div
                  key={subj}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359]"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                      {subj}
                    </span>
                    <span className="font-bold text-fuchsia-500">
                      {subjectKnowledge[subj]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={subjectKnowledge[subj]}
                    onChange={(e) => handleKnowledgeChange(subj, Number(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-[#6D4CFF] text-white font-bold text-sm shadow-md shadow-fuchsia-500/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Optimal Study Schedule...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Optimized AI Masterplan</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Plan Dashboard */}
      {activePlan ? (
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-sm space-y-6">
          {/* Plan Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1A2359] gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-500 text-[10px] font-bold uppercase mb-1">
                <span>Active Target Roadmap</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {activePlan.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Exam: {activePlan.examDate} • {activePlan.dailyHours} hrs/day allocation
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] p-3 rounded-2xl">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Roadmap Progress</p>
                <p className="text-lg font-black text-fuchsia-500">{activePlan.progress || 0}%</p>
              </div>
              <div className="w-24 h-2.5 bg-slate-200 dark:bg-[#07123F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-[#6D4CFF] rounded-full transition-all duration-300"
                  style={{ width: `${activePlan.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Schedule Checklist by Weeks / Days */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-fuchsia-500" />
              <span>Structured Study Modules & Tasks</span>
            </h3>

            <div className="space-y-3">
              {activePlan.items.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleItem(activePlan.id, task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400'
                      : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200 dark:border-[#1A2359] hover:border-fuchsia-500'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <button className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-fuchsia-500" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.topic}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
                        <span className="font-semibold text-[#6D4CFF] dark:text-[#00D9FF]">
                          {task.subject}
                        </span>
                        <span>•</span>
                        <span>Target: {task.day}</span>
                        <span>•</span>
                        <span>{task.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.completed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-fuchsia-500/10 text-fuchsia-500'
                    }`}
                  >
                    {task.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359]">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400 stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Study Plans Generated</h3>
          <p className="text-xs max-w-sm mx-auto mt-1">
            Fill out your upcoming exam date and subject proficiencies above to generate your first adaptive AI schedule.
          </p>
        </div>
      )}
    </div>
  );
};
