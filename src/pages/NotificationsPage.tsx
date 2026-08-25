import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { notificationService } from '../services/notificationService';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, currentUser } = useApp();
  const navigate = useNavigate();

  const [testPhone, setTestPhone] = useState(currentUser.phone || '(11) 98765-4321');
  const [testTemplate, setTestTemplate] = useState<'NEW_LOAD_AVAILABLE' | 'BID_RECEIVED' | 'DELIVERY_IN_TRANSIT' | 'DOCK_CHECKIN' | 'DELIVERY_FINISHED_PAYOUT'>('NEW_LOAD_AVAILABLE');
  const [waLinkGenerated, setWaLinkGenerated] = useState<string | null>(null);

  const handleTestWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const result = notificationService.formatWhatsAppMessage({
      toPhone: testPhone,
      template: testTemplate,
      data: {
        protocol: 'LF-2026-9041',
        clientName: 'Marcos Vinicius (EletroTech)',
        driverName: 'Carlos Eduardo Silva',
        originCity: 'São Paulo - SP',
        destinationName: 'Mercado Livre Full Cajamar I (CD SP01)',
        dockTimeSlot: '13:30 - 15:30',
        schedulingCode: 'MELI-AG-994812',
        amount: 420.00,
        trackingUrl: `${window.location.origin}/cliente/solicitacoes`
      }
    });

    setWaLinkGenerated(result.waLink);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Central de Notificações & Alertas no WhatsApp
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gerencie avisos de propostas, atualizações de status de viagens no Mercado Full e notificações automáticas via WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notifications Feed */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <h2 className="font-headline font-bold text-base text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">notifications_active</span>
              <span>Histórico de Alertas</span>
            </h2>
            <span className="text-xs font-semibold text-on-surface-variant">
              {notifications.filter(n => !n.read).length} não lidas
            </span>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-8 text-center">Nenhuma notificação no histórico.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.link) navigate(n.link);
                  }}
                  className={`p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer hover:bg-surface-container-low ${
                    !n.read ? 'bg-surface-container-low/60 border-secondary-fixed/50' : 'bg-surface-container-lowest border-surface-container-high opacity-85'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    n.type === 'BID' ? 'bg-primary-fixed text-on-primary-fixed' :
                    n.type === 'SUCCESS' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                    'bg-surface-container-high text-on-surface'
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {n.type === 'BID' ? 'local_offer' : n.type === 'SUCCESS' ? 'verified' : 'notifications'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline font-bold text-sm text-primary">{n.title}</h3>
                      <span className="text-[11px] text-on-surface-variant font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.description}</p>
                  </div>

                  {n.link && (
                    <span className="material-symbols-outlined text-on-surface-variant text-base mt-2">
                      arrow_forward_ios
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: WhatsApp Automation Hub & Simulator */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high text-emerald-700">
              <span className="material-symbols-outlined text-2xl text-emerald-600">chat</span>
              <h3 className="font-headline font-bold text-sm text-primary">Simulador de WhatsApp</h3>
            </div>

            <p className="text-on-surface-variant leading-relaxed">
              Teste o disparo automático de mensagens formatadas com dados reais para o WhatsApp de motoristas ou embarcadores:
            </p>

            <form onSubmit={handleTestWhatsApp} className="space-y-3">
              <div>
                <label className="block font-bold text-primary mb-1">Telefone com DDD *</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Tipo de Evento Logístico *</label>
                <select
                  value={testTemplate}
                  onChange={(e: any) => setTestTemplate(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-secondary focus:outline-none"
                >
                  <option value="NEW_LOAD_AVAILABLE">🚨 Nova Carga Full Disponível</option>
                  <option value="BID_RECEIVED">🔔 Proposta de Frete Recebida</option>
                  <option value="DELIVERY_IN_TRANSIT">🚚 Carga em Trânsito para o CD</option>
                  <option value="DOCK_CHECKIN">🏢 Check-in na Doca Mercado Full</option>
                  <option value="DELIVERY_FINISHED_PAYOUT">✅ Entrega Concluída & PIX Liberado</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Gerar Mensagem de WhatsApp</span>
              </button>
            </form>

            {waLinkGenerated && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3 mt-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                  <span>Mensagem Pronta!</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Clique no botão abaixo para abrir o WhatsApp Web / App com a mensagem pré-formatada:
                </p>
                <a
                  href={waLinkGenerated}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition"
                >
                  Abrir no WhatsApp Web →
                </a>
              </div>
            )}
          </div>

          {/* Webhook API Info Box */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <span className="material-symbols-outlined text-secondary text-sm">api</span>
              <span>Conexão com Gateways WhatsApp</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Compatível com <strong>Evolution API</strong>, <strong>Z-API</strong> e <strong>Twilio</strong>. Configure a variável <code className="bg-surface-container px-1 py-0.5 rounded font-mono text-[10px]">VITE_WHATSAPP_WEBHOOK_URL</code> no seu arquivo <code className="bg-surface-container px-1 py-0.5 rounded font-mono text-[10px]">.env</code> para envio 100% automático em segundo plano.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
