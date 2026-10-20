import { RutaDirections } from '../types';

/**
 * Decodificador de algoritmo de Polilíneas de Google Maps
 * Convierte un string codificado en un arreglo de coordenadas [latitud, longitud]
 */
export function decodificarGooglePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

/**
 * Calcula la distancia haversine en kilómetros entre dos coordenadas
 */
export function calcularDistanciaHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Servicio para calcular ruta con Google Directions API o fallback geográfico
 */
export async function obtenerRutaDirections(
  origen: { lat: number; lng: number },
  destino: { lat: number; lng: number },
  apiKey?: string
): Promise<RutaDirections> {
  const key =
    apiKey ||
    (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY : '') ||
    ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) ||
    '';

  // Si hay API key real configurada, intentar llamada directa a Google Directions API
  if (key && key.startsWith('AIzaSy') && key.length > 20) {
    try {
      // Use vite proxy to bypass CORS
      const url = `/maps-api/maps/api/directions/json?origin=${origen.lat},${origen.lng}&destination=${destino.lat},${destino.lng}&mode=transit&key=${key}`;
      const response = await fetch(url);

      
      if (!response.ok) {
        throw new Error(`Error HTTP del servidor Directions: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        const coordinates = decodificarGooglePolyline(route.overview_polyline.points);

        return {
          coordenadas: coordinates,
          distanciaKm: Number((leg.distance.value / 1000).toFixed(2)),
          duracionMin: Math.max(1, Math.round(leg.duration.value / 60)),
          origenNombre: leg.start_address || 'Punto de abordaje pasajero',
          destinoNombre: leg.end_address || 'Ubicación actual del bus',
          instrucciones: leg.steps?.map((s: any) => s.html_instructions?.replace(/<[^>]*>?/gm, '')) || [],
        };
      } else if (data.status === 'REQUEST_DENIED') {
        console.warn('Google Directions API: Acceso denegado o API key sin permisos. Aplicando fallback de navegación.');
      } else if (data.status === 'ZERO_RESULTS') {
        console.warn('Google Directions API: No se encontró ruta terrestre entre los dos puntos.');
      }
    } catch (err: any) {
      console.warn('Aviso: no fue posible conectar a Google Directions API, usando motor de trazado vectorial:', err.message);
    }
  }

  // Generación matemática de ruta urbana con waypoints para navegación realista
  const distDirecta = calcularDistanciaHaversine(origen.lat, origen.lng, destino.lat, destino.lng);
  const distanciaRuta = Number((distDirecta * 1.25).toFixed(2)); // Factor de sinuosidad vial
  const velocidadPromedioKmH = 26; // Velocidad promedio urbana de transporte público
  const duracionMinutos = Math.max(2, Math.round((distanciaRuta / velocidadPromedioKmH) * 60));

  // Generamos una serie de puntos intermedios que simulan vías ortogonales y curvas urbanas
  const steps = 12;
  const puntos: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Añadimos una pequeña variación sinusoidal para simular avenidas reales
    const curveOffset = Math.sin(t * Math.PI) * 0.0028;
    const lat = origen.lat + (destino.lat - origen.lat) * t + curveOffset * 0.6;
    const lng = origen.lng + (destino.lng - origen.lng) * t - curveOffset * 0.8;
    puntos.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
  }

  return {
    coordenadas: puntos,
    distanciaKm: distanciaRuta,
    duracionMin: duracionMinutos,
    origenNombre: 'Parada Ciudadana (Pasajero)',
    destinoNombre: 'Móvil de Transporte Público (Conductor)',
    instrucciones: [
      'Iniciar desplazamiento en parada designada',
      'Avanzar por el carril exclusivo de transporte masivo',
      'Llegada estimada a la estación de transbordo',
    ],
  };
}
