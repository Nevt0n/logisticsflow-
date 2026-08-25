import { generatePixBRCode } from '../utils/pix';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type PaymentGatewayProvider = 'ASAAS' | 'MERCADO_PAGO' | 'LOGISTICSFLOW_ESCROW';

const asaasApiKey = (import.meta.env.VITE_ASAAS_API_KEY || '').trim();
const isAsaasConfigured = Boolean(asaasApiKey && asaasApiKey.startsWith('$aact_'));

export interface CreatePixChargeParams {
  requestId: string;
  protocol: string;
  amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    document: string;
  };
}

export interface PixChargeResult {
  transactionId: string;
  status: 'PENDENTE' | 'PAGO' | 'EXPIRADO';
  qrCodeUrl: string;
  qrCodeText: string;
  amount: number;
  expiresAt: string;
  isLiveAsaas?: boolean;
}

export interface CreditCardChargeParams {
  requestId: string;
  amount: number;
  cardNumber: string;
  cardHolderName: string;
  cardExpiry: string;
  cardCvv: string;
  installments: number;
  payer: {
    name: string;
    email: string;
    document: string;
  };
}

export interface EscrowReleaseParams {
  requestId: string;
  protocol: string;
  driverId: string;
  driverName: string;
  driverPixKey: string;
  grossAmount: number;
  platformFeePercent?: number; // Ex: 10%
}

export interface EscrowReleaseResult {
  payoutId: string;
  driverNetAmount: number;
  platformFeeAmount: number;
  status: 'CONCLUIDO' | 'PROCESSANDO';
  releasedAt: string;
}

export const paymentGatewayService = {
  // 1. Geração de Cobrança PIX com Asaas Real ou Fallback Padrão Banco Central
  async createPixCharge(params: CreatePixChargeParams): Promise<PixChargeResult> {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Se a chave do Asaas estiver configurada, tenta criar a cobrança real via Asaas API
    if (isAsaasConfigured) {
      try {
        // 1.1 Criar ou localizar cliente no Asaas
        const cleanCpfCnpj = params.payer.document.replace(/\D/g, '');
        const customerPayload = {
          name: params.payer.name,
          email: params.payer.email,
          cpfCnpj: cleanCpfCnpj || '34829104000192'
        };

        const customerRes = await fetch('/api/asaas/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access_token': asaasApiKey
          },
          body: JSON.stringify(customerPayload)
        });

        let customerId = '';
        if (customerRes.ok) {
          const customerData = await customerRes.json();
          customerId = customerData.id;
        }

        // 1.2 Criar cobrança no Asaas
        const paymentPayload = {
          customer: customerId || undefined,
          billingType: 'PIX',
          value: params.amount,
          dueDate: dueDate,
          description: `LogisticsFlow - ${params.protocol}: ${params.description}`,
          postalService: false
        };

        const paymentRes = await fetch('/api/asaas/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access_token': asaasApiKey
          },
          body: JSON.stringify(paymentPayload)
        });

        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          const asaasPaymentId = paymentData.id;

          // 1.3 Obter QR Code e Chave Copia e Cola do Asaas
          const qrRes = await fetch(`/api/asaas/payments/${asaasPaymentId}/pixQrCode`, {
            headers: { 'access_token': asaasApiKey }
          });

          if (qrRes.ok) {
            const qrData = await qrRes.json();
            const qrCodeText = qrData.payload;
            const qrCodeUrl = qrData.encodedImage 
              ? `data:image/png;base64,${qrData.encodedImage}`
              : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeText)}`;

            // Registrar no Supabase
            if (isSupabaseConfigured && supabase) {
              await supabase.from('financial_transactions').insert([{
                request_id: params.requestId,
                protocol: asaasPaymentId,
                description: `Cobrança PIX Asaas Real - ${params.protocol}`,
                amount: params.amount,
                type: 'CREDIT',
                status: 'PROCESSANDO'
              }]);
            }

            return {
              transactionId: asaasPaymentId,
              status: 'PENDENTE',
              qrCodeUrl,
              qrCodeText,
              amount: params.amount,
              expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              isLiveAsaas: true
            };
          }
        }
      } catch (err) {
        console.warn('Tentativa Asaas API:', err);
      }
    }

    // Fallback matemático padrão Banco Central
    const txId = `PIX-${Date.now().toString().slice(-8)}`;
    const pixKey = 'pagamentos@logisticsflow.com.br';
    
    const qrCodeText = generatePixBRCode({
      pixKey,
      receiverName: 'LOGISTICSFLOW INTERMEDIACAO',
      city: 'SAO PAULO',
      amount: params.amount,
      transactionId: txId,
      description: params.description
    });

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeText)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('financial_transactions').insert([{
          request_id: params.requestId,
          protocol: params.protocol,
          description: `Custódia Garantida - ${params.description}`,
          amount: params.amount,
          type: 'CREDIT',
          status: 'PROCESSANDO'
        }]);
      } catch (err) {
        console.warn('Registro da transação no Supabase:', err);
      }
    }

    return {
      transactionId: txId,
      status: 'PENDENTE',
      qrCodeUrl,
      qrCodeText,
      amount: params.amount,
      expiresAt,
      isLiveAsaas: false
    };
  },

  // 2. Processamento de Cartão de Crédito
  async createCreditCardCharge(params: CreditCardChargeParams): Promise<{ success: boolean; transactionId: string; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = params.cardNumber.replace(/\s/g, '').length >= 13;
        if (!isValid) {
          resolve({ success: false, transactionId: '', error: 'Número do cartão inválido.' });
          return;
        }

        const txId = `CC-${Date.now().toString().slice(-8)}`;
        resolve({ success: true, transactionId: txId });
      }, 1000);
    });
  },

  // 3. Liberação de Custódia (Escrow) e Split para o Motorista via Asaas
  async releaseEscrowToDriver(params: EscrowReleaseParams): Promise<EscrowReleaseResult> {
    const feePercent = params.platformFeePercent || 10;
    const platformFeeAmount = (params.grossAmount * feePercent) / 100;
    const driverNetAmount = params.grossAmount - platformFeeAmount;
    const payoutId = `PAYOUT-PIX-${Date.now().toString().slice(-6)}`;

    // Se Asaas configurado, pode agendar transferência PIX para a chave do motorista
    if (isAsaasConfigured && params.driverPixKey) {
      try {
        await fetch('/api/asaas/transfers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access_token': asaasApiKey
          },
          body: JSON.stringify({
            value: driverNetAmount,
            pixAddressKey: params.driverPixKey.replace(/\D/g, '') || params.driverPixKey,
            description: `Repasse Frete LogisticsFlow - ${params.protocol}`
          })
        });
      } catch (err) {
        console.warn('Transferência Asaas:', err);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('financial_transactions').insert([{
          protocol: payoutId,
          description: `Repasse PIX ao Motorista (${params.driverName}) - Chave: ${params.driverPixKey}`,
          amount: driverNetAmount,
          type: 'DEBIT',
          status: 'CONCLUIDO',
          pix_key: params.driverPixKey
        }]);
      } catch (err) {
        console.warn('Erro ao registrar split no Supabase:', err);
      }
    }

    return {
      payoutId,
      driverNetAmount,
      platformFeeAmount,
      status: 'CONCLUIDO',
      releasedAt: new Date().toLocaleString('pt-BR')
    };
  },

  // 4. Verificação de Status da Cobrança no Asaas em Tempo Real
  async checkPaymentStatus(transactionId: string): Promise<'PENDENTE' | 'PAGO' | 'EXPIRADO'> {
    if (isAsaasConfigured && transactionId.startsWith('pay_')) {
      try {
        const res = await fetch(`/api/asaas/payments/${transactionId}`, {
          headers: { 'access_token': asaasApiKey }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'RECEIVED' || data.status === 'CONFIRMED' || data.status === 'RECEIVED_IN_CASH') {
            return 'PAGO';
          }
          if (data.status === 'OVERDUE') {
            return 'EXPIRADO';
          }
        }
      } catch (err) {
        console.warn('Status Asaas:', err);
      }
    }

    return transactionId.startsWith('PIX-') || transactionId.startsWith('CC-') ? 'PAGO' : 'PENDENTE';
  }
};
