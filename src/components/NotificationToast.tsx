import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { playNotificationSound } from '../services/notificationService';

export const NotificationToast: React.FC = () => {
  const { notifications } = useApp();
  const navigate = useNavigate();
  const [latestNotif, setLatestNotif] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      const newest = notifications[0];
      if (!newest.read) {
        setLatestNotif(newest);
        setVisible(true);
        playNotificationSound();

        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (!visible || !latestNotif) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div
        onClick={() => {
          if (latestNotif.link) {
            navigate(latestNotif.link);
            setVisible(false);
          }
        }}
        className="bg-primary-container text-white p-4 rounded-2xl border border-secondary-fixed/40 shadow-2xl flex items-start gap-3 cursor-pointer hover:bg-neutral-900 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold shrink-0">
          <span className="material-symbols-outlined text-xl">
            {latestNotif.type === 'BID' ? 'local_offer' : latestNotif.type === 'SUCCESS' ? 'verified' : 'notifications_active'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-bold text-xs text-secondary-fixed truncate">
              {latestNotif.title}
            </h4>
            <span className="text-[10px] text-gray-300 font-mono">Agora</span>
          </div>
          <p className="text-xs text-gray-200 mt-0.5 line-clamp-2 leading-relaxed">
            {latestNotif.description}
          </p>
          <span className="text-[10px] text-secondary-fixed font-bold mt-1 inline-block group-hover:underline">
            Clique para ver detalhes →
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className="text-gray-400 hover:text-white p-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
