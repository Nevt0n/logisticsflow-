import React from 'react';
import { useApp } from '../context/AppContext';

export const DriverProfilePage: React.FC = () => {
  const { driverUser } = useApp();

  const reviews = [
    {
      id: 'rev-01',
      author: 'EletroTech Mercado Líder Platinum',
      rating: 5.0,
      date: '23/08/2026',
      comment: 'Excelente motorista! Carga descarregada no CD Louveira exatamente na janela das 11:00 sem nenhuma avaria e com canhoto carimbado.',
      tags: ['Pontualidade Impecável', 'EPI Completo', 'Comunicação Rápida']
    },
    {
      id: 'rev-02',
      author: 'Distribuidora Global Multimarcas',
      rating: 5.0,
      date: '19/08/2026',
      comment: 'Super prestativo, ajudou na amarração dos pallets e na conferência das notas fiscais na portaria do CD Cajamar.',
      tags: ['Ajudante Dedicado', 'Veículo Impecável']
    },
    {
      id: 'rev-03',
      author: 'Moda & Estilo Confecções',
      rating: 4.8,
      date: '12/08/2026',
      comment: 'Recomendo a todos os sellers do Mercado Livre que precisam de entregas Full sem dor de cabeça.',
      tags: ['Homologado Full']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container-high shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={driverUser.avatarUrl}
            alt={driverUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-secondary-fixed/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-extrabold text-primary">{driverUser.name}</h1>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                Motorista Premium
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">{driverUser.companyName}</p>
            <p className="text-xs text-on-surface-variant">{driverUser.city} - {driverUser.state} • Documento: {driverUser.document}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl text-center shrink-0">
          <div>
            <div className="flex items-center justify-center gap-1 text-primary font-headline text-2xl font-extrabold">
              <span className="material-symbols-outlined text-amber-500 text-xl fill-1">star</span>
              <span>{driverUser.rating}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">Avaliação Média</p>
          </div>
          <div className="w-px h-8 bg-surface-container-high"></div>
          <div>
            <p className="text-primary font-headline text-2xl font-extrabold">{driverUser.completedDeliveries}</p>
            <p className="text-[11px] text-on-surface-variant">Entregas no Full</p>
          </div>
        </div>
      </div>

      {/* Badges and Compliance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-primary">Credenciamento Full</h4>
            <p className="text-[11px] text-on-surface-variant">Homologado em 25 Centros de Distribuição</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">shield</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-primary">ANTT & Documentação</h4>
            <p className="text-[11px] text-on-surface-variant">Placa Vermelha e RNTRC 100% Válidos</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">timer</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-primary">Pontualidade 99.8%</h4>
            <p className="text-[11px] text-on-surface-variant">Chegada rigorosa nas janelas de doca</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h3 className="font-headline font-bold text-base text-primary pb-3 border-b border-surface-container-high flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">reviews</span>
          <span>Avaliações dos Embarcadores ({reviews.length})</span>
        </h3>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl border border-surface-container-high bg-surface-container-low/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-primary">{rev.author}</span>
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <span className="material-symbols-outlined text-sm fill-1">star</span>
                  <span className="font-bold">{rev.rating}</span>
                  <span className="text-on-surface-variant text-[11px] ml-2">{rev.date}</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">"{rev.comment}"</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rev.tags.map((t, idx) => (
                  <span key={idx} className="bg-surface-container text-on-surface-variant text-[10px] font-semibold px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
