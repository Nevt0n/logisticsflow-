import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ClientDashboardPage: React.FC = () => {
  const { clientUser, deliveries, bids } = useApp();
  const navigate = useNavigate();

  const activeDeliveries = deliveries.filter(d => ['COTACAO', 'PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL'].includes(d.status));
  const completedDeliveries = deliveries.filter(d => d.status === 'FINALIZADO');
  const pendingQuotations = deliveries.filter(d => d.status === 'COTACAO');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-primary-container text-white p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-sm">store</span>
            <span>Painel do Embarcador Mercado Full</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight">
            Olá, {clientUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-surface-container-highest/80 text-xs md:text-sm mt-1 leading-relaxed">
            {clientUser.companyName} • Gestão centralizada de envios para os CDs do Mercado Livre Full.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/cliente/nova-solicitacao"
              className="bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Agendar Nova Carga Full</span>
            </Link>
            <Link
              to="/cliente/solicitacoes"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">list_alt</span>
              <span>Minhas Solicitações</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Em Andamento</span>
            <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">{activeDeliveries.length}</p>
          <p className="text-[11px] text-secondary font-semibold mt-1">Cargas em rota / agendadas</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Cotações Abertas</span>
            <span className="material-symbols-outlined text-amber-500 text-lg">request_quote</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">{pendingQuotations.length}</p>
          <p className="text-[11px] text-on-surface-variant mt-1">Aguardando aprovação</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Entregas no Full</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">task_alt</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">{completedDeliveries.length + 45}</p>
          <p className="text-[11px] text-on-surface-variant mt-1">100% no prazo de doca</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Economia Média</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">trending_down</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">28.4%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Comparado a fretes spot</p>
        </div>
      </div>

      {/* Main Grid: Active Deliveries & CD Full Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Freight Tracking List */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">route</span>
              <h2 className="font-headline font-bold text-base text-primary">Envios & Cargas Ativas</h2>
            </div>
            <Link to="/cliente/solicitacoes" className="text-xs font-bold text-secondary hover:underline">
              Ver histórico completo
            </Link>
          </div>

          <div className="space-y-3">
            {deliveries.map((delivery) => {
              const deliveryBids = bids.filter(b => b.requestId === delivery.id);
              return (
                <div
                  key={delivery.id}
                  className="p-4 rounded-xl border border-surface-container-high bg-surface-container-low/40 hover:bg-surface-container-low transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2 py-0.5 rounded">
                        {delivery.protocol}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        delivery.status === 'COTACAO' ? 'bg-amber-100 text-amber-800' :
                        delivery.status === 'EM_TRANSITO' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                        delivery.status === 'FINALIZADO' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {delivery.status === 'COTACAO' && 'Recebendo Orçamentos'}
                        {delivery.status === 'PAGO_AGENDADO' && 'Agendado no Full'}
                        {delivery.status === 'COLETANDO' && 'Coleta em Andamento'}
                        {delivery.status === 'EM_TRANSITO' && 'Em Trânsito para o CD'}
                        {delivery.status === 'DOCA_FULL' && 'Na Doca Mercado Full'}
                        {delivery.status === 'FINALIZADO' && 'Entregue com Sucesso'}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">Criado em: {delivery.createdAt}</span>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-sm text-primary">{delivery.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                        <span className="truncate"><strong>Origem:</strong> {delivery.origin.city} - {delivery.origin.state}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-primary">warehouse</span>
                        <span className="truncate"><strong>Destino:</strong> {delivery.destination.fulfillmentCenterName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span><strong>Janela Doca:</strong> {delivery.destination.dockDate} ({delivery.destination.dockTimeSlot})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">inventory</span>
                        <span>{delivery.cargo.palletsCount} Pallets • {delivery.cargo.weightKg} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-2">
                    {delivery.status === 'COTACAO' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {deliveryBids.length} propostas recebidas
                        </span>
                        <button
                          onClick={() => navigate(`/cliente/orcamentos/${delivery.id}`)}
                          className="bg-primary hover:bg-neutral-800 text-on-primary text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Ver Propostas & Contratar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <img
                          src={delivery.selectedBid?.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                          alt="Motorista"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-on-surface">
                          Motorista: <strong>{delivery.selectedBid?.driverName || 'Carlos Silva'}</strong>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/cliente/chat/${delivery.id}`)}
                        className="p-1.5 rounded-lg border border-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
                        title="Chat com Motorista"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </button>
                      <button
                        onClick={() => navigate(`/motorista/entrega/${delivery.id}`)}
                        className="bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Rastrear</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: CDs Mercado Full Status & Quick Guide */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">hub</span>
              <h2 className="font-headline font-bold text-base text-primary">CDs Full Homologados</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">CD SP01 - Cajamar I</p>
                  <p className="text-[11px] text-on-surface-variant">Docas 01 a 24 • 24 Horas</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Operando Normal</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">CD SP03 - Franco da Rocha</p>
                  <p className="text-[11px] text-on-surface-variant">Docas 12 a 16 • 07h às 23h</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Docas Rápidas</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">CD SP05 - Louveira</p>
                  <p className="text-[11px] text-on-surface-variant">Docas 04 a 18 • 06h às 20h</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Operando Normal</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">CD MG02 - Extrema Polo Sul</p>
                  <p className="text-[11px] text-on-surface-variant">Docas Pesadas • 06h às 22h</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Operando Normal</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary-fixed/20 p-5 rounded-2xl border border-secondary-fixed/40 text-on-secondary-fixed space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              <h3 className="font-headline font-bold text-sm text-secondary">Garantia de Entrega Full</h3>
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Todos os motoristas do LogisticsFlow passam por verificação de ANTT, documentação do veículo e regras de paletização e EPI exigidas pelo Mercado Livre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
