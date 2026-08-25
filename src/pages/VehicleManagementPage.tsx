import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Vehicle } from '../types';

export const VehicleManagementPage: React.FC = () => {
  const { vehicles, addVehicle } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'driverId'>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    type: 'Van / Furgão',
    maxWeightKg: 1800,
    maxVolumeM3: 14,
    bodyType: 'Baú Seco',
    isFullCompliant: true,
    anttRegister: ''
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(newVehicle);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary">
            Gestão de Veículos & Frota Full
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gerencie os veículos homologados para receber cotações de entregas nos Centros de Distribuição do Mercado Livre.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-secondary hover:bg-opacity-90 text-on-secondary font-headline font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Adicionar Veículo</span>
        </button>
      </div>

      {/* Vehicles Grid or Empty State */}
      {vehicles.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 rounded-2xl border border-surface-container-high text-center space-y-3">
          <div className="w-16 h-16 bg-surface-container rounded-2xl mx-auto flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">local_shipping</span>
          </div>
          <h3 className="font-headline font-bold text-base text-primary">Nenhum veículo cadastrado ainda</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Cadastre seus furgões, vans ou caminhões para começar a receber propostas e agendamentos nos Centros de Distribuição Mercado Livre Full.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-headline font-bold text-xs px-5 py-3 rounded-xl shadow-md transition hover:bg-neutral-800 inline-flex items-center gap-1.5 mt-2"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Cadastrar Meu Primeiro Veículo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm space-y-4 hover:border-secondary-fixed transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-primary">{v.brand} {v.model}</h3>
                    <span className="font-mono text-xs font-bold text-secondary bg-secondary-fixed/20 px-2 py-0.5 rounded">
                      {v.plate}
                    </span>
                  </div>
                </div>

                {v.isFullCompliant && (
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Selo Full
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-surface-container-low p-3.5 rounded-xl text-on-surface-variant">
                <div>
                  <span className="text-[10px] uppercase font-bold">Tipo:</span>
                  <p className="font-semibold text-primary">{v.type}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold">Carroceria:</span>
                  <p className="font-semibold text-primary">{v.bodyType}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold">Capacidade de Carga:</span>
                  <p className="font-semibold text-primary">{v.maxWeightKg} kg • {v.maxVolumeM3} m³</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold">Registro ANTT:</span>
                  <p className="font-mono font-semibold text-primary">{v.anttRegister || 'Ativo'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-xs">
                <span className="text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Aprovado para docas de 24 CDs
                </span>
                <button className="text-on-surface-variant hover:text-primary font-bold">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-surface-container-high shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="font-headline font-bold text-lg text-primary">
              Cadastrar Novo Veículo na Frota
            </h3>

            <form onSubmit={handleCreateVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-primary mb-1">Marca *</label>
                  <input
                    type="text"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1">Modelo *</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1">Placa (Mercosul) *</label>
                  <input
                    type="text"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value.toUpperCase() })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 font-mono uppercase focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1">Tipo de Veículo *</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e: any) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                  >
                    <option value="Fiorino / VUC">Fiorino / VUC</option>
                    <option value="Van / Furgão">Van / Furgão</option>
                    <option value="Caminhão 3/4">Caminhão 3/4</option>
                    <option value="Toco / Médio">Toco / Médio</option>
                    <option value="Truck / Pesado">Truck / Pesado</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1">Capacidade (kg) *</label>
                  <input
                    type="number"
                    value={newVehicle.maxWeightKg}
                    onChange={(e) => setNewVehicle({ ...newVehicle, maxWeightKg: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-primary mb-1">Registro ANTT</label>
                  <input
                    type="text"
                    value={newVehicle.anttRegister}
                    onChange={(e) => setNewVehicle({ ...newVehicle, anttRegister: e.target.value })}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-opacity-90 text-on-secondary shadow-md"
                >
                  Salvar Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
