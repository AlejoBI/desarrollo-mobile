import { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "@capacitor/motion";
import type { PluginListenerHandle } from "@capacitor/core";
import { getErrorMessage } from "./utils";

type AccelerationState = {
  x: number;
  y: number;
  z: number;
};

type OrientationState = {
  alpha: number;
  beta: number;
  gamma: number;
};

export const useAccelerometer = () => {
  const [acceleration, setAcceleration] = useState<AccelerationState | null>(
    null,
  );
  const [orientation, setOrientation] = useState<OrientationState | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accelListenerRef = useRef<PluginListenerHandle | null>(null);
  const orientationListenerRef = useRef<PluginListenerHandle | null>(null);

  const stop = useCallback(async () => {
    await accelListenerRef.current?.remove();
    await orientationListenerRef.current?.remove();

    accelListenerRef.current = null;
    orientationListenerRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    if (isListening) {
      return;
    }

    setError(null);

    try {
      accelListenerRef.current = await Motion.addListener("accel", (event) => {
        const nextAcceleration = event.acceleration;

        if (!nextAcceleration) {
          return;
        }

        setAcceleration({
          x: nextAcceleration.x ?? 0,
          y: nextAcceleration.y ?? 0,
          z: nextAcceleration.z ?? 0,
        });
      });

      orientationListenerRef.current = await Motion.addListener(
        "orientation",
        (event) => {
          setOrientation({
            alpha: event.alpha ?? 0,
            beta: event.beta ?? 0,
            gamma: event.gamma ?? 0,
          });
        },
      );

      setIsListening(true);
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible iniciar la lectura de movimiento.",
        ),
      );
      await stop();
    }
  }, [isListening, stop]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  return {
    acceleration,
    orientation,
    isListening,
    error,
    start,
    stop,
  };
};
