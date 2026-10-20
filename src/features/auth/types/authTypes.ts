import { Rol, UsuarioDocument } from '../../../types';

export interface AuthState {
  usuario: UsuarioDocument | null;
  rol: Rol | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password?: string;
  documento: string;
  tipoDocumento: 'CC' | 'TI' | 'CE' | 'PAS';
  municipio: string;
  telefono?: string;
  empresaTransporte?: string;
}
