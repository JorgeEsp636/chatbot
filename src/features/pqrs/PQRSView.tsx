import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Plus,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Send,
  MessageSquare,
  X,
  Search,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { PQRS, TipoPQRS, EstadoPQRS, AdjuntoPQRS, Usuario } from '../../types';
import { pqrsService } from './services/pqrsService';

interface PQRSViewProps {
  usuario: Usuario;
}

export const PQRSView: React.FC<PQRSViewProps> = ({ usuario }) => {
  const [listaPQRS, setListaPQRS] = useState<PQRS[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState<PQRS | null>(null);

  // Formulario de creación
  const [tipo, setTipo] = useState<TipoPQRS>('PETICION');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<AdjuntoPQRS[]>([]);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Formulario administrativo para responder/cambiar estado
  const [nuevoEstadoAdmin, setNuevoEstadoAdmin] = useState<EstadoPQRS>('EN_REVISION');
  const [respuestaAdmin, setRespuestaAdmin] = useState('');
  const [actualizandoAdmin, setActualizandoAdmin] = useState(false);
  const [adminMensajeFeedback, setAdminMensajeFeedback] = useState<string | null>(null);

  useEffect(() => {
    const desuscribir = pqrsService.suscribir(() => {
      const items = pqrsService.obtenerPorUsuario(usuario.id, usuario.rol);
      setListaPQRS(items);
      setCargando(false);
    });

    return () => desuscribir();
  }, [usuario.id, usuario.rol]);

  // Manejo de adjuntos con validación Firebase Storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorForm(null);
    const file = files[0];

    const validacion = pqrsService.validarArchivo({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validacion.valido) {
      setErrorForm(validacion.error || 'Archivo no permitido');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nuevoAdjunto: AdjuntoPQRS = {
        id: `adj_${Date.now()}`,
        nombre: file.name,
        tipo: file.type.startsWith('image/') ? 'imagen' : 'pdf',
        tamanioBytes: file.size,
        url: URL.createObjectURL(file),
        dataUrl: reader.result as string,
      };

      setArchivosAdjuntos((prev) => [...prev, nuevoAdjunto]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverAdjunto = (id: string) => {
    setArchivosAdjuntos((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCrearPQRS = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm(null);
    setGuardando(true);

    try {
      await pqrsService.crear({
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        usuarioEmail: usuario.email,
        tipo,
        asunto,
        descripcion,
        adjuntosDetalle: archivosAdjuntos,
      });

      // Reset
      setAsunto('');
      setDescripcion('');
      setArchivosAdjuntos([]);
      setModalCrearAbierto(false);
    } catch (err: any) {
      setErrorForm(err.message || 'Error al radicar PQRS.');
    } finally {
      setGuardando(false);
    }
  };

  const handleAdminUpdate = async () => {
    if (!modalDetalle) return;
    setActualizandoAdmin(true);
    setAdminMensajeFeedback(null);

    try {
      const actualizada = await pqrsService.actualizarEstado(
        modalDetalle.id,
        nuevoEstadoAdmin,
        respuestaAdmin.trim() || undefined
      );
      setModalDetalle(actualizada);
      setAdminMensajeFeedback(`✓ Solicitud actualizada a estado ${nuevoEstadoAdmin} exitosamente.`);
    } catch (err: any) {
      setAdminMensajeFeedback(err.message || 'Error al actualizar PQRS.');
    } finally {
      setActualizandoAdmin(false);
    }
  };

  // Filtrado de lista
  const pqrsFiltradas = listaPQRS.filter((item) => {
    const coincideTexto =
      item.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.id.toLowerCase().includes(busqueda.toLowerCase());

    if (!coincideTexto) return false;
    if (filtroTipo !== 'TODOS' && item.tipo !== filtroTipo) return false;
    if (filtroEstado !== 'TODOS' && item.estado !== filtroEstado) return false;
    return true;
  });

  const getEstadoBadge = (estado: EstadoPQRS) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'EN_REVISION':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'RESPONDIDA':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'CERRADA':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Atención al Ciudadano & PQRS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Peticiones, Quejas y Reclamos</h1>
          <p className="text-xs text-slate-400 mt-1">
            Radica solicitudes, adjunta evidencias con Firebase Storage y recibe seguimiento oficial en tiempo real.
          </p>
        </div>

        <button
          onClick={() => setModalCrearAbierto(true)}
          className="py-3 px-5 bg-amber-600 hover:bg-amber-500 active:scale-[0.99] text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Radicar Nueva PQRS</span>
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por radicado, asunto o contenido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium py-2.5 px-3 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="PETICION">Petición</option>
            <option value="QUEJA">Queja</option>
            <option value="RECLAMO">Reclamo</option>
            <option value="SUGERENCIA">Sugerencia</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium py-2.5 px-3 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="RESPONDIDA">Respondida</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>
      </div>

      {/* Listado de PQRS */}
      {cargando ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Consultando registros en Firestore...</p>
        </div>
      ) : pqrsFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
          <FileQuestion className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <h3 className="text-sm font-semibold text-white">No hay solicitudes registradas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {busqueda ? 'Ningún registro coincide con los filtros seleccionados.' : 'No tienes PQRS radicadas en el sistema actualmente.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pqrsFiltradas.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setModalDetalle(item);
                setNuevoEstadoAdmin(item.estado);
                setRespuestaAdmin(item.respuestaOficial || '');
              }}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{item.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {item.tipo}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getEstadoBadge(item.estado)}`}>
                    {item.estado.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white truncate group-hover:text-amber-400 transition">
                  {item.asunto}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {item.descripcion}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] block text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {item.adjuntos.length > 0 && (
                    <span className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
                      <Paperclip className="w-3 h-3" /> {item.adjuntos.length} adjunto(s)
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Creación de PQRS */}
      {modalCrearAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Radicar Nueva PQRS</h3>
              <button
                onClick={() => setModalCrearAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Tu requerimiento será asignado al área técnica correspondiente para respuesta formal.
            </p>

            {errorForm && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorForm}</span>
              </div>
            )}

            <form onSubmit={handleCrearPQRS} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tipo de Requerimiento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA'] as TipoPQRS[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipo(t)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition text-center ${
                        tipo === t
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asunto del Requerimiento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cobro indebido en torniquete estación Norte"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Descripción Detallada
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detalla fecha, hora, número de móvil o placa, estación y relato de los hechos..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subida de adjuntos (Firebase Storage) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Archivos Adjuntos (Firebase Storage: Imágenes o PDF &le; 10 MB)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Seleccionar Archivo</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">Máximo 10 MB</span>
                </div>

                {archivosAdjuntos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {archivosAdjuntos.map((adj) => (
                      <div
                        key={adj.id}
                        className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {adj.tipo === 'imagen' ? (
                            <ImageIcon className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="text-slate-200 truncate">{adj.nombre}</span>
                          <span className="text-slate-500 text-[10px]">
                            ({(adj.tamanioBytes / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoverAdjunto(adj.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalCrearAbierto(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{guardando ? 'Radicando...' : 'Enviar PQRS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle de PQRS */}
      {modalDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Radicado: #{modalDetalle.id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEstadoBadge(modalDetalle.estado)}`}>
                    {modalDetalle.estado.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{modalDetalle.asunto}</h3>
              </div>
              <button
                onClick={() => setModalDetalle(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3 text-slate-400">
                <div>
                  <span className="text-slate-500 block">Ciudadano solicitante:</span>
                  <strong className="text-slate-200">{modalDetalle.usuarioNombre}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Correo electrónico:</span>
                  <strong className="text-slate-200">{modalDetalle.usuarioEmail}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha de radicación:</span>
                  <strong className="text-slate-200">
                    {new Date(modalDetalle.createdAt).toLocaleString('es-CO')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Última actualización:</span>
                  <strong className="text-slate-200">
                    {new Date(modalDetalle.updatedAt).toLocaleString('es-CO')}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Descripción del Requerimiento</h4>
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed">
                  {modalDetalle.descripcion}
                </div>
              </div>

              {/* Adjuntos en detalle */}
              {modalDetalle.adjuntosDetalle && modalDetalle.adjuntosDetalle.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">Archivos Adjuntos (Firebase Storage)</h4>
                  <div className="space-y-2">
                    {modalDetalle.adjuntosDetalle.map((adj) => (
                      <div
                        key={adj.id}
                        className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          {adj.tipo === 'imagen' ? (
                            <ImageIcon className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="text-slate-200">{adj.nombre}</span>
                        </div>
                        {adj.dataUrl && adj.tipo === 'imagen' ? (
                          <img
                            src={adj.dataUrl}
                            alt="preview"
                            className="w-8 h-8 rounded object-cover border border-slate-700"
                          />
                        ) : (
                          <span className="text-[10px] text-blue-400 font-semibold uppercase">PDF</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Respuesta Oficial */}
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Respuesta Oficial del Ente Gestor</h4>
                <div
                  className={`p-3.5 rounded-2xl border leading-relaxed ${
                    modalDetalle.respuestaOficial
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500 italic'
                  }`}
                >
                  {modalDetalle.respuestaOficial ||
                    'Este radicado se encuentra actualmente en curso de evaluación técnica por el operador de control de flota.'}
                </div>
              </div>

              {/* Panel de control de administrador si el usuario tiene rol de administrador */}
              {usuario.rol === 'administrador' && (
                <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950 p-4 rounded-2xl border">
                  <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Panel de Control de Administrador (Roles & Custom Claims)</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Modificar Estado</label>
                      <select
                        value={nuevoEstadoAdmin}
                        onChange={(e) => setNuevoEstadoAdmin(e.target.value as EstadoPQRS)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_REVISION">EN_REVISION</option>
                        <option value="RESPONDIDA">RESPONDIDA</option>
                        <option value="CERRADA">CERRADA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Redactar Respuesta Oficial</label>
                      <textarea
                        rows={2}
                        value={respuestaAdmin}
                        onChange={(e) => setRespuestaAdmin(e.target.value)}
                        placeholder="Escribe la resolución o respuesta formal para el ciudadano..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs"
                      />
                    </div>

                    {adminMensajeFeedback && (
                      <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-200 text-xs font-semibold">
                        {adminMensajeFeedback}
                      </div>
                    )}

                    <button
                      onClick={handleAdminUpdate}
                      disabled={actualizandoAdmin}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      {actualizandoAdmin ? 'Actualizando...' : 'Actualizar Estado y Notificar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
