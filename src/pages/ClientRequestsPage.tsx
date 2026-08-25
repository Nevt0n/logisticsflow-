import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ClientRequestsPage: React.FC = () => {
  const { deliveries } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'COTACAO' | 'ACTIVE' | 'FINALIZADO'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'COTACAO' && d.status !== 'COTACAO') return false;
    if (filter === 'ACTIVE' && !['PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL'].includes(d.status)) return false;
    if (filter === 'FINALIZADO' && d.status !== 'FINALIZADO') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        d.protocol.toLowerCase().includes(term) ||
        d.title.toLowerCase().includes(term) ||
        d.cargo.invoiceNumber.toLowerCase().includes(term) ||
        d.destination.fulfillmentCenterName.toLowerCase().includes(term) ||
        d.destination.fullSchedulingCode.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Minhas Solicitações de Entrega Full
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gerencie todos os seus agendamentos, cotações abertas e histórico de envios para os CDs do Mercado Livre.
          </p>
        </div>

        <Link
          to="/cliente/nova-solicitacao"
          className="bg-secondary hover:bg-opacity-90 text-on-secondary font-headline font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Nova Carga Full</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Todas ({deliveries.length})
          </button>
          <button
            onClick={() => setFilter('COTACAO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'COTACAO' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Em Cotação
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ACTIVE' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Em Trânsito / Agendadas
          </button>
          <button
            onClick={() => setFilter('FINALIZADO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'FINALIZADO' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Concluídas
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Buscar por protocolo, NF-e, código Full ou CD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3">
        {filteredDeliveries.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <p className="text-sm font-bold text-primary mt-2">Nenhuma solicitação encontrada</p>
            <p className="text-xs text-on-surface-variant">Tente mudar o termo de busca ou o filtro de status selecionado.</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-secondary-fixed transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2.5 py-1 rounded-lg">
                    {delivery.protocol}
                  </span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    delivery.status === 'COTACAO' ? 'bg-amber-100 text-amber-800' :
                    delivery.status === 'EM_TRANSITO' ? 'bg-blue-100 text-blue-800' :
                    delivery.status === 'FINALIZADO' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {delivery.status === 'COTACAO' && 'Recebendo Orçamentos'}
                    {delivery.status === 'PAGO_AGENDADO' && 'Pago & Agendado'}
                    {delivery.status === 'COLETANDO' && 'Coletando na Origem'}
                    {delivery.status === 'EM_TRANSITO' && 'Em Trânsito'}
                    {delivery.status === 'DOCA_FULL' && 'Na Doca Mercado Full'}
                    {delivery.status === 'FINALIZADO' && 'Entregue com Sucesso'}
                  </span>
                </div>

                <span className="text-xs text-on-surface-variant font-mono">
                  {delivery.cargo.invoiceNumber}
                </span>
              </div>

              <div>
                <h3 className="font-headline font-bold text-base text-primary">{delivery.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs text-on-surface-variant bg-surface-container-low/40 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Destino CD Full:</span>
                    <p className="font-semibold text-primary">{delivery.destination.fulfillmentCenterName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Janela de Doca:</span>
                    <p className="font-semibold text-primary">{delivery.destination.dockDate} ({delivery.destination.dockTimeSlot})</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Agendamento Full:</span>
                    <p className="font-mono font-bold text-secondary">{delivery.destination.fullSchedulingCode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Carga:</span>
                    <p className="font-semibold text-primary">{delivery.cargo.palletsCount} Pallets ({delivery.cargo.weightKg} kg)</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-on-surface-variant">
                  {delivery.selectedBid ? (
                    <span>Motorista: <strong className="text-primary">{delivery.selectedBid.driverName}</strong> • {delivery.selectedBid.vehicleModel}</span>
                  ) : (
                    <span className="text-amber-700 font-semibold">Aguardando seleção de motorista</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {delivery.status === 'COTACAO' ? (
                    <button
                      onClick={() => navigate(`/cliente/orcamentos/${delivery.id}`)}
                      className="bg-primary hover:bg-neutral-800 text-on-primary text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Ver Propostas
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate(`/cliente/comprovante/${delivery.id}`)}
                        className="bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold px-3 py-2 rounded-xl transition"
                      >
                        Comprovante
                      </button>
                      <button
                        onClick={() => navigate(`/cliente/chat/${delivery.id}`)}
                        className="p-2 rounded-xl border border-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
                        title="Chat"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </button>
                      <button
                        onClick={() => navigate(`/motorista/entrega/${delivery.id}`)}
                        className="bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">route</span>
                        <span>Acompanhar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
