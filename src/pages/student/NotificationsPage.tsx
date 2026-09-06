import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-6 h-6 text-[#6D4CFF]" />
            <span>Academic Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with exam alerts, teacher announcements, and AI study tips.
          </p>
        </div>

        <button
          onClick={() => markAllNotificationsRead()}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1033] hover:bg-slate-200 dark:hover:bg-[#1A2359] border border-slate-200 dark:border-[#1A2359] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-emerald-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#07123F] border border-slate-200 dark:border-[#1A2359] p-4 sm:p-6 shadow-xs divide-y divide-slate-100 dark:divide-[#1A2359]">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`py-4 transition-colors flex items-start justify-between gap-4 ${
                !notif.isRead ? 'bg-[#6D4CFF]/5 dark:bg-[#6D4CFF]/10 px-4 rounded-2xl' : 'px-2'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {notif.link && (
                  <button
                    onClick={() => {
                      markNotificationRead(notif.id);
                      navigate(notif.link);
                    }}
                    className="p-2 text-xs font-bold text-[#6D4CFF] dark:text-[#00D9FF] hover:underline flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
