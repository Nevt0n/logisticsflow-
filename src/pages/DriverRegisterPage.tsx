import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import type { DriverFreightRateConfig } from '../types';

export const DriverRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setActiveRole, freightConfig, updateFreightConfig } = useApp();

  const [personalData, setPersonalData] = useState({
    name: '',
    cpf: '',
    cnh: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    state: 'SP',
    antt: ''
  });

  const handleFillDemo = () => {
    setPersonalData({
      name: 'Carlos Eduardo Silva',
      cpf: '284.918.472-09',
      cnh: '04829104928 (Cat. D)',
      phone: '(11) 97123-8899',
      email: 'carlos.fretes@logflow.com',
      password: 'senha123456',
      city: 'Jundiaí',
      state: 'SP',
      antt: 'ANTT-88392102'
    });
  };

  const [rates, setRates] = useState<DriverFreightRateConfig>({
    basePricePerKm: freightConfig.basePricePerKm,
    minimumFreight: freightConfig.minimumFreight,
    palletHandlingFee: freightConfig.palletHandlingFee,
    fullDockAssistanceFee: freightConfig.fullDockAssistanceFee,
    nightSurchargePercent: freightConfig.nightSurchargePercent,
    tollByShipper: freightConfig.tollByShipper,
    availableDays: freightConfig.availableDays,
    availableTimeSlots: freightConfig.availableTimeSlots,
    servicedFulfillmentCenters: freightConfig.servicedFulfillmentCenters,
    truckVolumeM3: freightConfig.truckVolumeM3,
    truckMaxWeightKg: freightConfig.truckMaxWeightKg,
    truckMaxPallets: freightConfig.truckMaxPallets
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    updateFreightConfig(rates);

    const { user, error } = await authService.signUp({
      email: personalData.email,
      password: personalData.password || 'senha123456',
      name: personalData.name,
      phone: personalData.phone,
      document: personalData.cpf,
      role: 'MOTORISTA',
      companyName: `${personalData.name.split(' ')[0]} Transportes Full`,
      city: personalData.city,
      state: personalData.state
    });

    if (error) {
      setErrorMsg(`Aviso: ${error}`);
    }

    if (user) {
      setCurrentUser(user);
      setActiveRole('MOTORISTA');
    }

    setLoading(false);
    navigate('/motorista/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-on-background py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-2xl">local_shipping</span>
              <h1 className="font-headline text-2xl font-extrabold text-primary">Cadastro do Motorista & Tabela de Frete</h1>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Configure seus dados profissionais e personalize sua tabela de preços para cálculo automático de propostas.
            </p>
          </div>
          <Link to="/login" className="text-xs font-semibold text-secondary hover:underline">Já tenho conta (Entrar)</Link>
        </div>

        {errorMsg && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-error">info</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
          <span className="text-[11px] text-on-surface-variant">Quer testar com dados simulados?</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">auto_fix_high</span>
            <span>Preencher Exemplo de Teste</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Dados Pessoais & Documentação */}
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">badge</span>
              <span>1. Dados Pessoais & Habilitação ANTT</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-primary mb-1">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={personalData.name}
                  onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">CPF *</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={personalData.cpf}
                  onChange={(e) => setPersonalData({ ...personalData, cpf: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">CNH com EAR *</label>
                <input
                  type="text"
                  placeholder="Nº da CNH (Cat. B, C ou D)"
                  value={personalData.cnh}
                  onChange={(e) => setPersonalData({ ...personalData, cnh: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Registro ANTT (RNTRC) *</label>
                <input
                  type="text"
                  placeholder="Ex: ANTT-88392102"
                  value={personalData.antt}
                  onChange={(e) => setPersonalData({ ...personalData, antt: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="(11) 98888-7777"
                  value={personalData.phone}
                  onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Cidade Base de Operação *</label>
                <input
                  type="text"
                  placeholder="Ex: Jundiaí - SP ou São Paulo - SP"
                  value={`${personalData.city}${personalData.city ? ' - ' + personalData.state : ''}`}
                  onChange={(e) => setPersonalData({ ...personalData, city: e.target.value.split('-')[0].trim() })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  placeholder="seu.email@transporte.com"
                  value={personalData.email}
                  onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Criar Senha de Acesso *</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={personalData.password}
                  onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tabela de Frete Personalizada */}
          <div className="space-y-3 pt-4 border-t border-surface-container-high">
            <h3 className="font-headline font-bold text-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">calculate</span>
              <span>2. Parâmetros da Sua Tabela de Frete (Automática)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-surface-container-low/50 p-4 rounded-xl border border-surface-container-high">
              <div>
                <label className="block font-bold text-primary mb-1">Saída Mínima / Frete Mínimo (R$) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.minimumFreight}
                  onChange={(e) => setRates({ ...rates, minimumFreight: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Valor por Km Rodado (R$/km) *</label>
                <input
                  type="number"
                  step="0.10"
                  value={rates.basePricePerKm}
                  onChange={(e) => setRates({ ...rates, basePricePerKm: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Taxa de Manuseio por Pallet (R$/un) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.palletHandlingFee}
                  onChange={(e) => setRates({ ...rates, palletHandlingFee: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Taxa Ajudante de Doca Full (R$) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.fullDockAssistanceFee}
                  onChange={(e) => setRates({ ...rates, fullDockAssistanceFee: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-neutral-800 text-on-primary font-headline font-bold text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Salvando Dados e Entrando...</span>
              </>
            ) : (
              <>
                <span>Salvar Tabela & Ir para o Painel do Motorista</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
