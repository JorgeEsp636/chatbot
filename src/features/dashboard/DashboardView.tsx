import React, { useState } from 'react';
import {
  CreditCard,
  MapPin,
  FileQuestion,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  LogOut,
  Navigation,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Usuario } from '../../types';
import { authService } from '../auth/services/authService';

interface DashboardViewProps {
  usuario: Usuario;
  onNavigate: (module: 'tarifas' | 'mapa' | 'pqrs' | 'perfil') => void;
  onOpenCodeExplorer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  usuario,
  onNavigate,
  onOpenCodeExplorer,
}) => {
  const [mostrarModalSalida, setMostrarModalSalida] = useState(false);

  const handleCerrarSesion = () => {
    setMostrarModalSalida(true);
  };

  const confirmarLogout = async () => {
    setMostrarModalSalida(false);
    await authService.logout();
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Modal Confirmación Cerrar Sesión */}
      {mostrarModalSalida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-400" />
              ¿Cerrar Sesión Activa?
            </h3>
            <p className="text-xs text-slate-300">
              ¿Seguro que deseas salir de tu cuenta en CHEEMS Transporte Público? Podrás volver a iniciar sesión cuando lo desees.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setMostrarModalSalida(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tarjeta de bienvenida y usuario */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
                Rol: {usuario.rol}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> {usuario.municipio || 'Ubaté'} (Cundinamarca)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Correo Verificado
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Bienvenido(a), {usuario.nombre}
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-2">
              <span>{usuario.email}</span>
              <span className="text-slate-600">•</span>
              <span>Doc: {usuario.documento || 'No registrado'}</span>
              {usuario.empresaTransporte && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-medium">{usuario.empresaTransporte}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Acceso rápido a código de arquitectura */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema en línea: Firebase Firestore & Google Directions activos</span>
          </div>
          <button
            onClick={onOpenCodeExplorer}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver Archivos Nativos (Expo, Rules, Functions)</span>
          </button>
        </div>
      </div>

      {/* Grid de los 4 Módulos Principales Obligatorios */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Tarifas */}
          <div
            onClick={() => onNavigate('tarifas')}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 cursor-pointer transition shadow-sm hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center justify-between">
                <span>1. Tarifas</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-blue-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                CRUD reactivo en tiempo real con Firestore <code>onSnapshot</code>, edición y control de activación.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Gestionar precios</span>
              <span className="text-blue-400">Abrir &rarr;</span>
            </div>
          </div>

          {/* 2. Mapa en Tiempo Real */}
          <div
            onClick={() => onNavigate('mapa')}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition flex items-center justify-between">
                <span>2. Mapa en Tiempo Real</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                GPS de conductor cada 5s, visualizador de pasajero, marcadores y ruta con Google Directions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Rastreo en vivo</span>
              <span className="text-emerald-400">Ver mapa &rarr;</span>
            </div>
          </div>

          {/* 3. PQRS */}
          <div
            onClick={() => onNavigate('pqrs')}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition shadow-sm hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition flex items-center justify-between">
                <span>3. PQRS</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Peticiones, quejas, reclamos y sugerencias con adjuntos PDF/imagen en Firebase Storage.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Atención ciudadana</span>
              <span className="text-amber-400">Consultar &rarr;</span>
            </div>
          </div>

          {/* 4. Perfil */}
          <div
            onClick={() => onNavigate('perfil')}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 cursor-pointer transition shadow-sm hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition flex items-center justify-between">
                <span>4. Perfil</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-purple-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Datos personales, fecha de registro, estado de verificación y cambio de rol para pruebas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Mi cuenta</span>
              <span className="text-purple-400">Gestionar &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Sistema de Transporte y Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-sm font-semibold text-white">Operación de Flota</h4>
          </div>
          <p className="text-xs text-slate-400">
            98.4% de los vehículos zonales y troncales operando en itinerario normal sin bloqueos.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Navigation className="w-4 h-4" />
            <h4 className="text-sm font-semibold text-white">Bus Más Cercano</h4>
          </div>
          <p className="text-xs text-slate-400">
            Móvil K-102 a 4 minutos de tu parada habitual con ruta trazada vía Directions API.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-300">
              <LogOut className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-semibold text-white">Sesión Activa</h4>
            </div>
            <p className="text-xs text-slate-400">
              Autenticado con token Firebase seguro.
            </p>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="mt-3 w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
