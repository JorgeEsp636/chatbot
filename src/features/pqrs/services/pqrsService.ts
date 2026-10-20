import { PQRS, TipoPQRS, EstadoPQRS, AdjuntoPQRS } from '../../../types';
import { notificationService } from '../../../services/notificationService';

const PQRS_STORAGE_KEY = 'cheems_pqrs_valle_ubate_v2';

const PQRS_INICIALES: PQRS[] = [
  {
    id: 'pqrs_98421',
    usuarioId: 'usr_cheems_01',
    usuarioNombre: 'Camila Andrea Pachón Robayo',
    usuarioEmail: 'camila.pachon@valledeubate.transimovil.gov.co',
    tipo: 'PETICION',
    asunto: 'Horarios de despacho en la ruta Ubaté - Carmen de Carupa',
    descripcion: 'Solicito conocer los horarios de despacho matutinos de microbuses de Rápido El Carmen S.A. desde el terminal de Ubaté hacia Carmen de Carupa para estudiantes universitarios.',
    estado: 'RESPONDIDA',
    adjuntos: [],
    adjuntosDetalle: [],
    respuestaOficial: 'Los despachos inician a las 05:30 AM con frecuencias cada 20 minutos desde la plataforma 2 de la Terminal de Ubaté operados por Rápido El Carmen S.A.',
    createdAt: '2026-01-14T08:00:00.000Z',
    updatedAt: '2026-01-14T10:30:00.000Z',
  },
  {
    id: 'pqrs_98422',
    usuarioId: 'usr_cheems_01',
    usuarioNombre: 'Camila Andrea Pachón Robayo',
    usuarioEmail: 'camila.pachon@valledeubate.transimovil.gov.co',
    tipo: 'PETICION',
    asunto: 'Verificación de tarifa reglamentaria 2026 hacia Cucunubá',
    descripcion: 'Quisiera confirmar si el valor oficial del pasaje hacia Cucunubá es de $5.400 COP según la planilla autorizada para este año 2026.',
    estado: 'EN_REVISION',
    adjuntos: [],
    adjuntosDetalle: [],
    respuestaOficial: 'Correcto, la tarifa oficial vigente según la planilla 2026 fijada por Rápido El Carmen S.A. y la autoridad de tránsito es de $5.400 COP.',
    createdAt: '2026-01-10T11:20:00.000Z',
    updatedAt: '2026-01-12T15:45:00.000Z',
  },
];

type PQRSListener = (items: PQRS[]) => void;
const subscribers: Set<PQRSListener> = new Set();

function getStoredPQRS(): PQRS[] {
  try {
    const raw = localStorage.getItem(PQRS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PQRS_STORAGE_KEY, JSON.stringify(PQRS_INICIALES));
      return PQRS_INICIALES;
    }
    return JSON.parse(raw);
  } catch {
    return PQRS_INICIALES;
  }
}

function persistAndBroadcast(items: PQRS[]) {
  localStorage.setItem(PQRS_STORAGE_KEY, JSON.stringify(items));
  subscribers.forEach((cb) => cb(items));
}

export const pqrsService = {
  async obtenerTodas(): Promise<PQRS[]> {
    return getStoredPQRS();
  },

  async responderPQRS(id: string, respuestaOficial: string, nuevoEstado: EstadoPQRS = 'RESPONDIDA'): Promise<PQRS> {
    return this.actualizarEstado(id, nuevoEstado, respuestaOficial);
  },

  suscribir(callback: PQRSListener): () => void {
    subscribers.add(callback);
    callback(getStoredPQRS());
    return () => {
      subscribers.delete(callback);
    };
  },

  obtenerPorUsuario(usuarioId: string, rol?: string): PQRS[] {
    const todos = getStoredPQRS();
    if (rol === 'administrador') {
      return todos;
    }
    return todos.filter((item) => item.usuarioId === usuarioId);
  },

  async crear(datos: {
    usuarioId: string;
    usuarioNombre: string;
    usuarioEmail: string;
    tipo: TipoPQRS;
    asunto: string;
    descripcion: string;
    adjuntosDetalle?: AdjuntoPQRS[];
  }): Promise<PQRS> {
    if (!datos.asunto.trim()) throw new Error('El asunto del requerimiento es obligatorio.');
    if (!datos.descripcion.trim()) throw new Error('Debe proporcionar una descripción detallada.');
    if (datos.descripcion.trim().length < 15) {
      throw new Error('La descripción debe contener al menos 15 caracteres.');
    }

    const nueva: PQRS = {
      id: `pqrs_${Date.now()}`,
      usuarioId: datos.usuarioId,
      usuarioNombre: datos.usuarioNombre,
      usuarioEmail: datos.usuarioEmail,
      tipo: datos.tipo,
      asunto: datos.asunto.trim(),
      descripcion: datos.descripcion.trim(),
      estado: 'PENDIENTE',
      adjuntos: datos.adjuntosDetalle?.map((a) => a.nombre) || [],
      adjuntosDetalle: datos.adjuntosDetalle || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const actual = getStoredPQRS();
    const actualizado = [nueva, ...actual];
    persistAndBroadcast(actualizado);

    // Disparar notificación automática al usuario
    notificationService.agregar({
      titulo: `PQRS Recibida (#${nueva.id.slice(-5)})`,
      mensaje: `Tu ${nueva.tipo.toLowerCase()} fue recibida correctamente y está en estado PENDIENTE.`,
      tipo: 'PQRS_CREADA',
      pqrsId: nueva.id,
    });

    return nueva;
  },

  async actualizarEstado(id: string, nuevoEstado: EstadoPQRS, respuestaOficial?: string): Promise<PQRS> {
    const actual = getStoredPQRS();
    const index = actual.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('PQRS no encontrada.');

    const anterior = actual[index];
    const modificada: PQRS = {
      ...anterior,
      estado: nuevoEstado,
      respuestaOficial: respuestaOficial !== undefined ? respuestaOficial : anterior.respuestaOficial,
      updatedAt: new Date().toISOString(),
    };

    actual[index] = modificada;
    persistAndBroadcast([...actual]);

    // Mensajes amigables de notificación
    const mensajesNotif: Record<EstadoPQRS, string> = {
      PENDIENTE: 'Tu PQRS está a la espera de ser asignada.',
      EN_REVISION: 'Tu PQRS está siendo revisada por el equipo de control.',
      RESPONDIDA: 'Tu PQRS ha sido respondida formalmente.',
      CERRADA: 'Tu PQRS fue cerrada satisfactoriamente.',
    };

    notificationService.agregar({
      titulo: `Estado de PQRS: ${nuevoEstado}`,
      mensaje: mensajesNotif[nuevoEstado],
      tipo: 'PQRS_ACTUALIZADA',
      pqrsId: id,
    });

    return modificada;
  },

  /**
   * Validación de archivos para subida a Firebase Storage
   */
  validarArchivo(archivo: { name: string; size: number; type: string }): { valido: boolean; error?: string } {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (archivo.size > MAX_SIZE) {
      return { valido: false, error: 'El archivo excede el tamaño máximo permitido de 10 MB.' };
    }

    const extensionValida = /\.(jpg|jpeg|png|webp|pdf)$/i.test(archivo.name);
    const tipoMimeValido =
      archivo.type.startsWith('image/') || archivo.type === 'application/pdf';

    if (!extensionValida && !tipoMimeValido) {
      return { valido: false, error: 'Solo se permiten archivos en formato de imagen (PNG, JPG, WebP) o documentos PDF.' };
    }

    return { valido: true };
  },
};
