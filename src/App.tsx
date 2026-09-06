import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DashboardLayout } from './layouts/DashboardLayout';

// Auth pages
import { SplashScreen } from './pages/auth/SplashScreen';
import { OnboardingScreen } from './pages/auth/OnboardingScreen';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AITutorPage } from './pages/student/AITutorPage';
import { NotesPage } from './pages/student/NotesPage';
import { DocumentsPage } from './pages/student/DocumentsPage';
import { QuizzesPage } from './pages/student/QuizzesPage';
import { StudyPlannerPage } from './pages/student/StudyPlannerPage';
import { SubjectsPage } from './pages/student/SubjectsPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { RecommendationsPage } from './pages/student/RecommendationsPage';
import { BookmarksPage } from './pages/student/BookmarksPage';
import { HistoryPage } from './pages/student/HistoryPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { ProfileSettingsPage } from './pages/student/ProfileSettingsPage';

// Teacher pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherContentGenerator } from './pages/teacher/TeacherContentGenerator';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';
import { TeacherAssignmentsPage } from './pages/teacher/TeacherAssignmentsPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Root Route Decider: redirects based on role or renders student dashboard
const RootRoleRedirect: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030B2C]">
        <div className="w-8 h-8 border-4 border-[#6D4CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'teacher') {
    return <Navigate to="/teacher" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <StudentDashboard />;
};

// Protected Layout Route wrapper
const ProtectedDashboardRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030B2C]">
        <div className="w-8 h-8 border-4 border-[#6D4CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-50 dark:bg-[#030B2C] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/onboarding" element={<OnboardingScreen />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Main Core Protected Route with layout */}
                <Route
                  path="/"
                  element={
                    <ProtectedDashboardRoute>
                      <RootRoleRedirect />
                    </ProtectedDashboardRoute>
                  }
                />

                {/* Student Pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedDashboardRoute>
                      <StudentDashboard />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/ai-tutor"
                  element={
                    <ProtectedDashboardRoute>
                      <AITutorPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <ProtectedDashboardRoute>
                      <NotesPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedDashboardRoute>
                      <DocumentsPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/quizzes"
                  element={
                    <ProtectedDashboardRoute>
                      <QuizzesPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/study-planner"
                  element={
                    <ProtectedDashboardRoute>
                      <StudyPlannerPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/subjects"
                  element={
                    <ProtectedDashboardRoute>
                      <SubjectsPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedDashboardRoute>
                      <ProgressPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedDashboardRoute>
                      <RecommendationsPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <ProtectedDashboardRoute>
                      <BookmarksPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedDashboardRoute>
                      <HistoryPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedDashboardRoute>
                      <NotificationsPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedDashboardRoute>
                      <ProfileSettingsPage />
                    </ProtectedDashboardRoute>
                  }
                />

                {/* Teacher Interface Routes */}
                <Route
                  path="/teacher"
                  element={
                    <ProtectedDashboardRoute>
                      <TeacherDashboard />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/teacher/content-generator"
                  element={
                    <ProtectedDashboardRoute>
                      <TeacherContentGenerator />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/teacher/students"
                  element={
                    <ProtectedDashboardRoute>
                      <TeacherStudentsPage />
                    </ProtectedDashboardRoute>
                  }
                />
                <Route
                  path="/teacher/assignments"
                  element={
                    <ProtectedDashboardRoute>
                      <TeacherAssignmentsPage />
                    </ProtectedDashboardRoute>
                  }
                />

                {/* Admin Interface Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedDashboardRoute>
                      <AdminDashboard />
                    </ProtectedDashboardRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Global overlays */}
              <ToastContainer />
              <GlobalSearchModal />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
