import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  DeliveryRequest, 
  FreightBid, 
  Vehicle, 
  ChatMessage, 
  DeliveryStatus 
} from '../types';

export const databaseService = {
  // 1. Centros de Distribuição
  async getFulfillmentCenters() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('fulfillment_centers').select('*').eq('is_active', true);
    if (error) {
      console.warn('Erro ao buscar CDs do Supabase:', error.message);
      return null;
    }
    return data;
  },

  // 2. Solicitações de Entrega
  async getDeliveryRequests(clientId?: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    let query = supabase.from('delivery_requests').select('*, fulfillment_centers(*)').order('created_at', { ascending: false });
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Erro ao buscar entregas do Supabase:', error.message);
      return null;
    }
    return data;
  },

  async createDeliveryRequest(request: Partial<DeliveryRequest>) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('delivery_requests').insert([request]).select().single();
    if (error) {
      console.error('Erro ao criar solicitação no Supabase:', error.message);
      return null;
    }
    return data;
  },

  // 3. Propostas de Frete
  async getBids(requestId?: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    let query = supabase.from('freight_bids').select('*, users(*)').order('created_at', { ascending: false });
    if (requestId) {
      query = query.eq('request_id', requestId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Erro ao buscar propostas do Supabase:', error.message);
      return null;
    }
    return data;
  },

  async submitBid(bid: Partial<FreightBid>) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('freight_bids').insert([bid]).select().single();
    if (error) {
      console.error('Erro ao enviar proposta no Supabase:', error.message);
      return null;
    }
    return data;
  },

  // 4. Atualização de Status
  async updateDeliveryStatus(requestId: string, status: DeliveryStatus, note?: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('delivery_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status no Supabase:', error.message);
      return null;
    }

    // Inserir registro de tracking step
    if (note) {
      await supabase.from('delivery_tracking_steps').insert([{
        request_id: requestId,
        step_name: status,
        notes: note,
        is_completed: true,
        completed_at: new Date().toISOString()
      }]);
    }

    return data;
  },

  // 5. Veículos
  async getVehicles(driverId: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('vehicles').select('*').eq('driver_id', driverId);
    if (error) {
      console.warn('Erro ao buscar veículos:', error.message);
      return null;
    }
    return data;
  },

  async addVehicle(vehicle: Partial<Vehicle>) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('vehicles').insert([vehicle]).select().single();
    if (error) {
      console.error('Erro ao adicionar veículo:', error.message);
      return null;
    }
    return data;
  },

  // 6. Chat em Tempo Real
  async getChatMessages(requestId: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar mensagens:', error.message);
      return null;
    }
    return data;
  },

  async sendChatMessage(message: Partial<ChatMessage>) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('chat_messages').insert([message]).select().single();
    if (error) {
      console.error('Erro ao enviar mensagem:', error.message);
      return null;
    }
    return data;
  },

  // 7. Transações Financeiras
  async getFinancialTransactions(userId: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar extrato financeiro:', error.message);
      return null;
    }
    return data;
  }
};
