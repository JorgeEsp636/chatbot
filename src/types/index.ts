export type Rol = 'usuario' | 'conductor' | 'administrador';

export type MunicipioUbate =
  | 'Ubaté'
  | 'Carmen de Carupa'
  | 'Cucunubá'
  | 'Fúquene'
  | 'Guachetá'
  | 'Lenguazaque'
  | 'Simijaca'
  | 'Susa'
  | 'Sutatausa'
  | 'Tausa';

export const MUNICIPIOS_VALLE_UBATE: { id: MunicipioUbate; nombre: string; descripcion: string }[] = [
  { id: 'Ubaté', nombre: 'Villa de San Diego de Ubaté', descripcion: 'Capital lechera de Colombia y centro de la provincia' },
  { id: 'Carmen de Carupa', nombre: 'Carmen de Carupa', descripcion: 'Cuna de aguas y páramos vírgenes' },
  { id: 'Cucunubá', nombre: 'Cucunubá', descripcion: 'Pueblo artesanal y tradición textil' },
  { id: 'Fúquene', nombre: 'Fúquene', descripcion: 'Santuario lacustre de la Laguna de Fúquene' },
  { id: 'Guachetá', nombre: 'Guachetá', descripcion: 'Tierra minera y ganadera' },
  { id: 'Lenguazaque', nombre: 'Lenguazaque', descripcion: 'Corazón hullero y carbonífero' },
  { id: 'Simijaca', nombre: 'Simijaca', descripcion: 'Valle fértil de la frontera cundiboyacense' },
  { id: 'Susa', nombre: 'Susa', descripcion: 'Mirador del valle y colinas agrícolas' },
  { id: 'Sutatausa', nombre: 'Sutatausa', descripcion: 'Tierra de los Farallones y arte rupestre' },
  { id: 'Tausa', nombre: 'Tausa', descripcion: 'Puerta sur del valle y embalse del Neusa' },
];

/**
 * Esquema Firestore: usuarios/{uid}
 */
export interface UsuarioDocument {
  id: string; // uid de Firebase Auth
  nombre: string;
  email: string;
  rol: Rol;
  createdAt: string;
  // Campos complementarios del perfil
  emailVerified?: boolean;
  documento?: string;
  tipoDocumento?: 'CC' | 'TI' | 'CE' | 'PAS';
  municipio?: MunicipioUbate;
  empresaTransporte?: string;
  telefono?: string;
  saldoTarjeta: number;
  fcmToken?: string;
  disponible?: boolean; // Para conductores
  movilAsignado?: string; // Para conductores
  placa?: string; // Para conductores
  rutaAsignada?: string; // Para conductores
  updatedAt?: string;
}

// Alias para compatibilidad
export type Usuario = UsuarioDocument;

export interface RutaTransporte {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
  horaSalida: string;
  vehiculo: string;
  placa: string;
  empresa: string;
  conductorNombre: string;
  duracionEstimada: string;
  distanciaKm: number;
  tarifa: number;
  frecuenciaMin: number;
  activa: boolean;
  coordenadasRuta: [number, number][];
}

export interface BusFlota {
  id: string;
  placa: string;
  numeroInterno: string;
  empresa: string;
  modelo: string;
  capacidadPasajeros: number;
  conductorAsignado: string;
  rutaActual: string;
  estado: 'EN_RUTA' | 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVO';
  latitud: number;
  longitud: number;
  velocidadKmH: number;
  calificacion: number;
  aireAcondicionado: boolean;
  wifi: boolean;
}

export interface Tarifa {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
  valor: number;
  descripcion?: string;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UbicacionConductor {
  conductorId: string;
  conductorNombre: string;
  vehiculo: string;
  placa: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  updatedAt: string;
  activo: boolean;
  ruta?: string;
}

export type TipoPQRS = 'PETICION' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA';
export type EstadoPQRS = 'PENDIENTE' | 'EN_REVISION' | 'RESPONDIDA' | 'CERRADA';

export interface AdjuntoPQRS {
  id: string;
  nombre: string;
  tipo: 'imagen' | 'pdf' | string;
  tamanioBytes: number;
  url: string;
  dataUrl?: string;
}

export interface PQRS {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  tipo: TipoPQRS;
  asunto: string;
  descripcion: string;
  estado: EstadoPQRS;
  adjuntos: string[];
  adjuntosDetalle?: AdjuntoPQRS[];
  respuestaOficial?: string;
  respondidoPor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificacionItem {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'PQRS_CREADA' | 'PQRS_ACTUALIZADA' | 'SISTEMA';
  leida: boolean;
  fecha: string;
  pqrsId?: string;
}

export interface RutaDirections {
  coordenadas: [number, number][];
  distanciaKm: number;
  duracionMin: number;
  origenNombre: string;
  destinoNombre: string;
  instrucciones?: string[];
}
