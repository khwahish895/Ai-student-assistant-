import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  BookOpen,
  Copy,
  Download,
  Check,
  FileSpreadsheet,
  FileCode,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';

export const TeacherContentGenerator: React.FC = () => {
  const { showToast } = useData();

  const [contentType, setContentType] = useState<'exam' | 'lecture' | 'lab' | 'rubric'>('exam');
  const [topic, setTopic] = useState('Operating Systems: Virtual Memory & Page Replacement');
  const [targetAudience, setTargetAudience] = useState('Undergraduate 3rd Year');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Include 2 theoretical concept questions, 1 mathematical numerical on LRU page faults, and a grading answer key.'
  );
  const [generating, setGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const promptText = `Act as an expert university professor. Generate ${contentType.toUpperCase()} academic material on topic: "${topic}".
Target Students: ${targetAudience}.
Specific instructions: ${specialInstructions}.
Format output with clean markdown headings, questions, solutions, and rubric points where applicable.`;

      const res = await api.askAITutor({
        question: promptText,
        subject: 'Faculty Curriculum Design',
        mode: 'academic',
      });

      setGeneratedOutput(res.answer);
      showToast('Academic material successfully synthesized!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating material', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied to clipboard', 'info');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_Material.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Material downloaded as Markdown', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-[#6D4CFF]" />
          <span>Faculty AI Curriculum & Exam Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Synthesize high-standard examination papers, lecture outlines, lab programming specs, and grading rubrics.
        </p>
      </div>

      {/* Configuration Form Card */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'exam', label: 'Exam Paper & Key', icon: FileSpreadsheet },
              { id: 'lecture', label: 'Lecture Outline', icon: BookOpen },
              { id: 'lab', label: 'Lab Assignment', icon: FileCode },
              { id: 'rubric', label: 'Grading Rubric', icon: Layers },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setContentType(t.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    contentType === t.id
                      ? 'bg-[#6D4CFF]/15 border-[#6D4CFF] text-[#6D4CFF] dark:text-[#00D9FF] font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200 dark:border-[#1A2359] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Curriculum Topic / Module
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Consensus (Raft/Paxos), Compiler Syntax Trees"
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Cohort Level
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Graduate Level, Sophomore"
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Custom Requirements & Pedagogical Directives
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder="e.g. Include 3 multiple choice questions, 2 code-tracing questions, and full step-by-step solution keys."
              className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
            />
          </div>

          <button
            type="submit"
            disabled={generating || !topic.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Course Material with Gemini...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Academic Material</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Content Output Section */}
      {generatedOutput && (
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1A2359]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Course Document
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1A2359] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033] flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-[#6D4CFF] text-white text-xs font-bold hover:bg-[#5B3CE6] flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans overflow-x-auto">
            <ReactMarkdown>{generatedOutput}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
