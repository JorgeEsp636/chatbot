import React from 'react';
import { UsuarioDocument } from '../types';
import { DashboardUsuarioScreen } from '../features/usuario/screens/DashboardUsuarioScreen';
import { AlertCircle, ShieldAlert, LogOut } from 'lucide-react';

interface UsuarioNavigatorProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado: (usuario: UsuarioDocument) => void;
}

export const UsuarioNavigator: React.FC<UsuarioNavigatorProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
}) => {
  // Protección estricta de rutas: solo rol 'usuario' (o fallback 'pasajero')
  if (usuario.rol !== 'usuario' && (usuario.rol as string) !== 'pasajero') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Acceso Denegado (403)</h2>
          <p className="text-xs text-slate-400 mb-4">
            Tu rol actual en Firestore es <strong>{usuario.rol}</strong>. Esta ruta está reservada para usuarios tipo <strong>usuario</strong>.
          </p>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardUsuarioScreen
      usuario={usuario}
      onLogout={onLogout}
      onUsuarioActualizado={onUsuarioActualizado}
    />
  );
};
