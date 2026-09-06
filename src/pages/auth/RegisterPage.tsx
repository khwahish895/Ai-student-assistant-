import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Mail, Lock, Building, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const INTEREST_OPTIONS = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Computer Networks',
  'Database Management',
  'Machine Learning & AI',
  'Web Development',
  'Cybersecurity',
  'Cloud Computing',
];

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('Stanford Institute of Technology');
  const [course, setCourse] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6th Semester');
  const [interests, setInterests] = useState<string[]>(['Data Structures & Algorithms', 'Operating Systems']);
  const [preferredStudyTime, setPreferredStudyTime] = useState('Evening (6:00 PM - 10:00 PM)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        role,
        college,
        course,
        semester,
        interests,
        preferredStudyTime,
      });

      if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030B2C] flex items-center justify-center p-4 sm:p-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#6D4CFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#07123F] border border-[#1A2359] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D4CFF] to-[#00D9FF] p-0.5 shadow-lg shadow-[#6D4CFF]/30 mb-3">
            <div className="w-full h-full bg-[#07123F] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00D9FF]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white">Create Academic Account</h2>
          <p className="text-sm text-slate-300 mt-1">Unlock personalized AI tutoring and study management</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Academic Role
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    role === r
                      ? 'bg-[#6D4CFF] text-white border-[#6D4CFF] shadow-lg shadow-[#6D4CFF]/30'
                      : 'bg-[#0B1033] text-slate-300 border-[#1A2359] hover:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@university.edu"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                College / University
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Degree Course / Program
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Semester / Year
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="1st Semester">1st Semester (Freshman)</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester (Sophomore)</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester (Junior)</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester (Senior)</option>
                <option value="8th Semester">8th Semester</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Learning Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const active = interests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#00D9FF] text-[#030B2C] font-bold shadow-md shadow-[#00D9FF]/20'
                        : 'bg-[#0B1033] text-slate-300 border border-[#1A2359] hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Study Time */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Study Rhythm
            </label>
            <select
              value={preferredStudyTime}
              onChange={(e) => setPreferredStudyTime(e.target.value)}
              className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6D4CFF]"
            >
              <option value="Morning (6:00 AM - 10:00 AM)">Morning (6:00 AM - 10:00 AM)</option>
              <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
              <option value="Evening (6:00 PM - 10:00 PM)">Evening (6:00 PM - 10:00 PM)</option>
              <option value="Night Owl (10:00 PM - 2:00 AM)">Night Owl (10:00 PM - 2:00 AM)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] hover:from-[#5B3CE6] hover:to-[#6D4CFF] text-white font-bold text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>Creating your AI profile...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#00D9FF] font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
