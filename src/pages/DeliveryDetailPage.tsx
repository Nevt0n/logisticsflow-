import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import type { DeliveryStatus } from '../types';

export const DeliveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries, updateDeliveryStatus, activeRole } = useApp();

  const currentDelivery = deliveries.find(d => d.id === id) || deliveries[1] || deliveries[0];
  const [stepNote, setStepNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  const statusOrder: DeliveryStatus[] = ['COTACAO', 'PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL', 'FINALIZADO'];
  const currentIndex = statusOrder.indexOf(currentDelivery.status);
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleAdvanceStep = async () => {
    if (!nextStatus) return;

    let proofUrl = currentDelivery.deliveryProofUrl;
    if (proofFile) {
      setUploadingProof(true);
      const res = await storageService.uploadDeliveryProof(proofFile, currentDelivery.id);
      proofUrl = res.url;
      setUploadingProof(false);
    }

    updateDeliveryStatus(currentDelivery.id, nextStatus, stepNote || undefined, proofUrl);
    setStepNote('');
    setProofFile(null);
    setProofPreview(null);
    setShowStatusModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-extrabold text-primary">
                Rastreamento da Entrega Full
              </h1>
              <span className="font-mono text-xs font-bold bg-primary text-on-primary px-2.5 py-1 rounded-lg">
                {currentDelivery.protocol}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Acompanhe cada etapa da coleta até a conferência e descarregamento no Centro de Distribuição do Mercado Livre.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/${activeRole.toLowerCase()}/chat/${currentDelivery.id}`}
            className="bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Abrir Chat ({activeRole === 'CLIENTE' ? 'Motorista' : 'Embarcador'})</span>
          </Link>

          {activeRole === 'MOTORISTA' && nextStatus && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-secondary hover:bg-opacity-90 text-on-secondary font-headline font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">update</span>
              <span>Avançar Etapa ({nextStatus})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mercado Full Live Status Banner */}
      <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>Agendamento Oficial Mercado Livre Full</span>
          </div>
          <h2 className="font-headline text-xl font-bold">
            {currentDelivery.destination.fulfillmentCenterName} ({currentDelivery.destination.code})
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">calendar_today</span>
              Data Doca: {currentDelivery.destination.dockDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">schedule</span>
              Janela: {currentDelivery.destination.dockTimeSlot}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-secondary-fixed font-bold">
              <span className="material-symbols-outlined text-sm">qr_code</span>
              Protocolo: {currentDelivery.destination.fullSchedulingCode}
            </span>
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-gray-300 block">Status da Carga</span>
          <span className="text-sm font-headline font-bold text-secondary-fixed">
            {currentDelivery.status}
          </span>
        </div>
      </div>

      {/* 2 Cols: Left Timeline, Right Document details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Transit Timeline */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-6">
          <h3 className="font-headline font-bold text-base text-primary pb-3 border-b border-surface-container-high flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">timeline</span>
            <span>Linha do Tempo da Operação</span>
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
            {currentDelivery.trackingSteps?.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4 group">
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step.completed
                      ? 'bg-secondary-fixed text-on-secondary-fixed ring-4 ring-secondary-fixed/20'
                      : step.current
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {step.completed ? 'check' : step.current ? 'radio_button_checked' : 'schedule'}
                  </span>
                </div>

                <div className="flex-1 bg-surface-container-low/50 p-4 rounded-xl border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-headline font-bold text-xs ${step.current ? 'text-secondary' : 'text-primary'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[11px] font-mono text-on-surface-variant">{step.date}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Documents, NF-e & Canhoto */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-4 text-xs">
            <h3 className="font-headline font-bold text-sm text-primary pb-2 border-b border-surface-container-high flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">description</span>
              <span>Documentos & Nota Fiscal</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Número da NF-e:</span>
                <span className="font-bold font-mono text-primary">{currentDelivery.cargo.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Chave de Acesso:</span>
                <p className="font-mono text-[10px] text-on-surface break-all bg-surface-container-low p-2 rounded-lg mt-0.5">
                  {currentDelivery.cargo.invoiceKey}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Valor da Carga:</span>
                <span className="font-bold text-primary">R$ {currentDelivery.cargo.declaredValue.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pallets PBR:</span>
                <span className="font-bold text-primary">{currentDelivery.cargo.palletsCount} un</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Peso Total:</span>
                <span className="font-bold text-primary">{currentDelivery.cargo.weightKg} kg</span>
              </div>

              {/* Download NF-e Link if uploaded */}
              {currentDelivery.invoiceFileUrl && (
                <div className="pt-2">
                  <a
                    href={currentDelivery.invoiceFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-surface-container-high transition"
                  >
                    <span className="material-symbols-outlined text-base text-secondary">file_download</span>
                    <span>Visualizar NF-e Anexada</span>
                  </a>
                </div>
              )}

              {/* Delivery Proof / Canhoto Preview */}
              {currentDelivery.deliveryProofUrl && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                    Canhoto Assinado no CD Full:
                  </span>
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-surface-container-high bg-black">
                    <img
                      src={currentDelivery.deliveryProofUrl}
                      alt="Canhoto de Entrega Mercado Full"
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(currentDelivery.deliveryProofUrl, '_blank')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-3 text-xs">
            <h3 className="font-headline font-bold text-sm text-primary pb-2 border-b border-surface-container-high">
              Dados do Motorista & Veículo
            </h3>
            <div className="space-y-1.5">
              <p>Motorista: <strong>{currentDelivery.selectedBid?.driverName || 'Carlos Eduardo Silva'}</strong></p>
              <p>Veículo: <strong>{currentDelivery.selectedBid?.vehicleModel || 'Mercedes Sprinter'}</strong></p>
              <p>Placa: <strong className="font-mono text-secondary">{currentDelivery.selectedBid?.vehiclePlate || 'LOG-4E28'}</strong></p>
              <p>Valor do Frete: <strong className="text-primary font-headline text-sm">R$ {(currentDelivery.selectedBid?.price || 420).toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to update status & upload proof */}
      {showStatusModal && nextStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-surface-container-high shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">update</span>
              <span>Avançar para: {nextStatus}</span>
            </h3>

            <p className="text-xs text-on-surface-variant">
              Adicione uma mensagem ou observação da etapa:
            </p>

            <textarea
              rows={2}
              placeholder="Ex: Carga descarregada na doca 12 do CD Cajamar..."
              value={stepNote}
              onChange={(e) => setStepNote(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs focus:ring-2 focus:ring-secondary focus:outline-none"
            />

            {/* If advancing to FINALIZADO or DOCA_FULL, allow uploading photo */}
            {(nextStatus === 'FINALIZADO' || nextStatus === 'DOCA_FULL') && (
              <div className="space-y-2 pt-2 border-t border-surface-container-high text-xs">
                <label className="block font-bold text-primary">
                  📸 Foto do Canhoto Assinado / Carimbo Mercado Full
                </label>

                {!proofPreview ? (
                  <label className="border-2 border-dashed border-surface-container-high hover:border-secondary bg-surface-container-low/50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-center">
                    <span className="material-symbols-outlined text-2xl text-secondary">add_a_photo</span>
                    <span className="text-[11px] font-bold text-primary mt-1">Tirar Foto ou Escolher Imagem</span>
                    <span className="text-[10px] text-on-surface-variant">Obrigatório para liberação do PIX</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleProofChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-secondary h-28 bg-black">
                    <img src={proofPreview} alt="Preview do Canhoto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setProofFile(null);
                        setProofPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-error text-white p-1 rounded-md text-xs"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={uploadingProof}
                onClick={handleAdvanceStep}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-opacity-90 text-on-secondary shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                {uploadingProof ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    <span>Enviando Comprovante...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Confirmar Atualização</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
