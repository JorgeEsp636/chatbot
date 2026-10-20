import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface DirectionsPolylineProps {
  coordenadas: [number, number][];
}

export const DirectionsPolyline: React.FC<DirectionsPolylineProps> = ({ coordenadas }) => {
  const map = useMap();
  const polylineRef = React.useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        strokeColor: '#2563EB',
        strokeOpacity: 0.85,
        strokeWeight: 5,
      });
    }

    const path = coordenadas.map((coord) => ({ lat: coord[0], lng: coord[1] }));
    polylineRef.current.setPath(path);
    polylineRef.current.setMap(map);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, coordenadas]);

  return null;
};
