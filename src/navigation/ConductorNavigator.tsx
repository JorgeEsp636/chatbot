import React from 'react';
import { UsuarioDocument } from '../types';
import { DashboardConductorScreen } from '../features/conductor/screens/DashboardConductorScreen';
import { ShieldAlert, LogOut } from 'lucide-react';

interface ConductorNavigatorProps {
  usuario: UsuarioDocument;
  onLogout: () => Promise<void>;
  onUsuarioActualizado: (usuario: UsuarioDocument) => void;
}

export const ConductorNavigator: React.FC<ConductorNavigatorProps> = ({
  usuario,
  onLogout,
  onUsuarioActualizado,
}) => {
  // Protección estricta de rutas: solo rol 'conductor'
  if (usuario.rol !== 'conductor') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Acceso Restringido a Conductores</h2>
          <p className="text-xs text-slate-400 mb-4">
            Tu rol actual en Firestore es <strong>{usuario.rol}</strong>. Para acceder al panel de telemetría y turnos debes contar con acreditación de <strong>conductor</strong>.
          </p>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardConductorScreen
      usuario={usuario}
      onLogout={onLogout}
      onUsuarioActualizado={onUsuarioActualizado}
    />
  );
};
