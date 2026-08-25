import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { 
  User, 
  UserRole, 
  Vehicle, 
  FulfillmentCenter, 
  DeliveryRequest, 
  FreightBid, 
  ChatMessage, 
  AppNotification, 
  DriverFinanceTransaction, 
  DriverFreightRateConfig,
  DeliveryStatus 
} from '../types';

export const FULFILLMENT_CENTERS: FulfillmentCenter[] = [
  {
    id: 'fc-cajamar-01',
    code: 'CD SP01',
    name: 'Mercado Livre Full Cajamar I',
    company: 'Mercado Livre Full',
    address: 'Av. Dr. Antônio João Abdalla, 260',
    neighborhood: 'Cristais',
    city: 'Cajamar',
    state: 'SP',
    zipCode: '07750-000',
    acceptedVehicles: ['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem'],
    dockOperatingHours: '24 horas (Recebimento Agendado)'
  },
  {
    id: 'fc-cajamar-02',
    code: 'CD SP02',
    name: 'Mercado Livre Full Cajamar II (Multicargas)',
    company: 'Mercado Livre Full',
    address: 'Rodovia Anhanguera, km 37,5',
    neighborhood: 'Polvilho',
    city: 'Cajamar',
    state: 'SP',
    zipCode: '07770-000',
    acceptedVehicles: ['Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado'],
    dockOperatingHours: '06:00 às 22:00'
  },
  {
    id: 'fc-franco-03',
    code: 'CD SP03',
    name: 'Mercado Livre Full Franco da Rocha',
    company: 'Mercado Livre Full',
    address: 'Estrada do Governo, 1500',
    neighborhood: 'Pouso Alegre',
    city: 'Franco da Rocha',
    state: 'SP',
    zipCode: '07850-000',
    acceptedVehicles: ['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Toco / Médio'],
    dockOperatingHours: '07:00 às 23:00'
  },
  {
    id: 'fc-guarulhos-04',
    code: 'CD SP04',
    name: 'Mercado Livre Full Guarulhos Cumbica',
    company: 'Mercado Livre Full',
    address: 'Av. Santos Dumont, 3200',
    neighborhood: 'Cumbica',
    city: 'Guarulhos',
    state: 'SP',
    zipCode: '07180-270',
    acceptedVehicles: ['Fiorino / VUC', 'Van / Furgão', 'Caminhão 3/4', 'Truck / Pesado'],
    dockOperatingHours: '24 horas'
  },
  {
    id: 'fc-louveira-05',
    code: 'CD SP05',
    name: 'Mercado Livre Full Louveira',
    company: 'Mercado Livre Full',
    address: 'Estrada Municipal Romildo Prado, 800',
    neighborhood: 'Santo Antônio',
    city: 'Louveira',
    state: 'SP',
    zipCode: '13290-000',
    acceptedVehicles: ['Van / Furgão', 'Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem'],
    dockOperatingHours: '06:00 às 20:00'
  },
  {
    id: 'fc-extrema-mg',
    code: 'CD MG02',
    name: 'Mercado Livre Full Extrema Polo Sul',
    company: 'Mercado Livre Full',
    address: 'Rodovia Fernão Dias, km 935',
    neighborhood: 'Polo Industrial',
    city: 'Extrema',
    state: 'MG',
    zipCode: '37640-000',
    acceptedVehicles: ['Caminhão 3/4', 'Toco / Médio', 'Truck / Pesado', 'Carreta / Bitrem'],
    dockOperatingHours: '06:00 às 22:00'
  }
];

const INITIAL_CLIENT_USER: User = {
  id: 'usr-client-01',
  name: 'Marcos Vinicius Ribeiro',
  email: 'marcos@eletrotechloja.com.br',
  phone: '(11) 98765-4321',
  document: '34.829.104/0001-92',
  companyName: 'EletroTech Mercado Líder Platinum',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'CLIENTE',
  city: 'São Paulo',
  state: 'SP',
  rating: 4.9,
  completedDeliveries: 48
};

const INITIAL_DRIVER_USER: User = {
  id: 'usr-driver-01',
  name: 'Carlos Eduardo Silva',
  email: 'carlos.fretes@logflow.com',
  phone: '(11) 97123-8899',
  document: '284.918.472-09',
  companyName: 'Silva Transportes Rápidos & Agendamento Full',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  role: 'MOTORISTA',
  city: 'Jundiaí',
  state: 'SP',
  rating: 4.95,
  completedDeliveries: 164
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    driverId: 'usr-driver-01',
    brand: 'Mercedes-Benz',
    model: 'Sprinter 415 CDI Baú',
    year: 2022,
    plate: 'LOG-4E28',
    type: 'Van / Furgão',
    maxWeightKg: 1800,
    maxVolumeM3: 14,
    bodyType: 'Baú Seco',
    isFullCompliant: true,
    anttRegister: 'ANTT-88392102'
  },
  {
    id: 'veh-02',
    driverId: 'usr-driver-01',
    brand: 'Iveco',
    model: 'Daily 35S14 Baú Lonado',
    year: 2023,
    plate: 'FUL-9A10',
    type: 'Caminhão 3/4',
    maxWeightKg: 3500,
    maxVolumeM3: 22,
    bodyType: 'Sider',
    isFullCompliant: true,
    anttRegister: 'ANTT-99210444'
  }
];

const INITIAL_FREIGHT_CONFIG: DriverFreightRateConfig = {
  basePricePerKm: 5.80,
  minimumFreight: 220.00,
  palletHandlingFee: 45.00,
  nightSurchargePercent: 20,
  fullDockAssistanceFee: 80.00,
  tollByShipper: true,
  availableDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
  availableTimeSlots: ['Manhã (06:00 - 12:00)', 'Tarde (12:00 - 18:00)', 'Noite (18:00 - 23:00)'],
  servicedFulfillmentCenters: ['CD SP01 Cajamar I', 'CD SP02 Cajamar II', 'CD SP03 Franco da Rocha', 'CD SP04 Guarulhos', 'CD SP05 Louveira', 'CD MG02 Extrema'],
  truckVolumeM3: 16.0,
  truckMaxWeightKg: 2200,
  truckMaxPallets: 4
};

const INITIAL_DELIVERIES: DeliveryRequest[] = [
  {
    id: 'req-01',
    protocol: 'LF-2026-9041',
    title: 'Envio 4 Pallets Eletrônicos & Smart Gadgets',
    clientId: 'usr-client-01',
    clientName: 'Marcos Vinicius Ribeiro',
    clientCompany: 'EletroTech Mercado Líder Platinum',
    createdAt: '2026-08-24 10:30',
    origin: {
      address: 'Rua Guaipá, 1420 - Galpão 04',
      neighborhood: 'Vila Leopoldina',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05089-000',
      contactName: 'Antônio Ferreira (Expedição)',
      contactPhone: '(11) 98822-1100',
      pickupDate: '2026-08-25',
      pickupTimeRange: '08:00 às 11:00'
    },
    destination: {
      fulfillmentCenterId: 'fc-cajamar-01',
      fulfillmentCenterName: 'Mercado Livre Full Cajamar I',
      code: 'CD SP01',
      address: 'Av. Dr. Antônio João Abdalla, 260',
      city: 'Cajamar',
      state: 'SP',
      dockDate: '2026-08-25',
      dockTimeSlot: '13:30 - 15:30',
      fullSchedulingCode: 'MELI-AG-994812'
    },
    cargo: {
      category: 'Eletrônicos e Informática',
      packagesCount: 140,
      palletsCount: 4,
      weightKg: 850,
      volumeM3: 6.8,
      invoiceNumber: 'NF-e 048.912 - Série 1',
      invoiceKey: '35260834829104000192550010000489121884910293',
      declaredValue: 74500.00,
      observations: 'Carga paletizada com filme stretch preto e selo de segurança Mercado Livre Full. Exige conferência na doca de entrada.'
    },
    requiredVehicleType: 'Van / Furgão',
    status: 'COTACAO'
  },
  {
    id: 'req-02',
    protocol: 'LF-2026-8982',
    title: 'Lote Acessórios Automotivos e Ferramentas',
    clientId: 'usr-client-01',
    clientName: 'Marcos Vinicius Ribeiro',
    clientCompany: 'EletroTech Mercado Líder Platinum',
    createdAt: '2026-08-24 07:15',
    origin: {
      address: 'Av. Industrial, 780',
      neighborhood: 'Jardim Santo André',
      city: 'Santo André',
      state: 'SP',
      zipCode: '09080-500',
      contactName: 'Rafael Silva',
      contactPhone: '(11) 97711-2233',
      pickupDate: '2026-08-24',
      pickupTimeRange: '09:00 às 11:00'
    },
    destination: {
      fulfillmentCenterId: 'fc-franco-03',
      fulfillmentCenterName: 'Mercado Livre Full Franco da Rocha',
      code: 'CD SP03',
      address: 'Estrada do Governo, 1500',
      city: 'Franco da Rocha',
      state: 'SP',
      dockDate: '2026-08-24',
      dockTimeSlot: '15:00 - 17:00',
      fullSchedulingCode: 'MELI-AG-882109'
    },
    cargo: {
      category: 'Ferramentas e Acessórios',
      packagesCount: 65,
      palletsCount: 2,
      weightKg: 420,
      volumeM3: 3.5,
      invoiceNumber: 'NF-e 048.890',
      invoiceKey: '35260834829104000192550010000488901991823712',
      declaredValue: 28900.00,
      observations: 'Docas 12 a 16 no CD Franco da Rocha. Motorista com comprovante ANTT e EPI obrigatório.'
    },
    requiredVehicleType: 'Van / Furgão',
    status: 'EM_TRANSITO',
    selectedBid: {
      id: 'bid-initial-carlos',
      requestId: 'req-02',
      driverId: 'usr-driver-01',
      driverName: 'Carlos Eduardo Silva',
      driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      driverRating: 4.95,
      driverCompletedTrips: 164,
      vehicleModel: 'Mercedes-Benz Sprinter 415 CDI',
      vehiclePlate: 'LOG-4E28',
      vehicleType: 'Van / Furgão',
      price: 395.00,
      tollIncluded: true,
      unloadingIncluded: true,
      estimatedPickupDate: '2026-08-24',
      estimatedPickupTime: '09:30',
      notes: 'Veículo aprovado para Full, com EPI completo (bota bico de aço e colete). Acompanhamento até liberação na doca.',
      status: 'ACEITA',
      createdAt: '2026-08-24 07:45'
    },
    paymentMethod: 'PIX',
    paymentDate: '2026-08-24 08:00',
    paymentTransactionId: 'PIX-LF-99201948',
    trackingSteps: [
      { step: 'COTACAO', title: 'Orçamentos Recebidos', description: 'Proposta do motorista Carlos Silva aprovada', date: '24/08/2026 07:50', completed: true, current: false },
      { step: 'PAGO_AGENDADO', title: 'Pagamento e Agendamento Confirmados', description: 'Garantia de frete retida em custódia com sucesso', date: '24/08/2026 08:00', completed: true, current: false },
      { step: 'COLETANDO', title: 'Coleta Realizada no Embarcador', description: 'Coleta efetuada na Av. Industrial, Santo André - SP', date: '24/08/2026 10:15', completed: true, current: false },
      { step: 'EM_TRANSITO', title: 'Em Trânsito para o CD Full', description: 'Veículo a caminho de Franco da Rocha - Janela 15:00', date: '24/08/2026 11:20', completed: true, current: true },
      { step: 'DOCA_FULL', title: 'Check-in na Portaria / Doca Full', description: 'Apresentação do protocolo MELI-AG-882109 e NFs', date: 'Aguardando chegada', completed: false, current: false },
      { step: 'FINALIZADO', title: 'Carga Conferida & Recebida', description: 'Canhoto assinado e carimbado pelo Mercado Livre', date: 'Pendente', completed: false, current: false }
    ]
  },
  {
    id: 'req-03',
    protocol: 'LF-2026-8710',
    title: 'Reposicionamento Estoque Black Season Louveira',
    clientId: 'usr-client-01',
    clientName: 'Marcos Vinicius Ribeiro',
    clientCompany: 'EletroTech Mercado Líder Platinum',
    createdAt: '2026-08-22 14:00',
    origin: {
      address: 'Rod. Pres. Dutra, km 215',
      neighborhood: 'Cumbica',
      city: 'Guarulhos',
      state: 'SP',
      zipCode: '07170-000',
      contactName: 'Lucas Matos',
      contactPhone: '(11) 96655-4433',
      pickupDate: '2026-08-23',
      pickupTimeRange: '07:00'
    },
    destination: {
      fulfillmentCenterId: 'fc-louveira-05',
      fulfillmentCenterName: 'Mercado Livre Full Louveira',
      code: 'CD SP05',
      address: 'Estrada Municipal Romildo Prado, 800',
      city: 'Louveira',
      state: 'SP',
      dockDate: '2026-08-23',
      dockTimeSlot: '11:00 - 13:00',
      fullSchedulingCode: 'MELI-AG-776100'
    },
    cargo: {
      category: 'Eletrodomésticos e Casa',
      packagesCount: 220,
      palletsCount: 6,
      weightKg: 1400,
      volumeM3: 11.5,
      invoiceNumber: 'NF-e 048.810',
      invoiceKey: '35260834829104000192550010000488101889920192',
      declaredValue: 62000.00
    },
    requiredVehicleType: 'Caminhão 3/4',
    status: 'FINALIZADO',
    selectedBid: {
      id: 'bid-hist-01',
      requestId: 'req-03',
      driverId: 'usr-driver-01',
      driverName: 'Carlos Eduardo Silva',
      driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      driverRating: 4.95,
      driverCompletedTrips: 164,
      vehicleModel: 'Iveco Daily 35S14',
      vehiclePlate: 'FUL-9A10',
      vehicleType: 'Caminhão 3/4',
      price: 580.00,
      tollIncluded: true,
      unloadingIncluded: true,
      estimatedPickupDate: '2026-08-23',
      estimatedPickupTime: '07:00',
      notes: 'Entrega finalizada com sucesso e canhotos anexados no portal.',
      status: 'ACEITA',
      createdAt: '2026-08-22 15:10'
    },
    paymentMethod: 'PIX',
    paymentDate: '2026-08-22 16:00',
    paymentTransactionId: 'PIX-LF-776102'
  }
];

const INITIAL_BIDS: FreightBid[] = [
  {
    id: 'bid-01',
    requestId: 'req-01',
    driverId: 'usr-driver-01',
    driverName: 'Carlos Eduardo Silva',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    driverRating: 4.95,
    driverCompletedTrips: 164,
    vehicleModel: 'Mercedes Sprinter 415 CDI',
    vehiclePlate: 'LOG-4E28',
    vehicleType: 'Van / Furgão (Baú Seco)',
    price: 420.00,
    tollIncluded: true,
    unloadingIncluded: true,
    estimatedPickupDate: '2026-08-25',
    estimatedPickupTime: '08:30',
    notes: 'Possuo selo de entregador homologado Mercado Full, colete reflexivo e bota EPI. Entrega pontual garantida.',
    status: 'PENDENTE',
    createdAt: '2026-08-24 11:00'
  },
  {
    id: 'bid-02',
    requestId: 'req-01',
    driverId: 'usr-driver-02',
    driverName: 'Marcio Rogério Souza',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    driverRating: 4.88,
    driverCompletedTrips: 92,
    vehicleModel: 'Renault Master Extra Longa',
    vehiclePlate: 'BRA-3X99',
    vehicleType: 'Van / Furgão',
    price: 450.00,
    tollIncluded: true,
    unloadingIncluded: false,
    estimatedPickupDate: '2026-08-25',
    estimatedPickupTime: '09:00',
    notes: 'Disponível na Zona Oeste de SP. Já estou habituado com as docas do CD SP01 Cajamar.',
    status: 'PENDENTE',
    createdAt: '2026-08-24 11:20'
  },
  {
    id: 'bid-03',
    requestId: 'req-01',
    driverId: 'usr-driver-03',
    driverName: 'Rodonaves Express - Paulo',
    driverAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    driverRating: 4.79,
    driverCompletedTrips: 210,
    vehicleModel: 'Hyundai HR Baú Refrigerado/Seco',
    vehiclePlate: 'HRV-8821',
    vehicleType: 'Fiorino / VUC',
    price: 390.00,
    tollIncluded: false,
    unloadingIncluded: true,
    estimatedPickupDate: '2026-08-25',
    estimatedPickupTime: '08:00',
    notes: 'Pedágio cobrado à parte na entrega. Experiência de 5 anos com entregas Full.',
    status: 'PENDENTE',
    createdAt: '2026-08-24 11:45'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'Nova Proposta Recebida!',
    description: 'Carlos Eduardo Silva enviou uma proposta de R$ 420,00 para o frete LF-2026-9041.',
    timestamp: 'Hoje, 11:00',
    read: false,
    type: 'BID',
    link: '/cliente/orcamentos/req-01'
  },
  {
    id: 'notif-02',
    title: 'Carga em Trânsito',
    description: 'Sua entrega LF-2026-8982 foi coletada e está a caminho do CD Full Franco da Rocha.',
    timestamp: 'Hoje, 10:15',
    read: false,
    type: 'INFO',
    link: '/cliente/solicitacoes'
  },
  {
    id: 'notif-03',
    title: 'Pagamento de Frete Confirmado',
    description: 'O valor de R$ 580,00 foi creditado em sua carteira LogisticsFlow.',
    timestamp: '23/08/2026',
    read: true,
    type: 'SUCCESS',
    link: '/motorista/financeiro'
  }
];

const INITIAL_FINANCE_TRANSACTIONS: DriverFinanceTransaction[] = [
  {
    id: 'tx-01',
    requestId: 'req-03',
    protocol: 'LF-2026-8710',
    description: 'Frete Concluído - CD Louveira SP05 (NF-e 048.810)',
    date: '23/08/2026 14:10',
    amount: 580.00,
    type: 'CREDIT',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-02',
    protocol: 'SAQUE-PIX-892',
    description: 'Transferência PIX para Conta Santander (Chave CPF)',
    date: '22/08/2026 18:30',
    amount: 1200.00,
    type: 'DEBIT',
    status: 'CONCLUIDO'
  },
  {
    id: 'tx-03',
    requestId: 'req-02',
    protocol: 'LF-2026-8982',
    description: 'Frete Garantido em Custódia - CD Franco da Rocha SP03',
    date: '24/08/2026 08:00',
    amount: 395.00,
    type: 'CREDIT',
    status: 'PROCESSANDO'
  }
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    requestId: 'req-02',
    senderId: 'usr-client-01',
    senderName: 'Marcos Vinicius',
    senderRole: 'CLIENTE',
    text: 'Olá Carlos! O lote já está devidamente paletizado com as etiquetas e códigos de barras do Mercado Full voltados para o lado externo.',
    timestamp: '08:45',
    read: true
  },
  {
    id: 'msg-02',
    requestId: 'req-02',
    senderId: 'usr-driver-01',
    senderName: 'Carlos Eduardo Silva',
    senderRole: 'MOTORISTA',
    text: 'Perfeito, Marcos! Já estou a 10 minutos do galpão de coleta em Santo André. Meu caminhão já está com a rampa higienizada e as cintas de amarração prontas.',
    timestamp: '08:52',
    read: true
  },
  {
    id: 'msg-03',
    requestId: 'req-02',
    senderId: 'usr-driver-01',
    senderName: 'Carlos Eduardo Silva',
    senderRole: 'MOTORISTA',
    text: 'Carga coletada com sucesso! Canhoto da NF assinado. Estou partindo agora em direção ao CD Franco da Rocha. Previsão de chegada às 14:15.',
    timestamp: '10:20',
    read: false
  }
];

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  logout: () => Promise<void>;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  clientUser: User;
  driverUser: User;
  deliveries: DeliveryRequest[];
  bids: FreightBid[];
  vehicles: Vehicle[];
  notifications: AppNotification[];
  financeTransactions: DriverFinanceTransaction[];
  chatMessages: ChatMessage[];
  freightConfig: DriverFreightRateConfig;
  updateFreightConfig: (config: DriverFreightRateConfig) => void;
  
  // Ações de Negócio
  createDeliveryRequest: (request: Omit<DeliveryRequest, 'id' | 'protocol' | 'createdAt' | 'status' | 'clientId' | 'clientName' | 'clientCompany'>) => string;
  submitBid: (bid: Omit<FreightBid, 'id' | 'status' | 'createdAt'>) => void;
  acceptBidAndPay: (requestId: string, bidId: string, paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO' | 'FATURADO') => void;
  updateDeliveryStatus: (requestId: string, newStatus: DeliveryStatus, stepNote?: string, deliveryProofUrl?: string) => void;
  sendChatMessage: (requestId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'driverId'>) => void;
  requestWithdrawal: (amount: number, pixKey: string) => boolean;
  calculateFreightEstimate: (distanceKm: number, pallets: number, weightKg: number, vehicleType: string, withAssistance: boolean) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('CLIENTE');
  const [clientUser] = useState<User>(INITIAL_CLIENT_USER);
  const [driverUser] = useState<User>(INITIAL_DRIVER_USER);
  
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>(() => {
    const saved = localStorage.getItem('lf_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [bids, setBids] = useState<FreightBid[]>(() => {
    const saved = localStorage.getItem('lf_bids');
    return saved ? JSON.parse(saved) : INITIAL_BIDS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('lf_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('lf_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [financeTransactions, setFinanceTransactions] = useState<DriverFinanceTransaction[]>(() => {
    const saved = localStorage.getItem('lf_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE_TRANSACTIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('lf_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [freightConfig, setFreightConfig] = useState<DriverFreightRateConfig>(() => {
    const saved = localStorage.getItem('lf_freight_config');
    return saved ? JSON.parse(saved) : INITIAL_FREIGHT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('lf_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('lf_bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('lf_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('lf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lf_finance', JSON.stringify(financeTransactions));
  }, [financeTransactions]);

  useEffect(() => {
    localStorage.setItem('lf_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('lf_freight_config', JSON.stringify(freightConfig));
  }, [freightConfig]);

  const [currentUserCustom, setCurrentUserCustom] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) {
        setCurrentUserCustom(user);
        setActiveRole(user.role);
      }
    });
  }, []);

  const currentUser = currentUserCustom || (activeRole === 'CLIENTE' ? clientUser : driverUser);

  const setCurrentUser = (user: User) => {
    setCurrentUserCustom(user);
    setActiveRole(user.role);
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUserCustom(null);
  };

  const createDeliveryRequest = (data: Omit<DeliveryRequest, 'id' | 'protocol' | 'createdAt' | 'status' | 'clientId' | 'clientName' | 'clientCompany'>): string => {
    const newId = `req-${Date.now().toString().slice(-6)}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newProtocol = `LF-2026-${randomNum}`;

    const newRequest: DeliveryRequest = {
      ...data,
      id: newId,
      protocol: newProtocol,
      clientId: clientUser.id,
      clientName: clientUser.name,
      clientCompany: clientUser.companyName,
      createdAt: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'COTACAO',
      trackingSteps: [
        { step: 'COTACAO', title: 'Solicitação Criada no Mercado Full', description: 'Aguardando propostas de motoristas credenciados', date: 'Hoje', completed: true, current: true },
        { step: 'PAGO_AGENDADO', title: 'Pagamento e Reserva de Doca', description: 'Contratação do frete e confirmação de agendamento', date: 'Pendente', completed: false, current: false },
        { step: 'COLETANDO', title: 'Coleta na Origem', description: `Coleta agendada para ${data.origin.pickupDate}`, date: 'Pendente', completed: false, current: false },
        { step: 'EM_TRANSITO', title: 'Em Trânsito para o CD Full', description: `Destino: ${data.destination.fulfillmentCenterName}`, date: 'Pendente', completed: false, current: false },
        { step: 'DOCA_FULL', title: 'Entrada na Doca Mercado Full', description: `Janela agendada: ${data.destination.dockTimeSlot}`, date: 'Pendente', completed: false, current: false },
        { step: 'FINALIZADO', title: 'Conferência e Recebimento Full', description: 'Comprovante e canhoto assinado', date: 'Pendente', completed: false, current: false }
      ]
    };

    setDeliveries(prev => [newRequest, ...prev]);

    // Simular 2 propostas automáticas de motoristas após alguns instantes
    const autoBid1: FreightBid = {
      id: `bid-${Date.now()}-1`,
      requestId: newId,
      driverId: 'usr-driver-01',
      driverName: 'Carlos Eduardo Silva',
      driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      driverRating: 4.95,
      driverCompletedTrips: 164,
      vehicleModel: 'Mercedes Sprinter 415 CDI',
      vehiclePlate: 'LOG-4E28',
      vehicleType: data.requiredVehicleType || 'Van / Furgão',
      price: Math.max(280, (data.cargo.palletsCount || 1) * 75 + (data.cargo.weightKg > 500 ? 150 : 90) + 120),
      tollIncluded: true,
      unloadingIncluded: true,
      estimatedPickupDate: data.origin.pickupDate,
      estimatedPickupTime: '08:30',
      notes: 'Motorista credenciado Mercado Full com comprovante ANTT e ajudante para doca.',
      status: 'PENDENTE',
      createdAt: 'Agora mesmo'
    };

    setBids(prev => [autoBid1, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Nova Solicitação Criada!',
        description: `Sua solicitação ${newProtocol} foi publicada. Motoristas já estão enviando propostas.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'SUCCESS',
        link: `/cliente/orcamentos/${newId}`
      },
      ...prev
    ]);

    return newId;
  };

  const submitBid = (bidData: Omit<FreightBid, 'id' | 'status' | 'createdAt'>) => {
    const newBid: FreightBid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      status: 'PENDENTE',
      createdAt: 'Agora mesmo'
    };

    setBids(prev => [newBid, ...prev]);

    // Notificar cliente
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Nova Proposta de Frete Recebida!',
        description: `${bidData.driverName} enviou uma proposta de R$ ${bidData.price.toFixed(2)} para sua carga.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'BID',
        link: `/cliente/orcamentos/${bidData.requestId}`
      },
      ...prev
    ]);
  };

  const acceptBidAndPay = (requestId: string, bidId: string, paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO' | 'FATURADO') => {
    const targetBid = bids.find(b => b.id === bidId);
    if (!targetBid) return;

    setBids(prev => prev.map(b => {
      if (b.requestId === requestId) {
        return b.id === bidId ? { ...b, status: 'ACEITA' } : { ...b, status: 'RECUSADA' };
      }
      return b;
    }));

    setDeliveries(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedSteps = req.trackingSteps?.map(step => {
          if (step.step === 'COTACAO' || step.step === 'PAGO_AGENDADO') {
            return { ...step, completed: true, current: step.step === 'PAGO_AGENDADO' };
          }
          return step;
        });

        return {
          ...req,
          status: 'PAGO_AGENDADO',
          selectedBid: targetBid,
          paymentMethod,
          paymentDate: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
          paymentTransactionId: `${paymentMethod}-LF-${Date.now().toString().slice(-8)}`,
          trackingSteps: updatedSteps
        };
      }
      return req;
    }));

    // Registrar no financeiro do motorista (em custódia/processando)
    const newTx: DriverFinanceTransaction = {
      id: `tx-${Date.now()}`,
      requestId,
      protocol: targetBid.requestId,
      description: `Frete Aprovado em Custódia - ${targetBid.vehicleType} (Protocolo Full)`,
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      amount: targetBid.price,
      type: 'CREDIT',
      status: 'PROCESSANDO'
    };

    setFinanceTransactions(prev => [newTx, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Pagamento Confirmado & Frete Agendado!',
        description: `O frete com ${targetBid.driverName} no valor de R$ ${targetBid.price.toFixed(2)} foi confirmado com sucesso.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'SUCCESS',
        link: `/cliente/solicitacoes`
      },
      ...prev
    ]);
  };

  const updateDeliveryStatus = (requestId: string, newStatus: DeliveryStatus, stepNote?: string, deliveryProofUrl?: string) => {
    setDeliveries(prev => prev.map(req => {
      if (req.id === requestId) {
        const stepOrder: DeliveryStatus[] = ['COTACAO', 'PAGO_AGENDADO', 'COLETANDO', 'EM_TRANSITO', 'DOCA_FULL', 'FINALIZADO'];
        const newIndex = stepOrder.indexOf(newStatus);

        const updatedSteps = req.trackingSteps?.map((step) => {
          const sIndex = stepOrder.indexOf(step.step);
          return {
            ...step,
            completed: sIndex <= newIndex,
            current: sIndex === newIndex,
            description: sIndex === newIndex && stepNote ? stepNote : step.description,
            date: sIndex <= newIndex && step.date.includes('Pendente') ? 'Atualizado agora' : step.date
          };
        });

        // Se finalizado, liberar o valor no financeiro do motorista
        if (newStatus === 'FINALIZADO') {
          setFinanceTransactions(txs => txs.map(tx => {
            if (tx.requestId === requestId) {
              return { ...tx, status: 'CONCLUIDO' };
            }
            return tx;
          }));
        }

        return {
          ...req,
          status: newStatus,
          deliveryProofUrl: deliveryProofUrl || req.deliveryProofUrl,
          trackingSteps: updatedSteps
        };
      }
      return req;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Status da Entrega Atualizado: ${newStatus}`,
        description: stepNote || `O status da entrega ${requestId} avançou para ${newStatus}.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: newStatus === 'FINALIZADO' ? 'SUCCESS' : 'INFO',
        link: `/cliente/solicitacoes`
      },
      ...prev
    ]);
  };

  const sendChatMessage = (requestId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: activeRole,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Resposta automática simulada de apoio/confirmação
    if (activeRole === 'CLIENTE') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          requestId,
          senderId: driverUser.id,
          senderName: driverUser.name,
          senderRole: 'MOTORISTA',
          text: 'Recebido e compreendido! Tudo sob controle no trajeto para o Mercado Full.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        setChatMessages(msgs => [...msgs, autoReply]);
      }, 1500);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'driverId'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      driverId: driverUser.id
    };
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const requestWithdrawal = (amount: number, pixKey: string): boolean => {
    const currentAvailable = financeTransactions
      .filter(t => t.status === 'CONCLUIDO')
      .reduce((acc, t) => t.type === 'CREDIT' ? acc + t.amount : acc - t.amount, 0);

    if (amount > currentAvailable) return false;

    const newTx: DriverFinanceTransaction = {
      id: `tx-saque-${Date.now()}`,
      protocol: `SAQUE-PIX-${Date.now().toString().slice(-4)}`,
      description: `Saque Instantâneo PIX para chave (${pixKey})`,
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      amount,
      type: 'DEBIT',
      status: 'CONCLUIDO'
    };

    setFinanceTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const calculateFreightEstimate = (distanceKm: number, pallets: number, weightKg: number, vehicleType: string, withAssistance: boolean): number => {
    let price = freightConfig.minimumFreight;
    price += distanceKm * freightConfig.basePricePerKm;
    price += (pallets || 1) * freightConfig.palletHandlingFee;
    
    if (weightKg > 1000) {
      price += ((weightKg - 1000) / 100) * 12;
    }
    
    if (withAssistance) {
      price += freightConfig.fullDockAssistanceFee;
    }

    if (vehicleType.includes('3/4') || vehicleType.includes('Toco')) {
      price *= 1.25;
    } else if (vehicleType.includes('Truck') || vehicleType.includes('Carreta')) {
      price *= 1.6;
    }

    return Math.round(price);
  };

  const updateFreightConfig = (newConfig: DriverFreightRateConfig) => {
    setFreightConfig(newConfig);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        activeRole,
        setActiveRole,
        clientUser,
        driverUser,
        deliveries,
        bids,
        vehicles,
        notifications,
        financeTransactions,
        chatMessages,
        freightConfig,
        updateFreightConfig,
        createDeliveryRequest,
        submitBid,
        acceptBidAndPay,
        updateDeliveryStatus,
        sendChatMessage,
        markNotificationAsRead,
        addVehicle,
        requestWithdrawal,
        calculateFreightEstimate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
