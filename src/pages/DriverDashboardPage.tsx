import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const DriverDashboardPage: React.FC = () => {
  const { driverUser, deliveries, financeTransactions, vehicles } = useApp();
  const navigate = useNavigate();

  const availableLoads = deliveries.filter(d => d.status === 'COTACAO');
  const activeTrips = deliveries.filter(d => ['PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL'].includes(d.status));
  const completedTrips = deliveries.filter(d => d.status === 'FINALIZADO');

  const totalBalance = financeTransactions
    .filter(t => t.status === 'CONCLUIDO')
    .reduce((acc, t) => t.type === 'CREDIT' ? acc + t.amount : acc - t.amount, 0);

  const inEscrowBalance = financeTransactions
    .filter(t => t.status === 'PROCESSANDO')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Driver Banner */}
      <div className="bg-primary text-white p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Motorista Homologado Mercado Full</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight">
            Olá, {driverUser.name}! 🚛
          </h1>
          <p className="text-gray-300 text-xs md:text-sm mt-1 leading-relaxed">
            {driverUser.companyName} • {vehicles.length} veículos cadastrados • Nota {driverUser.rating} ⭐ ({driverUser.completedDeliveries} viagens).
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/motorista/cargas"
              className="bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Ver Cargas Disponíveis ({availableLoads.length})</span>
            </Link>
            <Link
              to="/motorista/calculo-frete"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">calculate</span>
              <span>Simular / Tabela de Frete</span>
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Saldo Disponível (PIX)</span>
            <span className="material-symbols-outlined text-secondary text-lg">account_balance_wallet</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">R$ {totalBalance.toFixed(2)}</p>
          <Link to="/motorista/financeiro" className="text-[11px] text-secondary font-bold hover:underline mt-1 block">
            Solicitar Saque Instantâneo →
          </Link>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Em Custódia / Em Rota</span>
            <span className="material-symbols-outlined text-amber-500 text-lg">lock_clock</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">R$ {inEscrowBalance.toFixed(2)}</p>
          <p className="text-[11px] text-on-surface-variant mt-1">Liberado na entrega no CD</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Viagens em Andamento</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">route</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">{activeTrips.length}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Cargas aceitas ativas</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-medium">Docas Full Finalizadas</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">fact_check</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-primary">{completedTrips.length + 160}</p>
          <p className="text-[11px] text-on-surface-variant mt-1">Sem ocorrências de doca</p>
        </div>
      </div>

      {/* Main Sections: Active Load in Transit & Available Freight Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Scheduled Dock / In Transit */}
        <div className="lg:col-span-2 space-y-6">
          {activeTrips.length > 0 && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-secondary-fixed shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary animate-pulse">local_shipping</span>
                  <h2 className="font-headline font-bold text-base text-primary">Carga em Andamento (Próxima Doca)</h2>
                </div>
                <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full">
                  Em Trânsito
                </span>
              </div>

              {activeTrips.map(trip => (
                <div key={trip.id} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-on-surface-variant">{trip.protocol}</span>
                      <h3 className="font-headline font-bold text-base text-primary">{trip.title}</h3>
                    </div>
                    <span className="font-mono text-sm font-bold text-secondary bg-secondary-fixed/20 px-3 py-1 rounded-lg">
                      Agendamento: {trip.destination.fullSchedulingCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-container-low p-4 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Destino CD Full:</span>
                      <p className="font-bold text-primary">{trip.destination.fulfillmentCenterName}</p>
                      <p className="text-[11px] text-on-surface-variant">{trip.destination.address}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Janela de Horário:</span>
                      <p className="font-bold text-primary">{trip.destination.dockDate}</p>
                      <p className="text-[11px] text-secondary font-bold">Janela: {trip.destination.dockTimeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-on-surface-variant">
                      Embarcador: <strong>{trip.clientName}</strong> ({trip.clientCompany})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/motorista/chat/${trip.id}`)}
                        className="p-2.5 rounded-xl border border-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
                        title="Chat com Embarcador"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </button>
                      <button
                        onClick={() => navigate(`/motorista/entrega/${trip.id}`)}
                        className="bg-primary hover:bg-neutral-800 text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                        <span>Atualizar Etapa / Check-in</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Freight Opportunities */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">feed</span>
                <h2 className="font-headline font-bold text-base text-primary">Cargas Disponíveis no Radar Full</h2>
              </div>
              <Link to="/motorista/cargas" className="text-xs font-bold text-secondary hover:underline">
                Ver todas ({availableLoads.length})
              </Link>
            </div>

            <div className="space-y-3">
              {availableLoads.map((load) => (
                <div
                  key={load.id}
                  className="p-4 rounded-xl border border-surface-container-high bg-surface-container-low/40 hover:bg-surface-container-low transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2 py-0.5 rounded">
                      {load.protocol}
                    </span>
                    <span className="text-xs font-bold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded">
                      Doca: {load.destination.dockTimeSlot}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-sm text-primary">{load.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Coleta em <strong>{load.origin.city}/{load.origin.state}</strong> ➔ Entrega no <strong>{load.destination.fulfillmentCenterName}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2">
                      <span>📦 {load.cargo.palletsCount} Pallets</span>
                      <span>⚖️ {load.cargo.weightKg} kg</span>
                      <span>🚚 Veículo: {load.requiredVehicleType}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-surface-container-high flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Valor Estimado: <strong className="text-primary text-sm font-headline">R$ 420 ~ 550</strong></span>
                    <button
                      onClick={() => navigate(`/motorista/calculo-frete?requestId=${load.id}`)}
                      className="bg-secondary hover:bg-opacity-90 text-on-secondary font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Calcular & Enviar Proposta</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Full Dock Assistant & Vehicle Status */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">checklist</span>
              <h3 className="font-headline font-bold text-sm text-primary">Checklist de Entrada CD Full</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>EPI Completo (Colete e Botina)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Placa do Veículo e ANTT válidas</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Protocolo de Agendamento em mãos</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>DANFE / NFs impressas com código</span>
              </div>
            </div>
          </div>

          {/* Quick Vehicle Card */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <span className="font-headline font-bold text-xs text-primary">Veículo Principal</span>
              <Link to="/motorista/veiculos" className="text-[11px] text-secondary font-bold hover:underline">
                Gerenciar Frota
              </Link>
            </div>
            {vehicles[0] && (
              <div className="text-xs space-y-1">
                <p className="font-bold text-primary">{vehicles[0].brand} {vehicles[0].model}</p>
                <p className="font-mono text-secondary font-bold">Placa: {vehicles[0].plate}</p>
                <p className="text-[11px] text-on-surface-variant">Capacidade: {vehicles[0].maxWeightKg} kg • {vehicles[0].maxVolumeM3} m³</p>
                <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                  Selo Mercado Full Ativo
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
