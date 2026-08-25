import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, FULFILLMENT_CENTERS } from '../context/AppContext';
import { storageService } from '../services/storageService';

export const NewDeliveryRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDeliveryRequest, calculateFreightEstimate } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    // Origem
    originAddress: '',
    originNeighborhood: '',
    originCity: '',
    originState: 'SP',
    originZipCode: '',
    originContactName: '',
    originContactPhone: '',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickupTimeRange: '08:00 às 11:00',

    // Destino
    fulfillmentCenterId: FULFILLMENT_CENTERS[0].id,
    dockDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dockTimeSlot: '13:30 - 15:30',
    fullSchedulingCode: '',

    // Carga
    category: '',
    packagesCount: 1,
    palletsCount: 1,
    weightKg: 100,
    volumeM3: 1,
    invoiceNumber: '',
    invoiceKey: '',
    declaredValue: 1000.00,
    requiredVehicleType: 'Van / Furgão',
    observations: ''
  });

  const handleFillDemo = () => {
    setFormData({
      title: 'Envio 3 Pallets de Eletrônicos para o CD Cajamar I',
      originAddress: 'Rua Guaipá, 1420 - Galpão 04',
      originNeighborhood: 'Vila Leopoldina',
      originCity: 'São Paulo',
      originState: 'SP',
      originZipCode: '05089-000',
      originContactName: 'Antônio Ferreira (Expedição)',
      originContactPhone: '(11) 98822-1100',
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeRange: '08:00 às 11:00',
      fulfillmentCenterId: FULFILLMENT_CENTERS[0].id,
      dockDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dockTimeSlot: '13:30 - 15:30',
      fullSchedulingCode: 'MELI-AG-994820',
      category: 'Eletrônicos e Acessórios',
      packagesCount: 120,
      palletsCount: 3,
      weightKg: 650,
      volumeM3: 5.2,
      invoiceNumber: 'NF-e 049.120',
      invoiceKey: '35260834829104000192550010000491201889920194',
      declaredValue: 48500.00,
      requiredVehicleType: 'Van / Furgão',
      observations: 'Carga paletizada no padrão PBR com filme stretch preto e etiquetas de identificação nas laterais.'
    });
  };

  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedFc = FULFILLMENT_CENTERS.find(fc => fc.id === formData.fulfillmentCenterId) || FULFILLMENT_CENTERS[0];
  const estimatedFreight = calculateFreightEstimate(45, formData.palletsCount, formData.weightKg, formData.requiredVehicleType, true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let uploadedInvoiceUrl = '';
    const tempRequestId = `req-${Date.now().toString().slice(-6)}`;

    if (invoiceFile) {
      const uploadRes = await storageService.uploadInvoice(invoiceFile, tempRequestId);
      uploadedInvoiceUrl = uploadRes.url;
    }

    const newRequestId = createDeliveryRequest({
      title: formData.title || `Envio ${formData.palletsCount} Pallets para ${selectedFc.name}`,
      origin: {
        address: formData.originAddress,
        neighborhood: formData.originNeighborhood,
        city: formData.originCity,
        state: formData.originState,
        zipCode: formData.originZipCode,
        contactName: formData.originContactName,
        contactPhone: formData.originContactPhone,
        pickupDate: formData.pickupDate,
        pickupTimeRange: formData.pickupTimeRange
      },
      destination: {
        fulfillmentCenterId: selectedFc.id,
        fulfillmentCenterName: selectedFc.name,
        code: selectedFc.code,
        address: selectedFc.address,
        city: selectedFc.city,
        state: selectedFc.state,
        dockDate: formData.dockDate,
        dockTimeSlot: formData.dockTimeSlot,
        fullSchedulingCode: formData.fullSchedulingCode
      },
      cargo: {
        category: formData.category,
        packagesCount: Number(formData.packagesCount),
        palletsCount: Number(formData.palletsCount),
        weightKg: Number(formData.weightKg),
        volumeM3: Number(formData.volumeM3),
        invoiceNumber: formData.invoiceNumber,
        invoiceKey: formData.invoiceKey,
        declaredValue: Number(formData.declaredValue),
        observations: formData.observations
      },
      requiredVehicleType: formData.requiredVehicleType,
      invoiceFileUrl: uploadedInvoiceUrl || undefined
    });

    setUploading(false);
    navigate(`/cliente/orcamentos/${newRequestId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Nova Solicitação de Frete Mercado Full
          </h1>
          <p className="text-xs text-on-surface-variant">
            Preencha os dados do agendamento da doca no Mercado Livre e anexe a NF-e para receber cotações de motoristas habilitados.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs px-3.5 py-2 rounded-xl border border-surface-container-high transition flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-secondary text-sm">auto_fix_high</span>
          <span>Preencher Exemplo de Teste</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Destino / Agendamento Mercado Full */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high text-primary">
            <span className="material-symbols-outlined text-secondary">domain</span>
            <h2 className="font-headline font-bold text-base">1. Centro de Distribuição & Agendamento Mercado Full</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-primary mb-1">
                Centro de Distribuição de Destino (Mercado Full) *
              </label>
              <select
                value={formData.fulfillmentCenterId}
                onChange={(e) => setFormData({ ...formData, fulfillmentCenterId: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              >
                {FULFILLMENT_CENTERS.map((fc) => (
                  <option key={fc.id} value={fc.id}>
                    {fc.code} - {fc.name} ({fc.city} - {fc.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Data Agendada da Doca *</label>
              <input
                type="date"
                value={formData.dockDate}
                onChange={(e) => setFormData({ ...formData, dockDate: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Janela / Horário Agendado na Doca *</label>
              <input
                type="text"
                value={formData.dockTimeSlot}
                onChange={(e) => setFormData({ ...formData, dockTimeSlot: e.target.value })}
                placeholder="Ex: 08:00 - 10:00 ou 13:30 - 15:30"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-primary mb-1">
                Protocolo do Agendamento Mercado Full (Código de Entrega) *
              </label>
              <input
                type="text"
                value={formData.fullSchedulingCode}
                onChange={(e) => setFormData({ ...formData, fullSchedulingCode: e.target.value })}
                placeholder="Ex: MELI-AG-994820"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-mono font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
              <span className="text-[11px] text-on-surface-variant mt-1 block">
                O motorista precisará apresentar esse código na portaria do CD Full para liberação da doca.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Origem / Coleta */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high text-primary">
            <span className="material-symbols-outlined text-secondary">warehouse</span>
            <h2 className="font-headline font-bold text-base">2. Local de Coleta (Seu Galpão / Loja)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-primary mb-1">Endereço Completo de Coleta *</label>
              <input
                type="text"
                value={formData.originAddress}
                onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Bairro *</label>
              <input
                type="text"
                value={formData.originNeighborhood}
                onChange={(e) => setFormData({ ...formData, originNeighborhood: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Cidade / Estado *</label>
              <input
                type="text"
                value={`${formData.originCity} - ${formData.originState}`}
                onChange={(e) => setFormData({ ...formData, originCity: e.target.value.split('-')[0].trim() })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Data Desejada de Coleta *</label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Janela de Coleta *</label>
              <input
                type="text"
                value={formData.pickupTimeRange}
                onChange={(e) => setFormData({ ...formData, pickupTimeRange: e.target.value })}
                placeholder="Ex: 08:00 às 11:00"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Responsável na Expedição *</label>
              <input
                type="text"
                value={formData.originContactName}
                onChange={(e) => setFormData({ ...formData, originContactName: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Telefone / WhatsApp de Contato *</label>
              <input
                type="text"
                value={formData.originContactPhone}
                onChange={(e) => setFormData({ ...formData, originContactPhone: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Especificações da Carga, NF & Upload */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high text-primary">
            <span className="material-symbols-outlined text-secondary">inventory_2</span>
            <h2 className="font-headline font-bold text-base">3. Dados da Carga, Volumes e Nota Fiscal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1">Categoria dos Produtos *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Tipo de Veículo Indicado *</label>
              <select
                value={formData.requiredVehicleType}
                onChange={(e) => setFormData({ ...formData, requiredVehicleType: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              >
                <option value="Fiorino / VUC">Fiorino / VUC (Até 800 kg / 3 m³)</option>
                <option value="Van / Furgão">Van / Furgão (Até 1.800 kg / 4 Pallets)</option>
                <option value="Caminhão 3/4">Caminhão 3/4 (Até 3.500 kg / 8 Pallets)</option>
                <option value="Toco / Médio">Toco / Médio (Até 6.000 kg / 12 Pallets)</option>
                <option value="Truck / Pesado">Truck / Pesado (Até 14.000 kg / 20 Pallets)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Qtd. de Pallets PBR *</label>
              <input
                type="number"
                min="0"
                value={formData.palletsCount}
                onChange={(e) => setFormData({ ...formData, palletsCount: Number(e.target.value) })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Peso Total Estimado (kg) *</label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Cubagem Total (m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.volumeM3}
                onChange={(e) => setFormData({ ...formData, volumeM3: Number(e.target.value) })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Número da NF-e *</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="Ex: NF-e 049.120"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-primary mb-1">Chave de Acesso da NF-e (44 dígitos) *</label>
              <input
                type="text"
                maxLength={44}
                value={formData.invoiceKey}
                onChange={(e) => setFormData({ ...formData, invoiceKey: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1">Valor Declarado da Carga (R$) *</label>
              <input
                type="number"
                value={formData.declaredValue}
                onChange={(e) => setFormData({ ...formData, declaredValue: Number(e.target.value) })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>

            {/* Document Upload Area for NF-e (PDF/XML) */}
            <div className="md:col-span-3 pt-2">
              <label className="block text-xs font-bold text-primary mb-1">
                Anexar Arquivo da Nota Fiscal (DANFE PDF ou XML)
              </label>

              {!invoiceFile ? (
                <label className="border-2 border-dashed border-surface-container-high hover:border-secondary bg-surface-container-low/40 hover:bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center group">
                  <span className="material-symbols-outlined text-3xl text-secondary group-hover:scale-110 transition-transform">
                    upload_file
                  </span>
                  <span className="text-xs font-bold text-primary mt-2">
                    Clique para selecionar ou arraste o arquivo da NF-e
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    Formatos aceitos: .PDF ou .XML (até 15MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.xml,application/pdf,text/xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="bg-surface-container-low p-4 rounded-xl border border-secondary-fixed/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary truncate max-w-sm">{invoiceFile.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">
                        {(invoiceFile.size / (1024 * 1024)).toFixed(2)} MB • Arquivo pronto para envio
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInvoiceFile(null)}
                    className="text-error hover:bg-error-container/20 p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Remover</span>
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-primary mb-1">Observações de Manuseio / Doca</label>
              <textarea
                rows={2}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit & Estimate Box */}
        <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-xl">payments</span>
              <span className="text-xs font-medium text-gray-300">Estimativa média de frete para {formData.palletsCount} pallets:</span>
            </div>
            <p className="font-headline text-2xl font-extrabold text-secondary-fixed mt-0.5">
              R$ {estimatedFreight.toFixed(2)}
            </p>
            <span className="text-[10px] text-gray-400">
              Valor calculado com base em distância, pallets e taxa de doca Mercado Full.
            </span>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full md:w-auto bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-headline font-bold text-xs px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Enviando NF-e e Publicando...</span>
              </>
            ) : (
              <>
                <span>Publicar Carga e Receber Propostas</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
