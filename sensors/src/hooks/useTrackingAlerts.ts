import { useEffect, useRef } from "react";

interface UseTrackingAlertsParams {
  isConnected: boolean;
  isBatteryLow: boolean;
  isWatching: boolean;
  lastMovementAt: number;
  currentSpeed: number | null | undefined;
  schedule: (
    title: string,
    body: string,
    delayInSeconds?: number,
    id?: number,
  ) => Promise<number | null>;
  noMovementAlertMs: number;
  fastSpeedThresholdMps: number;
}

export const useTrackingAlerts = ({
  isConnected,
  isBatteryLow,
  isWatching,
  lastMovementAt,
  currentSpeed,
  schedule,
  noMovementAlertMs,
  fastSpeedThresholdMps,
}: UseTrackingAlertsParams) => {
  const noMovementNotifiedRef = useRef(false);
  const offlineNotifiedRef = useRef(false);
  const lowBatteryNotifiedRef = useRef(false);
  const lastSpeedAlertAtRef = useRef(0);

  useEffect(() => {
    if (isWatching) {
      return;
    }

    noMovementNotifiedRef.current = false;
    offlineNotifiedRef.current = false;
    lowBatteryNotifiedRef.current = false;
    lastSpeedAlertAtRef.current = 0;
  }, [isWatching]);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    if (!isConnected && !offlineNotifiedRef.current) {
      offlineNotifiedRef.current = true;
      void schedule(
        "Sin conexion",
        "Se pauso la consulta de direccion/mapa hasta recuperar internet.",
        1,
      );
      return;
    }

    if (isConnected) {
      offlineNotifiedRef.current = false;
    }
  }, [isConnected, isWatching, schedule]);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    if (isBatteryLow && !lowBatteryNotifiedRef.current) {
      lowBatteryNotifiedRef.current = true;
      void schedule(
        "Bateria baja",
        "Tracking detenido automaticamente para ahorrar bateria.",
        1,
      );
      return;
    }

    if (!isBatteryLow) {
      lowBatteryNotifiedRef.current = false;
    }
  }, [isBatteryLow, isWatching, schedule]);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    const checkNoMovement = () => {
      const elapsed = Date.now() - lastMovementAt;

      if (elapsed > noMovementAlertMs && !noMovementNotifiedRef.current) {
        noMovementNotifiedRef.current = true;
        void schedule(
          "Sin movimiento",
          "Llevas bastante tiempo sin moverte.",
          1,
        );
      }
    };

    const interval = window.setInterval(checkNoMovement, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isWatching, lastMovementAt, noMovementAlertMs, schedule]);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    if (
      typeof currentSpeed !== "number" ||
      currentSpeed <= fastSpeedThresholdMps
    ) {
      return;
    }

    const now = Date.now();
    const elapsed = now - lastSpeedAlertAtRef.current;

    if (elapsed < 90_000) {
      return;
    }

    lastSpeedAlertAtRef.current = now;

    void schedule(
      "Movimiento rapido",
      `Velocidad alta detectada: ${(currentSpeed * 3.6).toFixed(1)} km/h.`,
      1,
    );
  }, [currentSpeed, fastSpeedThresholdMps, isWatching, schedule]);

  return {
    clearNoMovementAlertFlag: () => {
      noMovementNotifiedRef.current = false;
    },
  };
};
