import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';
import { NotificacionItem } from '../types';
import { notificationService } from '../services/notificationService';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notificaciones: NotificacionItem[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notificaciones,
}) => {
  if (!isOpen) return null;

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Notificaciones</h3>
            {noLeidas > 0 && (
              <span className="bg-blue-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {noLeidas}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        {noLeidas > 0 && (
          <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800/80 flex justify-end">
            <button
              onClick={() => notificationService.marcarTodasComoLeidas()}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Marcar todas como leídas
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notificaciones.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notificaciones.map((item) => (
              <div
                key={item.id}
                onClick={() => notificationService.marcarComoLeida(item.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  item.leida
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-800/80 border-blue-500/30 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {item.tipo === 'PQRS_CREADA' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                  {item.tipo === 'PQRS_ACTUALIZADA' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {item.tipo === 'SISTEMA' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="font-semibold text-xs text-white truncate">{item.titulo}</p>
                      {!item.leida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.mensaje}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">
                      {new Date(item.fecha).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
