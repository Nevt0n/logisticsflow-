import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const PaymentReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { deliveries } = useApp();

  const currentDelivery = deliveries.find(d => d.id === id) || deliveries[0];
  const selectedBid = currentDelivery.selectedBid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-secondary-fixed text-on-secondary-fixed rounded-full flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h1 className="font-headline text-2xl font-extrabold text-primary">
          Pagamento Confirmado & Frete Agendado!
        </h1>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          O valor foi retido em garantia e o motorista foi notificado para realizar a coleta no horário agendado.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container-high shadow-lg space-y-6 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex items-center justify-between pb-6 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-base">local_shipping</span>
            </div>
            <div>
              <span className="font-headline font-bold text-base text-primary">LogisticsFlow Hub</span>
              <p className="text-[10px] text-on-surface-variant">Comprovante de Contratação Mercado Full</p>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Confirmado
            </span>
            <p className="text-[11px] font-mono text-on-surface-variant mt-1">
              {currentDelivery.paymentTransactionId || `PIX-LF-${Date.now().toString().slice(-8)}`}
            </p>
          </div>
        </div>

        {/* Delivery Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Protocolo do Frete:</span>
            <p className="font-mono font-bold text-primary text-sm">{currentDelivery.protocol}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Agendamento Mercado Full:</span>
            <p className="font-mono font-bold text-secondary text-sm">{currentDelivery.destination.fullSchedulingCode}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Origem (Coleta):</span>
            <p className="font-bold text-primary">{currentDelivery.origin.city}/{currentDelivery.origin.state}</p>
            <p className="text-[11px] text-on-surface-variant">{currentDelivery.origin.address}</p>
            <p className="text-[11px] text-secondary font-semibold">Data: {currentDelivery.origin.pickupDate} ({currentDelivery.origin.pickupTimeRange})</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Destino (CD Mercado Full):</span>
            <p className="font-bold text-primary">{currentDelivery.destination.fulfillmentCenterName}</p>
            <p className="text-[11px] text-on-surface-variant">{currentDelivery.destination.address}</p>
            <p className="text-[11px] text-secondary font-semibold">Janela Doca: {currentDelivery.destination.dockDate} ({currentDelivery.destination.dockTimeSlot})</p>
          </div>
        </div>

        {/* Driver & Vehicle Box */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Motorista Designado:</span>
            <p className="font-bold text-primary mt-0.5">{selectedBid?.driverName || 'Carlos Eduardo Silva'}</p>
            <p className="text-[10px] text-on-surface-variant">ANTT Verificada</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Veículo / Placa:</span>
            <p className="font-bold text-primary mt-0.5">{selectedBid?.vehicleModel || 'Mercedes Sprinter'}</p>
            <p className="font-mono text-[11px] text-secondary font-bold">{selectedBid?.vehiclePlate || 'LOG-4E28'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Nota Fiscal:</span>
            <p className="font-bold text-primary mt-0.5">{currentDelivery.cargo.invoiceNumber}</p>
            <p className="text-[10px] text-on-surface-variant">{currentDelivery.cargo.palletsCount} Pallets • {currentDelivery.cargo.weightKg} kg</p>
          </div>
        </div>

        {/* Total Box */}
        <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant">Método de Pagamento:</span>
            <p className="text-xs font-bold text-primary">{currentDelivery.paymentMethod || 'PIX Instantâneo'} (Custódia Garantida)</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-on-surface-variant">Valor Total:</span>
            <p className="font-headline text-2xl font-extrabold text-primary">
              R$ {(selectedBid?.price || 420).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">print</span>
          <span>Imprimir Comprovante</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/cliente/chat/${currentDelivery.id}`}
            className="bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Falar com Motorista</span>
          </Link>

          <Link
            to={`/motorista/entrega/${currentDelivery.id}`}
            className="bg-primary hover:bg-neutral-800 text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-base">route</span>
            <span>Rastrear Entrega em Tempo Real</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
