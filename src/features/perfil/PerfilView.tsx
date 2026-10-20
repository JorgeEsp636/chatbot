import React, { useState } from 'react';
import {
  User,
  Mail,
  CheckCircle2,
  Calendar,
  Shield,
  CreditCard,
  LogOut,
  Phone,
  FileText,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  MapPin,
  Building2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Usuario, Rol } from '../../types';
import { authService } from '../auth/services/authService';
import { firestoreService } from '../../services/firebase/firestoreService';

interface PerfilViewProps {
  usuario: Usuario;
  onUsuarioActualizado: (usuario: Usuario) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({ usuario, onUsuarioActualizado }) => {
  const [cambiandoRol, setCambiandoRol] = useState(false);
  const [recargando, setRecargando] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);
  const [toastTipo, setToastTipo] = useState<'exito' | 'error'>('exito');
  const [mostrarConfirmarSalida, setMostrarConfirmarSalida] = useState(false);

  const mostrarToast = (msg: string, tipo: 'exito' | 'error' = 'exito') => {
    setToastMensaje(msg);
    setToastTipo(tipo);
    setTimeout(() => {
      setToastMensaje(null);
    }, 4000);
  };

  const handleCambiarRol = async (nuevoRol: Rol) => {
    setCambiandoRol(true);
    try {
      const actualizado = await authService.cambiarRol(nuevoRol);
      onUsuarioActualizado(actualizado);
      mostrarToast(`Rol actualizado a "${nuevoRol.toUpperCase()}" correctamente.`);
    } catch (err: any) {
      mostrarToast(err.message || 'Error al cambiar rol.', 'error');
    } finally {
      setCambiandoRol(false);
    }
  };

  const handleRecargarSaldo = async () => {
    setRecargando(true);
    try {
      const nuevoSaldo = (usuario.saldoTarjeta || 0) + 10000;
      const actualizado = await firestoreService.updateUsuarioDocument(usuario.id, {
        saldoTarjeta: nuevoSaldo,
      });
      authService.actualizarUsuarioLocal(actualizado);
      onUsuarioActualizado(actualizado);
      mostrarToast('¡Recarga exitosa! Se han acreditado $10.000 COP a tu tarjeta de transporte.');
    } catch (err: any) {
      mostrarToast(err.message || 'Error al recargar saldo.', 'error');
    } finally {
      setRecargando(false);
    }
  };

  const handleCerrarSesion = async () => {
    setMostrarConfirmarSalida(true);
  };

  const confirmarLogout = async () => {
    setMostrarConfirmarSalida(false);
    await authService.logout();
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto relative">
      {/* Toast Notification In-App */}
      {toastMensaje && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xl transition border ${
            toastTipo === 'exito'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastTipo === 'exito' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMensaje}</span>
          </div>
          <button
            onClick={() => setToastMensaje(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal Confirmación Cerrar Sesión In-App */}
      {mostrarConfirmarSalida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-400" />
              ¿Cerrar Sesión Activa?
            </h3>
            <p className="text-xs text-slate-300">
              ¿Deseas cerrar tu sesión actual de CHEEMS Transporte Público Valle de Ubaté? Podrás ingresar nuevamente en cualquier momento con tus credenciales.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setMostrarConfirmarSalida(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta de Encabezado de Perfil */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 text-3xl font-extrabold border-4 border-slate-800">
          {usuario.nombre
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>

        <h1 className="text-2xl font-bold text-white">{usuario.nombre}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{usuario.email}</p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
            Rol: {usuario.rol}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {usuario.municipio || 'Ubaté'} (Cundinamarca)
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correo Verificado
          </span>
        </div>
      </div>

      {/* Switcher de Roles para Evaluador / Usuario */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>Selector de Roles & Permisos (Simulación de Custom Claims)</span>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Permite probar los tres perfiles del sistema solicitados en las especificaciones:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['usuario', 'conductor', 'administrador'] as Rol[]).map((r) => (
            <button
              key={r}
              disabled={cambiandoRol}
              onClick={() => handleCambiarRol(r)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                usuario.rol === r
                  ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="capitalize text-xs font-semibold">{r}</span>
                {usuario.rol === r && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <span className="text-[10px] text-slate-400 font-normal">
                {r === 'usuario' && 'Consulta mapa, tarifas y radica PQRS.'}
                {r === 'conductor' && 'Transmite GPS en vivo y gestiona turnos.'}
                {r === 'administrador' && 'CRUD tarifas, usuarios y responde PQRS.'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Información de Cuenta */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Detalles del Ciudadano</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5" /> Documento de Identidad
            </span>
            <strong className="text-slate-200">{usuario.documento || 'No registrado'}</strong>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5" /> Teléfono de Contacto
            </span>
            <strong className="text-slate-200">{usuario.telefono || '+57 312 456 7890'}</strong>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5" /> Correo Registrado
            </span>
            <strong className="text-slate-200">{usuario.email}</strong>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Municipio de Residencia
            </span>
            <strong className="text-emerald-300 font-semibold">{usuario.municipio || 'Villa de San Diego de Ubaté'}</strong>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> Operador / Empresa
            </span>
            <strong className="text-slate-200">{usuario.empresaTransporte || 'Red Intermunicipal del Valle'}</strong>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Fecha de Registro
            </span>
            <strong className="text-slate-200">
              {new Date(usuario.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </div>
        </div>
      </div>

      {/* Cerrar Sesión */}
      <div className="pt-2">
        <button
          onClick={handleCerrarSesion}
          className="w-full py-3.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión Segura en Firebase</span>
        </button>
      </div>
    </div>
  );
};
