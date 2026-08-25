import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const ClientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setActiveRole } = useApp();

  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    cnpj: '',
    responsibleName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: 'SP',
    zipCode: '',
    fullHubLevel: 'Mercado Líder Platinum'
  });

  const handleFillDemo = () => {
    setFormData({
      companyName: 'EletroTech Mercado Líder Platinum',
      tradeName: 'EletroTech Comércio Digital Ltda',
      cnpj: '34.829.104/0001-92',
      responsibleName: 'Marcos Vinicius Ribeiro',
      email: 'marcos@eletrotechloja.com.br',
      password: 'senha123456',
      phone: '(11) 98765-4321',
      address: 'Rua Guaipá, 1420 - Galpão 04',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05089-000',
      fullHubLevel: 'Mercado Líder Platinum'
    });
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { user, error } = await authService.signUp({
      email: formData.email,
      password: formData.password || 'senha123456',
      name: formData.responsibleName,
      phone: formData.phone,
      document: formData.cnpj,
      role: 'CLIENTE',
      companyName: formData.companyName,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode
    });

    if (error) {
      setErrorMsg(`Aviso: ${error}`);
    }

    if (user) {
      setCurrentUser(user);
      setActiveRole('CLIENTE');
    }
    setLoading(false);
    navigate('/cliente/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-on-background py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-2xl">storefront</span>
              <h1 className="font-headline text-2xl font-extrabold text-primary">Cadastro do Embarcador</h1>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Cadastre sua loja/empresa para agendar e contratar fretes para os CDs do Mercado Livre Full.
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-primary mb-1">Razão Social *</label>
              <input
                type="text"
                placeholder="Ex: Minha Empresa Comércio de Eletrônicos Ltda"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Nome da Loja no Mercado Livre *</label>
              <input
                type="text"
                placeholder="Ex: Minha Loja Oficial"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">CNPJ da Empresa *</label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-mono focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Responsável pela Expedição *</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={formData.responsibleName}
                onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                placeholder="(11) 98888-7777"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">E-mail Comercial de Acesso *</label>
              <input
                type="email"
                placeholder="seu.email@sualoja.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Criar Senha de Acesso *</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-primary mb-1">Endereço do Galpão de Coleta *</label>
              <input
                type="text"
                placeholder="Ex: Av. Paulista, 1000 - Galpão 3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Cidade / Estado *</label>
              <input
                type="text"
                value={`${formData.city} - ${formData.state}`}
                onChange={(e) => setFormData({ ...formData, city: e.target.value.split('-')[0].trim() })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Reputação no Mercado Livre</label>
              <select
                value={formData.fullHubLevel}
                onChange={(e) => setFormData({ ...formData, fullHubLevel: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
              >
                <option value="Mercado Líder Platinum">Mercado Líder Platinum</option>
                <option value="Mercado Líder Gold">Mercado Líder Gold</option>
                <option value="Mercado Líder">Mercado Líder</option>
                <option value="Seller Iniciante no Full">Seller Iniciante no Full</option>
              </select>
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
                <span>Criando Conta e Acessando...</span>
              </>
            ) : (
              <>
                <span>Cadastrar & Acessar Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
