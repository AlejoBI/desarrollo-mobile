import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { DISTANCE_GOAL_METERS } from '../constants/missions';
import type { GeolocationState, LatLng } from '../models/types';

interface UseGeolocationOptions {
  distanceGoalMeters?: number;
}

const INITIAL_STATE: GeolocationState = {
  initialPosition: null,
  currentPosition: null,
  distanceMeters: 0,
  hasReachedDistance: false,
  isTracking: false,
  error: null,
};

const toRadians = (value: number): number => (value * Math.PI) / 180;

export const calculateDistanceMeters = (from: LatLng, to: LatLng): number => {
  const earthRadiusMeters = 6371000;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
};

const normalizePosition = (position: Position): LatLng => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

const isLocationGranted = (status: Awaited<ReturnType<typeof Geolocation.checkPermissions>>) => {
  return status.location === 'granted' || status.coarseLocation === 'granted';
};

const normalizeLocationError = (message: string): string => {
  const lowered = message.toLowerCase();
  if (lowered.includes('in time') || lowered.includes('timeout')) {
    return 'No se pudo obtener la ubicacion a tiempo. Verifica GPS activo y prueba en un espacio abierto.';
  }

  return message;
};

export const useGeolocation = (options?: UseGeolocationOptions) => {
  const distanceGoalMeters = options?.distanceGoalMeters ?? DISTANCE_GOAL_METERS;
  const [state, setState] = useState<GeolocationState>(INITIAL_STATE);
  const watchIdRef = useRef<string | null>(null);
  const initialPositionRef = useRef<LatLng | null>(null);
  const trackingRequestIdRef = useRef(0);

  const resolvePermissions = useCallback(async () => {
    const current = await Geolocation.checkPermissions();
    if (isLocationGranted(current)) {
      return current;
    }

    return Geolocation.requestPermissions();
  }, []);

  const stopTracking = useCallback(async () => {
    trackingRequestIdRef.current += 1;

    if (watchIdRef.current) {
      await Geolocation.clearWatch({ id: watchIdRef.current });
      watchIdRef.current = null;
    }

    setState((previous) => ({
      ...previous,
      isTracking: false,
    }));
  }, []);

  const startTracking = useCallback(async () => {
    if (watchIdRef.current) {
      return;
    }

    const requestId = trackingRequestIdRef.current + 1;
    trackingRequestIdRef.current = requestId;

    setState((previous) => ({ ...previous, isTracking: true, error: null }));

    try {
      const permissions = await resolvePermissions();
      if (!isLocationGranted(permissions)) {
        throw new Error(
          'Permiso de geolocalizacion denegado. Habilitalo desde ajustes del sistema.',
        );
      }

      if (trackingRequestIdRef.current !== requestId) {
        return;
      }

      // enableHighAccuracy is only enabled when fine location is granted.
      const enableHighAccuracy = permissions.location === 'granted';
      const firstPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy,
        timeout: 20000,
        maximumAge: 15000,
      });

      if (trackingRequestIdRef.current !== requestId) {
        return;
      }

      const normalizedInitial = normalizePosition(firstPosition);
      initialPositionRef.current = normalizedInitial;

      setState((previous) => ({
        ...previous,
        initialPosition: normalizedInitial,
        currentPosition: normalizedInitial,
        distanceMeters: 0,
        hasReachedDistance: false,
      }));

      watchIdRef.current = await Geolocation.watchPosition(
        {
          enableHighAccuracy,
          timeout: 15000,
          maximumAge: 0,
          minimumUpdateInterval: 1500,
        },
        (position, error) => {
          if (error) {
            setState((previous) => ({
              ...previous,
              error: normalizeLocationError(error.message || 'No se pudo actualizar la ubicacion'),
            }));
            return;
          }

          if (!position || !initialPositionRef.current) {
            return;
          }

          const normalizedCurrent = normalizePosition(position);
          const distanceFromStart = calculateDistanceMeters(
            initialPositionRef.current,
            normalizedCurrent,
          );

          setState((previous) => {
            const maxDistance = Math.max(previous.distanceMeters, distanceFromStart);

            return {
              ...previous,
              currentPosition: normalizedCurrent,
              // Keep the farthest distance reached from the start point to avoid backwards drops.
              distanceMeters: maxDistance,
              hasReachedDistance: maxDistance > distanceGoalMeters,
              error: null,
            };
          });
        },
      );

      if (trackingRequestIdRef.current !== requestId && watchIdRef.current) {
        const pendingWatchId = watchIdRef.current;
        watchIdRef.current = null;
        await Geolocation.clearWatch({ id: pendingWatchId });
      }
    } catch (error) {
      if (trackingRequestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Error de geolocalizacion';

      setState((previous) => ({
        ...previous,
        isTracking: false,
        error: normalizeLocationError(errorMessage),
      }));
    }
  }, [distanceGoalMeters, resolvePermissions]);

  const reset = useCallback(() => {
    initialPositionRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        void Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    reset,
  };
};
