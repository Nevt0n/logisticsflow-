import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout, activeRole, notifications, markNotificationAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-surface-container-high px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <Link to={activeRole === 'CLIENTE' ? '/cliente/dashboard' : '/motorista/dashboard'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl text-secondary-fixed">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-primary tracking-tight">LogisticsFlow</span>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Full Hub
              </span>
            </div>
            <p className="text-xs text-on-surface-variant hidden sm:block">Agendamento & Fretes Mercado Full</p>
          </div>
        </Link>
      </div>

      {/* Center: Fixed Account Type Badge */}
      <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-xl border border-surface-container-high text-xs font-bold text-primary">
        <span className="material-symbols-outlined text-base text-secondary">
          {activeRole === 'CLIENTE' ? 'storefront' : 'local_shipping'}
        </span>
        <span>
          {activeRole === 'CLIENTE' ? 'Conta de Embarcador (Seller)' : 'Conta de Motorista Homologado'}
        </span>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick New Request button for Clients */}
        {activeRole === 'CLIENTE' && (
          <Link
            to="/cliente/nova-solicitacao"
            className="hidden md:flex items-center gap-1.5 bg-secondary hover:bg-opacity-90 text-on-secondary px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Agendar Carga Full</span>
          </Link>
        )}

        {/* Quick Calculate freight for Drivers */}
        {activeRole === 'MOTORISTA' && (
          <Link
            to="/motorista/cargas"
            className="hidden md:flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition hover:bg-opacity-90 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Buscar Cargas Full</span>
          </Link>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
            title="Notificações"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">notifications_active</span>
                  <h3 className="font-headline font-bold text-sm text-primary">Notificações Recentes</h3>
                </div>
                <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                  {unreadCount} novas
                </span>
              </div>

              <div className="divide-y divide-surface-container-high max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-4 text-center">Nenhuma notificação no momento.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3 text-left rounded-lg cursor-pointer hover:bg-surface-container-low transition flex items-start gap-3 my-1 ${
                        !notif.read ? 'bg-surface-container-low/60 font-medium' : 'opacity-80'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        notif.type === 'SUCCESS' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                        notif.type === 'BID' ? 'bg-primary-fixed text-on-primary-fixed' :
                        'bg-surface-container-high text-on-surface'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {notif.type === 'BID' ? 'local_offer' : notif.type === 'SUCCESS' ? 'check_circle' : 'info'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-primary truncate">{notif.title}</p>
                          <span className="text-[10px] text-on-surface-variant shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{notif.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-surface-container-high text-center">
                <Link
                  to={activeRole === 'CLIENTE' ? '/cliente/notificacoes' : '/motorista/notificacoes'}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  Ver todas as notificações
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-container-high">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary-fixed/50"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-primary truncate max-w-[140px]">{currentUser.name}</p>
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined text-xs text-amber-500 fill-1">star</span>
              <span>{currentUser.rating}</span>
              <span>•</span>
              <span className="truncate max-w-[90px]">{currentUser.role === 'CLIENTE' ? 'Embarcador' : 'Motorista'}</span>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            title="Encerrar Sessão / Trocar Usuário"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition ml-1"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
