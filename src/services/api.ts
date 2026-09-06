import {
  User,
  Subject,
  Note,
  DocumentItem,
  Quiz,
  StudyPlan,
  Bookmark,
  NotificationItem,
  Recommendation,
  HistoryItem,
  Assignment,
  Submission,
  StudentProgress,
  AIUsageStats,
} from '../types';

const BASE_URL = '/api';

export async function loginUser(email: string, role?: string): Promise<{ user: User; token: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export async function registerUser(userData: Partial<User>): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await res.json();
}

export async function forgotPassword(email: string): Promise<{ message: string; demoCode: string }> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function resetPassword(email: string, code: string, newPass: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPass }),
  });
  return await res.json();
}

export async function askAITutor(
  messageOrPayload: string | { question: string; subject?: string; mode?: string },
  history: any[] = []
): Promise<{ text: string; answer: string; source?: string }> {
  const message = typeof messageOrPayload === 'string' ? messageOrPayload : messageOrPayload.question;
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory: history }),
  });
  const data = await res.json();
  const replyText = data.text || data.answer || '';
  return { text: replyText, answer: replyText, source: data.source };
}

export async function generateNotesAI(payload: {
  topic: string;
  subject: string;
  difficulty: string;
  style: string;
  numSections: number;
}): Promise<{ note: Note }> {
  const res = await fetch(`${BASE_URL}/ai/generate-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function summarizePDF(payload: {
  filename: string;
  fileContentText: string;
  summaryLength: string;
}): Promise<{ document: DocumentItem }> {
  const res = await fetch(`${BASE_URL}/ai/summarize-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function askDocumentQA(documentId: string, question: string): Promise<{ answer: string }> {
  const res = await fetch(`${BASE_URL}/ai/document-qa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, question }),
  });
  return await res.json();
}

export async function generateQuizAI(payload: {
  topic: string;
  subject: string;
  totalQuestions: number;
  difficulty: string;
  questionType: string;
}): Promise<{ quiz: Quiz }> {
  const res = await fetch(`${BASE_URL}/ai/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function submitQuizAI(payload: {
  quizId: string;
  answers: Record<string, string>;
  timeTakenSeconds: number;
}): Promise<{ result: Quiz }> {
  const res = await fetch(`${BASE_URL}/ai/submit-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function generateStudyPlanAI(payload: {
  examDate: string;
  dailyHours: number;
  subjectsKnowledge: { subject: string; proficiency: number }[];
  targetScore: number;
}): Promise<{ plan: StudyPlan }> {
  const res = await fetch(`${BASE_URL}/ai/generate-study-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function fetchRecommendations(): Promise<{ recommendations: Recommendation[] }> {
  const res = await fetch(`${BASE_URL}/ai/recommendations`);
  return await res.json();
}

export async function generateTeacherContentAI(payload: {
  subject: string;
  topic: string;
  difficulty: string;
  contentType: string;
  count: number;
}): Promise<any> {
  const res = await fetch(`${BASE_URL}/ai/teacher-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function fetchSubjects(): Promise<{ subjects: Subject[] }> {
  const res = await fetch(`${BASE_URL}/subjects`);
  return await res.json();
}

export async function createSubject(payload: Partial<Subject>): Promise<{ subject: Subject }> {
  const res = await fetch(`${BASE_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function fetchNotes(): Promise<{ notes: Note[] }> {
  const res = await fetch(`${BASE_URL}/notes`);
  return await res.json();
}

export async function deleteNote(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchDocuments(): Promise<{ documents: DocumentItem[] }> {
  const res = await fetch(`${BASE_URL}/documents`);
  return await res.json();
}

export async function deleteDocument(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/documents/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchQuizzes(): Promise<{ quizzes: Quiz[] }> {
  const res = await fetch(`${BASE_URL}/quizzes`);
  return await res.json();
}

export async function fetchStudyPlans(): Promise<{ plans: StudyPlan[] }> {
  const res = await fetch(`${BASE_URL}/study-plans`);
  return await res.json();
}

export async function toggleStudyPlanItem(planId: string, itemId: string, completed?: boolean): Promise<any> {
  const res = await fetch(`${BASE_URL}/study-plans/${planId}/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return await res.json();
}

export async function fetchBookmarks(): Promise<{ bookmarks: Bookmark[] }> {
  const res = await fetch(`${BASE_URL}/bookmarks`);
  return await res.json();
}

export async function toggleBookmark(payload: Partial<Bookmark>): Promise<any> {
  const res = await fetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function fetchNotifications(): Promise<{ notifications: NotificationItem[] }> {
  const res = await fetch(`${BASE_URL}/notifications`);
  return await res.json();
}

export async function markNotificationRead(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'PATCH' });
  return await res.json();
}

export async function markAllNotificationsRead(): Promise<any> {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, { method: 'POST' });
  return await res.json();
}

export async function fetchAssignments(): Promise<{ assignments: Assignment[]; submissions: Submission[] }> {
  const res = await fetch(`${BASE_URL}/assignments`);
  return await res.json();
}

export async function createAssignment(payload: Partial<Assignment>): Promise<{ assignment: Assignment }> {
  const res = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function submitAssignment(assignmentId: string, content: string, studentName?: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, studentName }),
  });
  return await res.json();
}

export async function fetchProgress(): Promise<{ progress: StudentProgress }> {
  const res = await fetch(`${BASE_URL}/progress`);
  return await res.json();
}

export async function fetchHistory(): Promise<{ history: HistoryItem[] }> {
  const res = await fetch(`${BASE_URL}/history`);
  return await res.json();
}

export async function fetchAIUsage(): Promise<{ usage: AIUsageStats }> {
  const res = await fetch(`${BASE_URL}/ai/usage`);
  return await res.json();
}

export async function fetchAllUsers(): Promise<{ users: User[] }> {
  const res = await fetch(`${BASE_URL}/users`);
  return await res.json();
}

export async function updateUser(id: string, updates: Partial<User>): Promise<any> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return await res.json();
}

export async function deleteUser(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function globalSearch(q: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);
  return await res.json();
}
