import { useState, useEffect } from 'react';
import { UsuarioDocument, Rol } from '../../../types';
import { authService } from '../services/authService';

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioDocument | null>(authService.getUsuarioActual());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar y consultar rol en Firestore
    const desuscribir = authService.suscribir((user) => {
      setUsuario(user);
      setIsLoading(false);
    });

    return () => {
      desuscribir();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      return user;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (datos: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.register(datos);
      return user;
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const verificarCorreo = async () => {
    setIsLoading(true);
    try {
      return await authService.verificarCorreo();
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (nuevoRol: Rol) => {
    setIsLoading(true);
    try {
      return await authService.switchRole(nuevoRol);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    usuario,
    rol: usuario?.rol || null,
    isAuthenticated: !!usuario,
    isLoading,
    error,
    login,
    register,
    logout,
    verificarCorreo,
    switchRole,
  };
}
