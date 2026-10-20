import React, { useEffect, useState } from 'react';
import {
  Bus,
  CreditCard,
  Map,
  Route,
  Users,
} from 'lucide-react';
import { UsuarioDocument, RutaTransporte, Tarifa } from '../../types';
import { rutasService } from '../rutas/services/rutasService';
import { tarifasService } from '../tarifas/services/tarifasService';
import { CONDUCTORES_DEFAULT } from '../conductores/ConductoresView';
import { BUSES_DEFAULT } from '../buses/BusesView';

interface DashboardMetricsViewProps {
  usuario: UsuarioDocument;
  onNavigateTab: (tab: string) => void;
}

export const DashboardMetricsView: React.FC<DashboardMetricsViewProps> = ({
  onNavigateTab,
}) => {
  const [rutas, setRutas] = useState<RutaTransporte[]>([]);
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);

  useEffect(() => {
    setRutas(rutasService.obtenerRutas());
    void tarifasService.obtenerTarifas().then(setTarifas);
  }, []);

  const rutasActivas = rutas.filter((ruta) => ruta.activa).length;
  const tarifasActivas = tarifas.filter((tarifa) => tarifa.activa).length;
  const conductoresActivos = CONDUCTORES_DEFAULT.filter(
    (conductor) => conductor.estado === 'ACTIVO' || conductor.estado === 'EN_RUTA'
  ).length;
  const busesOperativos = BUSES_DEFAULT.filter(
    (bus) => bus.estado === 'DISPONIBLE' || bus.estado === 'EN_RUTA'
  ).length;
  const rutasPorDestino = rutas.slice(0, 6);

  return (
    <div className="dashboard-view space-y-5 pb-10">
      <section className="dashboard-welcome rounded-[26px] border border-cyan-500/30 bg-gradient-to-br from-[#0e2638] via-[#0b1a2e] to-[#111c3d] px-5 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.2)] sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              Panel de control
            </p>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Resumen operativo del Sistema de Transporte Inteligente
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('rutas')}
            className="self-start rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3.5 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-500/25 sm:self-auto"
          >
            Ver rutas
          </button>
        </div>
      </section>

      <section className="dashboard-metrics-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Rutas"
          value={String(rutasActivas || rutas.length)}
          detail="En operación activa"
          icon={<Route className="h-5 w-5" />}
          className="dashboard-metric-blue"
          onClick={() => onNavigateTab('rutas')}
        />
        <MetricCard
          label="Conductores"
          value={String(CONDUCTORES_DEFAULT.length)}
          detail={`${conductoresActivos} activos`}
          icon={<Users className="h-5 w-5" />}
          className="dashboard-metric-indigo"
          onClick={() => onNavigateTab('conductores')}
        />
        <MetricCard
          label="Buses en Flota"
          value={String(BUSES_DEFAULT.length)}
          detail={`${busesOperativos} operativos`}
          icon={<Bus className="h-5 w-5" />}
          className="dashboard-metric-purple"
          onClick={() => onNavigateTab('buses')}
        />
        <MetricCard
          label="Tarifas"
          value={String(tarifasActivas || tarifas.length)}
          detail={`${tarifasActivas || tarifas.length} activas`}
          icon={<CreditCard className="h-5 w-5" />}
          className="dashboard-metric-green"
          onClick={() => onNavigateTab('tarifas')}
        />
      </section>

      <section className="dashboard-charts-grid grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard title="Estado de Tarifas" icon={<CreditCard className="h-4 w-4 text-amber-300" />}>
          <div className="flex min-h-[265px] flex-col items-center justify-center">
            <div
              className="relative h-40 w-40 rounded-full sm:h-44 sm:w-44"
              style={{
                background: tarifas.length
                  ? `conic-gradient(#118bc7 0 ${Math.round((tarifasActivas / tarifas.length) * 360)}deg, #10b981 ${Math.round((tarifasActivas / tarifas.length) * 360)}deg 360deg)`
                  : '#118bc7',
              }}
            >
              <div className="absolute inset-[25%] rounded-full bg-[#0b1929]" />
            </div>
            <div className="mt-6 flex items-center gap-5 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-sky-400">
                <i className="h-3 w-3 bg-sky-600" /> Activas
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <i className="h-3 w-3 bg-emerald-500" /> Inactivas
              </span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Distribución de Rutas" icon={<Map className="h-4 w-4 text-yellow-300" />}>
          <div className="flex min-h-[265px] flex-col justify-end px-2 pb-3 pt-4">
            <div className="flex h-48 items-end gap-6 border-l border-slate-600/60 border-b pl-5 sm:gap-10">
              {rutasPorDestino.length > 0 ? rutasPorDestino.map((ruta) => (
                <div key={ruta.id} className="group flex h-full flex-1 items-end justify-center">
                  <div
                    className="w-full max-w-24 rounded-t-lg bg-[#108bc8] transition group-hover:bg-cyan-400"
                    style={{ height: `${Math.max(18, Math.min(100, (ruta.frecuenciaMin || 1) * 2.5))}%` }}
                    title={ruta.destino}
                  />
                </div>
              )) : (
                <div className="flex h-full flex-1 items-end justify-center">
                  <div className="h-1/2 w-1/3 rounded-t-lg bg-[#108bc8]" />
                </div>
              )}
            </div>
            <p className="pt-3 text-center text-xs text-slate-400">
              Mostrando {rutasPorDestino.length || 0} de {rutas.length || 0} rutas registradas
            </p>
          </div>
        </ChartCard>
      </section>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  className: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  detail,
  icon,
  className,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`dashboard-metric-card rounded-[24px] border px-5 py-5 text-left transition hover:-translate-y-0.5 ${className}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-300">{label}</span>
      <span className="text-slate-300">{icon}</span>
    </div>
    <div className="mt-2 text-3xl font-black tracking-tight text-white">{value}</div>
    <div className="mt-1 text-[11px] font-medium text-emerald-400">{detail}</div>
  </button>
);

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <article className="dashboard-chart rounded-[24px] border border-slate-700/70 bg-[#0b1727]/90 px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.18)] sm:px-6">
    <h2 className="flex items-center justify-center gap-2 text-base font-black text-white">
      {icon}
      {title}
    </h2>
    {children}
  </article>
);
