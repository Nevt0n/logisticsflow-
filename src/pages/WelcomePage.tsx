import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveRole } = useApp();

  const handleSelectDriver = () => {
    setActiveRole('MOTORISTA');
    navigate('/motorista/dashboard');
  };

  const handleSelectClient = () => {
    setActiveRole('CLIENTE');
    navigate('/cliente/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Illustrative Branding */}
        <div className="relative bg-gradient-to-br from-primary-container via-black to-[#05162a] p-8 text-white flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-tight text-white">LogisticsFlow</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-secondary-fixed/20 border border-secondary-fixed/30 text-secondary-fixed text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Especialista Mercado Livre Full</span>
            </div>

            <h1 className="font-headline text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Agendamento e Fretes Rápidos para o Mercado Full
            </h1>
            <p className="text-sm text-surface-container-highest/80 leading-relaxed">
              A plataforma inteligente que conecta embarcadores aos melhores motoristas credenciados para entregas pontuais nos Centros de Distribuição Full de todo o Brasil.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xl font-extrabold text-secondary-fixed">100%</p>
              <p className="text-[11px] text-gray-300">Homologado Full</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">25 CDs</p>
              <p className="text-[11px] text-gray-300">SP, MG, RJ, BA e Sul</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-secondary-fixed">0 min</p>
              <p className="text-[11px] text-gray-300">Tempo de Doca Otimizado</p>
            </div>
          </div>

          {/* Background subtle glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Right Side: Profile Selection & Action Hub */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-surface-container-lowest">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Como você deseja acessar?</span>
            <h2 className="font-headline text-2xl font-bold text-primary mt-1 mb-2">Escolha seu perfil</h2>
            <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
              Tenha acesso a ferramentas dedicadas para embarcadores ou transportadores.
            </p>

            <div className="space-y-4">
              {/* Option: Motorista */}
              <button
                onClick={handleSelectDriver}
                className="w-full p-4 rounded-xl bg-primary text-on-primary hover:bg-neutral-800 transition-all flex items-center justify-between group shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-secondary-fixed group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-white">Sou Motorista / Transportador</h3>
                    <p className="text-xs text-gray-300">Pegar cargas, calcular fretes e gerenciar entregas Full</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              {/* Option: Cliente */}
              <button
                onClick={handleSelectClient}
                className="w-full p-4 rounded-xl bg-surface-container-lowest border-2 border-primary text-primary hover:bg-surface-container transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-primary">Sou Cliente / Embarcador</h3>
                    <p className="text-xs text-on-surface-variant">Cotar fretes, agendar docas Full e rastrear envios</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-container-high mt-8 space-y-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Primeira vez aqui?</span>
              <div className="flex gap-3 font-semibold text-primary">
                <button onClick={() => navigate('/cadastro-cliente')} className="hover:underline">Cadastrar Loja</button>
                <span>•</span>
                <button onClick={() => navigate('/cadastro-motorista')} className="hover:underline text-secondary">Cadastrar Veículo</button>
              </div>
            </div>
            <div className="text-center pt-2">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-secondary hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Já tem uma conta? Fazer Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
