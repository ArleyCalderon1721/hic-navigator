import { useState, useEffect } from 'react';
import type { HospitalLocation, RouteResult } from '../types/hospital.types';
import { getLocations, findRouteVideo } from '../modules/search';

export function useRouteVideo() {
  const [originId, setOriginId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [locations, setLocations] = useState<HospitalLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar ubicaciones al montar y detectar origin/destination desde URL
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const urlOrigin = params.get('origin');
  const urlDestination = params.get('destination');

  // Solo cargar parámetros de URL si vienen de un QR (navegación externa)
  // Si es F5, el performance.navigation.type será 1 (reload)
  const isReload = performance.navigation.type === 1;

  if (!isReload) {
    if (urlOrigin) setOriginId(urlOrigin);
    if (urlDestination) setDestinationId(urlDestination);
  } else {
    // Es F5, limpiar la URL también
    window.history.replaceState(null, '', window.location.pathname);
  }

  async function loadLocations() {
    setIsLoading(true);
    const data = await getLocations();
    setLocations(data);
    setIsLoading(false);
  }
  loadLocations();
}, []);

  // Mantener URL en sincronía con la ubicación de origen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (originId) {
      params.set('origin', originId);
    } else {
      params.delete('origin');
    }
    if (destinationId) {
      params.set('destination', destinationId);
    } else {
      params.delete('destination');
    }
    const newRoute = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newRoute);
  }, [originId, destinationId]);

  async function searchRoute() {
    if (!originId || !destinationId) return;

    if (originId === destinationId) {
      setResult({ found: false });
      return;
    }

    const found = await findRouteVideo(originId, destinationId);
    setResult(found);
  }

  function reset() {
    setOriginId('');
    setDestinationId('');
    setResult(null);
  }

  return {
    originId,
    destinationId,
    result,
    locations,
    isLoading,
    setOriginId,
    setDestinationId,
    searchRoute,
    reset,
  };
}