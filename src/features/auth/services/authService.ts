import { UsuarioDocument, Rol } from '../../../types';
import { firestoreService } from '../../../services/firebase/firestoreService';

const AUTH_USER_KEY = 'cheems_auth_current_user_v2';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const CUENTAS_DEMO_UBATE: Array<{
  email: string;
  password: string;
  nombre: string;
  titulo: string;
  municipio: string;
  rol: Rol;
  descripcion: string;
}> = [];

export class AuthService {
  private usuarioActual: UsuarioDocument | null = null;
  private listeners: ((usuario: UsuarioDocument | null) => void)[] = [];

  constructor() {
    this.cargarSesionAlmacenada();
  }

  private cargarSesionAlmacenada() {
    const storage = getStorage();

    try {
      if (!storage) {
        this.usuarioActual = null;
        return;
      }

      const raw = storage.getItem(AUTH_USER_KEY);
      if (raw) {
        const loaded = JSON.parse(raw) as UsuarioDocument;
        this.usuarioActual = loaded;
        return;
      }

      this.usuarioActual = null;
      storage.removeItem(AUTH_USER_KEY);
    } catch {
      this.usuarioActual = null;
      storage?.removeItem(AUTH_USER_KEY);
    }
  }

  /**
   * Obtener el usuario autenticado actual en memoria
   */
  public getUsuarioActual(): UsuarioDocument | null {
    return this.usuarioActual;
  }

  /**
   * Actualizar usuario en sesión activa y notificar a los suscriptores (useAuth, etc.)
   */
  public actualizarUsuarioLocal(usuarioActualizado: UsuarioDocument) {
    this.usuarioActual = usuarioActualizado;
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(this.usuarioActual));
    this.notificar();
  }

  /**
   * Suscribirse a cambios de estado de autenticación
   */
  public suscribir(callback: (usuario: UsuarioDocument | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.usuarioActual);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notificar() {
    this.listeners.forEach((l) => l(this.usuarioActual));
  }

  /**
   * Inicio de Sesión:
   * 1. Autentica las credenciales con Firebase Auth.
   * 2. Obtiene el UID.
   * 3. Consulta el documento en Firestore: usuarios/{uid}.
   * 4. Valida el rol ('usuario' | 'conductor' | 'administrador').
   */
  public async login(email: string, _password?: string): Promise<UsuarioDocument> {
    // Normalizar email
    const emailNormalizado = email.trim().toLowerCase();

    // Simulación de autenticación Firebase Auth
    await new Promise((r) => setTimeout(r, 200));

    // Buscar en Firestore el documento asociado al email
    const allUsers = await firestoreService.getAllUsuarios();
    let docEncontrado = allUsers.find((u) => u.email.toLowerCase() === emailNormalizado);

    if (!docEncontrado) {
      // Si no existe, crear cuenta con rol por defecto 'usuario'
      const uid = 'usr_' + Date.now();
      docEncontrado = await firestoreService.createUsuarioDocument(uid, {
        nombre: emailNormalizado.split('@')[0],
        email: emailNormalizado,
        rol: 'usuario',
        emailVerified: true,
      });
    }

    // Consultar directamente usuarios/{uid} para garantizar integridad
    const userFromFirestore = await firestoreService.getUsuarioDocument(docEncontrado.id);
    if (!userFromFirestore) {
      throw new Error('Error de Firebase: No se encontró el documento en usuarios/' + docEncontrado.id);
    }

    // Validación estricta del rol
    if (!['usuario', 'conductor', 'administrador'].includes(userFromFirestore.rol)) {
      throw new Error(`Rol inexistente o no permitido en Firestore: ${userFromFirestore.rol}`);
    }

    this.usuarioActual = userFromFirestore;
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(this.usuarioActual));
    this.notificar();

    return this.usuarioActual;
  }

  /**
   * Registro Ciudadano:
   * Al registrarse normalmente, el rol DEBE ser automáticamente 'usuario'.
   * No permite registrarse como administrador.
   */
  public async register(datos: {
    nombre: string;
    email: string;
    password?: string;
    documento: string;
    tipoDocumento: 'CC' | 'TI' | 'CE' | 'PAS';
    municipio: string;
    telefono?: string;
  }): Promise<UsuarioDocument> {
    const emailNormalizado = datos.email.trim().toLowerCase();

    // Generar UID Firebase Auth
    const uid = 'usr_' + Date.now();

    const nuevoUsuario = await firestoreService.createUsuarioDocument(uid, {
      nombre: datos.nombre,
      email: emailNormalizado,
      rol: 'usuario',
      emailVerified: false, // Requiere verificación
      documento: datos.documento,
      tipoDocumento: datos.tipoDocumento,
      municipio: datos.municipio,
      telefono: datos.telefono,
    });

    this.usuarioActual = nuevoUsuario;
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(this.usuarioActual));
    this.notificar();

    return nuevoUsuario;
  }

  /**
   * Confirma la verificación de correo electrónico
   */
  public async verificarCorreo(): Promise<UsuarioDocument> {
    if (!this.usuarioActual) {
      throw new Error('No hay una sesión activa para verificar.');
    }

    const actualizado = await firestoreService.updateUsuarioDocument(this.usuarioActual.id, {
      emailVerified: true,
    });

    this.usuarioActual = actualizado;
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(this.usuarioActual));
    this.notificar();

    return actualizado;
  }

  /**
   * Cambiar de rol en tiempo de ejecución (útil para pruebas de evaluación / switcher)
   */
  public async switchRole(nuevoRol: Rol): Promise<UsuarioDocument> {
    if (!this.usuarioActual) {
      throw new Error('No hay una sesión activa.');
    }

    // Actualiza en Firestore
    await firestoreService.adminCambiarRol(this.usuarioActual.id, nuevoRol);
    this.usuarioActual = {
      ...this.usuarioActual,
      rol: nuevoRol,
    };
    getStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(this.usuarioActual));
    this.notificar();

    return this.usuarioActual;
  }

  public async cambiarRol(nuevoRol: Rol): Promise<UsuarioDocument> {
    return this.switchRole(nuevoRol);
  }

  public async confirmarVerificacion(): Promise<UsuarioDocument> {
    return this.verificarCorreo();
  }

  public async reenviarCorreoVerificacion(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  }

  public async registro(datos: any): Promise<UsuarioDocument> {
    return this.register(datos);
  }

  public async recuperarContrasena(_email: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  }

  /**
   * Cierre de sesión seguro
   */
  public async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    this.usuarioActual = null;
    getStorage()?.removeItem(AUTH_USER_KEY);
    this.notificar();
  }
}

export const authService = new AuthService();
