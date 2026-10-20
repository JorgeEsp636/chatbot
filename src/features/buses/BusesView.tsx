import React, { useState } from 'react';
import {
  Bus,
  Gauge,
  Wifi,
  Wind,
  ShieldCheck,
  Search,
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { BusFlota } from '../../types';

export const BUSES_DEFAULT: BusFlota[] = [
  {
    id: 'bus_01',
    placa: 'QFZ-098', // Foto 3
    numeroInterno: '108',
    empresa: 'Rápido El Carmen', // Foto 3
    modelo: 'Mercedes-Benz Sprinter 2024',
    capacidadPasajeros: 19,
    conductorAsignado: 'Carlos Rodríguez',
    rutaActual: 'Ubaté &rarr; Guachetá',
    estado: 'EN_RUTA',
    latitud: 5.3480,
    longitud: -73.7650,
    velocidadKmH: 42.5,
    calificacion: 4.9,
    aireAcondicionado: true,
    wifi: true,
  },
  {
    id: 'bus_02',
    placa: 'WOH-321', // Foto 2 (Sutatausa)
    numeroInterno: '104',
    empresa: 'Cootransubaté',
    modelo: 'Chevrolet NPR Buseta 2023',
    capacidadPasajeros: 24,
    conductorAsignado: 'Don Gonzalo Briceño',
    rutaActual: 'Ubaté &rarr; Sutatausa',
    estado: 'EN_RUTA',
    latitud: 5.2850,
    longitud: -73.8320,
    velocidadKmH: 38.0,
    calificacion: 4.8,
    aireAcondicionado: true,
    wifi: false,
  },
  {
    id: 'bus_03',
    placa: 'TLU-452',
    numeroInterno: '055',
    empresa: 'Cootranscarupa',
    modelo: 'Hino Dutro City 2022',
    capacidadPasajeros: 28,
    conductorAsignado: 'Jairo Pachón',
    rutaActual: 'Ubaté &rarr; Carmen de Carupa',
    estado: 'DISPONIBLE',
    latitud: 5.3094,
    longitud: -73.8164,
    velocidadKmH: 0,
    calificacion: 4.7,
    aireAcondicionado: true,
    wifi: true,
  },
  {
    id: 'bus_04',
    placa: 'SMJ-881',
    numeroInterno: '210',
    empresa: 'Flota Rionegro',
    modelo: 'Agrale MA 8.5 2023',
    capacidadPasajeros: 22,
    conductorAsignado: 'Mauricio Peña',
    rutaActual: 'Ubaté &rarr; Cucunubá',
    estado: 'EN_RUTA',
    latitud: 5.2700,
    longitud: -73.7700,
    velocidadKmH: 35.0,
    calificacion: 5.0,
    aireAcondicionado: false,
    wifi: true,
  },
];

export const BusesView: React.FC = () => {
  const [buses, setBuses] = useState<BusFlota[]>(BUSES_DEFAULT);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const filtrados = buses.filter((b) => {
    const match =
      b.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      b.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      b.conductorAsignado.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || b.estado === filtroEstado;
    return match && matchEstado;
  });

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Flota de Buses Intermunicipales</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {buses.length} Vehículos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoreo satelital y telemetría de la flota del Valle de Ubaté
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar placa (QFZ-098...)"
              className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filtrados.map((b) => (
          <div
            key={b.id}
            className="buses-list-item cheems-glass w-full min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4 border border-cyan-500/30 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white font-mono">{b.placa}</h3>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                        Int. #{b.numeroInterno}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{b.empresa}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    b.estado === 'EN_RUTA'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {b.estado === 'EN_RUTA' ? 'En Ruta' : 'Disponible'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/60 p-3 rounded-2xl border border-cyan-500/15">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Modelo</span>
                  <span className="font-semibold text-white truncate block">{b.modelo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Conductor</span>
                  <span className="font-semibold text-cyan-300 truncate block">
                    {b.conductorAsignado}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Capacidad</span>
                  <span className="font-semibold text-white block">{b.capacidadPasajeros} Pasajeros</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Telemetría GPS</span>
                  <span className="font-semibold text-emerald-400 block font-mono flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400" />
                    {b.velocidadKmH} km/h
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                {b.aireAcondicionado && (
                  <span className="flex items-center gap-1 text-[11px] text-cyan-300">
                    <Wind className="w-3 h-3 text-cyan-400" /> Aire A/C
                  </span>
                )}
                {b.wifi && (
                  <span className="flex items-center gap-1 text-[11px] text-cyan-300">
                    <Wifi className="w-3 h-3 text-cyan-400" /> Wi-Fi
                  </span>
                )}
              </div>

              <span className="text-[11px] text-cyan-400/90 font-mono">
                GPS Activo en {b.placa}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
