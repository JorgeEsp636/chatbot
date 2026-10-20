import React, { useState } from 'react';
import {
  Bus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  LogOut,
  MapPin,
  ShieldCheck,
  Eye,
  EyeOff,
  Moon,
  Sun,
  KeyRound,
  Compass,
  Phone,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Usuario, MunicipioUbate, MUNICIPIOS_VALLE_UBATE } from '../../types';
import { authService } from './services/authService';

interface AuthViewProps {
  usuario: Usuario | null;
  onAuthSuccess: (user: Usuario) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ usuario, onAuthSuccess }) => {
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [municipio, setMunicipio] = useState<MunicipioUbate>('Ubaté');
  const [tipoDocumento, setTipoDocumento] = useState<'CC' | 'TI' | 'CE' | 'PAS'>('CC');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(true);

  // Estados de carga y feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(true);

  // ==========================================
  // PANTALLA: VERIFICACIÓN DE CORREO OBLIGATORIA
  // ==========================================
  if (usuario && !usuario.emailVerified) {
    const handleReenviar = async () => {
      setResending(true);
      setError(null);
      try {
        await authService.reenviarCorreoVerificacion();
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setResending(false);
      }
    };

    const handleConfirmar = async () => {
      setLoading(true);
      setError(null);
      try {
        const verificado = await authService.confirmarVerificacion();
        onAuthSuccess(verificado);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verificación Obligatoria</span>
          </div>

          <h2 className="text-2xl font-bold text-white mt-2 mb-1">Confirma tu Correo Ciudadano</h2>
          <p className="text-xs text-emerald-400 font-medium mb-3">
            Provincia de Valle de Ubaté • Red Intermunicipal
          </p>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Hemos enviado un enlace de confirmación a:
            <br />
            <strong className="text-emerald-400 font-semibold">{usuario.email}</strong>.
            <br />
            <span className="text-xs text-slate-400 mt-2 block">
              Para validar tu identidad en el sistema de transporte de los 10 municipios (Ubaté, Carupa, Cucunubá, Fúquene, Guachetá, Lenguazaque, Simijaca, Susa, Sutatausa y Tausa), debes confirmar tu cuenta antes de acceder al panel de control.
            </span>
          </p>

          {resendSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 justify-center">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Token de confirmación enviado exitosamente.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              id="btn-confirm-email-verification"
              onClick={handleConfirmar}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Validando con Firebase...' : 'Confirmar Verificación y Acceder'}</span>
            </button>

            <button
              id="btn-resend-email-verification"
              onClick={handleReenviar}
              disabled={resending}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Enviando...' : 'Reenviar Enlace de Verificación'}</span>
            </button>

            <button
              id="btn-logout-unverified"
              onClick={() => authService.logout()}
              className="w-full py-2.5 px-4 text-slate-400 hover:text-slate-200 text-xs transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión / Registrar otro correo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MANEJADORES DE ENVÍO
  // ==========================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!aceptoTerminos) {
      setError('Debes aceptar los términos y condiciones de movilidad de la Provincia de Ubaté.');
      return;
    }

    setLoading(true);
    try {
      const resultado = await authService.registro({
        nombre,
        email,
        password,
        confirmPassword,
        rol: 'usuario',
        municipio,
        tipoDocumento,
        documento,
        telefono,
      });
      onAuthSuccess(((resultado as any)?.user || resultado) as any);
    } catch (err: any) {
      setError(err.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.recuperarContrasena(email);
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || 'Error al solicitar el restablecimiento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-theme ${modoOscuro ? '' : 'auth-theme-light'} min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-slate-100 relative overflow-hidden`}>
      {/* Decorative ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        <button
          type="button"
          onClick={() => setModoOscuro((actual) => !actual)}
          aria-label={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
          className="absolute right-4 top-4 rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
        >
          {modoOscuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        
        {/* Cabecera de Identidad Provincial */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-3">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Provincia de Valle de Ubaté • Cundinamarca</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
              <Bus className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                TransiMóvil <span className="text-emerald-400">Ubaté</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Red Intermunicipal de Transporte Público
              </p>
            </div>
          </div>

          {/* Selector de Modos (Iniciar Sesión / Registro) */}
          <div className="mt-4 inline-flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800 w-full max-w-md">
            <button
              id="tab-mode-login"
              type="button"
              onClick={() => {
                setViewMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                viewMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              id="tab-mode-register"
              type="button"
              onClick={() => {
                setViewMode('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                viewMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta Ciudadana
            </button>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 1: INICIAR SESIÓN */}
        {/* ========================================================= */}
        {viewMode === 'login' && (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    placeholder="ejemplo@valledeubate.transimovil.gov.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('forgot');
                      setError(null);
                      setForgotSent(false);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                <span>{loading ? 'Iniciando sesión...' : 'Ingresar a TransiMóvil'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 2: REGISTRO CIUDADANO */}
        {/* ========================================================= */}
        {viewMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  id="input-register-name"
                  type="text"
                  required
                  placeholder="Ej: Laura Camila Pachón"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Documento de Identidad */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tipo Doc.
                </label>
                <select
                  id="select-tipo-doc"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="CC">C.C.</option>
                  <option value="TI">T.I.</option>
                  <option value="CE">C.E.</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Número de Documento
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="input-register-documento"
                    type="text"
                    required
                    placeholder="Ej: 1070984512"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Selector de Municipios de la Provincia de Valle de Ubaté */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Municipio de la Provincia de Ubaté</span>
                <span className="text-[10px] text-emerald-400 font-normal">10 Municipios</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
                <select
                  id="select-register-municipio"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value as MunicipioUbate)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  {MUNICIPIOS_VALLE_UBATE.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.nombre} — {m.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Teléfono Celular
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  id="input-register-telefono"
                  type="tel"
                  placeholder="+57 312 456 7890"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico (Para verificación)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  id="input-register-email"
                  type="email"
                  required
                  placeholder="ciudadano@valledeubate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="input-register-password"
                    type="password"
                    required
                    placeholder="Mín. 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="input-register-confirm-password"
                    type="password"
                    required
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Aceptación de términos */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="check-terminos"
                checked={aceptoTerminos}
                onChange={(e) => setAceptoTerminos(e.target.checked)}
                className="mt-1 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="check-terminos" className="text-[11px] text-slate-400 leading-tight">
                Acepto los términos de servicio para transporte intermunicipal en la Provincia de Ubaté y el envío de correo de verificación de cuenta.
              </label>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              disabled={loading}
              className="w-full py-3.2 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta y Solicitar Verificación'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* VISTA 3: RECUPERACIÓN DE CONTRASEÑA */}
        {/* ========================================================= */}
        {viewMode === 'forgot' && (
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recuperar Contraseña</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa el correo registrado en TransiMóvil para enviarte las instrucciones.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-3">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="text-xs leading-relaxed">
                  Se ha generado el enlace de restablecimiento para <strong>{email}</strong>. Revisa tu bandeja de entrada o carpeta de spam.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setForgotSent(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Volver al Inicio de Sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      id="input-forgot-email"
                      type="email"
                      required
                      placeholder="ejemplo@valledeubate.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('login');
                      setError(null);
                    }}
                    className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    id="btn-submit-forgot"
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                  >
                    <span>{loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Banner de los 10 Municipios Conectados */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Red de transporte conectando:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            {MUNICIPIOS_VALLE_UBATE.map((m) => (
              <span
                key={m.id}
                className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] text-slate-300 font-normal hover:border-emerald-500/40 hover:text-emerald-300 transition"
              >
                {m.id}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
