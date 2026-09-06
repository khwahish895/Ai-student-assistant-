import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          id={t.id}
          className="pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border bg-white dark:bg-[#0B1033] border-slate-200 dark:border-[#1A2359] text-slate-800 dark:text-slate-100 transition-all duration-300 transform translate-y-0"
        >
          <div className="flex items-center space-x-3">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#6D4CFF] dark:text-[#00D9FF] shrink-0" />}
            <span className="text-sm font-medium">{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
