import { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "@capacitor/motion";
import type { PluginListenerHandle } from "@capacitor/core";
import { getErrorMessage } from "./utils";

type AccelerationState = {
  x: number;
  y: number;
  z: number;
};

type UseAccelerometerOptions = {
  sampleIntervalMs?: number;
};

export const useAccelerometer = (options: UseAccelerometerOptions = {}) => {
  const sampleIntervalMs = options.sampleIntervalMs ?? 250;
  const [acceleration, setAcceleration] = useState<AccelerationState | null>(
    null,
  );
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accelListenerRef = useRef<PluginListenerHandle | null>(null);
  const lastSampleAtRef = useRef(0);

  const stop = useCallback(async () => {
    await accelListenerRef.current?.remove();

    accelListenerRef.current = null;
    lastSampleAtRef.current = 0;
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
        const now = Date.now();

        if (!nextAcceleration) {
          return;
        }

        if (now - lastSampleAtRef.current < sampleIntervalMs) {
          return;
        }

        lastSampleAtRef.current = now;

        setAcceleration({
          x: nextAcceleration.x ?? 0,
          y: nextAcceleration.y ?? 0,
          z: nextAcceleration.z ?? 0,
        });
      });

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
  }, [isListening, sampleIntervalMs, stop]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  return {
    acceleration,
    isListening,
    error,
    start,
    stop,
  };
};
