import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Navigation,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Bus,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { RutaTransporte, Tarifa, MUNICIPIOS_VALLE_UBATE, MunicipioUbate } from '../../types';
import { rutasService } from './services/rutasService';
import { tarifasService } from '../tarifas/services/tarifasService';
import { LiveRouteMap } from './components/LiveRouteMap';

interface RutasViewProps {
  onAbrirMapaGeneral?: () => void;
}

export const RutasView: React.FC<RutasViewProps> = () => {
  const coordenadasDestino: Record<string, [number, number]> = {
    carupa: [5.3486, -73.9056],
    'carmen de carupa': [5.3486, -73.9056],
    cucunubá: [5.2575, -73.7431],
    fúquene: [5.4489, -73.8206],
    guachetá: [5.3853, -73.6853],
    lenguazaque: [5.3056, -73.7161],
    simijaca: [5.5028, -73.85],
    susa: [5.454, -73.814],
    sutatausa: [5.2503, -73.8525],
    tausa: [5.1967, -73.8869],
  };

  const generarTrazadoVisible = (destino: string): [number, number][] => {
    const origen: [number, number] = [5.3094, -73.8164];
    const puntoDestino = coordenadasDestino[destino.toLowerCase()] || origen;
    if (puntoDestino === origen) return [origen];
    return [
      origen,
      [Number(((origen[0] + puntoDestino[0]) / 2 + 0.004).toFixed(5)), Number(((origen[1] + puntoDestino[1]) / 2 - 0.003).toFixed(5))],
      puntoDestino,
    ];
  };

  const [rutas, setRutas] = useState<RutaTransporte[]>([]);
  const [vistaActual, setVistaActual] = useState<'tarjetas' | 'mapa'>('tarjetas');
  const [rutaSeleccionada, setRutaSeleccionada] = useState<RutaTransporte | null>(null);
  const [filtroTexto, setFiltroTexto] = useState('');

  // Modal para agregar o editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoRuta, setEditandoRuta] = useState<RutaTransporte | null>(null);

  // Formulario del modal
  const [formNombre, setFormNombre] = useState('');
  const [formOrigen, setFormOrigen] = useState('Ubaté');
  const [formDestino, setFormDestino] = useState('Guachetá');
  const [formHora, setFormHora] = useState('18:00:00');
  const [formVehiculo, setFormVehiculo] = useState('Móvil Cootransubaté');
  const [formTarifa, setFormTarifa] = useState('5000');
  const [formDuracion, setFormDuracion] = useState('30 min');
  const [formConductor, setFormConductor] = useState('Conductor Asignado');
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const mostrarToast = (msg: string) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(null), 3500);
  };

  const recargarRutas = async () => {
    const rutasOperativas = rutasService.obtenerRutas();
    const tarifasOficiales = await tarifasService.obtenerTarifas();
    const rutasPorDestino = new Map(rutasOperativas.map((ruta) => [ruta.destino.toLowerCase(), ruta]));
    const rutasDesdeTarifas: RutaTransporte[] = tarifasOficiales
      .filter((tarifa) => tarifa.activa)
      .map((tarifa) => {
        const rutaExistente = rutasPorDestino.get(tarifa.destino.toLowerCase());
        if (rutaExistente) {
          return { ...rutaExistente, tarifa: tarifa.valor, nombre: tarifa.destino };
        }
        return {
          id: `tarifa_${tarifa.id}`,
          nombre: tarifa.destino,
          origen: tarifa.origen,
          destino: tarifa.destino,
          horaSalida: '--:--:--',
          vehiculo: 'Por asignar',
          placa: 'Por asignar',
          empresa: 'Rápido El Carmen S.A.',
          conductorNombre: 'Por asignar',
          duracionEstimada: 'Consultar',
          distanciaKm: 0,
          tarifa: tarifa.valor,
          frecuenciaMin: 0,
          activa: true,
          coordenadasRuta: generarTrazadoVisible(tarifa.destino),
        };
      });
    const destinosConTarifa = new Set(rutasDesdeTarifas.map((ruta) => ruta.destino.toLowerCase()));
    const rutasCompletas = [
      ...rutasDesdeTarifas,
      ...rutasOperativas.filter((ruta) => !destinosConTarifa.has(ruta.destino.toLowerCase())),
    ];
    setRutas(rutasCompletas);
    if (!rutaSeleccionada && rutasCompletas.length > 0) {
      setRutaSeleccionada(rutasCompletas[0]);
    }
  };

  useEffect(() => {
    void recargarRutas();
  }, []);

  // Abrir modal de creación
  const handleAbrirCrear = () => {
    setEditandoRuta(null);
    setFormNombre('');
    setFormOrigen('Ubaté');
    setFormDestino('Guachetá');
    setFormHora(new Date().toLocaleTimeString('es-CO', { hour12: false }));
    setFormVehiculo('QFZ-098 (Rápido el Carmen)');
    setFormTarifa('6500');
    setFormDuracion('45 min');
    setFormConductor('Carlos Rodríguez');
    setModalAbierto(true);
  };

  // Abrir modal de edición
  const handleAbrirEditar = (r: RutaTransporte) => {
    setEditandoRuta(r);
    setFormNombre(r.nombre);
    setFormOrigen(r.origen);
    setFormDestino(r.destino);
    setFormHora(r.horaSalida);
    setFormVehiculo(r.vehiculo);
    setFormTarifa(String(r.tarifa));
    setFormDuracion(r.duracionEstimada);
    setFormConductor(r.conductorNombre);
    setModalAbierto(true);
  };

  // Eliminar ruta
  const handleEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la ruta a "${nombre}"?`)) {
      rutasService.eliminarRuta(id);
      void recargarRutas();
      mostrarToast(`Ruta a "${nombre}" eliminada correctamente.`);
    }
  };

  // Guardar formulario
  const handleGuardarForm = (e: React.FormEvent) => {
    e.preventDefault();
    const nueva = rutasService.guardarRuta({
      id: editandoRuta?.id,
      nombre: formNombre.trim() || formDestino,
      origen: formOrigen,
      destino: formDestino,
      horaSalida: formHora,
      vehiculo: formVehiculo,
      placa: formVehiculo.split(' ')[0] || 'UBT-101',
      conductorNombre: formConductor,
      duracionEstimada: formDuracion,
      tarifa: Number(formTarifa) || 5000,
      activa: true,
    });

    void recargarRutas();
    setModalAbierto(false);
    mostrarToast(editandoRuta ? 'Ruta actualizada con éxito.' : 'Nueva ruta creada con éxito.');
  };

  // Ver trayecto en mapa
  const handleVerEnMapa = (ruta: RutaTransporte) => {
    setRutaSeleccionada(ruta);
    setVistaActual('mapa');
  };

  const rutasFiltradas = rutas.filter(
    (r) =>
      r.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      r.destino.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      r.origen.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Toast flotante */}
      {toastMensaje && (
        <div className="fixed top-16 right-4 z-50 cheems-glass px-4 py-2.5 rounded-2xl border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMensaje}</span>
        </div>
      )}

      {/* Encabezado y Barra de Acciones (Foto 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Rutas de Transporte</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Consulta, navega en Google Maps y administra las rutas disponibles
          </p>
        </div>

        {/* Acción principal del encabezado */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAbrirCrear}
            className="px-3.5 py-1.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Ruta</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VISTA 1: MODO TARJETAS (Foto 2) */}
      {/* ========================================================= */}
      {vistaActual === 'tarjetas' && (
        <div className="space-y-4">
          {/* Buscador de rutas móvil */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Buscar por municipio (Sutatausa, Guachetá...)"
              className="w-full bg-slate-950/70 border border-cyan-500/20 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Lista de rutas */}
          <div className="space-y-2">
            {rutasFiltradas.map((ruta) => (
              <div
                key={ruta.id}
                className="cheems-glass w-full min-w-0 overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col lg:flex-row lg:items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group"
              >
                <div className="min-w-0 w-full flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                      {ruta.nombre}
                    </h3>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold shrink-0">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{ruta.horaSalida}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-1.5 text-xs text-slate-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className="text-slate-400">Desde</span>
                      <strong className="text-white">{ruta.origen}</strong>
                    </div>
                    <ArrowRight className="hidden h-3.5 w-3.5 text-slate-600 sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="text-slate-400">Hasta</span>
                      <strong className="text-cyan-300">{ruta.destino}</strong>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-cyan-500/15 pt-2 text-[11px] text-slate-400">
                    <span className="max-w-[45%] truncate">{ruta.vehiculo}</span>
                    <span className="whitespace-nowrap">{ruta.duracionEstimada}</span>
                    <span className="whitespace-nowrap text-cyan-300">Cada {ruta.frecuenciaMin} min</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${ruta.tarifa.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 border-t border-cyan-500/15 pt-3 lg:w-44 lg:shrink-0 lg:border-0 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => handleVerEnMapa(ruta)}
                    className="w-full min-w-0 whitespace-nowrap py-2 px-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <span>Ver mapa</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAbrirEditar(ruta)}
                    className="min-w-0 whitespace-nowrap py-2 px-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-[11px] sm:text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-cyan-400" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEliminar(ruta.id, ruta.nombre)}
                    className="min-w-0 whitespace-nowrap py-2 px-2.5 rounded-xl bg-slate-950/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-[11px] sm:text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rutasFiltradas.length === 0 && (
            <div className="text-center py-12 cheems-glass rounded-3xl border border-cyan-500/20">
              <Bus className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No se encontraron rutas con ese criterio.</p>
              <button
                onClick={() => setFiltroTexto('')}
                className="mt-2 text-xs text-cyan-400 font-bold hover:underline"
              >
                Limpiar filtro de búsqueda
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: MODO GOOGLE MAPS / TRAYECTO EN VIVO (Foto 3) */}
      {/* ========================================================= */}
      {vistaActual === 'mapa' && rutaSeleccionada && (
        <LiveRouteMap
          rutaSeleccionada={rutaSeleccionada}
          onVolverTarjetas={() => setVistaActual('tarjetas')}
          onSeleccionarRuta={(r) => setRutaSeleccionada(r)}
          todasLasRutas={rutas}
        />
      )}

      {/* Modal para Crear o Editar Ruta */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="cheems-glass rounded-3xl max-w-md w-full p-6 border border-cyan-500/40 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{editandoRuta ? 'Editar Ruta Intermunicipal' : 'Nueva Ruta de Transporte'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardarForm} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                  Nombre de la Ruta
                </label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: Guachetá Expreso"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                    Origen
                  </label>
                  <select
                    value={formOrigen}
                    onChange={(e) => setFormOrigen(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {MUNICIPIOS_VALLE_UBATE.map((m) => (
                      <option key={m.id} value={m.nombre}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                    Destino
                  </label>
                  <select
                    value={formDestino}
                    onChange={(e) => setFormDestino(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {MUNICIPIOS_VALLE_UBATE.map((m) => (
                      <option key={m.id} value={m.nombre}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                    Hora de Salida
                  </label>
                  <input
                    type="text"
                    value={formHora}
                    onChange={(e) => setFormHora(e.target.value)}
                    placeholder="20:04:00"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                    Tarifa (COP)
                  </label>
                  <input
                    type="number"
                    value={formTarifa}
                    onChange={(e) => setFormTarifa(e.target.value)}
                    placeholder="6500"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cyan-300 uppercase mb-1">
                  Vehículo y Empresa
                </label>
                <input
                  type="text"
                  value={formVehiculo}
                  onChange={(e) => setFormVehiculo(e.target.value)}
                  placeholder="QFZ-098 (Rápido el Carmen)"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  {editandoRuta ? 'Guardar Cambios' : 'Crear Ruta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
