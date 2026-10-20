import React, { useState } from 'react';
import { UsuarioDocument } from '../types';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { EmailVerificationScreen } from '../features/auth/screens/EmailVerificationScreen';

interface AuthNavigatorProps {
  usuario: UsuarioDocument | null;
  onLogin: (email: string, password?: string) => Promise<void>;
  onRegister: (datos: any) => Promise<void>;
  onConfirmVerification: () => Promise<void>;
  onLogout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  usuario,
  onLogin,
  onRegister,
  onConfirmVerification,
  onLogout,
  isLoading,
  error,
}) => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  // Si el usuario existe pero no ha verificado su email
  if (usuario && !usuario.emailVerified) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <EmailVerificationScreen
          usuario={usuario}
          onConfirmVerification={onConfirmVerification}
          onLogout={onLogout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {currentScreen === 'login' ? (
        <LoginScreen
          onLogin={onLogin}
          onNavigateToRegister={() => setCurrentScreen('register')}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <RegisterScreen
          onRegister={onRegister}
          onNavigateToLogin={() => setCurrentScreen('login')}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};
