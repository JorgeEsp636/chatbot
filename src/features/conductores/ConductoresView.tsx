import React, { useState } from 'react';
import {
  Truck,
  UserCheck,
  Star,
  Phone,
  ShieldCheck,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2,
} from 'lucide-react';

interface ConductorInfo {
  id: string;
  nombre: string;
  placa: string;
  empresa: string;
  vehiculo: string;
  rutaAsignada: string;
  telefono: string;
  categoriaLicencia: string;
  calificacion: number;
  viajesCompletados: number;
  estado: 'ACTIVO' | 'EN_RUTA' | 'DESCANSO';
  avatarUrl?: string;
}

export const CONDUCTORES_DEFAULT: ConductorInfo[] = [
  {
    id: 'cond_01',
    nombre: 'Don Gonzalo Briceño Méndez',
    placa: 'WOH-321',
    empresa: 'Cootransubaté',
    vehiculo: 'Microbús Intermunicipal',
    rutaAsignada: 'Ubaté &rarr; Sutatausa',
    telefono: '+57 312 489 1201',
    categoriaLicencia: 'C2 Profesional',
    calificacion: 4.9,
    viajesCompletados: 1240,
    estado: 'EN_RUTA',
  },
  {
    id: 'cond_02',
    nombre: 'Carlos Rodríguez Peña',
    placa: 'QFZ-098',
    empresa: 'Rápido El Carmen',
    vehiculo: 'Aerovan Turística',
    rutaAsignada: 'Ubaté &rarr; Guachetá',
    telefono: '+57 310 774 9920',
    categoriaLicencia: 'C3 Intermunicipal',
    calificacion: 4.8,
    viajesCompletados: 980,
    estado: 'EN_RUTA',
  },
  {
    id: 'cond_03',
    nombre: 'Jairo Pachón Forero',
    placa: 'TLU-452',
    empresa: 'Cootranscarupa',
    vehiculo: 'Buseta Provincial',
    rutaAsignada: 'Ubaté &rarr; Carmen de Carupa',
    telefono: '+57 314 200 4512',
    categoriaLicencia: 'C2 Profesional',
    calificacion: 4.7,
    viajesCompletados: 810,
    estado: 'ACTIVO',
  },
  {
    id: 'cond_04',
    nombre: 'Mauricio Peña Cárdenas',
    placa: 'SMJ-881',
    empresa: 'Flota Rionegro',
    vehiculo: 'Microbús 24 Pasajeros',
    rutaAsignada: 'Ubaté &rarr; Cucunubá',
    telefono: '+57 320 665 1478',
    categoriaLicencia: 'C2 Profesional',
    calificacion: 5.0,
    viajesCompletados: 650,
    estado: 'ACTIVO',
  },
];

export const ConductoresView: React.FC = () => {
  const [conductores, setConductores] = useState<ConductorInfo[]>(CONDUCTORES_DEFAULT);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('todas');

  const filtrados = conductores.filter((c) => {
    const matchText =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.vehiculo.toLowerCase().includes(busqueda.toLowerCase());
    const matchEmpresa = filtroEmpresa === 'todas' || c.empresa === filtroEmpresa;
    return matchText && matchEmpresa;
  });

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Directorio de Conductores</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {conductores.length} Certificados
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Personal autorizado y monitoreado por telemetría GPS en la provincia
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar conductor o placa..."
              className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filtrados.map((c) => (
          <div
            key={c.id}
            className="conductores-list-item cheems-glass w-full min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4 border border-cyan-500/30 shadow-lg"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-tr from-cyan-950 to-slate-900 text-cyan-300">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-white sm:text-base">{c.nombre}</h3>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400" />
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${
                      c.estado === 'EN_RUTA'
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {c.estado === 'EN_RUTA' ? 'En ruta' : 'Disponible'}
                    </span>
                  </div>
                  <div className="driver-details mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    <span className="truncate"><strong className="text-slate-400">Placa:</strong> {c.placa}</span>
                    <span className="min-w-0 truncate"><strong className="text-slate-400">Ruta:</strong> {c.rutaAsignada.replace('&rarr;', '→')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
