import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainAppScreen } from '../features/main/MainAppScreen';
import { authService } from '../features/auth/services/authService';

export const RootNavigator: React.FC = () => {
  const {
    usuario,
    rol,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verificarCorreo,
    switchRole,
  } = useAuth();

  // 1. Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xs text-cyan-300 font-mono mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Conectando con la red provincial CHEEMS...
        </p>
      </div>
    );
  }

  // 2. Estado: Usuario no autenticado o con correo pendiente de verificar
  if (!isAuthenticated || !usuario || !usuario.emailVerified) {
    return (
      <AuthNavigator
        usuario={usuario}
        onLogin={async (email, password) => {
          await login(email, password);
        }}
        onRegister={async (datos) => {
          await register(datos);
        }}
        onConfirmVerification={async () => {
          await verificarCorreo();
        }}
        onLogout={async () => {
          await logout();
        }}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Helper para actualizar el usuario localmente
  const handleUsuarioActualizado = (actualizado: any) => {
    if (actualizado) {
      authService.actualizarUsuarioLocal(actualizado);
    }
  };

  // 3. Interfaz Principal Unificada Fiel a las Fotos 2 y 3
  return (
    <div className="relative min-h-screen bg-[#060a12]">
      {/* Pantalla Principal con Navegación Fiel a la Foto 2 (Rutas, Tarifas, Conductores, Buses, PQRS, IA, Dashboard) */}
      <MainAppScreen
        usuario={usuario}
        onLogout={logout}
        onUsuarioActualizado={handleUsuarioActualizado}
      />
    </div>
  );
};
