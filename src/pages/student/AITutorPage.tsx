import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Bookmark,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Download,
  Lightbulb,
  Code2,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import * as api from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  subject?: string;
}

const SUGGESTIONS = [
  'Explain Dijkstra’s shortest path algorithm with a real-world GPS analogy',
  'How does Virtual Memory Paging work and what triggers a Page Fault?',
  'Write a clean SQL query to find the 2nd highest salary with explanation',
  'Compare TCP vs UDP: packet headers, handshakes, and gaming use-cases',
];

export const AITutorPage: React.FC = () => {
  const { subjects, toggleBookmark, isBookmarked, showToast } = useData();
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');
  const [learningMode, setLearningMode] = useState<'concept' | 'code' | 'summary' | 'analogy'>('concept');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I am your **AI Academic Tutor**. I can break down complex engineering concepts, generate clear code implementations, and solve exam questions step-by-step.
      
What would you like to master in **${selectedSubject}** today? You can select a subject or pick one of the sample academic questions below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Pass subject context and mode in query
      const promptWithContext = `[Subject: ${selectedSubject}] [Instruction Mode: ${learningMode.toUpperCase()}]\nStudent Question: ${query}`;
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await api.askAITutor(promptWithContext, historyPayload);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      showToast('Could not reach AI Tutor. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this device', 'error');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#`_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: `msg_clear_${Date.now()}`,
        sender: 'ai',
        text: `Conversation cleared. What topic shall we study next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleExport = () => {
    const textContent = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Tutor_Session_${selectedSubject.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Chat exported as Markdown file', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xl overflow-hidden">
      {/* Top Controls Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#1A2359] bg-slate-50/70 dark:bg-[#0B1033]/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D4CFF] to-[#00D9FF] p-0.5 flex items-center justify-center text-white shadow-md shadow-[#6D4CFF]/20">
            <div className="w-full h-full bg-[#07123F] rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#00D9FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                AI Academic Tutor
              </h2>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">Contextual answers powered by Gemini</p>
          </div>
        </div>

        {/* Subject & Mode Selectors */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Subject Dropdown */}
          <div className="flex items-center bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-xl px-2.5 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#6D4CFF] mr-1.5" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name} className="dark:bg-[#07123F]">
                  {s.name}
                </option>
              ))}
              <option value="General Engineering" className="dark:bg-[#07123F]">
                General Engineering
              </option>
            </select>
          </div>

          {/* Mode pills */}
          <div className="flex items-center bg-slate-200/60 dark:bg-[#0B1033] p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLearningMode('concept')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                learningMode === 'concept'
                  ? 'bg-white dark:bg-[#6D4CFF] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Concept
            </button>
            <button
              onClick={() => setLearningMode('code')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                learningMode === 'code'
                  ? 'bg-white dark:bg-[#6D4CFF] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setLearningMode('analogy')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                learningMode === 'analogy'
                  ? 'bg-white dark:bg-[#6D4CFF] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Analogy
            </button>
          </div>

          <button
            onClick={handleExport}
            title="Export Chat as Markdown"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#0B1033]"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat"
            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#0B1033]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const bookmarked = isBookmarked(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-[#6D4CFF] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#6D4CFF]/25">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs ${
                  isAi
                    ? 'bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] text-slate-800 dark:text-slate-100'
                    : 'bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white'
                }`}
              >
                {/* Header info in AI message */}
                {isAi && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-[#1A2359] text-xs text-slate-400">
                    <span className="font-semibold text-[#6D4CFF] dark:text-[#00D9FF]">
                      AI Academic Tutor {msg.subject ? `• ${msg.subject}` : ''}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                        className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        title="Copy text"
                        className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          toggleBookmark(
                            'ai_answer',
                            msg.id,
                            `AI Tutor: ${msg.text.slice(0, 40)}...`,
                            msg.text.slice(0, 100),
                            msg.subject || selectedSubject
                          )
                        }
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark this answer'}
                        className={`p-1 rounded ${
                          bookmarked
                            ? 'text-amber-400'
                            : 'hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Body with Markdown */}
                <div className="prose-ai text-sm leading-relaxed overflow-x-auto">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isAi ? 'text-slate-400' : 'text-purple-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6D4CFF] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#6D4CFF] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-medium">Formulating academic response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Academic Prompt Chips */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-slate-200/60 dark:border-[#1A2359] bg-slate-50/50 dark:bg-[#07123F] overflow-x-auto">
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center">
              <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Try asking:
            </span>
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-1 rounded-full bg-white dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] text-slate-700 dark:text-slate-300 hover:border-[#6D4CFF] dark:hover:border-[#00D9FF] transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#1A2359] bg-white dark:bg-[#07123F]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Ask a question in ${selectedSubject} (e.g. "Explain semaphores with code")...`}
            className="flex-1 bg-slate-100 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#6D4CFF] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-md shadow-[#6D4CFF]/30 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
