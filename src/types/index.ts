export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  course?: string;
  semester?: string;
  interests?: string[];
  preferredStudyTime?: string;
  profileImage?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId?: string;
  teacherName?: string;
  topicsCount: number;
  completedTopics: number;
  progress: number;
  averageScore: number;
  lastStudiedTopic?: string;
  color?: string;
  iconName?: string;
  credits?: number;
  semester?: string;
  topics?: string[];
}

export interface Note {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  style: 'Key Points' | 'Detailed Notes' | 'Examples' | 'Code' | 'Exam Focus' | 'Definitions';
  content: string;
  keyPoints: string[];
  importantDefinitions?: { term: string; definition: string }[];
  examPoints?: string[];
  summary: string;
  possibleQuestions?: string[];
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  filename: string;
  fileSize: string;
  fileType: string;
  extractedText?: string;
  summary: string;
  keyPoints: string[];
  importantTerms?: { term: string; definition: string }[];
  extractedConcepts?: string[];
  examFocus?: string[];
  questions?: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

export interface Quiz {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  questionType: 'MCQ' | 'True/False' | 'Short Answer' | string;
  totalQuestions: number;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  score?: number;
  correctAnswersCount?: number;
  timeTakenSeconds?: number;
  aiFeedback?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
  };
  createdAt: string;
  completedAt?: string;
}

export interface StudyPlanItem {
  id: string;
  day: string;
  time?: string;
  subject: string;
  topic: string;
  activity?: string;
  duration?: string;
  durationMinutes?: number;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  examDate: string;
  dailyHours: number;
  targetScore: number;
  subjectsKnowledge: { subject: string; proficiency: number }[];
  schedule: StudyPlanItem[];
  items?: StudyPlanItem[];
  progress?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  conversationId?: string;
  sender: 'user' | 'ai';
  text: string;
  codeSnippet?: string;
  language?: string;
  keyPoints?: string[];
  timestamp: string;
  bookmarked?: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  contentType: 'ai_answer' | 'note' | 'quiz' | 'pdf_summary' | string;
  contentId: string;
  title: string;
  snippet: string;
  subjectName?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'progress' | 'recommendation' | 'quiz' | 'achievement' | string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  subject: string;
  reason: string;
  actionLabel?: string;
  actionLink?: string;
  actionType?: 'quiz' | 'note' | 'tutor' | 'planner' | string;
  subjectId?: string;
  topic?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface HistoryItem {
  id: string;
  userId: string;
  actionType: 'asked_ai' | 'generated_notes' | 'completed_quiz' | 'summarized_pdf' | 'created_plan' | string;
  activityType?: string;
  subjectName?: string;
  title: string;
  subtitle?: string;
  score?: number;
  targetId?: string;
  targetType?: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  deadline: string;
  totalStudents: number;
  submittedCount: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  content: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
  submittedAt: string;
}

export interface AIUsageStats {
  totalRequests: number;
  chatRequests: number;
  notesGenerated: number;
  quizzesGenerated: number;
  pdfSummaries: number;
  studyPlansGenerated: number;
  estimatedTokens: number;
  apiErrors: number;
  status: 'operational' | 'degraded';
}

export interface StudentProgress {
  overallProgress: number;
  studyHoursTotal: number;
  totalStudyHours?: number;
  topicsCompleted: number;
  quizzesCompleted: number;
  completedQuizzesCount?: number;
  currentStreakDays: number;
  currentStreak?: number;
  averageQuizScore: number;
  averageScore?: number;
  notesCreated: number;
  notesCount?: number;
  strongTopics?: string[];
  weakTopics?: string[];
  weeklyHours: { day: string; hours: number; quizzes: number }[];
  subjectPerformances: { subject: string; score: number; progress: number }[];
}
