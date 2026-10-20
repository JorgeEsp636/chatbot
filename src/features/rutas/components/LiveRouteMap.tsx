import React, { useEffect, useRef, useState } from 'react';
import {
  Navigation,
  Bus,
  Clock,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Layers,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Radio,
  Gauge,
  Info,
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import L from 'leaflet';
import { RutaTransporte } from '../../../types';
import { DirectionsPolyline } from '../../mapa/DirectionsPolyline';

interface LiveRouteMapProps {
  rutaSeleccionada: RutaTransporte;
  onVolverTarjetas?: () => void;
  onSeleccionarRuta?: (ruta: RutaTransporte) => void;
  todasLasRutas?: RutaTransporte[];
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  rutaSeleccionada,
  onVolverTarjetas,
  onSeleccionarRuta,
  todasLasRutas = [],
}) => {
  const fallbackMapRef = useRef<HTMLDivElement | null>(null);
  // Estados de animación del bus
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentCoordIndex, setCurrentCoordIndex] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(42.5); // km/h
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tipoMapa, setTipoMapa] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  const coords = rutaSeleccionada.coordenadasRuta;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasGoogleMapsKey = apiKey.startsWith('AIza') && apiKey.length > 20 && !apiKey.includes('EXAMPLE_ONLY');
  const firstCoord = coords[0] || [5.3094, -73.8164];
  const lastCoord = coords[coords.length - 1] || firstCoord;
  const busCoord = coords[currentCoordIndex] || firstCoord;

  useEffect(() => {
    if (hasGoogleMapsKey || !fallbackMapRef.current) return;

    const tileUrl = tipoMapa === 'roadmap'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const map = L.map(fallbackMapRef.current, { zoomControl: true, attributionControl: false }).setView(firstCoord, 11);
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
    if (coords.length > 1) {
      const routeLine = L.polyline(coords, { color: '#0284c7', weight: 5, opacity: 0.9 }).addTo(map);
      map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
    }
    L.marker(firstCoord).addTo(map).bindTooltip(`Origen: ${rutaSeleccionada.origen}`);
    L.marker(lastCoord).addTo(map).bindTooltip(`Destino: ${rutaSeleccionada.destino}`);
    L.marker(busCoord).addTo(map).bindTooltip('Bus en ruta');

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 0);
    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
    };
  }, [hasGoogleMapsKey, rutaSeleccionada, coords, firstCoord, lastCoord, busCoord, tipoMapa]);

  useEffect(() => {
    setCurrentCoordIndex(0);
  }, [rutaSeleccionada]);

  // Loop de simulación de GPS del bus
  useEffect(() => {
    if (!isPlaying || !coords || coords.length === 0) return;

    const timer = setInterval(() => {
      setCurrentCoordIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % coords.length;
        const nextCoord = coords[nextIndex];

        // Variación de velocidad realista
        setCurrentSpeed(Number((38 + Math.sin(nextIndex) * 8 + Math.random() * 4).toFixed(1)));

        return nextIndex;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isPlaying, coords]);

  const handleReset = () => {
    setCurrentCoordIndex(0);
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 px-4 py-3 shadow-[0_8px_24px_rgba(6,182,212,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Ruta seleccionada</p>
            <h2 className="mt-1 truncate text-base font-black text-white sm:text-lg">{rutaSeleccionada.nombre}</h2>
          </div>
          <p className="text-xs font-semibold text-slate-300 sm:text-sm">
            {rutaSeleccionada.origen} <span className="px-1 text-cyan-400">→</span> {rutaSeleccionada.destino}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-slate-900/80 px-4 py-3 shadow-[0_8px_24px_rgba(6,182,212,0.08)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Visualización del mapa</p>
          <p className="mt-1 text-xs text-slate-400">Selecciona cómo quieres ver el recorrido</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-slate-950/85 p-1">
          {([
            ['roadmap', 'Mapa'],
            ['satellite', 'Satélite'],
            ['hybrid', 'Híbrido'],
          ] as const).map(([valor, etiqueta]) => (
            <button
              key={valor}
              type="button"
              onClick={() => setTipoMapa(valor)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition ${
                tipoMapa === valor ? 'bg-cyan-400 text-slate-950' : 'text-cyan-200 hover:bg-slate-800'
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden flex flex-col ${
          isFullscreen ? 'fixed inset-0 z-50 h-screen bg-slate-950' : 'h-[360px] sm:h-[430px] lg:h-[460px] rounded-3xl cheems-glass border border-cyan-500/40 shadow-2xl'
        }`}
      >
      {/* 1. Header / Notificación Superior Flotante: "Vista de trayecto en vivo..." (Foto 3) */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="pointer-events-auto flex-1 max-w-xl">
          <div className="cheems-glass rounded-2xl px-4 py-2.5 border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                  <Radio className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>Vista de trayecto en vivo</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  {rutaSeleccionada.origen}, Cundinamarca &rarr; {rutaSeleccionada.destino}, Cundinamarca
                </div>
              </div>
            </div>

            {onVolverTarjetas && (
              <button
                type="button"
                onClick={onVolverTarjetas}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
            )}
          </div>
        </div>

        {/* Controles rápidos de mapa */}
        <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 transition shadow-lg cursor-pointer"
            title={isPlaying ? 'Pausar Simulación GPS' : 'Reanudar Simulación GPS'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 transition shadow-lg cursor-pointer"
            title="Reiniciar Posición del Bus"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 transition shadow-lg cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 h-full w-full">
        {hasGoogleMapsKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              center={{ lat: firstCoord[0], lng: firstCoord[1] }}
              defaultZoom={12}
              mapTypeId={tipoMapa}
              gestureHandling="greedy"
              mapId="DEMO_MAP_ID"
              streetViewControl={false}
              fullscreenControl={false}
              mapTypeControl={false}
            >
              <DirectionsPolyline coordenadas={coords} />

              <AdvancedMarker position={{ lat: firstCoord[0], lng: firstCoord[1] }} title={`Origen: ${rutaSeleccionada.origen}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-300 bg-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </AdvancedMarker>

              <AdvancedMarker position={{ lat: lastCoord[0], lng: lastCoord[1] }} title={`Destino: ${rutaSeleccionada.destino}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-rose-400 bg-rose-950 shadow-[0_0_15px_rgba(244,63,94,0.8)] text-white">
                  <MapPin className="h-5 w-5" />
                </div>
              </AdvancedMarker>

              <AdvancedMarker position={{ lat: busCoord[0], lng: busCoord[1] }} title="Bus en ruta">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-tr from-cyan-600 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.9)]">
                  <Bus className="h-6 w-6" />
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          <div ref={fallbackMapRef} className="h-full w-full" />
        )}
      </div>

      </div>

      {/* 2. Selector de rutas fuera del mapa */}
      {todasLasRutas.length > 1 && onSeleccionarRuta && (
        <div className="w-full rounded-3xl cheems-glass p-3 sm:p-4 border border-cyan-500/30 shadow-xl">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block px-2">
              Cambiar Ruta:
            </span>
            <div className="flex max-h-44 flex-col gap-2 overflow-y-auto pr-1">
              {todasLasRutas.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSeleccionarRuta(r)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between gap-3 cursor-pointer ${
                    r.id === rutaSeleccionada.id
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="truncate">{r.nombre}</span>
                  <span className="text-[10px] text-cyan-400 font-mono ml-1">{r.horaSalida.slice(0, 5)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Panel de métricas fuera del mapa */}
      <div className="w-full cheems-glass rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {/* 1. Origen */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-300/80 uppercase tracking-wider font-bold block">
                Origen
              </span>
              <span className="text-xs sm:text-sm font-black text-white truncate block mt-0.5">
                {rutaSeleccionada.origen}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">Terminal Principal</span>
            </div>

            {/* 2. Destino */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-300/80 uppercase tracking-wider font-bold block">
                Destino
              </span>
              <span className="text-xs sm:text-sm font-black text-cyan-300 truncate block mt-0.5">
                {rutaSeleccionada.destino}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">Parque Central</span>
            </div>

            {/* 3. Estimación */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-300/80 uppercase tracking-wider font-bold block">
                Estimación
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 truncate block mt-0.5">
                Calculado en mapa
              </span>
              <span className="text-[10px] text-slate-400 truncate block font-mono">
                {rutaSeleccionada.duracionEstimada} • {rutaSeleccionada.distanciaKm} km
              </span>
            </div>

            {/* 4. Vehículo (Foto 3: QFZ-098 Rápido el Carmen) */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-300/80 uppercase tracking-wider font-bold block">
                Vehículo
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 truncate block mt-0.5">
                {rutaSeleccionada.vehiculo}
              </span>
              <span className="text-[10px] text-slate-400 truncate block flex items-center gap-1 font-mono">
                <Gauge className="w-3 h-3 text-cyan-400" />
                {currentSpeed} km/h • GPS Activo
              </span>
            </div>
          </div>
      </div>
    </div>
  );
};
