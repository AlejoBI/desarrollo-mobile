import { useCallback, useState } from "react";
import type { Position } from "@capacitor/geolocation";
import {
  getNearbyPlaces,
  reverseGeocode,
  type NearbyPlace,
} from "../services/opencageService";

interface UseTrackingPlacesParams {
  isConnected: boolean;
  currentPosition: Position | null;
  getCurrentLocation: () => Promise<Position | null>;
}

export const useTrackingPlaces = ({
  isConnected,
  currentPosition,
  getCurrentLocation,
}: UseTrackingPlacesParams) => {
  const [address, setAddress] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  const refreshAddressAndPlaces = useCallback(async () => {
    if (!isConnected) {
      setPlacesError("Sin conexion: no se consulta direccion ni mapa.");
      setAddress(null);
      setNearbyPlaces([]);
      return;
    }

    const position = currentPosition ?? (await getCurrentLocation());

    if (!position) {
      setPlacesError("Primero debes obtener una ubicacion valida.");
      return;
    }

    setPlacesLoading(true);
    setPlacesError(null);

    try {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const [addressResult, placesResult] = await Promise.all([
        reverseGeocode(latitude, longitude),
        getNearbyPlaces(latitude, longitude),
      ]);

      setAddress(addressResult);
      setNearbyPlaces(placesResult);
    } catch (serviceError: unknown) {
      setPlacesError(
        serviceError instanceof Error
          ? serviceError.message
          : "No fue posible cargar direccion y lugares cercanos.",
      );
    } finally {
      setPlacesLoading(false);
    }
  }, [currentPosition, getCurrentLocation, isConnected]);

  return {
    address,
    nearbyPlaces,
    placesLoading,
    placesError,
    refreshAddressAndPlaces,
  };
};
