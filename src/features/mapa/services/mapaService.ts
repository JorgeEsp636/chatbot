import { UbicacionConductor } from '../../../types';
import { calcularDistanciaHaversine } from '../../../services/directionsService';

const UBICACION_CONDUCTOR_KEY = 'transimovil_ubicacion_conductor_ubate_v2';

// Coordenadas base (Provincia de Valle de Ubaté: Ubaté - Carmen de Carupa)
export const COORDENADAS_DEFAULT = {
  pasajero: {
    lat: 5.3094,
    lng: -73.8164,
    nombre: 'Terminal de Transportes / Parque Principal (Ubaté)',
  },
  conductorInicial: {
    lat: 5.3340,
    lng: -73.8320,
    nombre: 'Móvil 104 Cootransubaté (Vía Carupa - Ubaté)',
  },
};

const UBICACION_CONDUCTOR_DEFAULT: UbicacionConductor = {
  conductorId: 'cond_ubate_01',
  conductorNombre: 'Don Gonzalo Briceño Méndez',
  vehiculo: 'Microbús Intermunicipal Cootransubaté',
  placa: 'WOH-321',
  latitude: COORDENADAS_DEFAULT.conductorInicial.lat,
  longitude: COORDENADAS_DEFAULT.conductorInicial.lng,
  heading: 145,
  speed: 38.0,
  updatedAt: new Date().toISOString(),
  activo: true,
};

type UbicacionSnapshotCallback = (ubicacion: UbicacionConductor | null) => void;
const subscribers: Set<UbicacionSnapshotCallback> = new Set();

function getStoredUbicacion(): UbicacionConductor | null {
  try {
    const raw = localStorage.getItem(UBICACION_CONDUCTOR_KEY);
    if (!raw) {
      localStorage.setItem(UBICACION_CONDUCTOR_KEY, JSON.stringify(UBICACION_CONDUCTOR_DEFAULT));
      return UBICACION_CONDUCTOR_DEFAULT;
    }
    return JSON.parse(raw);
  } catch {
    return UBICACION_CONDUCTOR_DEFAULT;
  }
}

function persistAndBroadcast(ubicacion: UbicacionConductor | null) {
  if (ubicacion) {
    localStorage.setItem(UBICACION_CONDUCTOR_KEY, JSON.stringify(ubicacion));
  } else {
    localStorage.removeItem(UBICACION_CONDUCTOR_KEY);
  }
  subscribers.forEach((cb) => cb(ubicacion));
}

export const mapaService = {
  /**
   * Suscripción en tiempo real de la ubicación del conductor (onSnapshot)
   */
  escucharUbicacionConductor(callback: UbicacionSnapshotCallback): () => void {
    subscribers.add(callback);
    callback(getStoredUbicacion());

    const storageListener = (e: StorageEvent) => {
      if (e.key === UBICACION_CONDUCTOR_KEY) {
        callback(getStoredUbicacion());
      }
    };
    window.addEventListener('storage', storageListener);

    return () => {
      subscribers.delete(callback);
      window.removeEventListener('storage', storageListener);
    };
  },

  /**
   * Actualizar ubicación del conductor en Firestore cada 5 segundos
   */
  async actualizarUbicacionConductor(datos: Partial<UbicacionConductor>): Promise<UbicacionConductor> {
    const actual = getStoredUbicacion() || UBICACION_CONDUCTOR_DEFAULT;

    // Solo guardar si hay cambio geográfico apreciable o cambio de estado
    if (
      datos.latitude !== undefined &&
      datos.longitude !== undefined &&
      calcularDistanciaHaversine(actual.latitude, actual.longitude, datos.latitude, datos.longitude) < 0.002 &&
      datos.activo === actual.activo
    ) {
      return actual; // No enviar datos innecesarios si la distancia es mínima
    }

    const nuevaUbicacion: UbicacionConductor = {
      ...actual,
      ...datos,
      updatedAt: new Date().toISOString(),
    };

    persistAndBroadcast(nuevaUbicacion);
    return nuevaUbicacion;
  },

  /**
   * Cambiar estado de transmisión del conductor
   */
  async setConductorActivo(activo: boolean): Promise<void> {
    const actual = getStoredUbicacion() || UBICACION_CONDUCTOR_DEFAULT;
    const actualizado = {
      ...actual,
      activo,
      updatedAt: new Date().toISOString(),
    };
    persistAndBroadcast(actualizado);
  },

  /**
   * Solicita permisos de ubicación nativos de navegador/dispositivo
   */
  async obtenerUbicacionGPS(): Promise<{ lat: number; lng: number; speed?: number; heading?: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no es compatible con este dispositivo o navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            speed: position.coords.speed ? Number((position.coords.speed * 3.6).toFixed(1)) : 25,
            heading: position.coords.heading || 180,
          });
        },
        (error) => {
          let mensaje = 'Error al obtener coordenadas GPS.';
          if (error.code === error.PERMISSION_DENIED) {
            mensaje = 'Permiso de ubicación denegado por el usuario.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            mensaje = 'Señal GPS no disponible actualmente.';
          } else if (error.code === error.TIMEOUT) {
            mensaje = 'Tiempo de espera de señal GPS agotado.';
          }
          reject(new Error(mensaje));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  },
};
