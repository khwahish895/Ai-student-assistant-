import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  Save,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useData();

  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [college, setCollege] = useState(user?.college || 'Stanford Institute of Technology');
  const [course, setCourse] = useState(user?.course || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(user?.semester || '6th Semester');
  const [preferredStudyTime, setPreferredStudyTime] = useState(
    user?.preferredStudyTime || 'Evening (6:00 PM - 10:00 PM)'
  );
  const [profileImage, setProfileImage] = useState(
    user?.profileImage ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [aiTutorTone, setAiTutorTone] = useState<'socratic' | 'encouraging' | 'concise'>('socratic');

  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      college,
      course,
      semester,
      preferredStudyTime,
      profileImage,
    });
    showToast('Profile and learning preferences updated!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
          <UserIcon className="w-6 h-6 text-[#6D4CFF]" />
          <span>Profile & Learning Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your academic profile, AI tutor communication style, and display preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details Card */}
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Academic Identity
          </h2>

          {/* Avatar selector */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#6D4CFF]/30 shadow-lg"
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Choose Profile Avatar
              </label>
              <div className="flex items-center space-x-3">
                {AVATARS.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    onClick={() => setProfileImage(av)}
                    alt={`Avatar option ${idx + 1}`}
                    className={`w-10 h-10 rounded-2xl object-cover cursor-pointer transition-all ${
                      profileImage === av
                        ? 'ring-2 ring-[#00D9FF] scale-110 shadow-md'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email (Read-only Academic ID)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Degree Program
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>
          </div>
        </div>

        {/* AI Tutor & Learning Rhythm Settings */}
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            AI Assistant Personalization
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                AI Tutor Teaching Persona
              </label>
              <select
                value={aiTutorTone}
                onChange={(e) => setAiTutorTone(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="socratic">Socratic & Academic (Guiding Questions & Intuition)</option>
                <option value="encouraging">Encouraging & Enthusiastic (Great for beginner confidence)</option>
                <option value="concise">Concise & Direct (Fast exam revision)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Optimal Study Schedule
              </label>
              <select
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="Morning (6:00 AM - 10:00 AM)">Morning (6:00 AM - 10:00 AM)</option>
                <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="Evening (6:00 PM - 10:00 PM)">Evening (6:00 PM - 10:00 PM)</option>
                <option value="Night Owl (10:00 PM - 2:00 AM)">Night Owl (10:00 PM - 2:00 AM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Theme Settings */}
        <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Theme & Interface Display
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Midnight', icon: Moon },
              { id: 'system', label: 'System Default', icon: Laptop },
            ].map((th) => {
              const Icon = th.icon;
              return (
                <button
                  type="button"
                  key={th.id}
                  onClick={() => setTheme(th.id as any)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-2 ${
                    theme === th.id
                      ? 'bg-[#6D4CFF]/15 border-[#6D4CFF] text-[#6D4CFF] dark:text-[#00D9FF] font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-[#0B1033] border-slate-200 dark:border-[#1A2359] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-sm shadow-lg shadow-[#6D4CFF]/30 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences & Update Profile</span>
        </button>
      </form>
    </div>
  );
};
