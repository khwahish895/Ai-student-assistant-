import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenSplash: boolean;
  setHasSeenSplash: (val: boolean) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  login: (email: string, role?: UserRole) => Promise<User>;
  register: (userData: Partial<User>) => Promise<User>;
  logout: () => void;
  switchDemoRole: (newRole: UserRole) => Promise<User>;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, { email: string; name: string }> = {
  student: {
    email: 'alex.student@university.edu',
    name: 'Alex Johnson',
  },
  teacher: {
    email: 'prof.sharma@university.edu',
    name: 'Prof. Priya Sharma',
  },
  admin: {
    email: 'admin@university.edu',
    name: 'Dr. Arthur Pendelton',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSeenSplash, setHasSeenSplashState] = useState<boolean>(() => {
    return sessionStorage.getItem('ai_seen_splash') === 'true';
  });
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('ai_onboarding_completed') === 'true';
  });

  useEffect(() => {
    // Check saved session
    const savedUserStr = localStorage.getItem('ai_assistant_user');
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    } else {
      // Default to student demo user for effortless instant evaluation!
      const defaultStudent: User = {
        id: 'usr_student_1',
        name: 'Alex Johnson',
        email: 'alex.student@university.edu',
        role: 'student',
        college: 'Stanford Institute of Technology',
        course: 'Computer Science & Engineering',
        semester: '6th Semester',
        interests: ['Data Structures & Algorithms', 'Operating Systems', 'Artificial Intelligence', 'Full-Stack Development'],
        preferredStudyTime: 'Evening (6:00 PM - 10:00 PM)',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-15T08:00:00Z',
      };
      setUser(defaultStudent);
      localStorage.setItem('ai_assistant_user', JSON.stringify(defaultStudent));
    }
    setIsLoading(false);
  }, []);

  const setHasSeenSplash = (val: boolean) => {
    setHasSeenSplashState(val);
    if (val) sessionStorage.setItem('ai_seen_splash', 'true');
    else sessionStorage.removeItem('ai_seen_splash');
  };

  const setHasCompletedOnboarding = (val: boolean) => {
    setHasCompletedOnboardingState(val);
    if (val) localStorage.setItem('ai_onboarding_completed', 'true');
    else localStorage.removeItem('ai_onboarding_completed');
  };

  const login = async (email: string, role?: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await api.loginUser(email, role);
      setUser(data.user);
      localStorage.setItem('ai_assistant_user', JSON.stringify(data.user));
      localStorage.setItem('ai_assistant_token', data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await api.registerUser(userData);
      setUser(data.user);
      localStorage.setItem('ai_assistant_user', JSON.stringify(data.user));
      localStorage.setItem('ai_assistant_token', data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_assistant_user');
    localStorage.removeItem('ai_assistant_token');
  };

  const switchDemoRole = async (newRole: UserRole): Promise<User> => {
    const demo = DEMO_USERS[newRole];
    return await login(demo.email, newRole);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('ai_assistant_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        isLoading,
        hasCompletedOnboarding,
        hasSeenSplash,
        setHasSeenSplash,
        setHasCompletedOnboarding,
        login,
        register,
        logout,
        switchDemoRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
