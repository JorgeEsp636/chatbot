import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Bus,
  MapPin,
  Compass,
  Gauge,
  AlertTriangle,
  Play,
  Square,
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { UbicacionConductor, RutaDirections, RutaTransporte, Usuario } from '../../types';
import { mapaService, COORDENADAS_DEFAULT } from './services/mapaService';
import { obtenerRutaDirections } from '../../services/directionsService';
import { DirectionsPolyline } from './DirectionsPolyline';
import { rutasService } from '../rutas/services/rutasService';

interface MapaViewProps {
  usuario?: Usuario;
}

export const MapaView: React.FC<MapaViewProps> = ({ usuario }) => {
  const usuarioActual: Usuario = usuario || {
    id: 'usr_default',
    nombre: 'Pasajero Ubaté',
    email: 'pasajero@valledeubate.transimovil.gov.co',
    rol: 'usuario',
    saldoTarjeta: 25000,
    createdAt: new Date().toISOString(),
  };

  const [modo, setModo] = useState<'pasajero' | 'conductor'>(
    usuarioActual.rol === 'conductor' ? 'conductor' : 'pasajero'
  );

  const [compartiendoUbicacion, setCompartiendoUbicacion] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(5);
  const [conductorGps, setConductorGps] = useState<{ lat: number; lng: number; speed: number; heading: number }>({
    lat: COORDENADAS_DEFAULT.conductorInicial.lat,
    lng: COORDENADAS_DEFAULT.conductorInicial.lng,
    speed: 28.5,
    heading: 195,
  });

  const [ubicacionConductor, setUbicacionConductor] = useState<UbicacionConductor | null>(null);
  const [pasajeroCoord, setPasajeroCoord] = useState<{ lat: number; lng: number }>({
    lat: COORDENADAS_DEFAULT.pasajero.lat,
    lng: COORDENADAS_DEFAULT.pasajero.lng,
  });
  const [ruta, setRuta] = useState<RutaDirections | null>(null);
  const [rutasDisponibles, setRutasDisponibles] = useState<RutaTransporte[]>([]);
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState<string>('');
  const [calculandoRuta, setCalculandoRuta] = useState(false);
  const [errorMapa, setErrorMapa] = useState<string | null>(null);

  useEffect(() => {
    const rutas = rutasService.obtenerRutas();
    setRutasDisponibles(rutas);
    if (!rutaSeleccionadaId && rutas.length > 0) {
      setRutaSeleccionadaId(rutas[0].id);
    }
  }, [rutaSeleccionadaId]);

  useEffect(() => {
    const desuscribir = mapaService.escucharUbicacionConductor((ubicacion) => {
      setUbicacionConductor(ubicacion);
      if (ubicacion && ubicacion.activo) {
        setConductorGps({
          lat: ubicacion.latitude,
          lng: ubicacion.longitude,
          speed: ubicacion.speed || 25,
          heading: ubicacion.heading || 180,
        });
      }
    });
    return () => desuscribir();
  }, []);

  useEffect(() => {
    if (!compartiendoUbicacion) {
      mapaService.setConductorActivo(false);
      return;
    }
    mapaService.setConductorActivo(true);
    
    const countdownTimer = setInterval(() => {
      setSegundosRestantes((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);

    const transmissionTimer = setInterval(async () => {
      setConductorGps((prev) => {
        const deltaLat = -0.0007 + (Math.random() - 0.5) * 0.0002;
        const deltaLng = -0.0003 + (Math.random() - 0.5) * 0.0002;
        const nuevaLat = Number((prev.lat + deltaLat).toFixed(6));
        const nuevaLng = Number((prev.lng + deltaLng).toFixed(6));
        const nuevaVel = Number((24 + Math.random() * 8).toFixed(1));

        mapaService.actualizarUbicacionConductor({
          conductorId: usuarioActual.id,
          conductorNombre: usuarioActual.nombre,
          vehiculo: 'Móvil SITP K-102',
          placa: 'WOH-321',
          ruta: 'Ruta 102 - Carmen de Carupa',
          latitude: nuevaLat,
          longitude: nuevaLng,
          speed: nuevaVel,
          heading: prev.heading,
          activo: true,
        });
        return { ...prev, lat: nuevaLat, lng: nuevaLng, speed: nuevaVel };
      });
    }, 5000);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(transmissionTimer);
    };
  }, [compartiendoUbicacion, usuarioActual]);

  useEffect(() => {
    let cancel = false;
    const fetchRoute = async () => {
      if (!ubicacionConductor?.activo) {
        setRuta(null);
        return;
      }
      setCalculandoRuta(true);
      try {
        const resultado = await obtenerRutaDirections(
          { lat: pasajeroCoord.lat, lng: pasajeroCoord.lng },
          { lat: ubicacionConductor.latitude, lng: ubicacionConductor.longitude }
        );
        if (!cancel && resultado) {
          setRuta(resultado);
        }
      } catch (err: any) {
        if (!cancel) setErrorMapa(err.message);
      } finally {
        if (!cancel) setCalculandoRuta(false);
      }
    };
    fetchRoute();
    return () => { cancel = true; };
  }, [pasajeroCoord, ubicacionConductor]);

  const handleObtenerGpsNativo = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setConductorGps(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }));
        },
        (err) => {
          setErrorMapa(`Error GPS: ${err.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setErrorMapa('Geolocalización no soportada en este navegador.');
    }
  };

  const conductorActivo = ubicacionConductor?.activo ?? false;
  const conductorLat = ubicacionConductor?.latitude ?? conductorGps.lat;
  const conductorLng = ubicacionConductor?.longitude ?? conductorGps.lng;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasGoogleMapsKey = Boolean(apiKey && apiKey.startsWith('AIza') && apiKey.length > 20);
  const rutaSeleccionada = rutasDisponibles.find((rutaItem) => rutaItem.id === rutaSeleccionadaId) || rutasDisponibles[0];
  const mapCenter = rutaSeleccionada?.coordenadas?.length
    ? { lat: rutaSeleccionada.coordenadas[0][0], lng: rutaSeleccionada.coordenadas[0][1] }
    : { lat: conductorLat, lng: conductorLng };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Mapa en Tiempo Real
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visualización de unidades en ruta y paradas de abordaje.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-1 flex">
          <button
            onClick={() => setModo('pasajero')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              modo === 'pasajero' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Modo Pasajero
          </button>
          <button
            onClick={() => setModo('conductor')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              modo === 'conductor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Modo Conductor
          </button>
        </div>
      </div>

      {errorMapa && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMapa}</span>
          </div>
          <button onClick={() => setErrorMapa(null)} className="text-amber-200 hover:underline font-semibold">
            Descartar
          </button>
        </div>
      )}

      {modo === 'conductor' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition ${compartiendoUbicacion ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Móvil K-102 (Placa: WOH-321)</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${compartiendoUbicacion ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {compartiendoUbicacion ? 'TRANSMITIENDO' : 'DETENIDO'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3 font-mono">
                <span>Lat: {conductorGps.lat.toFixed(5)}</span>
                <span>Lng: {conductorGps.lng.toFixed(5)}</span>
                <span className="flex items-center gap-1 text-emerald-400"><Gauge className="w-3 h-3" /> {conductorGps.speed} km/h</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {compartiendoUbicacion && (
              <div className="text-right px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Siguiente reporte en</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">00:0{segundosRestantes} seg</span>
              </div>
            )}
            <button
              onClick={() => setCompartiendoUbicacion(!compartiendoUbicacion)}
              className={`py-3 px-5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                compartiendoUbicacion ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {compartiendoUbicacion ? (
                <><Square className="w-4 h-4 fill-current" /><span>Detener Transmisión GPS</span></>
              ) : (
                <><Play className="w-4 h-4 fill-current" /><span>Compartir Ubicación</span></>
              )}
            </button>
            <button onClick={handleObtenerGpsNativo} className="p-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl transition">
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Llegada Estimada del Bus</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ubicacionConductor?.activo ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                  {ubicacionConductor?.activo ? 'BUS EN RUTA ACTIVA' : 'CONDUCTOR FUERA DE LÍNEA'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {ubicacionConductor?.activo ? `Conductor: ${ubicacionConductor.conductorNombre} • Vehículo: ${ubicacionConductor.vehiculo}` : 'Esperando señal.'}
              </p>
            </div>
          </div>
          {ruta && ubicacionConductor?.activo && (
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">ETA Estimado</span>
                <span className="text-xl font-black text-blue-400 font-mono">{ruta.duracionMin} min</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Distancia</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{ruta.distanciaKm} km</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl rounded-[24px] border border-slate-800 bg-slate-900/80 p-2 shadow-[0_16px_48px_rgba(15,23,42,0.35)]">
        <div className="relative h-[280px] w-full overflow-hidden rounded-[18px] border border-slate-700 bg-slate-950 sm:h-[360px] lg:h-[400px]">
          {!hasGoogleMapsKey ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center">
              <div className="rounded-full border border-amber-500/40 bg-amber-500/10 p-3 text-amber-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mapa de Google no disponible</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Agrega la clave <span className="font-mono text-cyan-300">VITE_GOOGLE_MAPS_API_KEY</span> para ver la ubicación real del bus.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left text-xs text-slate-300">
                <p><span className="font-semibold text-white">Última ubicación:</span> {conductorLat.toFixed(5)}, {conductorLng.toFixed(5)}</p>
                <p><span className="font-semibold text-white">Estado:</span> {conductorActivo ? 'Conductor en ruta' : 'Sin señal activa'}</p>
              </div>
            </div>
          ) : (
            <APIProvider apiKey={apiKey}>
              <Map
                defaultZoom={14}
                center={mapCenter}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={false}
                gestureHandling="greedy"
                streetViewControl={false}
              >
                <AdvancedMarker position={pasajeroCoord} title="Tu Ubicación">
                  <div style={{
                    background: '#2563EB', color: 'white', width: '36px', height: '36px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy={7} r="4"></circle></svg>
                  </div>
                </AdvancedMarker>

                {conductorActivo && (
                  <AdvancedMarker position={{ lat: conductorLat, lng: conductorLng }} title="Conductor">
                    <div style={{
                      background: '#10B981', color: 'white', width: '42px', height: '42px',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '3px solid white', boxShadow: '0 6px 15px rgba(16,185,129,0.5)'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.7 19.1 6 18 6H4c-1.1 0-2.1.7-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"></path><circle cx="7" cy="18" r="2"></circle><circle cx="15" cy="18" r="2"></circle></svg>
                    </div>
                  </AdvancedMarker>
                )}

                {ruta && ruta.coordenadas.length > 0 && (
                  <DirectionsPolyline coordenadas={ruta.coordenadas} />
                )}
              </Map>
            </APIProvider>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.25)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Terminal</p>
          <p className="mt-2 text-lg font-black text-white">Terminal de Ubaté</p>
          <p className="mt-1 text-xs text-slate-400">Origen principal del sistema CHEEMS</p>
        </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Origen</p>
          <p className="mt-2 text-lg font-black text-white">{rutaSeleccionada?.origen || 'Ubaté'}</p>
          <p className="mt-1 text-xs text-slate-400">Salida programada: {rutaSeleccionada?.horaSalida || '--:--'}</p>
        </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Cálculo del mapa</p>
          <p className="mt-2 text-lg font-black text-white">{ruta?.distanciaKm ? `${ruta.distanciaKm} km` : rutaSeleccionada ? `${rutaSeleccionada.distanciaKm} km` : '---'}</p>
          <p className="mt-1 text-xs text-slate-400">{ruta?.duracionMin ? `${ruta.duracionMin} min estimados` : rutaSeleccionada ? `${rutaSeleccionada.duracionEstimada}` : 'Sin ruta asignada'}</p>
        </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Conductor</p>
          <p className="mt-2 text-lg font-black text-white">{rutaSeleccionada?.conductorNombre || 'Sin conductor'}</p>
          <p className="mt-1 text-xs text-slate-400">{rutaSeleccionada?.vehiculo || 'Vehículo no asignado'}</p>
        </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Rutas disponibles</p>
            <h3 className="mt-1 text-lg font-black text-white">Cambiar recorrido</h3>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-300">
            {rutasDisponibles.length} rutas
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rutasDisponibles.map((rutaItem) => {
            const activo = rutaItem.id === (rutaSeleccionada?.id || rutaSeleccionadaId);
            return (
              <button
                key={rutaItem.id}
                type="button"
                onClick={() => setRutaSeleccionadaId(rutaItem.id)}
                className={`rounded-2xl border p-3 text-left transition ${
                  activo
                    ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-slate-700 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black text-white">{rutaItem.nombre}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${activo ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                    {activo ? 'Activa' : 'Ver'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{rutaItem.origen} → {rutaItem.destino}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
                  <span>{rutaItem.horaSalida}</span>
                  <span>{rutaItem.duracionEstimada}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
