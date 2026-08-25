import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const DeliverySchedulePage: React.FC = () => {
  const { deliveries } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-08-24');

  const scheduledDeliveries = deliveries.filter(d => ['PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL'].includes(d.status));

  const days = [
    { date: '2026-08-24', dayName: 'Segunda', label: '24 Ago', count: scheduledDeliveries.length },
    { date: '2026-08-25', dayName: 'Terça', label: '25 Ago', count: 2 },
    { date: '2026-08-26', dayName: 'Quarta', label: '26 Ago', count: 1 },
    { date: '2026-08-27', dayName: 'Quinta', label: '27 Ago', count: 0 },
    { date: '2026-08-28', dayName: 'Sexta', label: '28 Ago', count: 3 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Agenda de Docas Mercado Full
          </h1>
          <p className="text-xs text-on-surface-variant">
            Grade de horários e janelas de recebimento agendadas para os Centros de Distribuição.
          </p>
        </div>
      </div>

      {/* Date Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {days.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              selectedDate === d.date
                ? 'border-primary bg-primary text-on-primary shadow-md'
                : 'border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-on-surface'
            }`}
          >
            <p className="text-[11px] opacity-80 uppercase tracking-wider">{d.dayName}</p>
            <p className="font-headline font-extrabold text-lg mt-0.5">{d.label}</p>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
              selectedDate === d.date
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-surface-container text-on-surface-variant'
            }`}>
              {d.count} agendamentos
            </span>
          </button>
        ))}
      </div>

      {/* Scheduled Slots List */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h3 className="font-headline font-bold text-base text-primary pb-3 border-b border-surface-container-high flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">calendar_clock</span>
          <span>Janelas Agendadas para {selectedDate}</span>
        </h3>

        <div className="space-y-3">
          {scheduledDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="p-4 rounded-xl border border-surface-container-high bg-surface-container-low/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] uppercase font-mono">Doca</span>
                  <span className="text-xs">{delivery.destination.dockTimeSlot.slice(0, 5)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-sm text-primary">{delivery.destination.fulfillmentCenterName}</span>
                    <span className="font-mono text-xs font-bold text-secondary bg-secondary-fixed/20 px-2 py-0.5 rounded">
                      {delivery.destination.fullSchedulingCode}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Carga: {delivery.title} • {delivery.cargo.palletsCount} Pallets ({delivery.cargo.weightKg} kg)
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Embarcador: <strong>{delivery.clientName}</strong> ({delivery.clientCompany})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => navigate(`/motorista/entrega/${delivery.id}`)}
                  className="bg-primary hover:bg-neutral-800 text-on-primary text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">route</span>
                  <span>Ver Rota & Iniciar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
