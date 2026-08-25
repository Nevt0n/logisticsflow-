import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, UserRole } from '../types';

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone: string;
  document: string;
  role: UserRole;
  companyName?: string;
  city: string;
  state: string;
  zipCode?: string;
}

export const authService = {
  // 1. Cadastro de Novo Usuário (Supabase Auth + Tabela public.users)
  async signUp(params: SignUpParams): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      // Modo Mock Local caso não haja conexão com internet
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        name: params.name,
        email: params.email,
        phone: params.phone,
        document: params.document,
        role: params.role,
        companyName: params.companyName,
        city: params.city,
        state: params.state,
        rating: 5.0,
        completedDeliveries: 0
      };
      return { user: mockUser, error: null };
    }

    try {
      // 1.1 Criar no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.name,
            role: params.role,
            document: params.document
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      const authId = authData.user?.id;

      // 1.2 Inserir na tabela public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          name: params.name,
          email: params.email,
          phone: params.phone,
          document: params.document,
          company_name: params.companyName || params.name,
          role: params.role,
          city: params.city,
          state: params.state,
          zip_code: params.zipCode || '01000-000',
          rating: 5.00,
          completed_deliveries: 0,
          avatar_url: params.role === 'CLIENTE'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }])
        .select()
        .single();

      if (userError) {
        console.warn('Registro na tabela users:', userError.message);
      }

      const finalUser: User = {
        id: userData?.id || authId || `usr-${Date.now()}`,
        name: params.name,
        email: params.email,
        phone: params.phone,
        document: params.document,
        role: params.role,
        companyName: params.companyName,
        city: params.city,
        state: params.state,
        rating: 5.0,
        completedDeliveries: 0
      };

      return { user: finalUser, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Erro ao realizar cadastro.' };
    }
  },

  // 2. Login com E-mail e Senha
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { user: null, error: 'Supabase não configurado.' };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      // Buscar perfil na tabela public.users
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        // Fallback construído a partir dos metadados do auth
        const fallbackUser: User = {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || email.split('@')[0],
          email: authData.user.email || email,
          phone: '(11) 98888-0000',
          document: authData.user.user_metadata?.document || '00.000.000/0001-00',
          role: (authData.user.user_metadata?.role as UserRole) || 'CLIENTE',
          city: 'São Paulo',
          state: 'SP',
          rating: 5.0,
          completedDeliveries: 0
        };
        return { user: fallbackUser, error: null };
      }

      const user: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        document: profile.document,
        companyName: profile.company_name,
        role: profile.role,
        avatarUrl: profile.avatar_url,
        city: profile.city,
        state: profile.state,
        rating: profile.rating,
        completedDeliveries: profile.completed_deliveries
      };

      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Erro ao realizar login.' };
    }
  },

  // 3. Logout / Encerrar Sessão
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  // 4. Obter Usuário Atual da Sessão
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          document: profile.document,
          companyName: profile.company_name,
          role: profile.role,
          avatarUrl: profile.avatar_url,
          city: profile.city,
          state: profile.state,
          rating: profile.rating,
          completedDeliveries: profile.completed_deliveries
        };
      }

      return {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
        email: session.user.email || '',
        phone: '(11) 98888-0000',
        document: session.user.user_metadata?.document || '000.000.000-00',
        role: (session.user.user_metadata?.role as UserRole) || 'CLIENTE',
        city: 'São Paulo',
        state: 'SP',
        rating: 5.0,
        completedDeliveries: 0
      };
    } catch {
      return null;
    }
  },

  // 5. Recuperação de Senha
  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não configurado.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  }
};
