import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex.student@university.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, selectedRole);
      if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('alex.student@university.edu');
      setPassword('student123');
    } else if (role === 'teacher') {
      setEmail('prof.sharma@university.edu');
      setPassword('teacher123');
    } else {
      setEmail('admin@university.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#030B2C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6D4CFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#07123F] border border-[#1A2359] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D4CFF] to-[#00D9FF] p-0.5 shadow-lg shadow-[#6D4CFF]/30 mb-3">
            <div className="w-full h-full bg-[#07123F] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00D9FF]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back 👋</h2>
          <p className="text-sm text-slate-300 mt-1">Continue your intelligent learning journey</p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-6 p-3 rounded-2xl bg-[#0B1033] border border-[#1A2359]">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Personas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoUser('student')}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                selectedRole === 'student'
                  ? 'bg-[#6D4CFF] text-white shadow-md'
                  : 'bg-[#07123F] text-slate-300 hover:text-white border border-[#1A2359]'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-1" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoUser('teacher')}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-[#6D4CFF] text-white shadow-md'
                  : 'bg-[#07123F] text-slate-300 hover:text-white border border-[#1A2359]'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-1" />
              <span>Teacher</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoUser('admin')}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[#6D4CFF] text-white shadow-md'
                  : 'bg-[#07123F] text-slate-300 hover:text-white border border-[#1A2359]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="name@university.edu"
                className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#1A2359] bg-[#0B1033] text-[#6D4CFF] focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#00D9FF] hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] hover:from-[#5B3CE6] hover:to-[#6D4CFF] text-white font-bold text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google SSO Demo Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B1033] hover:bg-[#0E1546] border border-[#1A2359] text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with University Google ID</span>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an academic account?{' '}
          <Link to="/register" className="text-[#00D9FF] font-bold hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};
