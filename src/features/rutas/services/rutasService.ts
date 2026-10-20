import { RutaTransporte } from '../../../types';

const RUTAS_STORAGE_KEY = 'cheems_rutas_transporte_valle_ubate_v2';

// Generador de ruta curva realista entre dos puntos con waypoints intermedios
function generarTrayectoReal(
  origen: [number, number],
  destino: [number, number],
  curvaturaIntermedia: [number, number][] = []
): [number, number][] {
  const puntos: [number, number][] = [origen];

  if (curvaturaIntermedia.length > 0) {
    puntos.push(...curvaturaIntermedia);
  } else {
    // Generar 8 puntos intermedios con ligera desviación de carretera
    const pasos = 10;
    for (let i = 1; i < pasos; i++) {
      const frac = i / pasos;
      const lat = origen[0] + (destino[0] - origen[0]) * frac;
      const lng = origen[1] + (destino[1] - origen[1]) * frac;
      // Añadir serpenteo topográfico natural de montaña
      const wiggleLat = Math.sin(frac * Math.PI) * 0.008 * (i % 2 === 0 ? 1 : -0.8);
      const wiggleLng = Math.cos(frac * Math.PI) * 0.006 * (i % 2 === 0 ? -1 : 0.9);
      puntos.push([Number((lat + wiggleLat).toFixed(5)), Number((lng + wiggleLng).toFixed(5))]);
    }
  }

  puntos.push(destino);
  return puntos;
}

// Coordenadas base
const COORD_UBATE: [number, number] = [5.3094, -73.8164];
const COORD_SUTATAUSA: [number, number] = [5.2503, -73.8525];
const COORD_GUACHETA: [number, number] = [5.3853, -73.6853];
const COORD_CARUPA: [number, number] = [5.3486, -73.9056];
const COORD_CUCUNUBA: [number, number] = [5.2575, -73.7431];
const COORD_LENGUAZAQUE: [number, number] = [5.3056, -73.7161];
const COORD_SIMIJACA: [number, number] = [5.5028, -73.8500];
const COORD_SUSA: [number, number] = [5.4489, -73.8206];
const COORD_TAUSA: [number, number] = [5.1967, -73.8869];

// Trayecto Ubaté -> Guachetá (fiel a la foto 3 pasando por la vía rural intermunicipal)
const TRAYECTO_GUACHETA: [number, number][] = [
  COORD_UBATE,
  [5.3150, -73.8100],
  [5.3210, -73.7980],
  [5.3340, -73.7820],
  [5.3480, -73.7650], // Paso El Peñón
  [5.3550, -73.7450],
  [5.3620, -73.7220],
  [5.3710, -73.7040],
  [5.3790, -73.6920],
  COORD_GUACHETA,
];

// Trayecto Ubaté -> Sutatausa (vía Farallones)
const TRAYECTO_SUTATAUSA: [number, number][] = [
  COORD_UBATE,
  [5.2980, -73.8230],
  [5.2850, -73.8320],
  [5.2720, -73.8410],
  [5.2610, -73.8470],
  COORD_SUTATAUSA,
];

export const RUTAS_INICIALES_UBATE: RutaTransporte[] = [
  {
    id: 'ruta_sutatausa',
    nombre: 'Sutatausa',
    origen: 'Ubaté',
    destino: 'Sutatausa',
    horaSalida: '17:59:00', // Foto 2
    vehiculo: 'WOH-321 (Cootransubaté)',
    placa: 'WOH-321',
    empresa: 'Cootransubaté',
    conductorNombre: 'Don Gonzalo Briceño',
    duracionEstimada: '22 min',
    distanciaKm: 12.5,
    tarifa: 4500,
    frecuenciaMin: 20,
    activa: true,
    coordenadasRuta: TRAYECTO_SUTATAUSA,
  },
  {
    id: 'ruta_guacheta',
    nombre: 'Guachetá',
    origen: 'Ubaté',
    destino: 'Guachetá',
    horaSalida: '20:04:00', // Foto 2
    vehiculo: 'QFZ-098 (Rápido el Carmen)', // Foto 3
    placa: 'QFZ-098',
    empresa: 'Rápido El Carmen',
    conductorNombre: 'Carlos Rodríguez',
    duracionEstimada: '47 min', // Foto 3
    distanciaKm: 23.4,
    tarifa: 6500,
    frecuenciaMin: 15,
    activa: true,
    coordenadasRuta: TRAYECTO_GUACHETA,
  },
  {
    id: 'ruta_carupa',
    nombre: 'Carmen de Carupa',
    origen: 'Ubaté',
    destino: 'Carmen de Carupa',
    horaSalida: '06:30:00',
    vehiculo: 'TLU-452 (Cootranscarupa)',
    placa: 'TLU-452',
    empresa: 'Cootranscarupa',
    conductorNombre: 'Jairo Pachón',
    duracionEstimada: '35 min',
    distanciaKm: 18.2,
    tarifa: 5000,
    frecuenciaMin: 25,
    activa: true,
    coordenadasRuta: generarTrayectoReal(COORD_UBATE, COORD_CARUPA),
  },
  {
    id: 'ruta_cucunuba',
    nombre: 'Cucunubá',
    origen: 'Ubaté',
    destino: 'Cucunubá',
    horaSalida: '08:15:00',
    vehiculo: 'SMJ-881 (Flota Rionegro)',
    placa: 'SMJ-881',
    empresa: 'Flota Rionegro',
    conductorNombre: 'Mauricio Peña',
    duracionEstimada: '28 min',
    distanciaKm: 14.8,
    tarifa: 4500,
    frecuenciaMin: 30,
    activa: true,
    coordenadasRuta: generarTrayectoReal(COORD_UBATE, COORD_CUCUNUBA),
  },
  {
    id: 'ruta_lenguazaque',
    nombre: 'Lenguazaque',
    origen: 'Ubaté',
    destino: 'Lenguazaque',
    horaSalida: '14:00:00',
    vehiculo: 'WZK-109 (Transalianza)',
    placa: 'WZK-109',
    empresa: 'Transalianza Valle de Ubaté',
    conductorNombre: 'Hernando Forero',
    duracionEstimada: '42 min',
    distanciaKm: 21.6,
    tarifa: 6000,
    frecuenciaMin: 40,
    activa: true,
    coordenadasRuta: generarTrayectoReal(COORD_UBATE, COORD_LENGUAZAQUE),
  },
  {
    id: 'ruta_simijaca',
    nombre: 'Simijaca',
    origen: 'Ubaté',
    destino: 'Simijaca',
    horaSalida: '11:45:00',
    vehiculo: 'UBT-774 (Cootransubaté)',
    placa: 'UBT-774',
    empresa: 'Cootransubaté',
    conductorNombre: 'Gabriel Téllez',
    duracionEstimada: '30 min',
    distanciaKm: 19.1,
    tarifa: 5500,
    frecuenciaMin: 20,
    activa: true,
    coordenadasRuta: generarTrayectoReal(COORD_UBATE, COORD_SIMIJACA),
  },
];

export const rutasService = {
  obtenerRutas(): RutaTransporte[] {
    try {
      const data = localStorage.getItem(RUTAS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(RUTAS_STORAGE_KEY, JSON.stringify(RUTAS_INICIALES_UBATE));
        return RUTAS_INICIALES_UBATE;
      }
      const rutasGuardadas = (JSON.parse(data) as RutaTransporte[]).map((ruta) =>
        ruta.id === 'ruta_guacheta' ? { ...ruta, frecuenciaMin: 15 } : ruta
      );
      const idsGuardados = new Set(rutasGuardadas.map((ruta) => ruta.id));
      const rutasFaltantes = RUTAS_INICIALES_UBATE.filter((ruta) => !idsGuardados.has(ruta.id));
      const todasLasRutas = [...rutasGuardadas, ...rutasFaltantes];
      if (rutasFaltantes.length > 0 || rutasGuardadas.some((ruta) => ruta.id === 'ruta_guacheta')) {
        localStorage.setItem(RUTAS_STORAGE_KEY, JSON.stringify(todasLasRutas));
      }
      return todasLasRutas;
    } catch {
      return RUTAS_INICIALES_UBATE;
    }
  },

  guardarRuta(nuevaRuta: Partial<RutaTransporte>): RutaTransporte {
    const rutas = this.obtenerRutas();
    const id = nuevaRuta.id || `ruta_${Date.now()}`;
    const origen = nuevaRuta.origen || 'Ubaté';
    const destino = nuevaRuta.destino || 'Destino';
    
    // Coordenada estimada si no se entrega
    const coords = nuevaRuta.coordenadasRuta && nuevaRuta.coordenadasRuta.length > 0
      ? nuevaRuta.coordenadasRuta
      : generarTrayectoReal(COORD_UBATE, [COORD_UBATE[0] + 0.05, COORD_UBATE[1] - 0.05]);

    const rutaCompleta: RutaTransporte = {
      id,
      nombre: nuevaRuta.nombre || destino,
      origen,
      destino,
      horaSalida: nuevaRuta.horaSalida || new Date().toLocaleTimeString('es-CO', { hour12: false }),
      vehiculo: nuevaRuta.vehiculo || 'Móvil Cootransubaté',
      placa: nuevaRuta.placa || 'UBT-101',
      empresa: nuevaRuta.empresa || 'Cootransubaté',
      conductorNombre: nuevaRuta.conductorNombre || 'Conductor Certificado',
      duracionEstimada: nuevaRuta.duracionEstimada || '30 min',
      distanciaKm: nuevaRuta.distanciaKm || 15.0,
      tarifa: nuevaRuta.tarifa || 5000,
      frecuenciaMin: nuevaRuta.frecuenciaMin || 30,
      activa: nuevaRuta.activa ?? true,
      coordenadasRuta: coords,
    };

    const index = rutas.findIndex((r) => r.id === id);
    if (index >= 0) {
      rutas[index] = { ...rutas[index], ...rutaCompleta };
    } else {
      rutas.unshift(rutaCompleta);
    }

    localStorage.setItem(RUTAS_STORAGE_KEY, JSON.stringify(rutas));
    return rutaCompleta;
  },

  eliminarRuta(id: string): void {
    const rutas = this.obtenerRutas().filter((r) => r.id !== id);
    localStorage.setItem(RUTAS_STORAGE_KEY, JSON.stringify(rutas));
  },

  obtenerRutaPorId(id: string): RutaTransporte | undefined {
    return this.obtenerRutas().find((r) => r.id === id);
  },
};
