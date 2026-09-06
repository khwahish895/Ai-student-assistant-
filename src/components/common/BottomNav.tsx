import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bot, BookOpen, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { role } = useAuth();

  // If teacher or admin, adjust home path accordingly
  const homePath = role === 'teacher' ? '/teacher/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard';

  const navItems = [
    { label: 'Home', path: homePath, icon: Home },
    { label: 'AI', path: '/ai-tutor', icon: Bot, isSpecial: true },
    { label: 'Study', path: role === 'student' ? '/notes' : '/teacher/materials', icon: BookOpen },
    { label: 'Progress', path: role === 'student' ? '/progress' : '/teacher/analytics', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-[#030B2C]/95 backdrop-blur-lg border-t border-slate-200 dark:border-[#1A2359] px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                item.isSpecial
                  ? 'text-[#6D4CFF] dark:text-[#00D9FF] font-bold'
                  : isActive
                  ? 'text-[#6D4CFF] dark:text-[#00D9FF] font-bold'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    item.isSpecial
                      ? 'bg-[#6D4CFF]/15 dark:bg-[#00D9FF]/15 scale-110'
                      : isActive
                      ? 'scale-105'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
