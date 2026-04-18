export type MissionId = 1 | 2 | 3;

export interface PersistedMissionState {
  id: number;
  completed: boolean;
}

// Required persistence format.
export interface UserProgress {
  points: number;
  missions: PersistedMissionState[];
}

export interface AppUser {
  uid: string;
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  description: string;
  points: number;
  actionLabel: string;
  requiredMissionId?: MissionId;
}

export interface MissionViewModel extends MissionDefinition {
  completed: boolean;
  locked: boolean;
  inProgress: boolean;
}

export interface RankingEntry {
  uid: string;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  initialPosition: LatLng | null;
  currentPosition: LatLng | null;
  distanceMeters: number;
  hasReachedDistance: boolean;
  isTracking: boolean;
  error: string | null;
}

export interface AccelerometerState {
  isMonitoring: boolean;
  stationarySeconds: number;
  goalReached: boolean;
  lastMagnitude: number;
}
