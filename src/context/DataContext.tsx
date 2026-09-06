import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subject,
  Note,
  DocumentItem,
  Quiz,
  StudyPlan,
  Bookmark,
  NotificationItem,
  Recommendation,
  HistoryItem,
  StudentProgress,
  AIUsageStats,
} from '../types';
import * as api from '../services/api';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataContextType {
  subjects: Subject[];
  notes: Note[];
  documents: DocumentItem[];
  quizzes: Quiz[];
  studyPlans: StudyPlan[];
  bookmarks: Bookmark[];
  notifications: NotificationItem[];
  recommendations: Recommendation[];
  history: HistoryItem[];
  progress: StudentProgress | null;
  aiUsage: AIUsageStats | null;
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshAll: () => Promise<void>;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => Promise<void>;
  addDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => Promise<void>;
  addQuizResult: (quiz: Quiz) => void;
  addStudyPlan: (plan: StudyPlan) => void;
  toggleBookmark: (contentType: 'ai_answer' | 'note' | 'quiz' | 'pdf_summary', contentId: string, title: string, snippet?: string, subjectName?: string) => Promise<void>;
  isBookmarked: (contentId: string) => boolean;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [aiUsage, setAiUsage] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshAll = async () => {
    try {
      const [
        subjRes,
        notesRes,
        docsRes,
        quizzesRes,
        plansRes,
        bmRes,
        notifRes,
        recRes,
        histRes,
        progRes,
        usageRes,
      ] = await Promise.all([
        api.fetchSubjects(),
        api.fetchNotes(),
        api.fetchDocuments(),
        api.fetchQuizzes(),
        api.fetchStudyPlans(),
        api.fetchBookmarks(),
        api.fetchNotifications(),
        api.fetchRecommendations(),
        api.fetchHistory(),
        api.fetchProgress(),
        api.fetchAIUsage(),
      ]);

      if (subjRes?.subjects) setSubjects(subjRes.subjects);
      if (notesRes?.notes) setNotes(notesRes.notes);
      if (docsRes?.documents) setDocuments(docsRes.documents);
      if (quizzesRes?.quizzes) setQuizzes(quizzesRes.quizzes);
      if (plansRes?.plans) setStudyPlans(plansRes.plans);
      if (bmRes?.bookmarks) setBookmarks(bmRes.bookmarks);
      if (notifRes?.notifications) setNotifications(notifRes.notifications);
      if (recRes?.recommendations) setRecommendations(recRes.recommendations);
      if (histRes?.history) setHistory(histRes.history);
      if (progRes?.progress) setProgress(progRes.progress);
      if (usageRes?.usage) setAiUsage(usageRes.usage);
    } catch (e) {
      console.error('Error refreshing app data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
    showToast('✨ Study Note generated and saved!', 'success');
  };

  const deleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await api.deleteNote(id);
    showToast('Note deleted', 'info');
  };

  const addDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
    showToast('📄 Document parsed and summarized!', 'success');
  };

  const deleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    await api.deleteDocument(id);
    showToast('Document removed', 'info');
  };

  const addQuizResult = (quiz: Quiz) => {
    setQuizzes((prev) => [quiz, ...prev]);
    showToast(`🎉 Quiz completed! Score: ${quiz.score}%`, 'success');
  };

  const addStudyPlan = (plan: StudyPlan) => {
    setStudyPlans((prev) => [plan, ...prev]);
    showToast('📅 AI Study Plan generated!', 'success');
  };

  const toggleBookmark = async (
    contentType: 'ai_answer' | 'note' | 'quiz' | 'pdf_summary',
    contentId: string,
    title: string,
    snippet: string = '',
    subjectName: string = 'General'
  ) => {
    const isCurrentlyBookmarked = bookmarks.some((b) => b.contentId === contentId);
    if (isCurrentlyBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.contentId !== contentId));
      showToast('Bookmark removed', 'info');
    } else {
      const newBm: Bookmark = {
        id: `bm_${Date.now()}`,
        userId: 'usr_student_1',
        contentType,
        contentId,
        title,
        snippet,
        subjectName,
        createdAt: new Date().toISOString(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast('🔖 Saved to Bookmarks', 'success');
    }
    await api.toggleBookmark({ contentType, contentId, title, snippet, subjectName });
  };

  const isBookmarked = (contentId: string) => {
    return bookmarks.some((b) => b.contentId === contentId);
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await api.markNotificationRead(id);
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await api.markAllNotificationsRead();
    showToast('All notifications marked as read', 'info');
  };

  return (
    <DataContext.Provider
      value={{
        subjects,
        notes,
        documents,
        quizzes,
        studyPlans,
        bookmarks,
        notifications,
        recommendations,
        history,
        progress,
        aiUsage,
        isLoading,
        toasts,
        showToast,
        removeToast,
        refreshAll,
        addNote,
        deleteNote,
        addDocument,
        deleteDocument,
        addQuizResult,
        addStudyPlan,
        toggleBookmark,
        isBookmarked,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
