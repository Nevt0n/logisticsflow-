import React, { useState } from 'react';
import { useApp, FULFILLMENT_CENTERS } from '../context/AppContext';

export const FreightCalculationPage: React.FC = () => {
  const { freightConfig, updateFreightConfig } = useApp();

  const [rates, setRates] = useState({
    basePricePerKm: freightConfig.basePricePerKm,
    minimumFreight: freightConfig.minimumFreight,
    palletHandlingFee: freightConfig.palletHandlingFee,
    fullDockAssistanceFee: freightConfig.fullDockAssistanceFee,
    nightSurchargePercent: freightConfig.nightSurchargePercent,
    tollByShipper: freightConfig.tollByShipper,
    availableDays: freightConfig.availableDays || ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    availableTimeSlots: freightConfig.availableTimeSlots || ['Manhã (06:00 - 12:00)', 'Tarde (12:00 - 18:00)'],
    servicedFulfillmentCenters: freightConfig.servicedFulfillmentCenters || ['CD SP01 Cajamar I', 'CD SP02 Cajamar II', 'CD SP03 Franco da Rocha'],
    truckVolumeM3: freightConfig.truckVolumeM3 || 16.0,
    truckMaxWeightKg: freightConfig.truckMaxWeightKg || 2200,
    truckMaxPallets: freightConfig.truckMaxPallets || 4
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulação de Match em tempo real
  const [simDistance, setSimDistance] = useState(48);
  const [simPallets, setSimPallets] = useState(3);
  const [simAssistance, setSimAssistance] = useState(true);

  const calculateSampleFreight = () => {
    let price = rates.minimumFreight + (simDistance * rates.basePricePerKm) + (simPallets * rates.palletHandlingFee);
    if (simAssistance) price += rates.fullDockAssistanceFee;
    return Math.round(price);
  };

  const handleDayToggle = (day: string) => {
    setRates(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSlotToggle = (slot: string) => {
    setRates(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.includes(slot)
        ? prev.availableTimeSlots.filter(s => s !== slot)
        : [...prev.availableTimeSlots, slot]
    }));
  };

  const handleFcToggle = (fcName: string) => {
    setRates(prev => ({
      ...prev,
      servicedFulfillmentCenters: prev.servicedFulfillmentCenters.includes(fcName)
        ? prev.servicedFulfillmentCenters.filter(f => f !== fcName)
        : [...prev.servicedFulfillmentCenters, fcName]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFreightConfig(rates);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const timeSlots = [
    'Manhã (06:00 - 12:00)',
    'Tarde (12:00 - 18:00)',
    'Noite (18:00 - 23:00)',
    'Madrugada (23:00 - 06:00)'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl font-extrabold text-primary">
          Disponibilidade de Agenda, Cubagem & Tabela de Frete
        </h1>
        <p className="text-xs text-on-surface-variant">
          Defina sua agenda e a capacidade do seu caminhão. O sistema faz o match automático com os vendedores e calcula os fretes com base na sua tabela.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200 animate-fadeIn">
          <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
          <span>Sua agenda, cubagem e tabela de preços foram salvas e atualizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Availability & Truck Capacity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Disponibilidade de Dias e Horários */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4 text-xs">
            <h2 className="font-headline font-bold text-sm text-primary flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">calendar_clock</span>
              <span>1. Dias e Horários em que Você Atende Entregas</span>
            </h2>

            <div>
              <label className="block font-bold text-primary mb-2">Dias da Semana Disponíveis:</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                      rates.availableDays.includes(day)
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-primary mb-2">Turnos / Janelas de Doca Atendidas:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotToggle(slot)}
                    className={`p-3 rounded-xl text-xs font-semibold transition border text-left flex items-center justify-between ${
                      rates.availableTimeSlots.includes(slot)
                        ? 'bg-secondary-fixed/20 border-secondary text-primary font-bold'
                        : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <span>{slot}</span>
                    <span className="material-symbols-outlined text-sm text-secondary">
                      {rates.availableTimeSlots.includes(slot) ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-primary mb-2">Centros de Distribuição Mercado Livre Full que Atende:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FULFILLMENT_CENTERS.map(fc => (
                  <button
                    key={fc.id}
                    type="button"
                    onClick={() => handleFcToggle(`${fc.code} ${fc.name.replace('Mercado Livre Full ', '')}`)}
                    className={`p-2.5 rounded-xl text-xs transition border text-left flex items-center justify-between ${
                      rates.servicedFulfillmentCenters.some(s => s.includes(fc.code))
                        ? 'bg-primary/5 border-primary text-primary font-bold'
                        : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <span>{fc.code} - {fc.city}</span>
                    <span className="material-symbols-outlined text-xs">
                      {rates.servicedFulfillmentCenters.some(s => s.includes(fc.code)) ? 'check_circle' : 'add_circle'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Capacidade do Veículo / Cubagem */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4 text-xs">
            <h2 className="font-headline font-bold text-sm text-primary flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              <span>2. Capacidade do seu Veículo / Caminhão</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-primary mb-1">Cubagem Útil (m³) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={rates.truckVolumeM3}
                    onChange={(e) => setRates({ ...rates, truckVolumeM3: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold text-primary focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-on-surface-variant">m³</span>
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 block">Espaço total do baú</span>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Capacidade de Peso (kg) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    value={rates.truckMaxWeightKg}
                    onChange={(e) => setRates({ ...rates, truckMaxWeightKg: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold text-primary focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-on-surface-variant">kg</span>
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 block">Carga útil máxima</span>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Capacidade em Pallets PBR *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={rates.truckMaxPallets}
                    onChange={(e) => setRates({ ...rates, truckMaxPallets: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold text-primary focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-on-surface-variant">pallets</span>
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 block">Padrão 1,00 x 1,20 m</span>
              </div>
            </div>
          </div>

          {/* Section 3: Parâmetros da Tabela de Frete */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4 text-xs">
            <h2 className="font-headline font-bold text-sm text-primary flex items-center gap-2 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-secondary">calculate</span>
              <span>3. Parâmetros de Cobrança da sua Tabela</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-primary mb-1">Saída Mínima / Frete Mínimo (R$) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.minimumFreight}
                  onChange={(e) => setRates({ ...rates, minimumFreight: Number(e.target.value) })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Valor por Km Rodado (R$/km) *</label>
                <input
                  type="number"
                  step="0.10"
                  value={rates.basePricePerKm}
                  onChange={(e) => setRates({ ...rates, basePricePerKm: Number(e.target.value) })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Taxa de Manuseio por Pallet (R$/un) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.palletHandlingFee}
                  onChange={(e) => setRates({ ...rates, palletHandlingFee: Number(e.target.value) })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Taxa Ajudante Doca Full (R$) *</label>
                <input
                  type="number"
                  step="1"
                  value={rates.fullDockAssistanceFee}
                  onChange={(e) => setRates({ ...rates, fullDockAssistanceFee: Number(e.target.value) })}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 font-bold focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Calculator & Save Button */}
        <div className="space-y-6">
          <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-xl space-y-4 sticky top-24">
            <h3 className="font-headline font-bold text-sm text-secondary-fixed flex items-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              <span>Simulador de Match Automático</span>
            </h3>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              Veja como o sistema calcula o valor pago a você quando um vendedor solicitar uma entrega compatível com sua cubagem e agenda:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Distância da Coleta ao CD Full:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={simDistance}
                    onChange={(e) => setSimDistance(Number(e.target.value))}
                    className="flex-1 accent-secondary-fixed cursor-pointer"
                  />
                  <span className="font-mono font-bold text-secondary-fixed text-xs">{simDistance} km</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Qtd. de Pallets:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max={rates.truckMaxPallets || 6}
                    value={simPallets}
                    onChange={(e) => setSimPallets(Number(e.target.value))}
                    className="flex-1 accent-secondary-fixed cursor-pointer"
                  />
                  <span className="font-mono font-bold text-secondary-fixed text-xs">{simPallets} un</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-300">Acompanhar descarga na doca:</span>
                <input
                  type="checkbox"
                  checked={simAssistance}
                  onChange={(e) => setSimAssistance(e.target.checked)}
                  className="w-4 h-4 rounded accent-secondary-fixed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <span className="text-xs text-gray-300 block">Valor Final Calculado para Você:</span>
              <p className="font-headline text-3xl font-extrabold text-secondary-fixed mt-1">
                R$ {calculateSampleFreight().toFixed(2)}
              </p>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Sem leilão de propostas • Valor fixo garantido na sua agenda.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-headline font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Salvar Disponibilidade & Tabela</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
