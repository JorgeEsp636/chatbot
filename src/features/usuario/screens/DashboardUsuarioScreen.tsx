import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  CreditCard,
  FileQuestion,
  UserCheck,
  LogOut,
  Navigation,
  Compass,
  Clock,
  CheckCircle2,
  Phone,
  Building2,
  PlusCircle,
  HelpCircle,
  Eye,
  Send,
  AlertCircle,
} from 'lucide-react';
import { UsuarioDocument } from '../../../types';
import { TarifasView } from '../../tarifas/TarifasView';
import { MapaView } from '../../mapa/MapaView';
import { PQRSView } from '../../pqrs/PQRSView';
import { PerfilView } from '../../perfil/PerfilView';

interface DashboardUsuarioScreenProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado: (usuario: UsuarioDocument) => void;
}

export type UsuarioTab = 'inicio' | 'tarifas' | 'mapa' | 'pqrs' | 'perfil';

export const DashboardUsuarioScreen: React.FC<DashboardUsuarioScreenProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
}) => {
  const [activeTab, setActiveTab] = useState<UsuarioTab>('inicio');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Barra de Navegación del Usuario */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('inicio')}
            className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center cursor-pointer shadow-sm hover:bg-emerald-600/30 transition"
          >
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab('inicio')}
                className="font-black text-white text-base tracking-tight cursor-pointer"
              >
                CHEEMS <span className="text-emerald-400 font-bold">Pasajero</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                {usuario.rol}
              </span>
              {usuario.municipio && (
                <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {usuario.municipio}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Valle de Ubaté • Red Intermunicipal
            </p>
          </div>
        </div>

        {/* Acciones Rápidas del Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Pestañas de Navegación Secundaria para Usuario */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max max-w-5xl mx-auto">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'inicio'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => setActiveTab('tarifas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tarifas'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Consultar Tarifas</span>
          </button>

          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Ver Mapa & Conductor GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('pqrs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'pqrs'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Crear y Consultar PQRS</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'perfil'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Mi Perfil</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            {/* Banner de Bienvenida */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  Municipio: {usuario.municipio || 'Villa de San Diego de Ubaté'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Hola, {usuario.nombre}
                </h1>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Bienvenido al panel del ciudadano de <strong>CHEEMS</strong>. Consulta en tiempo real las tarifas oficiales entre municipios, sigue la posición del microbús en ruta y radíca tus quejas o peticiones con respuesta oficial.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setActiveTab('mapa')}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Ver Microbús en Ruta</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tarifas')}
                    className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Tarifas Intermunicipales</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pqrs')}
                    className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                  >
                    <FileQuestion className="w-4 h-4 text-amber-400" />
                    <span>Radicar PQRS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos Funcionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('tarifas')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Consultar Tarifas
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Valores reglamentados entre Ubaté, Carupa, Cucunubá, Simijaca, Guachetá y Bogotá.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('mapa')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Ubicación del Conductor
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Sigue la telemetría satelital en vivo del Móvil 104 y estima tu tiempo de espera.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('pqrs')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                  PQRS Ciudadanas
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Envía solicitudes, quejas sobre sobrecupo o cobro excesivo con soporte oficial.
                </p>
              </div>
            </div>

            {/* Vista Previa de la Ruta Valle de Ubaté */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Corredor Principal de Transporte Activo
                </h3>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                  En servicio habitual
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Origen Principal</span>
                  <strong className="text-slate-200">Terminal Ubaté</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Destino Concurrido</span>
                  <strong className="text-slate-200">Carmen de Carupa</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Frecuencia Diaria</span>
                  <strong className="text-emerald-400 font-semibold">Cada 15 minutos</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Operador Licitado</span>
                  <strong className="text-slate-200">Rápido El Carmen S.A.</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tarifas' && <TarifasView usuario={usuario as any} />}
        {activeTab === 'mapa' && <MapaView usuario={usuario as any} />}
        {activeTab === 'pqrs' && <PQRSView usuario={usuario as any} />}
        {activeTab === 'perfil' && (
          <PerfilView
            usuario={usuario as any}
            onUsuarioActualizado={onUsuarioActualizado as any}
          />
        )}
      </main>
    </div>
  );
};
