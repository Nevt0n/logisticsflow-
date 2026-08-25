import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DriverFinancePage: React.FC = () => {
  const { financeTransactions, requestWithdrawal } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pixKey, setPixKey] = useState('284.918.472-09 (CPF)');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const availableBalance = financeTransactions
    .filter(t => t.status === 'CONCLUIDO')
    .reduce((acc, t) => t.type === 'CREDIT' ? acc + t.amount : acc - t.amount, 0);

  const inEscrowBalance = financeTransactions
    .filter(t => t.status === 'PROCESSANDO')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalHistoricalEarnings = financeTransactions
    .filter(t => t.type === 'CREDIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount <= 0 || amount > availableBalance) return;

    const ok = requestWithdrawal(amount, pixKey);
    if (ok) {
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Financeiro & Extrato de Ganhos
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gerencie seu saldo disponível, valores em custódia de fretes em trânsito e solicite saques via PIX 24h.
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={availableBalance <= 0}
          className="bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-headline font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">payments</span>
          <span>Solicitar Saque PIX</span>
        </button>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg space-y-2 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs text-gray-300 uppercase font-bold tracking-wider">Saldo Disponível para Saque</span>
            <p className="font-headline text-3xl font-extrabold text-secondary-fixed mt-1">
              R$ {availableBalance.toFixed(2)}
            </p>
            <p className="text-[11px] text-gray-300 mt-2">Transferência via PIX em até 5 minutos</p>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-secondary/30 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Em Custódia / Garantia</span>
            <span className="material-symbols-outlined text-amber-500 text-lg">lock</span>
          </div>
          <p className="font-headline text-3xl font-extrabold text-primary mt-1">
            R$ {inEscrowBalance.toFixed(2)}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-2">Liberado assim que o CD Full assinar o canhoto</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Total Histórico Faturado</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">trending_up</span>
          </div>
          <p className="font-headline text-3xl font-extrabold text-primary mt-1">
            R$ {totalHistoricalEarnings.toFixed(2)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2">164 viagens finalizadas</p>
        </div>
      </div>

      {/* Transactions Statement */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h3 className="font-headline font-bold text-base text-primary pb-3 border-b border-surface-container-high flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">receipt_long</span>
          <span>Extrato Detalhado de Movimentações</span>
        </h3>

        <div className="space-y-2.5">
          {financeTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-xl border border-surface-container-high bg-surface-container-low/40 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  tx.type === 'CREDIT' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {tx.type === 'CREDIT' ? 'add' : 'arrow_upward'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-primary">{tx.description}</p>
                    {tx.status === 'PROCESSANDO' && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Em Custódia
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-mono mt-0.5">{tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-headline font-extrabold text-sm ${
                  tx.type === 'CREDIT' ? 'text-secondary' : 'text-primary'
                }`}>
                  {tx.type === 'CREDIT' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                </p>
                <span className="text-[10px] text-on-surface-variant font-medium capitalize">
                  {tx.status.toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-surface-container-high shadow-2xl space-y-4 animate-fadeIn">
            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-2">
                <span className="material-symbols-outlined text-4xl text-secondary">check_circle</span>
                <h4 className="font-headline font-bold text-lg text-primary">Transferência Solicitada!</h4>
                <p className="text-xs text-on-surface-variant">O PIX será processado para a chave indicada em poucos minutos.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                <h3 className="font-headline font-bold text-lg text-primary">
                  Saque Instantâneo via PIX
                </h3>

                <div>
                  <span className="text-on-surface-variant">Saldo Disponível:</span>
                  <p className="font-headline text-xl font-bold text-secondary">R$ {availableBalance.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Valor do Saque (R$) *</label>
                  <input
                    type="number"
                    max={availableBalance}
                    min="10"
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-headline font-bold text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Chave PIX para Recebimento *</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-mono focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold bg-secondary hover:bg-opacity-90 text-on-secondary shadow-md"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
