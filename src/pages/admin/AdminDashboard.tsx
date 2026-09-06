import React, { useState } from 'react';
import {
  Shield,
  Users,
  Activity,
  Server,
  Zap,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useData();

  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [safetyFilter, setSafetyFilter] = useState('Strict');
  const [systemNotice, setSystemNotice] = useState('Final semester examinations begin on May 15th. All course evaluations open.');

  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Alex Johnson', email: 'alex.j@university.edu', role: 'student', status: 'Active', joined: 'Jan 2026' },
    { id: 'u2', name: 'Dr. Robert Vance', email: 'r.vance@university.edu', role: 'teacher', status: 'Active', joined: 'Aug 2024' },
    { id: 'u3', name: 'Elena Rostova', email: 'elena.r@university.edu', role: 'student', status: 'Active', joined: 'Feb 2026' },
    { id: 'u4', name: 'Sarah Miller', email: 'sarah.m@university.edu', role: 'student', status: 'Active', joined: 'Jan 2026' },
    { id: 'u5', name: 'Prof. Ananya Sen', email: 'a.sen@university.edu', role: 'teacher', status: 'Active', joined: 'Sep 2023' },
  ]);

  const usageData = [
    { hour: '00:00', tokens: 4200, calls: 120 },
    { hour: '04:00', tokens: 1800, calls: 45 },
    { hour: '08:00', tokens: 12400, calls: 350 },
    { hour: '12:00', tokens: 28900, calls: 780 },
    { hour: '16:00', tokens: 34100, calls: 920 },
    { hour: '20:00', tokens: 26500, calls: 690 },
    { hour: '23:59', tokens: 14200, calls: 380 },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('AI System Parameters & Institution Notice updated', 'success');
  };

  const handleToggleUserRole = (userId: string) => {
    setUsersList(
      usersList.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'student' ? 'teacher' : u.role === 'teacher' ? 'admin' : 'student';
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
    showToast('User role updated', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#030B2C] via-[#07123F] to-[#0B1033] border border-[#1A2359] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1A2359] text-rose-400 text-xs font-bold mb-3 border border-rose-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>System & Campus Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Institutional AI Infrastructure
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Monitor Gemini API consumption, maintain campus role policies, and tune model hyperparameters.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">Gemini 2.5 Flash: Operational</span>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-[#6D4CFF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">1,248</p>
          <p className="text-xs text-emerald-500 font-semibold mt-1">1,120 Students • 128 Faculty</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Daily AI Queries</span>
            <Activity className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">3,285</p>
          <p className="text-xs text-[#00D9FF] font-semibold mt-1">~122K Tokens consumed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Average Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">480ms</p>
          <p className="text-xs text-emerald-500 font-semibold mt-1">99.98% Uptime SLA</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Quota Utilization</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">18.4%</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Plenty of headroom</p>
        </div>
      </div>

      {/* Usage Chart & AI Model Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            24-Hour AI Traffic & Token Velocity
          </h3>
          <p className="text-xs text-slate-400 mb-4">Real-time model inferences across campuses</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2359" opacity={0.2} />
                <XAxis dataKey="hour" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07123F',
                    border: '1px solid #1A2359',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Model Parameter Tuner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] shadow-xs">
          <div className="flex items-center space-x-2 text-[#6D4CFF] mb-4">
            <Sliders className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Campus AI Policy & Guardrails
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Model Temperature</span>
                <span className="font-bold text-[#00D9FF]">{modelTemperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={modelTemperature}
                onChange={(e) => setModelTemperature(Number(e.target.value))}
                className="w-full accent-[#00D9FF]"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Lower = fact-grounded; Higher = creative</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Content Safety Threshold
              </label>
              <select
                value={safetyFilter}
                onChange={(e) => setSafetyFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              >
                <option value="Strict">Strict Academic (Zero Hallucination)</option>
                <option value="Moderate">Moderate (Exploratory Learning)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campus-Wide Announcement Notice
              </label>
              <textarea
                value={systemNotice}
                onChange={(e) => setSystemNotice(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-[#0B1033] border border-slate-200 dark:border-[#1A2359] rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#6D4CFF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6D4CFF] text-white font-bold text-xs shadow-md hover:bg-[#5B3CE6] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Deploy Policy Updates</span>
            </button>
          </form>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 dark:border-[#1A2359] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional User Roster & RBAC
            </h3>
            <p className="text-xs text-slate-400">Manage user authorization and roles</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1A2359] bg-slate-50/50 dark:bg-[#0B1033]/50 text-[11px] font-bold text-slate-400 uppercase">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Switch Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1A2359] text-xs">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#0B1033] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-rose-500/15 text-rose-400'
                          : u.role === 'teacher'
                          ? 'bg-purple-500/15 text-purple-400'
                          : 'bg-cyan-500/15 text-cyan-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-500 font-semibold">{u.status}</span>
                  </td>
                  <td className="p-4 text-slate-400">{u.joined}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleUserRole(u.id)}
                      className="px-3 py-1 rounded-xl border border-slate-200 dark:border-[#1A2359] hover:bg-slate-100 dark:hover:bg-[#121A50] text-[11px] font-semibold text-[#6D4CFF] dark:text-[#00D9FF]"
                    >
                      Cycle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
