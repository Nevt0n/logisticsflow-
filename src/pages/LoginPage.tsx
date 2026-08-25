import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveRole, setCurrentUser } = useApp();

  const initialRole = (searchParams.get('role') as UserRole) || 'CLIENTE';
  const [role, setRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    const urlRole = searchParams.get('role') as UserRole;
    if (urlRole === 'CLIENTE' || urlRole === 'MOTORISTA') {
      setRole(urlRole);
    }
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { user, error } = await authService.signIn(email, password);

    if (error) {
      setErrorMsg(`Erro no login: ${error}`);
      setLoading(false);
      return;
    }

    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      navigate(user.role === 'CLIENTE' ? '/cliente/dashboard' : '/motorista/dashboard');
    }
    setLoading(false);
  };

  const handleDemoLogin = (demoRole: UserRole) => {
    setActiveRole(demoRole);
    if (demoRole === 'CLIENTE') {
      navigate('/cliente/dashboard');
    } else {
      navigate('/motorista/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    const { success, error } = await authService.resetPassword(forgotEmail);
    if (error) {
      setErrorMsg(error);
    } else if (success) {
      setSuccessMsg('E-mail de redefinição de senha enviado com sucesso!');
      setShowForgotModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl text-secondary-fixed">local_shipping</span>
            </div>
            <span className="font-headline font-bold text-2xl text-primary tracking-tight">LogisticsFlow</span>
          </Link>
          <h1 className="font-headline text-lg font-bold text-primary">Acesse sua Conta</h1>
          <p className="text-xs text-on-surface-variant">
            Entre para gerenciar fretes, cotações e agendamentos Mercado Full.
          </p>
        </div>

        {/* Profile Switcher Tabs */}
        <div className="bg-surface-container p-1 rounded-xl flex items-center gap-1 border border-surface-container-high">
          <button
            type="button"
            onClick={() => setRole('CLIENTE')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'CLIENTE'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span>Embarcador</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('MOTORISTA')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'MOTORISTA'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-sm">rv_hookup</span>
            <span>Motorista</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-error">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-primary mb-1">E-mail Cadastrado *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">mail</span>
              <input
                type="email"
                placeholder={role === 'CLIENTE' ? 'marcos@eletrotechloja.com.br' : 'carlos.fretes@logflow.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-primary">Senha de Acesso *</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-secondary hover:underline font-semibold"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">lock</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-secondary focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-neutral-800 text-on-primary font-headline font-bold text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Validando Acesso...</span>
              </>
            ) : (
              <>
                <span>Entrar na Plataforma</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Access Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-high"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container-lowest px-2">
            Ou acesso rápido de teste
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('CLIENTE')}
            className="p-2.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary flex items-center justify-center gap-1.5 transition"
          >
            <span className="material-symbols-outlined text-sm text-secondary">storefront</span>
            <span>Demo Embarcador</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('MOTORISTA')}
            className="p-2.5 rounded-xl border border-surface-container-high hover:bg-surface-container text-[11px] font-bold text-primary flex items-center justify-center gap-1.5 transition"
          >
            <span className="material-symbols-outlined text-sm text-secondary">rv_hookup</span>
            <span>Demo Motorista</span>
          </button>
        </div>

        {/* Register Links */}
        <div className="pt-4 border-t border-surface-container-high text-center text-xs text-on-surface-variant">
          <span>Ainda não tem conta? </span>
          <Link
            to={role === 'CLIENTE' ? '/cadastro-cliente' : '/cadastro-motorista'}
            className="font-bold text-primary hover:underline text-secondary"
          >
            Criar conta de {role === 'CLIENTE' ? 'Embarcador' : 'Motorista'}
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full border border-surface-container-high shadow-2xl space-y-4">
            <h3 className="font-headline font-bold text-base text-primary">Redefinir Senha</h3>
            <p className="text-xs text-on-surface-variant">
              Informe seu e-mail cadastrado para receber o link de redefinição de senha:
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <input
                type="email"
                placeholder="seu-email@loja.com.br"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-neutral-800"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
