import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileSpreadsheet,
  UploadCloud,
  File,
  Sparkles,
  Bot,
  Send,
  Download,
  Trash2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';
import { DocumentItem } from '../../types';

const SAMPLE_PDF_TEXT = `CHAPTER 6: DEADLOCKS IN OPERATING SYSTEMS
1. SYSTEM MODEL
A system consists of a finite number of resources to be distributed among a number of competing processes. Resources are categorized into several types, such as CPU cycles, memory space, files, and I/O devices (like printers, DVD drives).

2. DEADLOCK CHARACTERIZATION
A deadlock occurs if and only if all four Coffman conditions hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode; only one process at a time can use the resource.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources that are currently being held by other processes.
3. No Preemption: Resources cannot be preempted; that is, a resource can be released only voluntarily by the process holding it, after that process has finished its task.
4. Circular Wait: A set of waiting processes {P0, P1, ..., Pn} must exist such that P0 is waiting for a resource held by P1, P1 is waiting for a resource held by P2, ..., and Pn is waiting for a resource held by P0.

3. METHODS FOR HANDLING DEADLOCKS
- Deadlock Prevention: Negating at least one of the four necessary conditions.
- Deadlock Avoidance: The Banker's Algorithm ensures the system never enters an unsafe state.
- Deadlock Detection and Recovery: Allow system to enter deadlock, detect with Resource Allocation Graph, and recover via process termination or resource preemption.
- Ignorance: The Ostrich Algorithm (used by UNIX and Windows for rare deadlocks).`;

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, deleteDocument, showToast } = useData();

  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(documents[0] || null);
  const [filename, setFilename] = useState('Operating_Systems_Deadlocks.pdf');
  const [fileContentText, setFileContentText] = useState(SAMPLE_PDF_TEXT);
  const [summaryLength, setSummaryLength] = useState('Detailed');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Document QA states
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContentText(text || `Uploaded ${file.name} content with academic text.`);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContentText(text || `Uploaded ${file.name} content with academic text.`);
      };
      reader.readAsText(file);
    }
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContentText.trim()) {
      showToast('Please provide or upload document text', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await api.summarizePDF({
        filename,
        fileContentText,
        summaryLength,
      });

      if (res?.document) {
        addDocument(res.document);
        setActiveDoc(res.document);
        setQaHistory([]);
      }
    } catch (err) {
      console.error(err);
      showToast('Error summarizing document.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAskDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc || !qaQuestion.trim() || qaLoading) return;

    const q = qaQuestion;
    setQaQuestion('');
    setQaLoading(true);

    try {
      const res = await api.askDocumentQA(activeDoc.id, q);
      setQaHistory((prev) => [...prev, { q, a: res.answer }]);
    } catch (err) {
      console.error(err);
      showToast('Failed to get answer from document', 'error');
    } finally {
      setQaLoading(false);
    }
  };

  const handleDownloadSummary = (doc: DocumentItem) => {
    const content = `# Document Summary: ${doc.filename}\n\n**Generated:** ${new Date(
      doc.createdAt
    ).toLocaleDateString()}\n\n## Executive Summary\n${doc.summary}\n\n## Key Takeaways\n${doc.keyPoints.map(
      (p) => `- ${p}`
    ).join('\n')}\n\n## Study Concepts\n${doc.extractedConcepts.map(
      (c) => `- **${c}**`
    ).join('\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.filename}_AI_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Summary downloaded', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-[#00D9FF]" />
          <span>PDF & Document AI Intelligence</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload lecture slides, research papers, or syllabus chapters to extract summaries, key terms, and ask document-grounded questions.
        </p>
      </div>

      {/* Upload & Summarization Form Card */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSummarize} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                dragActive
                  ? 'border-[#00D9FF] bg-[#00D9FF]/10'
                  : 'border-slate-300 dark:border-[#1A2359] hover:border-[#6D4CFF] bg-slate-50 dark:bg-[#0B1033]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-[#00D9FF] mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Click to upload or drag and drop file here
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                PDF, TXT, DOCX, Markdown (Up to 25MB)
              </p>
              {filename && (
                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/15 text-[#00D9FF] text-xs font-semibold">
                  <File className="w-3.5 h-3.5" />
                  <span>{filename}</span>
                </div>
              )}
            </div>

            {/* Paste or Review Raw Document Content */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Document Text Preview & Raw Paste
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFilename('Sample_OS_Deadlocks.txt');
                    setFileContentText(SAMPLE_PDF_TEXT);
                  }}
                  className="text-[11px] text-[#00D9FF] hover:underline font-semibold"
                >
                  Load Sample Chapter
                </button>
              </div>
              <textarea
                value={fileContentText}
                onChange={(e) => setFileContentText(e.target.value)}
                placeholder="Paste chapter notes or paper text here directly..."
                className="flex-1 w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#6D4CFF] font-mono"
                rows={6}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Summary Depth:
              </span>
              {(['Concise', 'Detailed', 'Exam Bullet Points'] as const).map((len) => (
                <button
                  type="button"
                  key={len}
                  onClick={() => setSummaryLength(len)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    summaryLength === len
                      ? 'bg-[#6D4CFF] text-white shadow-md'
                      : 'bg-slate-100 dark:bg-[#0B1033] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1A2359]'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={uploading || !fileContentText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#00D9FF] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing & Analyzing Document...</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Process Document with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Document List & Document Intelligence Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Previous Documents */}
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-4 flex flex-col h-[650px] shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
            Processed Documents ({documents.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No documents uploaded yet.
              </div>
            ) : (
              documents.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc);
                      setQaHistory([]);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00D9FF]/10 border-[#00D9FF] text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200/80 dark:border-[#1A2359] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <File className="w-4 h-4 text-[#00D9FF] shrink-0" />
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {doc.filename}
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-[#1A2359] text-[10px] text-slate-400">
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      <span className="text-[#00D9FF] font-semibold">
                        {doc.keyPoints?.length || 0} Key Points
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Document Details & Interactive Q&A */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 flex flex-col h-[650px] shadow-sm">
          {activeDoc ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1A2359]">
                <div>
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4 text-[#00D9FF]" />
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      {activeDoc.filename}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzed on {new Date(activeDoc.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadSummary(activeDoc)}
                    title="Download Summary"
                    className="p-2 rounded-xl text-slate-500 hover:text-white border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#0B1033]"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this document?')) {
                        await deleteDocument(activeDoc.id);
                        setActiveDoc(documents.filter((d) => d.id !== activeDoc.id)[0] || null);
                      }
                    }}
                    title="Delete Document"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-[#1A2359] hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Summary and Q&A Section */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Executive Summary
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    <ReactMarkdown>{activeDoc.summary}</ReactMarkdown>
                  </div>
                </div>

                {/* Key Points */}
                {activeDoc.keyPoints && activeDoc.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key Academic Takeaways
                    </h3>
                    <div className="space-y-2">
                      {activeDoc.keyPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Concepts */}
                {activeDoc.extractedConcepts && activeDoc.extractedConcepts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Core Concept Glossary
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDoc.extractedConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF] border border-[#6D4CFF]/20"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounded Document Q&A History */}
                <div className="border-t border-slate-200 dark:border-[#1A2359] pt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                    <Bot className="w-4 h-4 text-[#00D9FF]" />
                    <span>Ask Questions Grounded in this Document</span>
                  </h3>

                  <div className="space-y-3 mb-4">
                    {qaHistory.length === 0 && (
                      <p className="text-xs text-slate-400 italic">
                        No questions asked yet. Try: "What are the 4 Coffman conditions?" or "How does avoidance differ from prevention?"
                      </p>
                    )}

                    {qaHistory.map((item, idx) => (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <div className="bg-[#6D4CFF]/15 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 font-semibold">
                          Q: {item.q}
                        </div>
                        <div className="bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] p-3 rounded-xl text-slate-700 dark:text-slate-200">
                          <ReactMarkdown>{item.a}</ReactMarkdown>
                        </div>
                      </div>
                    ))}

                    {qaLoading && (
                      <div className="p-3 bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl flex items-center space-x-2 text-xs text-slate-400">
                        <span className="w-3 h-3 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
                        <span>Searching document text for answer...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Q&A Input Bar */}
              <form onSubmit={handleAskDoc} className="pt-3 border-t border-slate-200 dark:border-[#1A2359] flex items-center space-x-2">
                <input
                  type="text"
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  disabled={qaLoading}
                  placeholder={`Ask a question based on "${activeDoc.filename}"...`}
                  className="flex-1 bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00D9FF]"
                />
                <button
                  type="submit"
                  disabled={qaLoading || !qaQuestion.trim()}
                  className="p-2.5 rounded-xl bg-[#00D9FF] text-[#030B2C] hover:opacity-90 font-bold transition-opacity disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <FileSpreadsheet className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold">No Document Selected</p>
              <p className="text-xs max-w-xs mt-1">
                Upload a document or select an existing one to review summaries and start document Q&A.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
