import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Flame,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';
import { Quiz, QuizQuestion } from '../../types';

export const QuizzesPage: React.FC = () => {
  const { quizzes, subjects, addQuizResult, showToast } = useData();

  // Generator form
  const [showGenModal, setShowGenModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [generating, setGenerating] = useState(false);

  // Active quiz playing state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (activeQuiz && !isSubmitted && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, isSubmitted, timeLeftSeconds]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const res = await api.generateQuizAI({
        topic,
        subject,
        difficulty,
        totalQuestions,
        questionType,
      });

      if (res?.quiz) {
        setShowGenModal(false);
        startQuiz(res.quiz);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not generate quiz. Please retry.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setAnswers({});
    setTimeLeftSeconds((quiz.timeLimitMinutes || 5) * 60);
    setIsSubmitted(false);
    setQuizStartTime(Date.now());
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || isSubmitted) return;
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    try {
      const res = await api.submitQuizAI({
        quizId: activeQuiz.id,
        answers,
        timeTakenSeconds: timeTaken,
      });

      if (res?.result) {
        setActiveQuiz(res.result);
        setIsSubmitted(true);
        addQuizResult(res.result);

        if ((res.result.score || 0) >= 75) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error submitting quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-amber-500" />
            <span>AI Quiz & Self-Assessment Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test your concept mastery with AI-generated test papers and get instant, detailed feedback.
          </p>
        </div>

        {!activeQuiz && (
          <button
            onClick={() => setShowGenModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center space-x-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Custom AI Quiz</span>
          </button>
        )}
      </div>

      {/* Active Quiz Player */}
      {activeQuiz ? (
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-sm">
          {/* Top Bar of active quiz */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1A2359] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#6D4CFF] dark:text-[#00D9FF]">
                  {activeQuiz.subjectName}
                </span>
                <span className="text-xs text-slate-400">• {activeQuiz.difficulty}</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {!isSubmitted ? (
                <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold text-sm border border-amber-500/20">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">
                  <Award className="w-4 h-4" />
                  <span>Score: {activeQuiz.score}%</span>
                </div>
              )}

              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {/* If Still Playing Quiz */}
          {!isSubmitted ? (
            <div className="py-6">
              {/* Question Progress Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>
                  Question {currentQIndex + 1} of {activeQuiz.questions.length}
                </span>
                <span>{Math.round(((currentQIndex + 1) / activeQuiz.questions.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-[#0B1033] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQIndex + 1) / activeQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question */}
              {activeQuiz.questions[currentQIndex] && (
                <div className="space-y-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {activeQuiz.questions[currentQIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {activeQuiz.questions[currentQIndex].options.map((opt, oIdx) => {
                      const qId = activeQuiz.questions[currentQIndex].id;
                      const isSelected = answers[qId] === opt;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(qId, opt)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#6D4CFF]/15 border-[#6D4CFF] text-[#6D4CFF] dark:text-[#00D9FF] font-semibold'
                              : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200 dark:border-[#1A2359] hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] flex items-center justify-center text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-sm">{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#6D4CFF] dark:text-[#00D9FF]" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Nav Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-[#1A2359]">
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A2359] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033] disabled:opacity-40 flex items-center space-x-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentQIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-[#6D4CFF] text-white text-xs font-bold hover:bg-[#5B3CE6] transition-colors flex items-center space-x-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        disabled={submitting}
                        onClick={handleSubmitQuiz}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center space-x-1.5"
                      >
                        {submitting ? (
                          <span>Grading Quiz...</span>
                        ) : (
                          <>
                            <span>Submit Examination</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Result Screen */
            <div className="py-6 space-y-6">
              {/* Score Banner */}
              <div className="text-center p-6 rounded-3xl bg-gradient-to-tr from-[#6D4CFF]/15 via-[#00D9FF]/10 to-transparent border border-[#6D4CFF]/30">
                <div className="inline-flex p-3 rounded-2xl bg-[#6D4CFF] text-white mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Examination Result: {activeQuiz.score}%
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1">
                  You got{' '}
                  <strong className="text-[#00D9FF]">
                    {Math.round(((activeQuiz.score || 0) / 100) * activeQuiz.questions.length)}
                  </strong>{' '}
                  out of {activeQuiz.questions.length} questions correct.
                </p>

                <div className="flex items-center justify-center space-x-3 mt-4">
                  <button
                    onClick={() => startQuiz(activeQuiz)}
                    className="px-4 py-2 rounded-xl bg-[#6D4CFF] text-white text-xs font-bold hover:bg-[#5B3CE6] transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1033] text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#121A50]"
                  >
                    Return to Quiz List
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Question Breakdown & AI Explanations
                </h4>

                {activeQuiz.questions.map((q, idx) => {
                  const studentAns = answers[q.id];
                  const isCorrect = studentAns === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        isCorrect
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-rose-500/5 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {idx + 1}. {q.question}
                          </p>

                          <div className="mt-2 text-xs space-y-1">
                            <p className="text-slate-600 dark:text-slate-300">
                              Your Answer: <strong className={isCorrect ? 'text-emerald-500' : 'text-rose-500'}>{studentAns || 'Skipped'}</strong>
                            </p>
                            {!isCorrect && (
                              <p className="text-slate-600 dark:text-slate-300">
                                Correct Answer: <strong className="text-emerald-500">{q.correctAnswer}</strong>
                              </p>
                            )}
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-bold text-[#6D4CFF] dark:text-[#00D9FF]">AI Academic Analysis: </span>
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Catalog / Available Quizzes Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Available & Practice Quizzes ({quizzes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] hover:border-[#6D4CFF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                      {q.subjectName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {q.totalQuestions} Questions • {q.timeLimitMinutes} Mins
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#1A2359] flex items-center justify-between">
                  {q.score !== undefined ? (
                    <span className="text-xs font-bold text-emerald-500">
                      Last Score: {q.score}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not Attempted</span>
                  )}

                  <button
                    onClick={() => startQuiz(q)}
                    className="px-3 py-1.5 rounded-xl bg-[#6D4CFF] text-white text-xs font-bold hover:bg-[#5B3CE6] transition-colors flex items-center space-x-1"
                  >
                    <span>{q.score !== undefined ? 'Retake' : 'Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Quiz Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#6D4CFF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generate AI Practice Quiz
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic or Syllabus Unit
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. CPU Scheduling Algorithms, Database SQL Joins"
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
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Question Count
                  </label>
                  <select
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  >
                    <option value={5}>5 Questions (5 mins)</option>
                    <option value={10}>10 Questions (10 mins)</option>
                    <option value={15}>15 Questions (15 mins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Question Format
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
                  >
                    <option value="multiple_choice">Multiple Choice (MCQ)</option>
                    <option value="true_false">True / False</option>
                    <option value="fill_in_blank">Fill in the Blanks</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating || !topic.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {generating ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Exam Questions...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Begin Examination</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
