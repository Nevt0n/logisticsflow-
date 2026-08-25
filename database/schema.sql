-- ============================================================================
-- LOGISTICSFLOW - SCHEMA COMPLETO E RESILIENTE (SUPABASE / POSTGRESQL)
-- Execute este script completo no SQL Editor do Supabase (Ctrl+A e Correr)
-- ============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Limpeza prévia de tabelas antigas para permitir re-execução limpa
DROP TABLE IF EXISTS public.delivery_tracking_steps CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.financial_transactions CASCADE;
DROP TABLE IF EXISTS public.freight_bids CASCADE;
DROP TABLE IF EXISTS public.delivery_requests CASCADE;
DROP TABLE IF EXISTS public.driver_freight_rate_configs CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.fulfillment_centers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 3. Criação Segura de Tipos Customizados (ENUMs)
DO $$ BEGIN
    CREATE TYPE public.user_role_type AS ENUM ('CLIENTE', 'MOTORISTA', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.delivery_status_type AS ENUM (
        'COTACAO', 
        'AGUARDANDO_PAGAMENTO', 
        'PAGO_AGENDADO', 
        'COLETANDO', 
        'EM_TRANSITO', 
        'DOCA_FULL', 
        'FINALIZADO', 
        'CANCELADO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.bid_status_type AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. TABELA: USUÁRIOS (Embarcadores e Motoristas)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    document VARCHAR(30) NOT NULL UNIQUE, -- CPF ou CNPJ
    company_name VARCHAR(255),
    role public.user_role_type NOT NULL DEFAULT 'CLIENTE',
    avatar_url TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(20),
    address TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_deliveries INTEGER DEFAULT 0,
    full_hub_level VARCHAR(100) DEFAULT 'Seller Mercado Livre',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA: CENTROS DE DISTRIBUIÇÃO MERCADO LIVRE FULL (CDs)
CREATE TABLE public.fulfillment_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE, -- Ex: 'CD SP01', 'CD SP02', 'CD MG02'
    name VARCHAR(255) NOT NULL,
    company VARCHAR(100) DEFAULT 'Mercado Livre Full',
    address TEXT NOT NULL,
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    accepted_vehicles TEXT[] DEFAULT ARRAY['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado'],
    dock_operating_hours VARCHAR(100) DEFAULT '24 Horas (Agendado)',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA: VEÍCULOS DOS MOTORISTAS (FROTA)
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    year INTEGER NOT NULL,
    plate VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL DEFAULT 'Van / Furgão',
    body_type VARCHAR(100) NOT NULL DEFAULT 'Baú Seco',
    max_weight_kg NUMERIC(10, 2) NOT NULL,
    max_volume_m3 NUMERIC(10, 2) NOT NULL,
    is_full_compliant BOOLEAN DEFAULT TRUE,
    antt_register VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA: TABELA DE FRETE DO MOTORISTA
CREATE TABLE public.driver_freight_rate_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    base_price_per_km NUMERIC(10, 2) NOT NULL DEFAULT 5.80,
    minimum_freight NUMERIC(10, 2) NOT NULL DEFAULT 220.00,
    pallet_handling_fee NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
    full_dock_assistance_fee NUMERIC(10, 2) NOT NULL DEFAULT 80.00,
    night_surcharge_percent NUMERIC(5, 2) DEFAULT 20.00,
    toll_by_shipper BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA: SOLICITAÇÕES DE ENTREGA / AGENDAMENTOS MERCADO FULL
CREATE TABLE public.delivery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol VARCHAR(50) NOT NULL UNIQUE, -- Ex: 'LF-2026-9041'
    title VARCHAR(255) NOT NULL,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    fulfillment_center_id UUID NOT NULL REFERENCES public.fulfillment_centers(id) ON DELETE RESTRICT,
    
    -- Origem
    origin_address TEXT NOT NULL,
    origin_neighborhood VARCHAR(100) NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    origin_state VARCHAR(2) NOT NULL,
    origin_zip_code VARCHAR(20),
    origin_contact_name VARCHAR(150) NOT NULL,
    origin_contact_phone VARCHAR(30) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time_range VARCHAR(50) NOT NULL,

    -- Destino Mercado Full
    dock_date DATE NOT NULL,
    dock_time_slot VARCHAR(50) NOT NULL,
    full_scheduling_code VARCHAR(100) NOT NULL,

    -- Carga
    cargo_category VARCHAR(150) NOT NULL,
    packages_count INTEGER NOT NULL DEFAULT 1,
    pallets_count INTEGER NOT NULL DEFAULT 1,
    weight_kg NUMERIC(10, 2) NOT NULL,
    volume_m3 NUMERIC(10, 2),
    invoice_number VARCHAR(100) NOT NULL,
    invoice_key VARCHAR(50) NOT NULL,
    declared_value NUMERIC(12, 2) NOT NULL,
    observations TEXT,
    required_vehicle_type VARCHAR(100) NOT NULL,

    -- Status e Pagamento
    status public.delivery_status_type NOT NULL DEFAULT 'COTACAO',
    selected_bid_id UUID,
    payment_method VARCHAR(50),
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_transaction_id VARCHAR(100),
    total_amount NUMERIC(10, 2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABELA: PROPOSTAS DE FRETE (BIDS DOS MOTORISTAS)
CREATE TABLE public.freight_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.delivery_requests(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    toll_included BOOLEAN DEFAULT TRUE,
    unloading_included BOOLEAN DEFAULT TRUE,
    estimated_pickup_date DATE NOT NULL,
    estimated_pickup_time VARCHAR(50) NOT NULL,
    notes TEXT,
    status public.bid_status_type NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABELA: TRACKING / RASTREAMENTO EM TEMPO REAL
CREATE TABLE public.delivery_tracking_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.delivery_requests(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name public.delivery_status_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABELA: CHAT EM TEMPO REAL
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.delivery_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. TABELA: CENTRAL DE NOTIFICAÇÕES
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. TABELA: TRANSAÇÕES FINANCEIRAS & CUSTÓDIA (ESCROW)
CREATE TABLE public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    request_id UUID REFERENCES public.delivery_requests(id) ON DELETE SET NULL,
    protocol VARCHAR(100),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'CREDIT' ou 'DEBIT'
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSANDO',
    pix_key VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. POVOAMENTO INICIAL AUTOMÁTICO (SEED DOS CENTROS DE DISTRIBUIÇÃO MERCADO LIVRE FULL)
INSERT INTO public.fulfillment_centers (code, name, company, address, neighborhood, city, state, zip_code, dock_operating_hours)
VALUES
    ('CD SP01', 'Mercado Livre Full Cajamar I', 'Mercado Livre Full', 'Av. Dr. Antônio João Abdalla, 260', 'Cristais', 'Cajamar', 'SP', '07750-000', '24 Horas (Agendado)'),
    ('CD SP02', 'Mercado Livre Full Cajamar II (Multicargas)', 'Mercado Livre Full', 'Rodovia Anhanguera, km 37,5', 'Polvilho', 'Cajamar', 'SP', '07770-000', '06:00 às 22:00'),
    ('CD SP03', 'Mercado Livre Full Franco da Rocha', 'Mercado Livre Full', 'Estrada do Governo, 1500', 'Pouso Alegre', 'Franco da Rocha', 'SP', '07850-000', '07:00 às 23:00'),
    ('CD SP04', 'Mercado Livre Full Guarulhos Cumbica', 'Mercado Livre Full', 'Av. Santos Dumont, 3200', 'Cumbica', 'Guarulhos', 'SP', '07180-270', '24 Horas'),
    ('CD SP05', 'Mercado Livre Full Louveira', 'Mercado Livre Full', 'Estrada Municipal Romildo Prado, 800', 'Santo Antônio', 'Louveira', 'SP', '13290-000', '06:00 às 20:00'),
    ('CD MG02', 'Mercado Livre Full Extrema Polo Sul', 'Mercado Livre Full', 'Rodovia Fernão Dias, km 935', 'Polo Industrial', 'Extrema', 'MG', '37640-000', '06:00 às 22:00')
ON CONFLICT (code) DO NOTHING;

-- 15. USUÁRIOS DE DEMONSTRAÇÃO
INSERT INTO public.users (name, email, phone, document, company_name, role, avatar_url, city, state, zip_code, rating, completed_deliveries, full_hub_level)
VALUES
    ('Marcos Vinicius Ribeiro', 'marcos@eletrotechloja.com.br', '(11) 98765-4321', '34.829.104/0001-92', 'EletroTech Mercado Líder Platinum', 'CLIENTE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'São Paulo', 'SP', '05089-000', 4.90, 48, 'Mercado Líder Platinum'),
    ('Carlos Eduardo Silva', 'carlos.fretes@logflow.com', '(11) 97123-8899', '284.918.472-09', 'Silva Transportes Rápidos & Agendamento Full', 'MOTORISTA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Jundiaí', 'SP', '13201-000', 4.95, 164, 'Motorista Homologado Full')
ON CONFLICT (email) DO NOTHING;

-- 16. PERMISSÕES PÚBLICAS / ROW LEVEL SECURITY
ALTER TABLE public.fulfillment_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública dos CDs Full" ON public.fulfillment_centers FOR SELECT USING (true);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso a usuários" ON public.users FOR ALL USING (true);

ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso a solicitações" ON public.delivery_requests FOR ALL USING (true);

ALTER TABLE public.freight_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso a propostas" ON public.freight_bids FOR ALL USING (true);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso ao chat" ON public.chat_messages FOR ALL USING (true);

ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso ao financeiro" ON public.financial_transactions FOR ALL USING (true);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso a notificações" ON public.notifications FOR ALL USING (true);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso a veículos" ON public.vehicles FOR ALL USING (true);
