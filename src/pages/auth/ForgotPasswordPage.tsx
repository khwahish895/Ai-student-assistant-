import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import * as api from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [email, setEmail] = useState('alex.student@university.edu');
  const [demoCode, setDemoCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setDemoCode(res.demoCode);
      setInputCode(res.demoCode); // prefill demo code for effortless testing!
      setMessage(res.message);
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to request reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.resetPassword(email, inputCode, newPassword);
      setMessage(res.message);
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030B2C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#6D4CFF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#07123F] border border-[#1A2359] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0B1033] border border-[#1A2359] mb-3">
            <KeyRound className="w-6 h-6 text-[#00D9FF]" />
          </div>
          <h2 className="text-2xl font-black text-white">Reset Password</h2>
          <p className="text-sm text-slate-300 mt-1">
            {step === 'request' && 'Enter your university email to receive a recovery code'}
            {step === 'reset' && 'Enter the verification code and your new password'}
            {step === 'done' && 'Password updated successfully!'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-4">
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
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] hover:from-[#5B3CE6] hover:to-[#6D4CFF] text-white font-bold text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <span>Sending Code...</span> : <span>Send Recovery Code</span>}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="p-3 bg-[#0B1033] border border-[#1A2359] rounded-xl text-xs text-[#00D9FF]">
              Demo code sent: <strong className="text-white text-sm">{demoCode}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. 583921"
                className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl px-4 py-2.5 text-sm text-white text-center tracking-widest font-mono focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#0B1033] border border-[#1A2359] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6D4CFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#5B3CE6] text-white font-bold text-sm shadow-lg shadow-[#6D4CFF]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <span>Updating...</span> : <span>Confirm New Password</span>}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-sm text-slate-200">{message || 'Your password has been reset.'}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6D4CFF] text-white font-bold text-sm"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
