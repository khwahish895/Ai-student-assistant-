import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FileText,
  FileSpreadsheet,
  HelpCircle,
  Calendar,
  BookOpen,
  TrendingUp,
  Target,
  Bookmark,
  History,
  Bell,
  Settings,
  Sparkles,
  Users,
  Layers,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Tutor', path: '/ai-tutor', icon: Bot, badge: 'AI' },
    { name: 'Notes Generator', path: '/notes', icon: FileText, badge: 'AI' },
    { name: 'PDF Summarizer', path: '/documents', icon: FileSpreadsheet, badge: 'AI' },
    { name: 'AI Quizzes', path: '/quizzes', icon: HelpCircle, badge: 'AI' },
    { name: 'Study Planner', path: '/study-planner', icon: Calendar, badge: 'AI' },
    { name: 'My Subjects', path: '/subjects', icon: BookOpen },
    { name: 'My Progress', path: '/progress', icon: TrendingUp },
    { name: 'Recommendations', path: '/recommendations', icon: Target, badge: 'Smart' },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Study History', path: '/history', icon: History },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile & Settings', path: '/profile', icon: Settings },
  ];

  const teacherLinks = [
    { name: 'Teacher Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'My Subjects', path: '/teacher/subjects', icon: BookOpen },
    { name: 'Study Materials', path: '/teacher/materials', icon: FileSpreadsheet },
    { name: 'AI Content Generator', path: '/teacher/content-generator', icon: Sparkles, badge: 'AI' },
    { name: 'Students Monitoring', path: '/teacher/students', icon: Users },
    { name: 'Assignments', path: '/teacher/assignments', icon: FileText },
    { name: 'Quiz Management', path: '/teacher/quizzes', icon: HelpCircle },
    { name: 'Class Analytics', path: '/teacher/analytics', icon: BarChart3 },
    { name: 'Profile & Settings', path: '/profile', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Subjects Management', path: '/admin/subjects', icon: BookOpen },
    { name: 'Content Management', path: '/admin/content', icon: Layers },
    { name: 'AI Usage & Costs', path: '/admin/ai-usage', icon: Sparkles, badge: 'Live' },
    { name: 'Platform Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  let currentNav = studentLinks;
  if (role === 'teacher') currentNav = teacherLinks;
  else if (role === 'admin') currentNav = adminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-68 bg-[#030B2C] text-slate-200 border-r border-[#1A2359] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1A2359] bg-[#07123F]/50">
          <div
            onClick={() => {
              if (role === 'student') navigate('/dashboard');
              else if (role === 'teacher') navigate('/teacher/dashboard');
              else navigate('/admin/dashboard');
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D4CFF] via-[#00D9FF] to-[#6D4CFF] p-0.5 shadow-lg shadow-[#6D4CFF]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#07123F] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00D9FF]" />
              </div>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white flex items-center space-x-1">
                <span>AI STUDENT</span>
                <span className="text-[#00D9FF]">.AI</span>
              </div>
              <div className="text-[10px] font-medium text-slate-400">Intelligent Learning</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A2359]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Pill Banner */}
        <div className="px-4 py-2.5 bg-[#0B1033] border-b border-[#1A2359] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {role === 'student' && <GraduationCap className="w-4 h-4 text-[#00D9FF]" />}
            {role === 'teacher' && <Briefcase className="w-4 h-4 text-[#6D4CFF]" />}
            {role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-semibold capitalize text-slate-200">
              {role} Space
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-[#1A2359] text-[#00D9FF]">
            v2.5
          </span>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white shadow-md shadow-[#6D4CFF]/25'
                      : 'text-slate-300 hover:bg-[#07123F] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      item.badge === 'AI'
                        ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                        : item.badge === 'Live'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[#6D4CFF]/30 text-[#6D4CFF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-[#1A2359] bg-[#07123F]/60">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
