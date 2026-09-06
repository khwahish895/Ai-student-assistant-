import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Sparkles,
  Check,
  ChevronDown,
  Menu,
  ShieldCheck,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface TopbarProps {
  onOpenSearch: () => void;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSearch, onToggleSidebar }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = async (newRole: 'student' | 'teacher' | 'admin') => {
    await switchDemoRole(newRole);
    setProfileOpen(false);
    if (newRole === 'student') navigate('/dashboard');
    else if (newRole === 'teacher') navigate('/teacher/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-[#07123F]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1A2359] transition-colors">
      {/* Left side: Mobile Menu Button & Search */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0B1033] hover:bg-slate-200/70 dark:hover:bg-[#0D1546] border border-slate-200/60 dark:border-[#1A2359] transition-all w-48 sm:w-64 md:w-80 text-left"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 truncate">Search everything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Demo Role Badges, Theme, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Seminar Demo Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-[#0B1033] p-1 rounded-xl border border-slate-200 dark:border-[#1A2359] text-xs font-medium">
          <button
            onClick={() => handleRoleSwitch('student')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              role === 'student'
                ? 'bg-[#6D4CFF] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            onClick={() => handleRoleSwitch('teacher')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              role === 'teacher'
                ? 'bg-[#6D4CFF] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              role === 'admin'
                ? 'bg-[#6D4CFF] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033] border border-transparent hover:border-slate-200 dark:hover:border-[#1A2359] transition-all"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033] relative border border-transparent hover:border-slate-200 dark:hover:border-[#1A2359] transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#00D9FF] rounded-full ring-2 ring-white dark:ring-[#07123F]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1A2359] bg-slate-50/50 dark:bg-[#0B1033]/50">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-[#6D4CFF] dark:text-[#00D9FF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1A2359]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifOpen(false);
                      }}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0B1033] ${
                        !n.isRead ? 'bg-[#6D4CFF]/5 dark:bg-[#6D4CFF]/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">Recently</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-[#1A2359] text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setNotifOpen(false);
                  }}
                  className="text-xs font-medium text-[#6D4CFF] dark:text-[#00D9FF] hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1033] transition-all"
          >
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#6D4CFF]/30"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {user?.name || 'Alex Johnson'}
              </div>
              <div className="text-[10px] font-semibold text-[#6D4CFF] dark:text-[#00D9FF] uppercase tracking-wider">
                {role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-[#1A2359]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]">
                  {role.toUpperCase()} ROLE
                </div>
              </div>

              {/* Quick Role Switcher for Seminar demo */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-[#1A2359]">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Demo Role Switcher
                </p>
                <div className="space-y-1">
                  {(['student', 'teacher', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        role === r
                          ? 'bg-[#6D4CFF]/15 text-[#6D4CFF] dark:text-[#00D9FF]'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1033]'
                      }`}
                    >
                      <span className="capitalize">{r} Dashboard</span>
                      {role === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0B1033] flex items-center space-x-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile & Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
