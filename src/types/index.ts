export type UserRole = 'CLIENTE' | 'MOTORISTA';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  companyName?: string;
  avatarUrl?: string;
  role: UserRole;
  city: string;
  state: string;
  rating?: number;
  completedDeliveries?: number;
}

export interface Vehicle {
  id: string;
  driverId: string;
  model: string;
  brand: string;
  year: number;
  plate: string;
  type: 'Fiorino / VUC' | 'Van / Furgão' | 'Caminhão 3/4' | 'Toco / Médio' | 'Truck / Pesado' | 'Carreta / Bitrem';
  maxWeightKg: number;
  maxVolumeM3: number;
  bodyType: 'Baú Seco' | 'Baú Refrigerado' | 'Sider' | 'Grade Baixa';
  isFullCompliant: boolean; // Atende aos requisitos Mercado Full (EPI, placa vermelha/ANTT, rastreador)
  anttRegister?: string;
}

export interface FulfillmentCenter {
  id: string;
  code: string; // Ex: SP01, SP02, MG01
  name: string;
  company: 'Mercado Livre Full';
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  acceptedVehicles: string[];
  dockOperatingHours: string;
}

export type DeliveryStatus = 
  | 'COTACAO' 
  | 'AGUARDANDO_PAGAMENTO' 
  | 'PAGO_AGENDADO' 
  | 'COLETANDO' 
  | 'EM_TRANSITO' 
  | 'DOCA_FULL' 
  | 'FINALIZADO' 
  | 'CANCELADO';

export interface FreightBid {
  id: string;
  requestId: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  driverCompletedTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleType: string;
  price: number;
  tollIncluded: boolean;
  unloadingIncluded: boolean;
  estimatedPickupDate: string;
  estimatedPickupTime: string;
  notes: string;
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  protocol: string; // Ex: LF-2026-8942
  title: string;
  clientId: string;
  clientName: string;
  clientCompany?: string;
  createdAt: string;
  
  // Origem (Coleta no Embarcador)
  origin: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
    pickupDate: string;
    pickupTimeRange: string;
  };

  // Destino (CD Mercado Full)
  destination: {
    fulfillmentCenterId: string;
    fulfillmentCenterName: string;
    code: string;
    address: string;
    city: string;
    state: string;
    dockDate: string;
    dockTimeSlot: string; // Janela agendada no portal Full (Ex: 08:00 - 10:00)
    fullSchedulingCode: string; // Protocolo oficial do Agendamento Mercado Full (Ex: MELI-AG-88231)
  };

  // Carga
  cargo: {
    category: string;
    packagesCount: number;
    palletsCount: number;
    weightKg: number;
    volumeM3: number;
    invoiceNumber: string; // NF-e
    invoiceKey: string; // Chave de acesso 44 dígitos
    declaredValue: number;
    observations?: string;
  };

  requiredVehicleType: string;
  status: DeliveryStatus;
  
  // Proposta Selecionada / Contratada
  selectedBid?: FreightBid;
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'BOLETO' | 'FATURADO';
  paymentDate?: string;
  paymentTransactionId?: string;

  // Documentos anexados
  invoiceFileUrl?: string;
  deliveryProofUrl?: string;

  // Rastreamento em tempo real
  trackingSteps?: {
    step: DeliveryStatus;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    current: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'BID' | 'CHAT';
  link?: string;
}

export interface DriverFinanceTransaction {
  id: string;
  requestId?: string;
  protocol?: string;
  description: string;
  date: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'CONCLUIDO' | 'PROCESSANDO' | 'PENDENTE';
}

export interface DriverFreightRateConfig {
  basePricePerKm: number;
  minimumFreight: number;
  palletHandlingFee: number;
  nightSurchargePercent: number;
  fullDockAssistanceFee: number;
  tollByShipper: boolean;

  // Disponibilidade e Capacidade do Caminhão
  availableDays: string[]; // Dias da semana disponíveis
  availableTimeSlots: string[]; // Turnos / Janelas de doca atendidas
  servicedFulfillmentCenters: string[]; // CDs Mercado Full atendidos
  truckVolumeM3: number; // Cubagem do caminhão em m³
  truckMaxWeightKg: number; // Capacidade máxima de peso em kg
  truckMaxPallets: number; // Capacidade de pallets PBR
}
