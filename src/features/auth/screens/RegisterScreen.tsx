import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  MapPin,
  Eye,
  EyeOff,
  Phone,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { MUNICIPIOS_VALLE_UBATE, MunicipioUbate } from '../../../types';

interface RegisterScreenProps {
  onRegister: (datos: {
    nombre: string;
    email: string;
    password?: string;
    documento: string;
    tipoDocumento: 'CC' | 'TI' | 'CE' | 'PAS';
    municipio: MunicipioUbate;
    telefono?: string;
  }) => Promise<void>;
  onNavigateToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onNavigateToLogin,
  isLoading,
  error: authError,
}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [municipio, setMunicipio] = useState<MunicipioUbate>('Ubaté');
  const [tipoDocumento, setTipoDocumento] = useState<'CC' | 'TI' | 'CE' | 'PAS'>('CC');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!nombre.trim()) {
      setLocalError('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    if (!documento.trim()) {
      setLocalError('Ingresa tu número de documento de identidad.');
      return;
    }

    if (!aceptoTerminos) {
      setLocalError('Debes aceptar los términos y condiciones del sistema CHEEMS.');
      return;
    }

    try {
      await onRegister({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        documento: documento.trim(),
        tipoDocumento,
        municipio,
        telefono: telefono.trim(),
      });
    } catch (err: any) {
      setLocalError(err.message || 'Error al registrar la cuenta en el sistema.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-center min-h-full">
      {/* 2. Tarjeta Glassmorphic Neón Cian */}
      <div className="w-full cheems-glass rounded-3xl p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.12)] border border-cyan-500/35 relative">
        {/* Selector de Pestañas: [ Iniciar Sesión ] [ Registrarse ] */}
        <div className="flex items-center p-1 bg-slate-950/70 border border-cyan-500/20 rounded-2xl mb-6">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-default"
          >
            Registrarse
          </button>
        </div>

        {/* Encabezado del Formulario */}
        <div className="mb-5 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Crear Cuenta Móvil
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Únete a la red provincial de transporte inteligente del Valle de Ubaté
          </p>
        </div>

        {/* Notificaciones de error */}
        {(localError || authError) && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{localError || authError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nombre Completo */}
          <div>
            <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
              NOMBRE COMPLETO
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Erik Arévalo"
                className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
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
                placeholder="arevalo@valledeubate.com"
                className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
              />
            </div>
          </div>

          {/* Documento y Municipio */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
                DOCUMENTO
              </label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="1070984..."
                  className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-9 pr-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
                MUNICIPIO
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value as MunicipioUbate)}
                  className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  {MUNICIPIOS_VALLE_UBATE.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
              TELÉFONO
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+57 312 456 7890"
                className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
              />
            </div>
          </div>

          {/* Contraseña y Confirmar */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
                CONTRASEÑA
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 6 chars"
                  className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-cyan-200/90 tracking-wider uppercase mb-1.5">
                CONFIRMAR
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir clave"
                  className="w-full bg-slate-950/80 border border-cyan-500/25 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition"
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Términos */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terminos-check"
              checked={aceptoTerminos}
              onChange={(e) => setAceptoTerminos(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
            />
            <label htmlFor="terminos-check" className="text-[11px] text-slate-400 leading-tight">
              Acepto los términos del sistema CHEEMS Transporte Inteligente.
            </label>
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              <>
                <span>Registrar en CHEEMS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
