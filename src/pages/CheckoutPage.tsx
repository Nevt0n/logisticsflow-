import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { paymentGatewayService } from '../services/paymentGatewayService';
import type { PixChargeResult } from '../services/paymentGatewayService';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const bidId = searchParams.get('bidId');
  const navigate = useNavigate();
  const { deliveries, bids, acceptBidAndPay, currentUser } = useApp();

  const currentDelivery = deliveries.find(d => d.id === id) || deliveries[0];
  const selectedBid = bids.find(b => b.id === bidId) || currentDelivery.selectedBid || bids[0];

  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'BOLETO'>('PIX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixData, setPixData] = useState<PixChargeResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos em segundos

  const [cardData, setCardData] = useState({
    number: '4532 8912 3410 8821',
    holder: currentUser.name.toUpperCase(),
    expiry: '12/29',
    cvv: '882',
    installments: 1
  });

  // Gerar cobrança PIX dinamicamente com o gateway
  useEffect(() => {
    paymentGatewayService.createPixCharge({
      requestId: currentDelivery.id,
      protocol: currentDelivery.protocol,
      amount: selectedBid.price,
      description: `Frete Mercado Full - ${currentDelivery.destination.code} (${currentDelivery.destination.fullSchedulingCode})`,
      payer: {
        name: currentUser.name,
        email: currentUser.email,
        document: currentUser.document
      }
    }).then(result => {
      setPixData(result);
    });
  }, [currentDelivery, selectedBid, currentUser]);

  // Contador regressivo do PIX
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCopyPix = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'CREDIT_CARD') {
      const res = await paymentGatewayService.createCreditCardCharge({
        requestId: currentDelivery.id,
        amount: selectedBid.price,
        cardNumber: cardData.number,
        cardHolderName: cardData.holder,
        cardExpiry: cardData.expiry,
        cardCvv: cardData.cvv,
        installments: Number(cardData.installments),
        payer: {
          name: currentUser.name,
          email: currentUser.email,
          document: currentUser.document
        }
      });

      if (!res.success) {
        alert(res.error || 'Falha no processamento do cartão.');
        setIsProcessing(false);
        return;
      }
    }

    setTimeout(() => {
      acceptBidAndPay(currentDelivery.id, selectedBid.id, paymentMethod);
      setIsProcessing(false);

      // Celebração visual
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      navigate(`/cliente/comprovante/${currentDelivery.id}`);
    }, 1200);
  };

  const installmentValue = (selectedBid.price / Number(cardData.installments)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Checkout Seguro & Garantia de Custódia
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gateway Integrado com Split Automático • O pagamento fica protegido em custódia até a conferência no CD Mercado Livre Full.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment Form & Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Methods Tabs */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
            <h2 className="font-headline font-bold text-base text-primary flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">payments</span>
              <span>Escolha a Forma de Pagamento</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'PIX'
                    ? 'border-secondary bg-secondary-fixed/20 text-primary font-bold shadow-sm'
                    : 'border-surface-container-high hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-secondary text-2xl">qr_code_2</span>
                <span className="text-xs">PIX Dinâmico</span>
                <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold px-1.5 py-0.2 rounded">
                  Aprovação Imediata
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-primary bg-primary text-on-primary font-bold shadow-sm'
                    : 'border-surface-container-high hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="text-xs">Cartão de Crédito</span>
                <span className="text-[10px] opacity-80">Em até 12x</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BOLETO')}
                className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'BOLETO'
                    ? 'border-primary bg-primary text-on-primary font-bold shadow-sm'
                    : 'border-surface-container-high hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                <span className="text-xs">Boleto / Faturado</span>
                <span className="text-[10px] opacity-80">Mercado Líder</span>
              </button>
            </div>

            {/* PIX View */}
            {paymentMethod === 'PIX' && pixData && (
              <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container-high text-center space-y-3 mt-4 animate-fadeIn">
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="text-on-surface-variant">Status da Cobrança:</span>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Aguardando Pagamento ({formatTime(timeLeft)})
                  </span>
                </div>

                <div className="w-48 h-48 bg-white p-2.5 rounded-2xl mx-auto border border-surface-container-high shadow-md flex items-center justify-center">
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX Banco Central"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-primary">
                    Escaneie com o app do seu banco ou utilize o código Copia e Cola:
                  </p>
                  <p className="text-[11px] text-on-surface-variant">Valor: <strong>R$ {selectedBid.price.toFixed(2)}</strong> (Sem taxas adicionais)</p>
                </div>

                <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border border-surface-container-high max-w-lg mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={pixData.qrCodeText}
                    className="text-[11px] font-mono text-on-surface-variant truncate flex-1 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="bg-primary text-on-primary text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-neutral-800 transition shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {pixCopied ? 'check' : 'content_copy'}
                    </span>
                    <span>{pixCopied ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card View */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-3 mt-4 text-xs animate-fadeIn">
                <div>
                  <label className="block font-bold text-primary mb-1">Número do Cartão *</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-primary mb-1">Validade (MM/AA) *</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-primary mb-1">CVV (Código de Segurança) *</label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Nome Impresso no Cartão *</label>
                  <input
                    type="text"
                    value={cardData.holder}
                    onChange={(e) => setCardData({ ...cardData, holder: e.target.value.toUpperCase() })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 uppercase focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Opções de Parcelamento</label>
                  <select
                    value={cardData.installments}
                    onChange={(e) => setCardData({ ...cardData, installments: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="1">1x de R$ {selectedBid.price.toFixed(2)} (Sem juros)</option>
                    <option value="2">2x de R$ {(selectedBid.price / 2).toFixed(2)} (Sem juros)</option>
                    <option value="3">3x de R$ {(selectedBid.price / 3).toFixed(2)} (Sem juros)</option>
                    <option value="6">6x de R$ {(selectedBid.price / 6).toFixed(2)}</option>
                    <option value="12">12x de R$ {(selectedBid.price / 12).toFixed(2)}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Boleto View */}
            {paymentMethod === 'BOLETO' && (
              <div className="bg-surface-container-low p-4 rounded-xl text-xs space-y-2">
                <p className="font-bold text-primary">Faturamento Faturado para Mercado Líderes</p>
                <p className="text-on-surface-variant">
                  Boleto com vencimento para 15 dias após a conclusão da entrega na doca do Mercado Full.
                </p>
              </div>
            )}
          </div>

          {/* Split & Escrow Guarantee Box */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-secondary font-headline font-bold text-sm">
              <span className="material-symbols-outlined text-xl">shield</span>
              <span>Regra de Split & Proteção Escrow</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              O valor total de <strong>R$ {selectedBid.price.toFixed(2)}</strong> é retido na conta de custódia da plataforma. Quando o motorista ({selectedBid.driverName}) finalizar a descarga na doca do CD Full com o canhoto assinado, o split é executado automaticamente via PIX.
            </p>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-sm text-primary pb-3 border-b border-surface-container-high">
              Resumo da Contratação
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Protocolo:</span>
                <span className="font-mono font-bold text-primary">{currentDelivery.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destino CD:</span>
                <span className="font-semibold text-primary">{currentDelivery.destination.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Janela Doca:</span>
                <span className="font-mono text-secondary font-bold">{currentDelivery.destination.dockTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Motorista:</span>
                <span className="font-bold text-primary">{selectedBid.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Veículo:</span>
                <span className="text-on-surface">{selectedBid.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Placa:</span>
                <span className="font-mono font-bold text-primary">{selectedBid.vehiclePlate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container-high space-y-1.5 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Valor do Frete:</span>
                <span>R$ {selectedBid.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Taxa de Intermediação Full:</span>
                <span className="text-secondary font-bold">Inclusa</span>
              </div>
              <div className="flex justify-between text-base font-headline font-extrabold text-primary pt-2 border-t border-surface-container-high">
                <span>Total:</span>
                <span className="text-primary">
                  {paymentMethod === 'CREDIT_CARD' && cardData.installments > 1
                    ? `${cardData.installments}x de R$ ${installmentValue}`
                    : `R$ ${selectedBid.price.toFixed(2)}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-secondary hover:bg-opacity-90 text-on-secondary font-headline font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Confirmando Pagamento...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  <span>{paymentMethod === 'PIX' ? 'Já fiz o PIX / Confirmar' : 'Efetuar Pagamento'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
