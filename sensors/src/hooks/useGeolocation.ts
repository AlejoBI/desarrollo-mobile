import { useCallback, useEffect, useState } from "react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { getErrorMessage } from "./utils";

export const useGeolocation = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);

  const ensurePermissions = useCallback(async () => {
    let permissions = await Geolocation.checkPermissions();

    if (
      permissions.location === "prompt" ||
      permissions.coarseLocation === "prompt"
    ) {
      permissions = await Geolocation.requestPermissions();
    }

    const locationGranted = permissions.location === "granted";
    const coarseGranted = permissions.coarseLocation === "granted";

    if (!locationGranted && !coarseGranted) {
      throw new Error("Permiso de geolocalizacion denegado.");
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await ensurePermissions();

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      setCurrentPosition(position);
      return position;
    } catch (hookError: unknown) {
      const message = getErrorMessage(
        hookError,
        "No fue posible obtener la ubicacion actual.",
      );
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [ensurePermissions]);

  const startWatching = useCallback(async () => {
    setError(null);

    try {
      if (watchId) {
        return;
      }

      await ensurePermissions();

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        (position, watchError) => {
          if (watchError) {
            setError(
              getErrorMessage(
                watchError,
                "Error durante el seguimiento de ubicacion.",
              ),
            );
            return;
          }

          if (position) {
            setCurrentPosition(position);
          }
        },
      );

      setWatchId(id);
      setIsWatching(true);
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible iniciar el seguimiento de ubicacion.",
        ),
      );
    }
  }, [ensurePermissions, watchId]);

  const stopWatching = useCallback(async () => {
    if (!watchId) {
      setIsWatching(false);
      return;
    }

    try {
      await Geolocation.clearWatch({ id: watchId });
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible detener el seguimiento de ubicacion.",
        ),
      );
    } finally {
      setWatchId(null);
      setIsWatching(false);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      void stopWatching();
    };
  }, [stopWatching]);

  return {
    currentPosition,
    isWatching,
    loading,
    error,
    getCurrentLocation,
    startWatching,
    stopWatching,
  };
};
