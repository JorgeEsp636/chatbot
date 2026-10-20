import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Radio,
  Power,
  Compass,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Users,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  CreditCard,
} from 'lucide-react';
import { UsuarioDocument, UbicacionConductor } from '../../../types';
import { firestoreService } from '../../../services/firebase/firestoreService';
import { MapaView } from '../../mapa/MapaView';
import { TarifasView } from '../../tarifas/TarifasView';
import { PerfilView } from '../../perfil/PerfilView';

interface DashboardConductorScreenProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado: (usuario: UsuarioDocument) => void;
}

type ConductorTab = 'panel' | 'mapa' | 'tarifas' | 'servicio' | 'perfil';

export const DashboardConductorScreen: React.FC<DashboardConductorScreenProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
}) => {
  const [activeTab, setActiveTab] = useState<ConductorTab>('panel');
  const [disponible, setDisponible] = useState<boolean>(usuario.disponible ?? true);
  const [compartiendoGPS, setCompartiendoGPS] = useState<boolean>(true);
  const [pasajerosAbordo, setPasajerosAbordo] = useState<number>(14);
  const [capacidadMaxima] = useState<number>(19);
  const [velocidadActual, setVelocidadActual] = useState<number>(38.5);
  const [latitudActual, setLatitudActual] = useState<number>(5.3214);
  const [longitudActual, setLongitudActual] = useState<number>(-73.8245);
  const [ultimoReporte, setUltimoReporte] = useState<string>(new Date().toLocaleTimeString());

  // Simulación de emisión de telemetría GPS periódica a Firestore
  useEffect(() => {
    if (!compartiendoGPS || !disponible) return;

    const interval = setInterval(() => {
      // Simula pequeño desplazamiento a lo largo del corredor Carupa - Ubaté
      setLatitudActual((lat) => Number((lat + (Math.random() * 0.0004 - 0.0002)).toFixed(6)));
      setLongitudActual((lng) => Number((lng + (Math.random() * 0.0004 - 0.0002)).toFixed(6)));
      setVelocidadActual((v) => Math.max(15, Math.min(60, Number((v + (Math.random() * 6 - 3)).toFixed(1)))));
      setUltimoReporte(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, [compartiendoGPS, disponible]);

  // Cambiar disponibilidad en Firestore
  const toggleDisponibilidad = async () => {
    const nuevoEstado = !disponible;
    setDisponible(nuevoEstado);
    try {
      await firestoreService.setConductorDisponibilidad(usuario.id, nuevoEstado);
      onUsuarioActualizado({ ...usuario, disponible: nuevoEstado });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGPS = () => {
    setCompartiendoGPS((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header del Conductor */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('panel')}
            className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center cursor-pointer shadow-sm hover:bg-amber-500/30 transition"
          >
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab('panel')}
                className="font-black text-white text-base tracking-tight cursor-pointer"
              >
                CHEEMS <span className="text-amber-400 font-bold">Conductor</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                {usuario.rol}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {usuario.movilAsignado || 'Móvil 104'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {usuario.empresaTransporte || 'Cootransubaté'} • Ruta {usuario.rutaAsignada || 'Ubaté - Carupa'}
            </p>
          </div>
        </div>

        {/* Controles Rápidos de Estado */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge de Estado en Ruta */}
          <button
            onClick={toggleDisponibilidad}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              disponible
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{disponible ? 'En Servicio' : 'Fuera de Servicio'}</span>
          </button>

          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Menú de Navegación de Conductor */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max max-w-5xl mx-auto">
          <button
            onClick={() => setActiveTab('panel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'panel'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Panel de Telemetría GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Ver Mapa & Ruta</span>
          </button>

          <button
            onClick={() => setActiveTab('tarifas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tarifas'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Planilla Tarifas 2026</span>
          </button>

          <button
            onClick={() => setActiveTab('servicio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'servicio'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Información del Servicio</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'perfil'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Perfil Conductor</span>
          </button>
        </div>
      </div>

      {/* Contenido Conductor */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'panel' && (
          <div className="space-y-6">
            {/* Banner de Operación en Tiempo Real */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
                    <Truck className="w-3.5 h-3.5" />
                    Unidad Activa: {usuario.movilAsignado || 'Móvil 104'} ({usuario.placa || 'WOH-321'})
                  </div>
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {usuario.nombre}
                  </h1>
                  <p className="text-slate-300 text-xs mt-1">
                    Operador: <strong className="text-white">{usuario.empresaTransporte || 'Cootransubaté'}</strong> • Corredor: {usuario.rutaAsignada || 'Ubaté - Carmen de Carupa'}
                  </p>
                </div>

                {/* Switch de Transmisión GPS */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">Emisión GPS</span>
                    <button
                      onClick={toggleGPS}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        compartiendoGPS && disponible ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          compartiendoGPS && disponible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        compartiendoGPS && disponible ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    <span className={compartiendoGPS && disponible ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {compartiendoGPS && disponible ? 'Transmitiendo satélite' : 'GPS en pausa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Módulo de Telemetría GPS en Vivo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" /> Velocidad
                </span>
                <span className="text-2xl font-black text-white">{velocidadActual}</span>
                <span className="text-slate-500 text-xs ml-1">km/h</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Aforo Pasajeros
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{pasajerosAbordo}</span>
                  <span className="text-slate-500 text-xs">/ {capacidadMaxima}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => setPasajerosAbordo((p) => Math.min(capacidadMaxima, p + 1))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-white font-bold cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => setPasajerosAbordo((p) => Math.max(0, p - 1))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-white font-bold cursor-pointer"
                  >
                    -1
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Latitud
                </span>
                <span className="text-base font-mono font-bold text-slate-200">{latitudActual}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Norte Ubaté</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-slate-400 text-xs block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Último Pulso
                </span>
                <span className="text-base font-mono font-bold text-slate-200">{ultimoReporte}</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Sincronizado</span>
              </div>
            </div>

            {/* Accesos a Funcionalidades de Conductor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('mapa')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition shrink-0">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                      Ver Mapa & Paraderos Autorizados
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Visualiza los puntos de ascenso de pasajeros en Ubaté y la vía Carupa.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('servicio')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                      Ficha Técnica del Vehículo y Turno
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Consulta la tarjeta de operación, SOAT, revisión técnico-mecánica y horarios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mapa' && <MapaView usuario={usuario as any} />}
        {activeTab === 'tarifas' && <TarifasView usuario={usuario as any} />}

        {activeTab === 'servicio' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Información del Servicio Intermunicipal
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Datos reglamentados del vehículo y planilla de despacho autorizada por la Secretaría de Movilidad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Móvil / Interno</span>
                  <strong className="text-base text-white">{usuario.movilAsignado || 'Móvil 104'}</strong>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Placa Vehicular</span>
                  <strong className="text-base text-amber-400 font-mono">{usuario.placa || 'WOH-321'}</strong>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Empresa Operadora</span>
                  <strong className="text-base text-white">{usuario.empresaTransporte || 'Rápido El Carmen S.A.'}</strong>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Ruta Asignada</span>
                  <strong className="text-slate-200">{usuario.rutaAsignada || 'Ubaté - Carmen de Carupa'}</strong>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Tarifa Oficial Pasajero</span>
                  <strong className="text-amber-400 font-bold">$6.000 COP (Mín. $4.400)</strong>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">SOAT y Tecnomecánica</span>
                  <strong className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vigentes (2026)
                  </strong>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <strong>Instrucción para conductores:</strong> Mantén la aplicación abierta con la pantalla activa durante el recorrido para garantizar la precisión del GPS para los usuarios en espera.
              </div>
            </div>
          </div>
        )}

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
