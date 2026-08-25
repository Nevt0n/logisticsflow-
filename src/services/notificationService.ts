import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AppNotification } from '../types';

export interface WhatsAppMessagePayload {
  toPhone: string; // Ex: '5511971238899'
  template: 'NEW_LOAD_AVAILABLE' | 'BID_RECEIVED' | 'DELIVERY_IN_TRANSIT' | 'DOCK_CHECKIN' | 'DELIVERY_FINISHED_PAYOUT';
  data: {
    driverName?: string;
    clientName?: string;
    protocol: string;
    originCity?: string;
    destinationName?: string;
    dockTimeSlot?: string;
    schedulingCode?: string;
    amount?: number;
    trackingUrl?: string;
  };
}

// Síntese de áudio nativa do navegador (Web Audio API) para alertas sonoros sem dependência externa
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignora se o navegador bloquear autoplay
  }
}

export const notificationService = {
  // 1. Gerador de Mensagens Formatadas para WhatsApp
  formatWhatsAppMessage(payload: WhatsAppMessagePayload): { text: string; waLink: string } {
    let text = '';
    const cleanPhone = payload.toPhone.replace(/\D/g, '');

    switch (payload.template) {
      case 'NEW_LOAD_AVAILABLE':
        text = `🚨 *LOGISTICSFLOW - NOVA CARGA MERCADO FULL!*\n\n` +
          `Olá! Uma nova oportunidade de frete foi publicada na sua região:\n\n` +
          `📦 *Protocolo:* ${payload.data.protocol}\n` +
          `📍 *Coleta:* ${payload.data.originCity}\n` +
          `🏭 *Destino:* ${payload.data.destinationName}\n` +
          `⏰ *Janela Doca Full:* ${payload.data.dockTimeSlot}\n` +
          `💰 *Valor Estimado:* R$ ${payload.data.amount?.toFixed(2)}\n\n` +
          `👉 *Acesse o aplicativo para enviar sua proposta:* ${payload.data.trackingUrl || window.location.origin}`;
        break;

      case 'BID_RECEIVED':
        text = `🔔 *LOGISTICSFLOW - NOVA PROPOSTA DE FRETE!*\n\n` +
          `Olá ${payload.data.clientName || 'Embarcador'}!\n` +
          `O motorista *${payload.data.driverName}* enviou uma proposta para a carga *${payload.data.protocol}*:\n\n` +
          `💰 *Valor Ofertado:* R$ ${payload.data.amount?.toFixed(2)}\n` +
          `🚛 *Destino:* ${payload.data.destinationName}\n\n` +
          `👉 *Clique para aprovar e agendar:* ${payload.data.trackingUrl || window.location.origin}`;
        break;

      case 'DELIVERY_IN_TRANSIT':
        text = `🚚 *LOGISTICSFLOW - CARGA EM TRÂNSITO PARA O FULL!*\n\n` +
          `Sua carga *${payload.data.protocol}* foi coletada e está a caminho do Centro de Distribuição.\n\n` +
          `🏭 *Destino:* ${payload.data.destinationName}\n` +
          `⏰ *Horário Agendado:* ${payload.data.dockTimeSlot}\n` +
          `📋 *Protocolo Mercado Full:* ${payload.data.schedulingCode}\n\n` +
          `👉 *Acompanhe em tempo real:* ${payload.data.trackingUrl || window.location.origin}`;
        break;

      case 'DOCK_CHECKIN':
        text = `🏢 *LOGISTICSFLOW - CHECK-IN NA DOCA MERCADO FULL!*\n\n` +
          `O motorista *${payload.data.driverName}* chegou à portaria do CD *${payload.data.destinationName}* e apresentou o código *${payload.data.schedulingCode}*.\n\n` +
          `Conferência de notas e descarregamento em andamento na doca.`;
        break;

      case 'DELIVERY_FINISHED_PAYOUT':
        text = `✅ *LOGISTICSFLOW - ENTREGA CONCLUÍDA & PIX LIBERADO!*\n\n` +
          `A carga *${payload.data.protocol}* foi conferida e aceita pelo CD Mercado Livre Full!\n\n` +
          `💰 *Repasse de Frete:* R$ ${payload.data.amount?.toFixed(2)} liberado via PIX.\n\n` +
          `Obrigado por utilizar a rede LogisticsFlow! 🚛🎉`;
        break;
    }

    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    return { text, waLink };
  },

  // 2. Disparo de Notificação (In-App + Supabase + Alerta Sonoro)
  async sendInAppNotification(userId: string, notification: Omit<AppNotification, 'id' | 'timestamp'>) {
    playNotificationSound();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('notifications').insert([{
          user_id: userId,
          title: notification.title,
          description: notification.description,
          type: notification.type,
          link: notification.link,
          is_read: false
        }]);
      } catch (err) {
        console.warn('Erro ao salvar notificação no Supabase:', err);
      }
    }
  },

  // 3. Simulação de Disparo via Webhook / API WhatsApp (Evolution API / Z-API / Twilio)
  async dispatchWhatsAppWebhook(payload: WhatsAppMessagePayload): Promise<{ success: boolean; message: string; waLink: string }> {
    const { text, waLink } = this.formatWhatsAppMessage(payload);

    // Se houver webhook configurado em variáveis de ambiente, envia requisição HTTP POST
    const webhookUrl = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: payload.toPhone,
            message: text
          })
        });
      } catch (err) {
        console.warn('Erro no envio do webhook WhatsApp:', err);
      }
    }

    return {
      success: true,
      message: 'Mensagem pronta para envio no WhatsApp.',
      waLink
    };
  }
};
