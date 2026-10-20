import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Truck,
  CreditCard,
  FileQuestion,
  BarChart3,
  UserCheck,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Save,
  X,
  AlertCircle,
  Building2,
  MapPin,
  TrendingUp,
  FileCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { UsuarioDocument, Tarifa, PQRS, Rol, MUNICIPIOS_VALLE_UBATE, MunicipioUbate } from '../../../types';
import { firestoreService } from '../../../services/firebase/firestoreService';
import { tarifasService } from '../../tarifas/services/tarifasService';
import { pqrsService } from '../../pqrs/services/pqrsService';
import { TarifasView } from '../../tarifas/TarifasView';
import { PerfilView } from '../../perfil/PerfilView';

interface DashboardAdministradorScreenProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado: (usuario: UsuarioDocument) => void;
}

type AdminTab = 'estadisticas' | 'usuarios' | 'conductores' | 'tarifas' | 'pqrs' | 'perfil';

export const DashboardAdministradorScreen: React.FC<DashboardAdministradorScreenProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('estadisticas');

  // Datos para gestión
  const [usuariosLista, setUsuariosLista] = useState<UsuarioDocument[]>([]);
  const [tarifasLista, setTarifasLista] = useState<Tarifa[]>([]);
  const [pqrsLista, setPqrsLista] = useState<PQRS[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros de búsqueda
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos');

  // Estado de Respuesta PQRS (Administración)
  const [pqrsSeleccionada, setPqrsSeleccionada] = useState<PQRS | null>(null);
  const [respuestaOficial, setRespuestaOficial] = useState('');
  const [nuevoEstadoPQRS, setNuevoEstadoPQRS] = useState<'PENDIENTE' | 'EN_REVISION' | 'RESPONDIDA' | 'CERRADA'>('RESPONDIDA');
  const [adminToast, setAdminToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);

  const mostrarToast = (mensaje: string, tipo: 'exito' | 'error' = 'exito') => {
    setAdminToast({ mensaje, tipo });
    setTimeout(() => setAdminToast(null), 4000);
  };

  // Cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [users, tarifas, pqrs] = await Promise.all([
        firestoreService.getAllUsuarios(),
        tarifasService.obtenerTarifas(),
        pqrsService.obtenerTodas(),
      ]);
      setUsuariosLista(users);
      setTarifasLista(tarifas);
      setPqrsLista(pqrs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Responder PQRS como Administrador
  const handleGuardarRespuestaPQRS = async () => {
    if (!pqrsSeleccionada || !respuestaOficial.trim()) {
      mostrarToast('Ingresa una respuesta oficial para el ciudadano.', 'error');
      return;
    }

    try {
      await pqrsService.responderPQRS(pqrsSeleccionada.id, respuestaOficial.trim(), nuevoEstadoPQRS);
      await cargarDatos();
      setPqrsSeleccionada(null);
      setRespuestaOficial('');
      mostrarToast('Respuesta oficial radicada con éxito.');
    } catch (e: any) {
      mostrarToast(e.message || 'Error al guardar respuesta.', 'error');
    }
  };

  // Cambiar rol de usuario (exclusivo Admin)
  const handleCambiarRol = async (uid: string, nuevoRol: Rol) => {
    try {
      await firestoreService.adminCambiarRol(uid, nuevoRol);
      setUsuariosLista((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, rol: nuevoRol } : u))
      );
      mostrarToast(`Rol de usuario actualizado a "${nuevoRol.toUpperCase()}" correctamente.`);
    } catch (e: any) {
      mostrarToast(e.message || 'Error al modificar rol.', 'error');
    }
  };

  // Usuarios filtrados
  const usuariosFiltrados = usuariosLista.filter((u) => {
    const coincideTexto =
      u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      u.email.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      (u.documento && u.documento.includes(busquedaUsuario));
    const coincideMunicipio = filtroMunicipio === 'todos' || u.municipio === filtroMunicipio;
    return coincideTexto && coincideMunicipio;
  });

  const conductores = usuariosLista.filter((u) => u.rol === 'conductor');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Administrador */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('estadisticas')}
            className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center cursor-pointer shadow-sm hover:bg-purple-600/30 transition"
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab('estadisticas')}
                className="font-black text-white text-base tracking-tight cursor-pointer"
              >
                CHEEMS <span className="text-purple-400 font-bold">Administrador</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase">
                {usuario.rol}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Gobernanza Valle de Ubaté
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Panel de Control Central & Gestión de Movilidad
            </p>
          </div>
        </div>

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

      {/* Barra de Navegación de Administrador */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max max-w-6xl mx-auto">
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'estadisticas'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Estadísticas</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gestionar Usuarios ({usuariosLista.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conductores')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'conductores'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Gestionar Conductores ({conductores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tarifas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tarifas'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>CRUD de Tarifas ({tarifasLista.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pqrs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'pqrs'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Gestionar PQRS ({pqrsLista.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'perfil'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Perfil Admin</span>
          </button>
        </div>
      </div>

      {/* Contenido Administrador */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Toast Notificación In-App */}
        {adminToast && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xl transition border ${
              adminToast.tipo === 'exito'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {adminToast.tipo === 'exito' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{adminToast.mensaje}</span>
            </div>
            <button
              onClick={() => setAdminToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {/* 1. VISTA DE ESTADÍSTICAS */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 block">
                  Panel de Inteligencia Territorial
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Observatorio de Movilidad Valle de Ubaté
                </h1>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Supervisión centralizada del sistema CHEEMS para los 10 municipios cundinamarqueses. Control de flota, recaudo tarifario y satisfacción de solicitudes ciudadanas.
                </p>
              </div>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs block">Usuarios Registrados</span>
                <span className="text-2xl font-black text-white mt-1 block">{usuariosLista.length}</span>
                <span className="text-[11px] text-emerald-400 font-medium">100% validados en Firestore</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs block">Flota de Microbuses</span>
                <span className="text-2xl font-black text-white mt-1 block">{conductores.length}</span>
                <span className="text-[11px] text-amber-400 font-medium">Cootransubaté & Rionegro</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs block">Rutas Reglamentadas</span>
                <span className="text-2xl font-black text-white mt-1 block">{tarifasLista.length}</span>
                <span className="text-[11px] text-emerald-400 font-medium">Tarifas activas</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs block">PQRS Radicadas</span>
                <span className="text-2xl font-black text-white mt-1 block">{pqrsLista.length}</span>
                <span className="text-[11px] text-purple-400 font-medium">
                  {pqrsLista.filter((p) => p.estado === 'RESPONDIDA').length} respondidas
                </span>
              </div>
            </div>

            {/* Desglose por Municipio */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Cobertura Territorial por Municipio
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {MUNICIPIOS_VALLE_UBATE.map((m) => {
                  const cant = usuariosLista.filter((u) => u.municipio === m.id).length;
                  return (
                    <div key={m.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <div className="text-slate-400 font-medium truncate">{m.id}</div>
                      <div className="text-sm font-bold text-white mt-1">{cant} usuario(s)</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. GESTIONAR USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaUsuario}
                  onChange={(e) => setBusquedaUsuario(e.target.value)}
                  placeholder="Buscar por nombre, correo o documento..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filtroMunicipio}
                  onChange={(e) => setFiltroMunicipio(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="todos">Todos los municipios</option>
                  {MUNICIPIOS_VALLE_UBATE.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Usuario</th>
                      <th className="p-3.5">Documento</th>
                      <th className="p-3.5">Municipio</th>
                      <th className="p-3.5">Rol en Firestore</th>
                      <th className="p-3.5">Acción Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{u.nombre}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          {u.tipoDocumento} {u.documento || 'Sin doc'}
                        </td>
                        <td className="p-3.5 text-slate-300">{u.municipio || 'Ubaté'}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              u.rol === 'administrador'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : u.rol === 'conductor'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {u.rol}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={u.rol}
                            onChange={(e) => handleCambiarRol(u.id, e.target.value as Rol)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="usuario">Asignar Usuario</option>
                            <option value="conductor">Asignar Conductor</option>
                            <option value="administrador">Asignar Administrador</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. GESTIONAR CONDUCTORES */}
        {activeTab === 'conductores' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Flota de Conductores Autorizados en la Provincia
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Control de móviles, empresas de transporte y rutas licitadas para el Valle de Ubaté.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conductores.map((cond) => (
                  <div key={cond.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {cond.movilAsignado || 'Móvil 104'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          Placa: {cond.placa || 'WOH-321'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{cond.nombre}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{cond.email}</p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block">Empresa</span>
                          <strong className="text-slate-200">{cond.empresaTransporte || 'Cootransubaté'}</strong>
                        </div>
                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block">Ruta Actual</span>
                          <strong className="text-emerald-400">{cond.rutaAsignada || 'Ubaté - Carupa'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> GPS Habilitado
                      </span>
                      <button
                        onClick={() => handleCambiarRol(cond.id, 'usuario')}
                        className="text-rose-400 hover:text-rose-300 transition text-[11px] cursor-pointer"
                      >
                        Revocar a usuario
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CRUD Y SUPERVISIÓN DE TARIFAS (OFICIALES 2026 RÁPIDO EL CARMEN S.A.) */}
        {activeTab === 'tarifas' && (
          <TarifasView usuario={usuario} />
        )}

        {/* 5. GESTIONAR PQRS */}
        {activeTab === 'pqrs' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-purple-400" />
                Ventanilla Única de PQRS Ciudadanas
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Revisa solicitudes radicadas por pasajeros, formula respuestas oficiales y cambia el estado administrativo.
              </p>

              <div className="space-y-3">
                {pqrsLista.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                          {item.tipo}
                        </span>
                        <h4 className="text-sm font-bold text-white">{item.asunto}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          item.estado === 'RESPONDIDA'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.estado === 'EN_REVISION'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.estado}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.descripcion}</p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                      <span>Radicado por: <strong className="text-slate-300">{item.usuarioNombre}</strong> ({item.usuarioEmail})</span>
                      <span>Fecha: {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {item.respuestaOficial && (
                      <div className="mt-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs">
                        <span className="text-[10px] font-bold text-purple-300 uppercase block mb-0.5">Respuesta Oficial Vigente</span>
                        <p className="text-slate-200">{item.respuestaOficial}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setPqrsSeleccionada(item);
                          setRespuestaOficial(item.respuestaOficial || '');
                          setNuevoEstadoPQRS(item.estado === 'PENDIENTE' ? 'RESPONDIDA' : item.estado);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{item.respuestaOficial ? 'Editar Respuesta' : 'Responder PQRS'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. PERFIL ADMIN */}
        {activeTab === 'perfil' && (
          <PerfilView
            usuario={usuario as any}
            onUsuarioActualizado={onUsuarioActualizado as any}
          />
        )}
      </main>

      {/* MODAL PARA RESPONDER PQRS */}
      {pqrsSeleccionada && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                Respuesta Oficial a Radicado
              </h3>
              <button
                onClick={() => setPqrsSeleccionada(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-xs">
              <strong className="text-white block">{pqrsSeleccionada.asunto}</strong>
              <p className="text-slate-400 mt-1">{pqrsSeleccionada.descripcion}</p>
              <div className="text-[10px] text-slate-500 mt-1">
                De: {pqrsSeleccionada.usuarioNombre} ({pqrsSeleccionada.usuarioEmail})
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado Administrativo</label>
                <select
                  value={nuevoEstadoPQRS}
                  onChange={(e) => setNuevoEstadoPQRS(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none"
                >
                  <option value="EN_REVISION">En Revisión por Secretaría</option>
                  <option value="RESPONDIDA">Respondida Oficialmente</option>
                  <option value="CERRADA">Cerrada / Concluida</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Texto de la Respuesta Oficial</label>
                <textarea
                  rows={4}
                  required
                  value={respuestaOficial}
                  onChange={(e) => setRespuestaOficial(e.target.value)}
                  placeholder="Escribe la determinación oficial de la Secretaría de Movilidad..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPqrsSeleccionada(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarRespuestaPQRS}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer shadow-sm shadow-purple-600/20"
                >
                  Radicar Respuesta Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
