export interface HospitalLocation {
  id: string;
  name: string;
  floor: number;
}

export interface RouteVideo {
  id: string;
  originId: string;
  destinationId: string;
  videoUrl: string;
  duration?: string;
}

export interface RouteResult {
  found: boolean;
  video?: RouteVideo;
  origin?: HospitalLocation;
  destination?: HospitalLocation;
}