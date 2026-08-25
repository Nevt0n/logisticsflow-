import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const QuotationsListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries, bids } = useApp();

  const currentDelivery = deliveries.find(d => d.id === id) || deliveries[0];
  const requestBids = bids.filter(b => b.requestId === currentDelivery.id);

  const handleSelectBid = (bidId: string) => {
    navigate(`/cliente/pagamento/${currentDelivery.id}?bidId=${bidId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/cliente/dashboard')}
              className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h1 className="font-headline text-2xl font-extrabold text-primary">
              Motoristas Disponíveis para sua Doca
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant ml-8">
            Motoristas credenciados com agenda e cubagem compatíveis com a solicitação <strong className="font-mono">{currentDelivery.protocol}</strong>.
          </p>
        </div>

        <Link
          to="/cliente/solicitacoes"
          className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">inventory_2</span>
          <span>Minhas Solicitações</span>
        </Link>
      </div>

      {/* Delivery Summary Banner */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">Destino Mercado Full</span>
          <p className="text-xs font-extrabold text-primary mt-0.5">{currentDelivery.destination.fulfillmentCenterName}</p>
          <p className="text-[11px] text-secondary font-semibold">Janela: {currentDelivery.destination.dockDate} ({currentDelivery.destination.dockTimeSlot})</p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">Local de Coleta</span>
          <p className="text-xs font-bold text-primary mt-0.5">{currentDelivery.origin.city} - {currentDelivery.origin.state}</p>
          <p className="text-[11px] text-on-surface-variant truncate">{currentDelivery.origin.address}</p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">Carga & Cubagem</span>
          <p className="text-xs font-bold text-primary mt-0.5">{currentDelivery.cargo.palletsCount} Pallets • {currentDelivery.cargo.volumeM3 || 4.5} m³</p>
          <p className="text-[11px] text-on-surface-variant">Peso: {currentDelivery.cargo.weightKg} kg</p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">Protocolo Mercado Full</span>
          <p className="font-mono text-xs font-bold text-primary mt-0.5 bg-surface-container px-2 py-0.5 rounded inline-block">
            {currentDelivery.destination.fullSchedulingCode}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Doca confirmada</p>
        </div>
      </div>

      {/* Available Drivers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-base text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">event_available</span>
            <span>{requestBids.length} Motoristas com Disponibilidade Confirmada</span>
          </h2>
          <span className="text-xs text-on-surface-variant">Valores fixos baseados na tabela oficial de frete</span>
        </div>

        {requestBids.length === 0 ? (
          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-surface-container-high text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">hourglass_top</span>
            <p className="text-sm font-bold text-primary">Buscando motoristas na região...</p>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              Estamos localizando motoristas que atendem a rota do seu galpão até o CD Mercado Full na sua janela de horário.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requestBids.map((bid, index) => (
              <div
                key={bid.id}
                className={`bg-surface-container-lowest p-5 rounded-2xl border transition-all ${
                  index === 0
                    ? 'border-secondary-fixed shadow-md ring-1 ring-secondary-fixed/50'
                    : 'border-surface-container-high hover:border-surface-tint shadow-sm'
                }`}
              >
                {index === 0 && (
                  <div className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-3">
                    <span className="material-symbols-outlined text-xs">recommend</span>
                    <span>Disponibilidade Imediata Recomendada</span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Driver Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={bid.driverAvatar}
                      alt={bid.driverName}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-surface-container-high"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-base text-primary">{bid.driverName}</h3>
                        <span className="bg-surface-container text-primary text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-amber-500 fill-1">star</span>
                          {bid.driverRating}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {bid.driverCompletedTrips} entregas no Full • <strong>{bid.vehicleModel}</strong> ({bid.vehiclePlate})
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-secondary-fixed/30 text-secondary text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Cubagem Homologada ({bid.vehicleType})
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          Disponível na sua Janela ({currentDelivery.destination.dockTimeSlot})
                        </span>
                        {bid.tollIncluded && (
                          <span className="bg-surface-container text-on-surface-variant text-[10px] font-medium px-2 py-0.5 rounded">
                            Pedágios Inclusos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between w-full lg:w-auto lg:text-right gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-surface-container-high">
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">Valor Fixo do Frete</span>
                      <p className="font-headline text-2xl font-extrabold text-primary">
                        R$ {bid.price.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-secondary font-medium">Horário de Coleta: {bid.estimatedPickupTime}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/cliente/chat/${currentDelivery.id}`)}
                        className="p-3 rounded-xl border border-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
                        title="Conversar com Motorista"
                      >
                        <span className="material-symbols-outlined text-xl">chat</span>
                      </button>

                      <button
                        onClick={() => handleSelectBid(bid.id)}
                        className="bg-primary hover:bg-neutral-800 text-on-primary font-headline font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Contratar Frete</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
