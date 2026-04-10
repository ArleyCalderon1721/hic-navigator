import type { HospitalLocation, RouteResult } from '../../types/hospital.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getLocations(): Promise<HospitalLocation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function findRouteVideo(
  originId: string,
  destinationId: string
): Promise<RouteResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/${originId}/${destinationId}`);
    if (!response.ok) throw new Error('Failed to fetch route');
    return await response.json();
  } catch (error) {
    console.error('Error fetching route:', error);
    return { found: false };
  }
}