import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const DriverLoadsPage: React.FC = () => {
  const { deliveries, freightConfig } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'AVAILABLE' | 'MY_LOADS'>('AVAILABLE');

  const availableLoads = deliveries.filter(d => d.status === 'COTACAO');
  const myLoads = deliveries.filter(d => ['PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL', 'FINALIZADO'].includes(d.status));

  const currentList = tab === 'AVAILABLE' ? availableLoads : myLoads;

  const handleAcceptLoad = (loadId: string) => {
    navigate(`/motorista/entrega/${loadId}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Cargas & Viagens Mercado Full
          </h1>
          <p className="text-xs text-on-surface-variant">
            Cargas filtradas automaticamente para a cubagem do seu veículo ({freightConfig.truckVolumeM3 || 16} m³) e seus dias/horários disponíveis.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-surface-container-lowest p-1 rounded-xl border border-surface-container-high flex items-center gap-1 shadow-sm">
          <button
            onClick={() => setTab('AVAILABLE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              tab === 'AVAILABLE' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Cargas Compatíveis ({availableLoads.length})
          </button>
          <button
            onClick={() => setTab('MY_LOADS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              tab === 'MY_LOADS' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Minha Agenda ({myLoads.length})
          </button>
        </div>
      </div>

      {/* Driver Capacity Banner */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">event_available</span>
          </div>
          <div>
            <p className="font-bold text-primary">Sua Capacidade & Agenda Configurada:</p>
            <p className="text-on-surface-variant text-[11px]">
              Cubagem: <strong>{freightConfig.truckVolumeM3 || 16} m³</strong> • Peso Máx: <strong>{freightConfig.truckMaxWeightKg || 2200} kg</strong> • Pallets: <strong>Até {freightConfig.truckMaxPallets || 4} un</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/motorista/calculo-frete')}
          className="text-secondary font-bold text-xs hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>Ajustar Agenda / Cubagem</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {currentList.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl border border-surface-container-high text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">inbox</span>
            <p className="font-bold text-primary">Nenhuma carga pendente no momento</p>
            <p className="text-xs text-on-surface-variant">
              Assim que um embarcador agendar uma entrega compatível com seus horários e cubagem, ela aparecerá aqui para você aceitar.
            </p>
          </div>
        ) : (
          currentList.map((load) => {
            const calculatedFreight = freightConfig.minimumFreight + (45 * freightConfig.basePricePerKm) + (load.cargo.palletsCount * freightConfig.palletHandlingFee) + freightConfig.fullDockAssistanceFee;

            return (
              <div
                key={load.id}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-secondary-fixed transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2.5 py-1 rounded-lg">
                      {load.protocol}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      load.status === 'COTACAO' ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1' :
                      load.status === 'EM_TRANSITO' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      load.status === 'FINALIZADO' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {load.status === 'COTACAO' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>Compatível com sua Cubagem & Horário</span>
                        </>
                      )}
                      {load.status === 'PAGO_AGENDADO' && 'Agendada na sua Frota'}
                      {load.status === 'COLETANDO' && 'Coleta em Andamento'}
                      {load.status === 'EM_TRANSITO' && 'Em Trânsito para o CD'}
                      {load.status === 'DOCA_FULL' && 'Na Doca Mercado Full'}
                      {load.status === 'FINALIZADO' && 'Entregue com Sucesso'}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-secondary bg-secondary-fixed/20 px-2.5 py-1 rounded-lg">
                    Protocolo Full: {load.destination.fullSchedulingCode}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-base text-primary">{load.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Embarcador: <strong>{load.clientName}</strong> ({load.clientCompany})
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs text-on-surface-variant bg-surface-container-low/40 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Local de Coleta:</span>
                      <p className="font-semibold text-primary">{load.origin.city}/{load.origin.state}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{load.origin.address}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Destino CD Full:</span>
                      <p className="font-semibold text-primary">{load.destination.fulfillmentCenterName}</p>
                      <p className="text-[11px] text-secondary font-bold">Janela Doca: {load.destination.dockTimeSlot}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Cubagem & Pallets:</span>
                      <p className="font-semibold text-primary">{load.cargo.palletsCount} Pallets • {load.cargo.volumeM3 || 4.5} m³</p>
                      <p className="text-[11px] text-emerald-700 font-bold">✓ Cabe no seu baú</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">Nota Fiscal:</span>
                      <p className="font-mono font-semibold text-primary">{load.cargo.invoiceNumber}</p>
                      <p className="text-[11px] text-on-surface-variant">Valor: R$ {load.cargo.declaredValue.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-on-surface-variant">Valor Fixo da sua Tabela: </span>
                    <strong className="font-headline text-lg text-primary">
                      R$ {calculatedFreight.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-on-surface-variant ml-1">(Sem leilão de propostas)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {load.status === 'COTACAO' ? (
                      <button
                        onClick={() => handleAcceptLoad(load.id)}
                        className="bg-secondary hover:bg-opacity-90 text-on-secondary text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">event_available</span>
                        <span>Aceitar Carga na Minha Agenda</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/motorista/chat/${load.id}`)}
                          className="p-2 rounded-xl border border-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
                          title="Chat com Embarcador"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </button>
                        <button
                          onClick={() => navigate(`/motorista/entrega/${load.id}`)}
                          className="bg-primary hover:bg-neutral-800 text-on-primary text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                        >
                          <span>Ver Trajeto / Canhoto</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
