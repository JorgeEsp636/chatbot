import { UsuarioDocument, Rol, Tarifa, UbicacionConductor, PQRS } from '../../types';

const FIRESTORE_USERS_KEY = 'cheems_firestore_usuarios_v2';

// Sin cuentas semilladas de prueba; el sistema debe trabajar con usuarios reales registrados.
const USUARIOS_FIRESTORE_SEED: Record<string, UsuarioDocument> = {};

function getStoredFirestoreUsers(): Record<string, UsuarioDocument> {
  try {
    const raw = localStorage.getItem(FIRESTORE_USERS_KEY);
    let parsed: Record<string, UsuarioDocument>;
    if (!raw) {
      parsed = { ...USUARIOS_FIRESTORE_SEED };
    } else {
      parsed = JSON.parse(raw);
    }

    // Sincronizar automáticamente las cuentas semilla con las definiciones del código
    Object.keys(USUARIOS_FIRESTORE_SEED).forEach((key) => {
      parsed[key] = {
        ...parsed[key],
        ...USUARIOS_FIRESTORE_SEED[key],
      };
    });

    localStorage.setItem(FIRESTORE_USERS_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return { ...USUARIOS_FIRESTORE_SEED };
  }
}

function saveStoredFirestoreUsers(users: Record<string, UsuarioDocument>) {
  localStorage.setItem(FIRESTORE_USERS_KEY, JSON.stringify(users));
}

export const firestoreService = {
  /**
   * Obtiene el documento en Firestore en la ruta: usuarios/{uid}
   */
  async getUsuarioDocument(uid: string): Promise<UsuarioDocument | null> {
    // Simulación de latencia de red de Firestore (150ms)
    await new Promise((r) => setTimeout(r, 120));

    if (!uid) {
      throw new Error('El UID de usuario es requerido para consultar Firestore.');
    }

    const users = getStoredFirestoreUsers();
    const userDoc = users[uid];

    if (!userDoc) {
      // Manejo de caso: Usuario sin documento en Firestore
      return null;
    }

    // Validar integridad del rol
    if (!['usuario', 'conductor', 'administrador'].includes(userDoc.rol)) {
      console.warn(`Rol inválido detectado en Firestore para UID ${uid}: ${userDoc.rol}. Ajustando a 'usuario'.`);
      userDoc.rol = 'usuario';
      users[uid] = userDoc;
      saveStoredFirestoreUsers(users);
    }

    return userDoc;
  },

  /**
   * Crea el documento en Firestore en la ruta: usuarios/{uid}
   * REGLA DE SEGURIDAD ESTRICTA: Normal user registration FORCES rol = 'usuario'.
   * Never permits registering directly as 'administrador'.
   */
  async createUsuarioDocument(
    uid: string,
    datos: {
      nombre: string;
      email: string;
      rol?: Rol;
      emailVerified?: boolean;
      documento?: string;
      tipoDocumento?: 'CC' | 'TI' | 'CE' | 'PAS';
      municipio?: any;
      telefono?: string;
      empresaTransporte?: string;
    }
  ): Promise<UsuarioDocument> {
    await new Promise((r) => setTimeout(r, 150));

    const users = getStoredFirestoreUsers();

    // La creación pública siempre genera usuarios; el administrador asigna otros roles.
    const rolAsignado: Rol = 'usuario';

    const nuevoDoc: UsuarioDocument = {
      id: uid,
      nombre: datos.nombre.trim(),
      email: datos.email.trim().toLowerCase(),
      rol: rolAsignado,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: datos.emailVerified ?? false,
      documento: datos.documento || '',
      tipoDocumento: datos.tipoDocumento || 'CC',
      municipio: datos.municipio || 'Ubaté',
      telefono: datos.telefono || '',
      empresaTransporte: datos.empresaTransporte,
      movilAsignado: undefined,
      placa: undefined,
      rutaAsignada: undefined,
      disponible: false,
      saldoTarjeta: 15000, // Bono de bienvenida para movilidad en el valle
    };

    users[uid] = nuevoDoc;
    saveStoredFirestoreUsers(users);

    return nuevoDoc;
  },

  /**
   * Actualiza campos permitidos del documento de usuario
   */
  async updateUsuarioDocument(uid: string, cambios: Partial<UsuarioDocument>): Promise<UsuarioDocument> {
    await new Promise((r) => setTimeout(r, 100));

    const users = getStoredFirestoreUsers();
    const existing = users[uid];
    if (!existing) {
      throw new Error(`El usuario con ID ${uid} no existe en Firestore.`);
    }

    // Regla de seguridad: los usuarios no administradores no pueden alterar su propio rol
    if (cambios.rol && cambios.rol !== existing.rol && existing.rol !== 'administrador') {
      throw new Error('Violación de seguridad: No tienes permisos para modificar tu rol en Firestore.');
    }

    const actualizado: UsuarioDocument = {
      ...existing,
      ...cambios,
      updatedAt: new Date().toISOString(),
    };

    users[uid] = actualizado;
    saveStoredFirestoreUsers(users);

    return actualizado;
  },

  /**
   * Obtiene todos los usuarios (exclusivo para Dashboard Administrador)
   */
  async getAllUsuarios(): Promise<UsuarioDocument[]> {
    await new Promise((r) => setTimeout(r, 120));
    const users = getStoredFirestoreUsers();
    return Object.values(users);
  },

  /**
   * Cambia el rol de un usuario (exclusivo para Administrador)
   */
  async adminCambiarRol(uid: string, nuevoRol: Rol): Promise<void> {
    const users = getStoredFirestoreUsers();
    if (!users[uid]) throw new Error('Usuario no encontrado.');

    users[uid] = {
      ...users[uid],
      rol: nuevoRol,
      updatedAt: new Date().toISOString(),
    };
    saveStoredFirestoreUsers(users);
  },

  /**
   * Asignar datos de conductor (unidad, placa, ruta) por el administrador
   */
  async adminAsignarConductor(
    uid: string,
    datos: { movilAsignado: string; placa: string; rutaAsignada: string; empresaTransporte: string }
  ): Promise<void> {
    const users = getStoredFirestoreUsers();
    if (!users[uid]) throw new Error('Usuario no encontrado.');

    users[uid] = {
      ...users[uid],
      rol: 'conductor',
      movilAsignado: datos.movilAsignado,
      placa: datos.placa,
      rutaAsignada: datos.rutaAsignada,
      empresaTransporte: datos.empresaTransporte,
      disponible: true,
      updatedAt: new Date().toISOString(),
    };
    saveStoredFirestoreUsers(users);
  },

  /**
   * Actualiza la disponibilidad de un conductor
   */
  async setConductorDisponibilidad(uid: string, disponible: boolean): Promise<void> {
    const users = getStoredFirestoreUsers();
    if (users[uid]) {
      users[uid].disponible = disponible;
      users[uid].updatedAt = new Date().toISOString();
      saveStoredFirestoreUsers(users);
    }
  },
};
