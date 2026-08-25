-- ============================================================================
-- LOGISTICSFLOW - DADOS INICIAIS (SEED DATA)
-- População dos Centros de Distribuição Oficiais do Mercado Livre Full
-- ============================================================================

-- 1. Inserir Centros de Distribuição Oficiais Mercado Livre Full
INSERT INTO fulfillment_centers (id, code, name, company, address, neighborhood, city, state, zip_code, dock_operating_hours, accepted_vehicles)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'CD SP01', 'Mercado Livre Full Cajamar I', 'Mercado Livre Full', 'Av. Dr. Antônio João Abdalla, 260', 'Cristais', 'Cajamar', 'SP', '07750-000', '24 Horas (Agendado)', ARRAY['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem']),
    ('c0000000-0000-0000-0000-000000000002', 'CD SP02', 'Mercado Livre Full Cajamar II (Multicargas)', 'Mercado Livre Full', 'Rodovia Anhanguera, km 37,5', 'Polvilho', 'Cajamar', 'SP', '07770-000', '06:00 às 22:00', ARRAY['Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado']),
    ('c0000000-0000-0000-0000-000000000003', 'CD SP03', 'Mercado Livre Full Franco da Rocha', 'Mercado Livre Full', 'Estrada do Governo, 1500', 'Pouso Alegre', 'Franco da Rocha', 'SP', '07850-000', '07:00 às 23:00', ARRAY['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Toco / Médio']),
    ('c0000000-0000-0000-0000-000000000004', 'CD SP04', 'Mercado Livre Full Guarulhos Cumbica', 'Mercado Livre Full', 'Av. Santos Dumont, 3200', 'Cumbica', 'Guarulhos', 'SP', '07180-270', '24 Horas', ARRAY['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Truck / Pesado']),
    ('c0000000-0000-0000-0000-000000000005', 'CD SP05', 'Mercado Livre Full Louveira', 'Mercado Livre Full', 'Estrada Municipal Romildo Prado, 800', 'Santo Antônio', 'Louveira', 'SP', '13290-000', '06:00 às 20:00', ARRAY['Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem']),
    ('c0000000-0000-0000-0000-000000000006', 'CD MG02', 'Mercado Livre Full Extrema Polo Sul', 'Mercado Livre Full', 'Rodovia Fernão Dias, km 935', 'Polo Industrial', 'Extrema', 'MG', '37640-000', '06:00 às 22:00', ARRAY['Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem'])
ON CONFLICT (code) DO NOTHING;

-- 2. Inserir Usuários Iniciais (Embarcador e Motorista)
INSERT INTO users (id, name, email, phone, document, company_name, role, avatar_url, city, state, zip_code, rating, completed_deliveries, full_hub_level)
VALUES
    ('u0000000-0000-0000-0000-000000000001', 'Marcos Vinicius Ribeiro', 'marcos@eletrotechloja.com.br', '(11) 98765-4321', '34.829.104/0001-92', 'EletroTech Mercado Líder Platinum', 'CLIENTE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'São Paulo', 'SP', '05089-000', 4.90, 48, 'Mercado Líder Platinum'),
    ('u0000000-0000-0000-0000-000000000002', 'Carlos Eduardo Silva', 'carlos.fretes@logflow.com', '(11) 97123-8899', '284.918.472-09', 'Silva Transportes Rápidos & Agendamento Full', 'MOTORISTA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Jundiaí', 'SP', '13201-000', 4.95, 164, 'Motorista Homologado Full')
ON CONFLICT (email) DO NOTHING;

-- 3. Inserir Veículos do Motorista
INSERT INTO vehicles (id, driver_id, brand, model, year, plate, type, body_type, max_weight_kg, max_volume_m3, is_full_compliant, antt_register)
VALUES
    ('v0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'Mercedes-Benz', 'Sprinter 415 CDI Baú', 2022, 'LOG-4E28', 'Van / Furgão', 'Baú Seco', 1800, 14, true, 'ANTT-88392102'),
    ('v0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Iveco', 'Daily 35S14 Baú Sider', 2023, 'FUL-9A10', 'Caminhão 3/4', 'Sider', 3500, 22, true, 'ANTT-99210444')
ON CONFLICT (plate) DO NOTHING;

-- 4. Inserir Tabela de Frete Base do Motorista
INSERT INTO driver_freight_rate_configs (driver_id, base_price_per_km, minimum_freight, pallet_handling_fee, full_dock_assistance_fee, night_surcharge_percent, toll_by_shipper)
VALUES
    ('u0000000-0000-0000-0000-000000000002', 5.80, 220.00, 45.00, 80.00, 20.00, true)
ON CONFLICT (driver_id) DO NOTHING;
