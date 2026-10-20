import { NotificacionItem } from '../types';

const STORAGE_KEY = 'transimovil_notificaciones_v1';

const NOTIFICACIONES_INICIALES: NotificacionItem[] = [
  {
    id: 'notif_1',
    titulo: 'Bienvenido(a) a TransiMóvil',
    mensaje: 'Tu cuenta ha sido creada. Recuerda verificar tu correo electrónico para acceder sin restricciones.',
    tipo: 'SISTEMA',
    leida: false,
    fecha: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_2',
    titulo: 'Actualización en Ruta Troncal',
    mensaje: 'Se han incorporado 4 buses biarticulados de refuerzo en el corredor Norte.',
    tipo: 'SISTEMA',
    leida: true,
    fecha: new Date(Date.now() - 86400000).toISOString(),
  },
];

type Listener = (notificaciones: NotificacionItem[]) => void;
const listeners: Set<Listener> = new Set();

function getStored(): NotificacionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTIFICACIONES_INICIALES));
      return NOTIFICACIONES_INICIALES;
    }
    return JSON.parse(raw);
  } catch {
    return NOTIFICACIONES_INICIALES;
  }
}

function save(items: NotificacionItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    listeners.forEach((fn) => fn(items));
  } catch (e) {
    console.error('Error guardando notificaciones:', e);
  }
}

export const notificationService = {
  obtenerTodas(): NotificacionItem[] {
    return getStored();
  },

  suscribir(listener: Listener): () => void {
    listeners.add(listener);
    listener(getStored());
    return () => {
      listeners.delete(listener);
    };
  },

  agregar(notif: Omit<NotificacionItem, 'id' | 'fecha' | 'leida'>): NotificacionItem {
    const items = getStored();
    const nueva: NotificacionItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      fecha: new Date().toISOString(),
      leida: false,
    };
    const actualizados = [nueva, ...items];
    save(actualizados);
    return nueva;
  },

  marcarComoLeida(id: string) {
    const items = getStored().map((item) =>
      item.id === id ? { ...item, leida: true } : item
    );
    save(items);
  },

  marcarTodasComoLeidas() {
    const items = getStored().map((item) => ({ ...item, leida: true }));
    save(items);
  },

  contarNoLeidas(): number {
    return getStored().filter((n) => !n.leida).length;
  },
};
