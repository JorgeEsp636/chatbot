import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Building2,
  Table,
  LayoutGrid,
  MapPin,
  ExternalLink,
  Coins,
  Receipt,
  Bus,
} from 'lucide-react';
import { Tarifa, UsuarioDocument } from '../../types';
import {
  tarifasService,
  EMPRESA_TRANSPORTE_OFICIAL,
  TARIFA_MINIMA_2026,
  TARIFAS_RAPIDO_EL_CARMEN_2026,
} from './services/tarifasService';

interface TarifasViewProps {
  usuario?: UsuarioDocument;
}

export const TarifasView: React.FC<TarifasViewProps> = ({ usuario }) => {
  const esAdmin = usuario?.rol === 'administrador';

  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [zonaFiltro, setZonaFiltro] = useState<'todas' | 'valle' | 'rurales' | 'interprovincial'>('todas');
  const [modoVisualizacion, setModoVisualizacion] = useState<'planilla' | 'cuadricula'>('planilla');

  // Modal CRUD para Admin
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tarifaEditando, setTarifaEditando] = useState<Tarifa | null>(null);
  const [nombre, setNombre] = useState('');
  const [origen, setOrigen] = useState('Ubaté');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activa, setActiva] = useState(true);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Estados de retroalimentación in-app
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const [confirmarRestablecer, setConfirmarRestablecer] = useState(false);

  const mostrarToast = (mensaje: string, tipo: 'exito' | 'error' = 'exito') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Suscripción reactiva con onSnapshot
  useEffect(() => {
    setCargando(true);
    const unsubscribe = tarifasService.onSnapshot((nuevasTarifas) => {
      setTarifas(nuevasTarifas);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  // Modal handlers
  const abrirModalCrear = () => {
    setTarifaEditando(null);
    setNombre('Ubaté - ');
    setOrigen('Ubaté');
    setDestino('');
    setValor('6000');
    setDescripcion('Ruta autorizada por Rápido El Carmen S.A.');
    setActiva(true);
    setErrorForm(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (item: Tarifa) => {
    setTarifaEditando(item);
    setNombre(item.nombre);
    setOrigen(item.origen);
    setDestino(item.destino);
    setValor(item.valor.toString());
    setDescripcion(item.descripcion || '');
    setActiva(item.activa);
    setErrorForm(null);
    setModalAbierto(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm(null);

    const valorNum = parseFloat(valor);
    if (!nombre.trim()) {
      setErrorForm('El nombre de la tarifa es obligatorio.');
      return;
    }
    if (!origen.trim() || !destino.trim()) {
      setErrorForm('Tanto el origen como el destino son obligatorios.');
      return;
    }
    if (isNaN(valorNum) || valorNum <= 0) {
      setErrorForm('El valor del pasaje debe ser un monto mayor a 0 COP.');
      return;
    }

    setGuardando(true);
    try {
      if (tarifaEditando) {
        await tarifasService.actualizarTarifa(tarifaEditando.id, {
          nombre,
          origen,
          destino,
          valor: valorNum,
          descripcion,
          activa,
        });
      } else {
        await tarifasService.crearTarifa({
          nombre,
          origen,
          destino,
          valor: valorNum,
          descripcion,
          activa,
        });
      }
      setModalAbierto(false);
    } catch (err: any) {
      setErrorForm(err.message || 'Error al guardar la tarifa.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = (id: string, nombreTarifa: string) => {
    setConfirmarEliminar({ id, nombre: nombreTarifa });
  };

  const ejecutarEliminar = async () => {
    if (!confirmarEliminar) return;
    try {
      await tarifasService.eliminarTarifa(confirmarEliminar.id);
      mostrarToast(`Tarifa "${confirmarEliminar.nombre}" eliminada correctamente.`);
    } catch (err: any) {
      mostrarToast(err.message || 'Error al eliminar la tarifa.', 'error');
    } finally {
      setConfirmarEliminar(null);
    }
  };

  const handleToggleActiva = async (id: string) => {
    try {
      await tarifasService.toggleActiva(id);
      mostrarToast('Estado de la tarifa modificado con éxito.');
    } catch (err: any) {
      mostrarToast(err.message || 'Error al modificar estado.', 'error');
    }
  };

  const handleRestablecerOficiales = () => {
    setConfirmarRestablecer(true);
  };

  const ejecutarRestablecer = () => {
    tarifasService.restablecerTarifasOficiales();
    setConfirmarRestablecer(false);
    mostrarToast('Planilla oficial 2026 de Rápido El Carmen S.A. restablecida (34 tarifas).');
  };

  // Clasificación por zonas geográficas
  const clasificarZona = (destino: string): 'valle' | 'rurales' | 'interprovincial' => {
    const dest = destino.toUpperCase();
    const valle = ['CARUPA', 'CUCUNUBA', 'FUQUENE', 'GUACHETA', 'LENGUAZAQUE', 'SIMIJACA', 'SUSA', 'SUTATAUSA', 'TAUSA'];
    const inter = ['COPER', 'CHOCONTA', 'NEMOCON', 'RAQUIRA', 'SAMACA', 'SAN MIGUEL DE SEMA', 'SUESCA'];

    if (valle.some((v) => dest.includes(v))) return 'valle';
    if (inter.some((i) => dest.includes(i))) return 'interprovincial';
    return 'rurales';
  };

  // Filtrado
  const tarifasFiltradas = tarifas.filter((t) => {
    const texto = `${t.nombre} ${t.origen} ${t.destino}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda.toLowerCase().trim());
    if (!coincideTexto) return false;

    if (zonaFiltro === 'todas') return true;
    return clasificarZona(t.destino) === zonaFiltro;
  });

  // Dividir para la vista de Planilla Oficial 2 Columnas (como el afiche)
  const mitad = Math.ceil(tarifasFiltradas.length / 2);
  const columna1 = tarifasFiltradas.slice(0, mitad);
  const columna2 = tarifasFiltradas.slice(mitad);

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification In-App */}
      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xl transition border ${
            toast.tipo === 'exito'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.tipo === 'exito' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.mensaje}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              ¿Eliminar Tarifa?
            </h3>
            <p className="text-xs text-slate-300">
              ¿Confirmas que deseas eliminar la tarifa <strong className="text-white">"{confirmarEliminar.nombre}"</strong>? Esta acción removerá el valor del tarifario en tiempo real.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarEliminar}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Sí, Eliminar Tarifa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Restablecer Oficiales */}
      {confirmarRestablecer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Restablecer Planilla Oficial 2026
            </h3>
            <p className="text-xs text-slate-300">
              ¿Deseas restaurar la lista oficial de <strong className="text-white">34 rutas y tarifas autorizadas</strong> para <strong className="text-amber-400">RÁPIDO EL CARMEN S.A.</strong> aprobadas por la Secretaría de Transporte y Movilidad?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmarRestablecer(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarRestablecer}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer font-bold"
              >
                Sí, Restaurar Planilla 2026
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CARTEL OFICIAL DE LA EMPRESA RÁPIDO EL CARMEN S.A.       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-slate-800 pb-6">
          <div className="flex items-start gap-4">
            {/* Logotipo / Escudo Rápido El Carmen */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-700 flex flex-col items-center justify-center p-2 shrink-0 shadow-lg text-slate-900">
              <Bus className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 mb-0.5" />
              <span className="text-[8px] font-black uppercase tracking-tighter leading-none text-center">
                EL CARMEN
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Empresa Habilitada • NIT: {EMPRESA_TRANSPORTE_OFICIAL.nit}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                {EMPRESA_TRANSPORTE_OFICIAL.nombre}
              </h1>
              <p className="text-xs sm:text-sm text-amber-300 font-medium italic mt-0.5">
                "{EMPRESA_TRANSPORTE_OFICIAL.slogan}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Servicio Intermunicipal de Pasajeros • Terminal de Transportes de Ubaté
              </p>
            </div>
          </div>

          {/* Badge de Tarifa Mínima y Vigencia */}
          <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
            <div className="bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-lg shadow-amber-500/20 text-right">
              <span className="text-[10px] uppercase tracking-wider block font-extrabold opacity-90">
                {EMPRESA_TRANSPORTE_OFICIAL.vigencia}
              </span>
              <span className="text-xl sm:text-2xl tracking-tight leading-none block mt-0.5">
                TARIFA MÍNIMA ${TARIFA_MINIMA_2026.toLocaleString('es-CO')}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-[10px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vigilado: <strong>{EMPRESA_TRANSPORTE_OFICIAL.entidadVigilante}</strong></span>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas del Afiche */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-300 flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Punto de Partida: <strong>Terminal de Ubaté (Plataforma Intermunicipal)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {esAdmin && (
              <button
                onClick={abrirModalCrear}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Tarifa</span>
              </button>
            )}

            <button
              onClick={handleRestablecerOficiales}
              title="Cargar las 34 tarifas autorizadas en la resolución 2026"
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restablecer Oficiales 2026</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE BÚSQUEDA Y MODOS DE VISTA                      */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Buscador de destino */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar destino (ej: Carupa, Cucunubá, Coper)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filtros por Categoría */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setZonaFiltro('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              zonaFiltro === 'todas'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({tarifas.length})
          </button>
          <button
            onClick={() => setZonaFiltro('valle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              zonaFiltro === 'valle'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Valle de Ubaté
          </button>
          <button
            onClick={() => setZonaFiltro('rurales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              zonaFiltro === 'rurales'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Veredas & Sectores
          </button>
          <button
            onClick={() => setZonaFiltro('interprovincial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              zonaFiltro === 'interprovincial'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Boyacá & Sabana
          </button>

          {/* Toggle de formato */}
          <div className="flex items-center ml-auto bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setModoVisualizacion('planilla')}
              title="Formato Planilla 2 Columnas (Idéntico al Cartel)"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                modoVisualizacion === 'planilla'
                  ? 'bg-amber-500/20 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModoVisualizacion('cuadricula')}
              title="Formato Cuadrícula / Tarjetas"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                modoVisualizacion === 'cuadricula'
                  ? 'bg-amber-500/20 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VISTA 1: PLANILLA OFICIAL 2 COLUMNAS (IGUAL A LA FOTO)   */}
      {/* ======================================================== */}
      {cargando ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Cargando tarifas oficiales de Rápido El Carmen S.A...</p>
        </div>
      ) : tarifasFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <h3 className="text-sm font-semibold text-white">No se encontraron destinos</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {busqueda
              ? `No hay tarifas que coincidan con "${busqueda}".`
              : 'No hay tarifas registradas en este filtro.'}
          </p>
        </div>
      ) : modoVisualizacion === 'planilla' ? (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Cabecera del Cuadro */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                TABLA REGULATORIA OFICIAL
              </span>
              <h2 className="text-lg font-black text-white tracking-tight uppercase">
                TARIFAS VIGENTES AÑO 2026 — DE UBATE A:
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Mostrando {tarifasFiltradas.length} de {tarifas.length} destinos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Columna Izquierda */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-bold">
                    <th className="py-2.5 px-4 text-left">DE UBATE A :</th>
                    <th className="py-2.5 px-4 text-right">VALOR</th>
                    {esAdmin && <th className="py-2.5 px-3 text-center">ACCIONES</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {columna1.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-amber-500/5 transition group"
                    >
                      <td className="py-2 px-4 text-slate-200 uppercase font-bold tracking-tight">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{t.destino}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-black text-amber-300 text-sm">
                        ${t.valor.toLocaleString('es-CO')}
                      </td>
                      {esAdmin && (
                        <td className="py-2 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => abrirModalEditar(t)}
                              className="p-1 text-slate-400 hover:text-amber-400 rounded transition"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEliminar(t.id, t.nombre)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Columna Derecha */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-bold">
                    <th className="py-2.5 px-4 text-left">DE UBATE A :</th>
                    <th className="py-2.5 px-4 text-right">VALOR</th>
                    {esAdmin && <th className="py-2.5 px-3 text-center">ACCIONES</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {columna2.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-amber-500/5 transition group"
                    >
                      <td className="py-2 px-4 text-slate-200 uppercase font-bold tracking-tight">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{t.destino}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-black text-amber-300 text-sm">
                        ${t.valor.toLocaleString('es-CO')}
                      </td>
                      {esAdmin && (
                        <td className="py-2 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => abrirModalEditar(t)}
                              className="p-1 text-slate-400 hover:text-amber-400 rounded transition"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEliminar(t.id, t.nombre)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie de Tabla con Tarifa Mínima Reglamentaria */}
          <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase">
              <Coins className="w-4 h-4" />
              <span>TARIFA MÍNIMA ${TARIFA_MINIMA_2026.toLocaleString('es-CO')}</span>
            </div>

            <div className="text-slate-400 text-[11px] flex items-center gap-2">
              <span>Resolución Tarifaria 2026</span>
              <span>•</span>
              <span>SuperTransporte Colombia</span>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA 2: CUADRÍCULA DE TARJETAS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {tarifasFiltradas.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      De Ubaté a:
                    </span>
                    <h3 className="text-base font-black text-white tracking-tight uppercase">
                      {item.destino}
                    </h3>
                  </div>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    ${item.valor.toLocaleString('es-CO')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {item.descripcion || `Ruta intermunicipal autorizada por ${EMPRESA_TRANSPORTE_OFICIAL.nombre}.`}
                </p>
              </div>

              {esAdmin && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => abrirModalEditar(item)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                    title="Editar tarifa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEliminar(item.id, item.nombre)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title="Eliminar tarifa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CREAR / EDITAR TARIFA (SOLO ADMIN)                */}
      {/* ======================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-white mb-1">
              {tarifaEditando ? 'Modificar Tarifa 2026' : 'Nueva Tarifa Oficial'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              RÁPIDO EL CARMEN S.A. • Actualización para toda la provincia.
            </p>

            {errorForm && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorForm}</span>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nombre de la Ruta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ubaté - Carupa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Origen</label>
                  <input
                    type="text"
                    required
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Destino</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Cucunubá"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Valor Oficial del Pasaje (COP)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="100"
                  placeholder="6000"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Observaciones / Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Paradas autorizadas o condiciones..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-450 text-slate-950 rounded-xl font-bold transition disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {guardando ? 'Guardando...' : tarifaEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
