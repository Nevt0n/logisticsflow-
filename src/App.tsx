import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { ClientRegisterPage } from './pages/ClientRegisterPage';
import { DriverRegisterPage } from './pages/DriverRegisterPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { NewDeliveryRequestPage } from './pages/NewDeliveryRequestPage';
import { QuotationsListPage } from './pages/QuotationsListPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentReceiptPage } from './pages/PaymentReceiptPage';
import { ClientRequestsPage } from './pages/ClientRequestsPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { DriverLoadsPage } from './pages/DriverLoadsPage';
import { FreightCalculationPage } from './pages/FreightCalculationPage';
import { DeliverySchedulePage } from './pages/DeliverySchedulePage';
import { DeliveryDetailPage } from './pages/DeliveryDetailPage';
import { VehicleManagementPage } from './pages/VehicleManagementPage';
import { DriverFinancePage } from './pages/DriverFinancePage';
import { DriverProfilePage } from './pages/DriverProfilePage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Landing Pages */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro-cliente" element={<ClientRegisterPage />} />
          <Route path="/cadastro-motorista" element={<DriverRegisterPage />} />

          {/* App Shell with Navbar + Sidebar */}
          <Route element={<Layout />}>
            {/* Client Routes */}
            <Route path="/cliente/dashboard" element={<ClientDashboardPage />} />
            <Route path="/cliente/nova-solicitacao" element={<NewDeliveryRequestPage />} />
            <Route path="/cliente/solicitacoes" element={<ClientRequestsPage />} />
            <Route path="/cliente/orcamentos/:id" element={<QuotationsListPage />} />
            <Route path="/cliente/pagamento/:id" element={<CheckoutPage />} />
            <Route path="/cliente/comprovante/:id" element={<PaymentReceiptPage />} />
            <Route path="/cliente/chat/:id" element={<ChatPage />} />
            <Route path="/cliente/notificacoes" element={<NotificationsPage />} />

            {/* Driver Routes */}
            <Route path="/motorista/dashboard" element={<DriverDashboardPage />} />
            <Route path="/motorista/cargas" element={<DriverLoadsPage />} />
            <Route path="/motorista/minhas-cargas" element={<DriverLoadsPage />} />
            <Route path="/motorista/calculo-frete" element={<FreightCalculationPage />} />
            <Route path="/motorista/agenda" element={<DeliverySchedulePage />} />
            <Route path="/motorista/entrega/:id" element={<DeliveryDetailPage />} />
            <Route path="/motorista/veiculos" element={<VehicleManagementPage />} />
            <Route path="/motorista/financeiro" element={<DriverFinancePage />} />
            <Route path="/motorista/perfil" element={<DriverProfilePage />} />
            <Route path="/motorista/chat/:id" element={<ChatPage />} />
            <Route path="/motorista/notificacoes" element={<NotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
