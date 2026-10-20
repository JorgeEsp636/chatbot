import React, { useState } from 'react';
import { Mail, ShieldCheck, RefreshCw, CheckCircle, LogOut, ArrowRight, AlertCircle } from 'lucide-react';
import { UsuarioDocument } from '../../../types';

interface EmailVerificationScreenProps {
  usuario: UsuarioDocument;
  onConfirmVerification: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  usuario,
  onConfirmVerification,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirmVerification();
    } catch (err: any) {
      setError(err.message || 'Error al validar la verificación');
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = () => {
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verificación Requerida</span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          Verifica tu Correo Electrónico
        </h2>

        <p className="text-sm text-slate-300 mb-2">
          Hemos enviado un enlace de confirmación a:
        </p>

        <div className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-semibold mb-5 break-all">
          {usuario.email}
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 text-left mb-6 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Abre tu bandeja de entrada o carpeta de spam.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Presiona el botón de confirmación en el correo enviado.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Regresa a esta pantalla y haz clic en &ldquo;Confirmar Verificación&rdquo;.</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 text-left">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enlace reenviado con éxito a tu bandeja.</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Comprobando estado...
              </span>
            ) : (
              <>
                <span>Confirmar Verificación y Acceder</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReenviar}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reenviar correo de verificación</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-4 text-slate-500 hover:text-rose-400 text-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión / Usar otra cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
