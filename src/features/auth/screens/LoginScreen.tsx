import React, { useState } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onNavigateToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
  isLoading,
  error: authError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      await onLogin(email.trim(), password);
    } catch (err: any) {
      setLocalError(err.message || 'Error al autenticar credenciales.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-center min-h-full">
      {/* 2. Tarjeta Glassmorphic Neón Cian (Imagen 1) */}
      <div className="w-full cheems-glass rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.12)] border border-cyan-500/35 relative">
        {/* Selector de Pestañas: [ Iniciar Sesión ] [ Registrarse ] */}
        <div className="flex items-center p-1 bg-slate-950/70 border border-cyan-500/20 rounded-2xl mb-6">
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-default"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Registrarse
          </button>
        </div>

        {/* Encabezado del Formulario */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingresa tus credenciales para acceder a la plataforma
          </p>
        </div>

        {/* Notificaciones de error */}
        {(localError || authError) && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{localError || authError}</div>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: CORREO ELECTRÓNICO */}
          <div>
            <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
              CORREO ELECTRÓNICO
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Campo: CONTRASEÑA con enlace ¿La olvidaste? */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase">
                CONTRASEÑA
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer"
              >
                ¿La olvidaste?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón Principal: Ingresar al Sistema (Imagen 1) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Validando en CHEEMS...
              </span>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

      </div>

      {/* Modal Olvidé Contraseña */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="cheems-glass rounded-3xl p-6 max-w-sm w-full border border-cyan-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Recuperar Contraseña
            </h3>
            {forgotSent ? (
              <div className="space-y-3 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300">
                  Enlace de restablecimiento enviado a <strong>{forgotEmail}</strong>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Ingresa tu correo para enviarte las instrucciones de restablecimiento:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="ejemplo@valledeubate.com"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="px-4 py-1.5 text-xs font-bold text-slate-950 rounded-lg bg-cyan-400 hover:bg-cyan-300"
                  >
                    Enviar Enlace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
