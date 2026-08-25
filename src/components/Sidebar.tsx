import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeRole, deliveries } = useApp();

  const pendingQuotationsCount = deliveries.filter(d => d.status === 'COTACAO').length;
  const activeDeliveriesCount = deliveries.filter(d => ['COLETANDO', 'EM_TRANSITO', 'DOCA_FULL'].includes(d.status)).length;

  const clientNavItems = [
    { label: 'Visão Geral (Dashboard)', path: '/cliente/dashboard', icon: 'dashboard' },
    { label: 'Agendar Carga Full', path: '/cliente/nova-solicitacao', icon: 'post_add', highlight: true },
    { label: 'Minhas Solicitações', path: '/cliente/solicitacoes', icon: 'inventory_2', badge: deliveries.length },
    { label: 'Orçamentos Recebidos', path: '/cliente/orcamentos/req-01', icon: 'request_quote', badge: pendingQuotationsCount > 0 ? `${pendingQuotationsCount} novos` : undefined },
    { label: 'Chat com Motorista', path: '/cliente/chat/req-02', icon: 'chat' },
    { label: 'Central de Notificações', path: '/cliente/notificacoes', icon: 'notifications' },
    { label: 'Dados da Empresa', path: '/cadastro-cliente', icon: 'badge' },
  ];

  const driverNavItems = [
    { label: 'Painel do Motorista', path: '/motorista/dashboard', icon: 'speed' },
    { label: 'Cargas Disponíveis (Full)', path: '/motorista/cargas', icon: 'local_shipping', highlight: true, badge: 'Mercado Full' },
    { label: 'Cálculo & Tabela de Frete', path: '/motorista/calculo-frete', icon: 'calculate' },
    { label: 'Agenda de Entregas Full', path: '/motorista/agenda', icon: 'calendar_month' },
    { label: 'Carga em Andamento', path: '/motorista/entrega/req-02', icon: 'route', badge: activeDeliveriesCount > 0 ? 'Ativa' : undefined },
    { label: 'Minhas Cargas & Histórico', path: '/motorista/minhas-cargas', icon: 'receipt_long' },
    { label: 'Gestão de Veículos', path: '/motorista/veiculos', icon: 'directions_car' },
    { label: 'Financeiro & Ganhos', path: '/motorista/financeiro', icon: 'account_balance_wallet' },
    { label: 'Perfil & Avaliações', path: '/motorista/perfil', icon: 'verified_user' },
    { label: 'Chat com Embarcador', path: '/motorista/chat/req-02', icon: 'forum' },
  ];

  const navItems = activeRole === 'CLIENTE' ? clientNavItems : driverNavItems;

  return (
    <aside className="w-64 shrink-0 bg-surface-container-low border-r border-surface-container-high min-h-[calc(100vh-61px)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high flex items-center gap-3 shadow-sm">
          <div className={`p-2 rounded-lg ${activeRole === 'CLIENTE' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'}`}>
            <span className="material-symbols-outlined text-lg">
              {activeRole === 'CLIENTE' ? 'store' : 'local_shipping'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Painel Ativo</span>
            <p className="text-xs font-bold text-primary">
              {activeRole === 'CLIENTE' ? 'Módulo Embarcador' : 'Módulo Transportador'}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-3 mb-2">Navegação Principal</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : item.highlight
                      ? 'bg-secondary-fixed/30 text-secondary hover:bg-secondary-fixed/50 font-semibold'
                      : 'text-on-surface hover:bg-surface-container hover:text-primary'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mercado Full Hub Support Box */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-container-high mt-6">
        <div className="flex items-center gap-2 text-secondary mb-1">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span className="text-xs font-bold font-headline">Padrão Mercado Full</span>
        </div>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Suporte e agendamento direto com conferência de NFs, paletização e janelas de docas homologadas.
        </p>
        <div className="mt-3 pt-2 border-t border-surface-container-high flex items-center justify-between text-[10px] text-on-surface-variant">
          <span>Status: <strong>Online</strong></span>
          <span className="text-secondary font-semibold">CDs SP & MG Ativos</span>
        </div>
      </div>
    </aside>
  );
};
