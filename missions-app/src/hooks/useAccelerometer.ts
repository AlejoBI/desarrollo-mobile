import { useCallback, useEffect, useRef, useState } from 'react';
import { Haptics } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';
import { STATIONARY_SECONDS_GOAL } from '../constants/missions';
import type { AccelerometerState } from '../models/types';

interface UseAccelerometerOptions {
  stationaryGoalSeconds?: number;
}

const MOVEMENT_THRESHOLD = 0.15;
const COUNTER_TICK_MS = 250;

const INITIAL_STATE: AccelerometerState = {
  isMonitoring: false,
  stationarySeconds: 0,
  goalReached: false,
  lastMagnitude: 0,
};

export const useAccelerometer = (options?: UseAccelerometerOptions) => {
  const stationaryGoalSeconds = options?.stationaryGoalSeconds ?? STATIONARY_SECONDS_GOAL;
  const [state, setState] = useState<AccelerometerState>(INITIAL_STATE);

  const listenerRef = useRef<PluginListenerHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMagnitudeRef = useRef<number>(0);
  const lastMovementAtRef = useRef<number>(Date.now());
  const goalReachedRef = useRef<boolean>(false);

  const updateStationaryState = useCallback(
    (now: number, magnitude?: number) => {
      const stationarySeconds = Math.max(0, Math.floor((now - lastMovementAtRef.current) / 1000));

      if (stationarySeconds >= stationaryGoalSeconds && !goalReachedRef.current) {
        goalReachedRef.current = true;
        void Haptics.vibrate();
      }

      setState((previous) => ({
        ...previous,
        stationarySeconds,
        goalReached: goalReachedRef.current,
        lastMagnitude: magnitude ?? previous.lastMagnitude,
      }));
    },
    [stationaryGoalSeconds],
  );

  const stopMonitoring = useCallback(async () => {
    if (listenerRef.current) {
      await listenerRef.current.remove();
      listenerRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState((previous) => ({
      ...previous,
      isMonitoring: false,
    }));
  }, []);

  const startMonitoring = useCallback(async () => {
    if (listenerRef.current) {
      return;
    }

    goalReachedRef.current = false;
    lastMovementAtRef.current = Date.now();
    lastMagnitudeRef.current = 0;

    setState({
      isMonitoring: true,
      stationarySeconds: 0,
      goalReached: false,
      lastMagnitude: 0,
    });

    timerRef.current = setInterval(() => {
      updateStationaryState(Date.now());
    }, COUNTER_TICK_MS);

    listenerRef.current = await Motion.addListener('accel', (event) => {
      const x = event.acceleration?.x ?? 0;
      const y = event.acceleration?.y ?? 0;
      const z = event.acceleration?.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (lastMagnitudeRef.current === 0) {
        lastMagnitudeRef.current = magnitude;
      }

      const delta = Math.abs(magnitude - lastMagnitudeRef.current);
      if (delta > MOVEMENT_THRESHOLD) {
        lastMovementAtRef.current = now;
      }

      lastMagnitudeRef.current = magnitude;
      updateStationaryState(now, magnitude);
    });
  }, [updateStationaryState]);

  const reset = useCallback(() => {
    goalReachedRef.current = false;
    lastMagnitudeRef.current = 0;
    lastMovementAtRef.current = Date.now();
    setState(INITIAL_STATE);
  }, []);

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        void listenerRef.current.remove();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
    reset,
  };
};
