import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Sparkles,
  BookOpen,
  Download,
  Copy,
  Check,
  Bookmark,
  Trash2,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';
import { Note } from '../../types';

export const NotesPage: React.FC = () => {
  const { notes, subjects, addNote, deleteNote, toggleBookmark, isBookmarked, showToast } = useData();

  // Generator form states
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [style, setStyle] = useState('Detailed Explanation');
  const [numSections, setNumSections] = useState(4);
  const [generating, setGenerating] = useState(false);

  // Active view states
  const [activeNote, setActiveNote] = useState<Note | null>(notes[0] || null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterSubject, setSelectedFilterSubject] = useState('All');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const res = await api.generateNotesAI({
        topic,
        subject,
        difficulty,
        style,
        numSections,
      });

      if (res?.note) {
        addNote(res.note);
        setActiveNote(res.note);
        setTopic('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate notes. Please retry.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast('Note content copied!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (note: Note) => {
    const blob = new Blob([`# ${note.title}\n\n**Subject:** ${note.subjectName} | **Difficulty:** ${note.difficulty} | **Style:** ${note.style}\n\n---\n\n${note.content}`], {
      type: 'text/markdown',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}_Study_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Notes downloaded as Markdown file', 'success');
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedFilterSubject === 'All' || n.subjectName === selectedFilterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#6D4CFF]" />
            <span>AI Study Notes Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Turn any syllabus topic into structured, exam-ready study notes in seconds.
          </p>
        </div>
      </div>

      {/* Generator Card */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#6D4CFF] dark:text-[#00D9FF] uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4" />
          <span>New AI Note Synthesis</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic or Concept Title
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Process Scheduling & Round Robin Algorithm, Normalization Forms (1NF-BCNF)"
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="Computer Science">Computer Science General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Target
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="Beginner">Beginner (Foundations & Intuition)</option>
                <option value="Intermediate">Intermediate (Core Engineering)</option>
                <option value="Advanced">Advanced (Deep Technical & Proofs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Note Format Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="Detailed Explanation">Detailed Textbook Style</option>
                <option value="Bullet Points">High-Yield Bullet Points</option>
                <option value="Revision Cheat Sheet">Revision Cheat Sheet & Formulas</option>
                <option value="Mind Map / Conceptual">Mind Map Hierarchical Breakdown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sub-Sections ({numSections})
              </label>
              <input
                type="range"
                min="2"
                max="6"
                value={numSections}
                onChange={(e) => setNumSections(Number(e.target.value))}
                className="w-full mt-2 accent-[#6D4CFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={generating || !topic.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] hover:from-[#5B3CE6] hover:to-[#6D4CFF] text-white font-bold text-sm shadow-md shadow-[#6D4CFF]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Academic Notes...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Structured Notes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Content Layout: Sidebar List of Notes & Active Note Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Saved Notes List with Search */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-4 flex flex-col h-[650px] shadow-sm">
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                My Saved Notes ({filteredNotes.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            {/* Filter Subject */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFilterSubject}
                onChange={(e) => setSelectedFilterSubject(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-600 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes scroll list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No notes found matching your criteria.
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = activeNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setActiveNote(n)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6D4CFF]/10 border-[#6D4CFF] text-[#6D4CFF] dark:text-[#00D9FF]'
                        : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200/80 dark:border-[#1A2359] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {n.title}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-400">
                      <span>{n.subjectName}</span>
                      <span>•</span>
                      <span>{n.difficulty}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Note Viewer */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 flex flex-col h-[650px] shadow-sm">
          {activeNote ? (
            <div className="flex flex-col h-full">
              {/* Note Header & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1A2359] gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                      {activeNote.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#0B1033] text-slate-500 dark:text-slate-400">
                      {activeNote.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#0B1033] text-slate-500 dark:text-slate-400">
                      {activeNote.style}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(activeNote.content)}
                    title="Copy Markdown"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#0B1033]"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDownload(activeNote)}
                    title="Download Markdown"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#0B1033]"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      toggleBookmark(
                        'note',
                        activeNote.id,
                        activeNote.title,
                        activeNote.content.slice(0, 80),
                        activeNote.subjectName
                      )
                    }
                    title="Bookmark"
                    className={`p-2 rounded-xl border border-slate-200 dark:border-[#1A2359] ${
                      isBookmarked(activeNote.id)
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0B1033]'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked(activeNote.id) ? 'fill-current' : ''}`}
                    />
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('Delete this study note?')) {
                        await deleteNote(activeNote.id);
                        setActiveNote(notes.filter((n) => n.id !== activeNote.id)[0] || null);
                      }
                    }}
                    title="Delete Note"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-[#1A2359] hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content Markdown */}
              <div className="flex-1 overflow-y-auto py-5 prose-ai text-sm text-slate-800 dark:text-slate-200">
                <ReactMarkdown>{activeNote.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <FileText className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold">No Note Selected</p>
              <p className="text-xs max-w-xs mt-1">
                Choose a note from the left list or generate a brand-new study guide above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
