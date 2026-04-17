import { useCallback, useEffect, useRef, useState } from "react";
import type { Position } from "@capacitor/geolocation";
import { type TrackingPoint } from "../services/trackingUtils";

interface UseTrackingHistoryParams {
  fileName: string;
  readTextFile: (targetFileName?: string) => Promise<string | null>;
  writeTextFile: (
    text: string,
    targetFileName?: string,
  ) => Promise<string | null>;
  sampleIntervalMs: number;
  persistIntervalMs: number;
  batteryLevel: number | null;
  connectionType: string;
  isMoving: boolean;
  currentPosition: Position | null;
  isWatching: boolean;
}

export const useTrackingHistory = ({
  fileName,
  readTextFile,
  writeTextFile,
  sampleIntervalMs,
  persistIntervalMs,
  batteryLevel,
  connectionType,
  isMoving,
  currentPosition,
  isWatching,
}: UseTrackingHistoryParams) => {
  const [history, setHistory] = useState<TrackingPoint[]>([]);
  const [historyMessage, setHistoryMessage] = useState<string | null>(null);
  const lastSampleAtRef = useRef(0);
  const lastPersistAtRef = useRef(0);
  const positionRef = useRef<Position | null>(null);
  const watchingRef = useRef(false);
  const batteryLevelRef = useRef<number | null>(null);
  const connectionTypeRef = useRef("");
  const isMovingRef = useRef(false);

  useEffect(() => {
    const loadHistory = async () => {
      const payload = await readTextFile(fileName);

      if (!payload) {
        setHistory([]);
        await writeTextFile("[]", fileName);
        setHistoryMessage("Historial creado en almacenamiento local.");
        return;
      }

      try {
        const parsed = JSON.parse(payload) as TrackingPoint[];

        if (Array.isArray(parsed)) {
          setHistory(parsed);
          setHistoryMessage(`Historial cargado (${parsed.length} registros).`);
        }
      } catch {
        setHistory([]);
        setHistoryMessage("No se pudo parsear el historial guardado.");
      }
    };

    void loadHistory();
  }, [fileName, readTextFile, writeTextFile]);

  useEffect(() => {
    positionRef.current = currentPosition;
    watchingRef.current = isWatching;
    batteryLevelRef.current = batteryLevel;
    connectionTypeRef.current = connectionType;
    isMovingRef.current = isMoving;
  }, [batteryLevel, connectionType, currentPosition, isMoving, isWatching]);

  const appendHistoryPoint = useCallback(() => {
    if (!watchingRef.current || !positionRef.current) {
      return;
    }

    const now = Date.now();

    if (now - lastSampleAtRef.current < sampleIntervalMs) {
      return;
    }

    lastSampleAtRef.current = now;

    const position = positionRef.current;

    const nextPoint: TrackingPoint = {
      timestamp: now,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? null,
      speed: position.coords.speed ?? null,
      batteryLevel: batteryLevelRef.current,
      connectionType: connectionTypeRef.current,
      moving: isMovingRef.current,
    };

    setHistory((prev) => {
      const nextHistory = [nextPoint, ...prev].slice(0, 300);
      const canPersist = now - lastPersistAtRef.current >= persistIntervalMs;

      if (canPersist) {
        lastPersistAtRef.current = now;
        void writeTextFile(JSON.stringify(nextHistory), fileName);
        setHistoryMessage(
          `Historial actualizado (${nextHistory.length} registros).`,
        );
      } else {
        setHistoryMessage(
          `Historial en memoria (${nextHistory.length} registros).`,
        );
      }

      return nextHistory;
    });
  }, [fileName, persistIntervalMs, sampleIntervalMs, writeTextFile]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      appendHistoryPoint();
    }, sampleIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [appendHistoryPoint, sampleIntervalMs]);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    appendHistoryPoint();
  }, [appendHistoryPoint, isWatching]);

  return {
    history,
    historyMessage,
  };
};
