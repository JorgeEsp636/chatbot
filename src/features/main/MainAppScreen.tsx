import React, { useState } from 'react';
import {
  Map,
  CreditCard,
  Truck,
  Bus,
  FileQuestion,
  Sparkles,
  BarChart3,
  LogOut,
  User,
  Shield,
  Layers,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { UsuarioDocument } from '../../types';
import { RutasView } from '../rutas/RutasView';
import { TarifasView } from '../tarifas/TarifasView';
import { ConductoresView } from '../conductores/ConductoresView';
import { BusesView } from '../buses/BusesView';
import { PQRSView } from '../pqrs/PQRSView';
import AsistenteIAView from '../ia/AsistenteIAView';
import { DashboardMetricsView } from '../dashboard/DashboardMetricsView';

export type CheemsTab =
  | 'rutas'
  | 'tarifas'
  | 'conductores'
  | 'buses'
  | 'pqrs'
  | 'asistente'
  | 'dashboard';

interface MainAppScreenProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado?: (usuario: UsuarioDocument) => void;
  onOpenCodeExplorer?: () => void;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
  onOpenCodeExplorer,
}) => {
  const [activeTab, setActiveTab] = useState<CheemsTab>(() => (
    window.location.pathname === '/dashboard' ? 'dashboard' : 'rutas'
  ));
  const [modalLogout, setModalLogout] = useState(false);

  const tabs: { id: CheemsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'rutas', label: 'Rutas', icon: Map },
    { id: 'tarifas', label: 'Tarifas', icon: CreditCard },
    { id: 'conductores', label: 'Conductores', icon: Truck },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'pqrs', label: 'PQRS', icon: FileQuestion },
    { id: 'asistente', label: 'Asistente IA', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="min-h-full flex flex-col bg-[#0b101b] text-slate-100 relative font-sans">
      <header className="sticky top-0 z-40 bg-[#0d1424]/95 border-b border-slate-800/80 px-3 py-2.5 sm:px-6 shadow-md backdrop-blur-xl">
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max py-0.5">
              {tabs.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 py-1.5 sm:px-3.5 rounded-2xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#00e5ff] text-slate-950 shadow-[0_0_16px_rgba(0,229,255,0.45)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setModalLogout(true)}
              className="px-3 py-1.5 sm:px-4 rounded-full bg-[#f43f5e] hover:bg-[#e11d48] text-white text-[10px] sm:text-xs font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)] transition cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-6">
        {activeTab === 'rutas' && <RutasView />}

        {activeTab === 'tarifas' && <TarifasView usuario={usuario} />}

        {activeTab === 'conductores' && <ConductoresView />}

        {activeTab === 'buses' && <BusesView />}

        {activeTab === 'pqrs' && <PQRSView usuario={usuario} />}

        {activeTab === 'asistente' && <AsistenteIAView usuario={usuario} />}

        {activeTab === 'dashboard' && (
          <DashboardMetricsView
            usuario={usuario}
            onNavigateTab={(tab) => setActiveTab(tab as CheemsTab)}
          />
        )}
      </main>

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 border-t border-cyan-500/30 backdrop-blur-xl px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
        <div className="flex items-center justify-around gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center px-1.5 py-1 rounded-xl text-[10px] font-bold transition min-w-[52px] cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="truncate mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Confirmar Salir */}
      {modalLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="cheems-glass rounded-3xl max-w-sm w-full p-6 border border-cyan-500/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">¿Cerrar Sesión en CHEEMS?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saldrás de la cuenta activa ({usuario.email}). Podrás volver a ingresar en cualquier momento.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setModalLogout(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setModalLogout(false);
                  await onLogout();
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Sí, Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
