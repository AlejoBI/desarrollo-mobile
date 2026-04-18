import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  buildDefaultProgress,
  DISTANCE_GOAL_METERS,
  MISSION_DEFINITIONS,
  missionPointsById,
  STATIONARY_SECONDS_GOAL,
} from '../constants/missions';
import type {
  AccelerometerState,
  AppUser,
  GeolocationState,
  MissionId,
  MissionViewModel,
  RankingEntry,
  UserProgress,
} from '../models/types';
import type { ProgressService } from '../services/progressService';
import { normalizeUserProgress } from '../utils/progressUtils';
import { useAccelerometer } from './useAccelerometer';
import { useGeolocation } from './useGeolocation';

interface UseMissionsOptions {
  user: AppUser | null;
  primaryService: ProgressService;
  backupService: ProgressService;
}

export interface MissionsState {
  loading: boolean;
  saving: boolean;
  points: number;
  missions: MissionViewModel[];
  progressPercentage: number;
  completedCount: number;
  totalMissions: number;
  photoEvidenceUri: string | null;
  cameraError: string | null;
  geolocation: GeolocationState;
  accelerometer: AccelerometerState;
  ranking: RankingEntry[];
  rankingLoading: boolean;
  completePhotoMission: () => Promise<void>;
  startMovementMission: () => Promise<void>;
  stopMovementMission: () => Promise<void>;
  startStationaryMission: () => Promise<void>;
  stopStationaryMission: () => Promise<void>;
  refreshRanking: () => Promise<void>;
}

export const useMissions = ({
  user,
  primaryService,
  backupService,
}: UseMissionsOptions): MissionsState => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(buildDefaultProgress());
  const progressRef = useRef<UserProgress>(buildDefaultProgress());
  const [photoEvidenceUri, setPhotoEvidenceUri] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  const geolocationHook = useGeolocation({ distanceGoalMeters: DISTANCE_GOAL_METERS });
  const accelerometerHook = useAccelerometer({ stationaryGoalSeconds: STATIONARY_SECONDS_GOAL });
  const { startTracking, stopTracking, hasReachedDistance, reset: resetTracking } = geolocationHook;
  const {
    startMonitoring,
    stopMonitoring,
    goalReached,
    reset: resetMonitoring,
  } = accelerometerHook;
  const notificationIdRef = useRef(1000);

  const scheduleNotification = useCallback(async (body: string) => {
    try {
      notificationIdRef.current = Math.min(notificationIdRef.current + 1, 2147483647);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationIdRef.current,
            title: 'Missions Challenge',
            body,
            schedule: { at: new Date(Date.now() + 250) },
          },
        ],
      });
    } catch {
      // Notification failure should not block mission completion.
    }
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    void LocalNotifications.requestPermissions();
  }, []);

  const persistProgress = useCallback(
    async (nextProgress: UserProgress) => {
      if (!user) {
        return;
      }

      setSaving(true);
      const shouldSaveBackup = primaryService !== backupService;
      const saveJobs = [primaryService.saveProgress(user, nextProgress)];

      if (shouldSaveBackup) {
        saveJobs.push(backupService.saveProgress(user, nextProgress));
      }

      await Promise.allSettled(saveJobs);
      setSaving(false);
    },
    [backupService, primaryService, user],
  );

  const markMissionCompleted = useCallback(
    async (missionId: MissionId) => {
      const previous = progressRef.current;
      const currentMission = previous.missions.find((mission) => mission.id === missionId);
      if (!currentMission || currentMission.completed) {
        return;
      }

      if (missionId === 3) {
        const missionTwoCompleted = previous.missions.some(
          (mission) => mission.id === 2 && mission.completed,
        );
        if (!missionTwoCompleted) {
          return;
        }
      }

      const missions = previous.missions.map((mission) =>
        mission.id === missionId ? { ...mission, completed: true } : mission,
      );

      const nextProgress: UserProgress = {
        points: previous.points + missionPointsById(missionId),
        missions,
      };

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      const pendingCount = nextProgress.missions.filter((mission) => !mission.completed).length;
      await persistProgress(nextProgress);
      await scheduleNotification('¡Has completado una misión!');
      if (pendingCount === 1) {
        await scheduleNotification('Te falta 1 misión para completar');
      }
    },
    [persistProgress, scheduleNotification],
  );

  const hasMediaPermission = (
    status: Awaited<ReturnType<typeof Camera.checkPermissions>>,
  ): boolean => {
    return (
      status.camera === 'granted' ||
      status.camera === 'limited' ||
      status.photos === 'granted' ||
      status.photos === 'limited'
    );
  };

  const completePhotoMission = useCallback(async () => {
    setCameraError(null);

    try {
      const permissions = await Camera.checkPermissions();
      let granted = hasMediaPermission(permissions);

      if (!granted) {
        const requested = await Camera.requestPermissions();
        granted = hasMediaPermission(requested);
      }

      if (!granted) {
        setCameraError('Permiso de camara/fotos denegado. Habilitalo en ajustes del sistema.');
        return;
      }

      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 85,
        saveToGallery: true,
      });

      const photoUri = photo.webPath || photo.path || null;
      if (photoUri) {
        setPhotoEvidenceUri(photoUri);
        await markMissionCompleted(1);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo obtener la foto.';
      const normalized = message.toLowerCase();
      if (normalized.includes('cancel')) {
        return;
      }

      setCameraError(message);
    }
  }, [markMissionCompleted]);

  const startMovementMission = useCallback(async () => {
    await startTracking();
  }, [startTracking]);

  const stopMovementMission = useCallback(async () => {
    await stopTracking();
    resetTracking();
  }, [resetTracking, stopTracking]);

  const startStationaryMission = useCallback(async () => {
    const missionTwoCompleted = progress.missions.some(
      (mission) => mission.id === 2 && mission.completed,
    );
    if (!missionTwoCompleted) {
      return;
    }

    await startMonitoring();
  }, [progress.missions, startMonitoring]);

  const stopStationaryMission = useCallback(async () => {
    await stopMonitoring();
    resetMonitoring();
  }, [resetMonitoring, stopMonitoring]);

  const refreshRanking = useCallback(async () => {
    if (!user) {
      setRanking([]);
      return;
    }

    setRankingLoading(true);
    const data = await primaryService.getRanking(user, progress.points);
    setRanking(data);
    setRankingLoading(false);
  }, [primaryService, progress.points, user]);

  useEffect(() => {
    if (!user) {
      const fallback = buildDefaultProgress();
      setProgress(fallback);
      progressRef.current = fallback;
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadProgress = async () => {
      setLoading(true);
      try {
        const remote = await primaryService.getProgress(user.uid);
        const normalized = normalizeUserProgress(remote);
        if (!mounted) {
          return;
        }

        setProgress(normalized);
        progressRef.current = normalized;
        await backupService.saveProgress(user, normalized);
      } catch {
        const local = await backupService.getProgress(user.uid);
        if (mounted) {
          const normalizedLocal = normalizeUserProgress(local);
          setProgress(normalizedLocal);
          progressRef.current = normalizedLocal;
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProgress();

    return () => {
      mounted = false;
    };
  }, [backupService, primaryService, user]);

  useEffect(() => {
    if (hasReachedDistance) {
      void markMissionCompleted(2);
      void stopTracking();
    }
  }, [hasReachedDistance, markMissionCompleted, stopTracking]);

  useEffect(() => {
    if (goalReached) {
      void markMissionCompleted(3);
      void stopMonitoring();
    }
  }, [goalReached, markMissionCompleted, stopMonitoring]);

  useEffect(() => {
    void refreshRanking();
  }, [refreshRanking]);

  const missions = useMemo<MissionViewModel[]>(() => {
    const completedById = new Set(
      progress.missions.filter((mission) => mission.completed).map((mission) => mission.id),
    );

    return MISSION_DEFINITIONS.map((mission) => {
      const completed = completedById.has(mission.id);
      const locked = Boolean(
        mission.requiredMissionId && !completedById.has(mission.requiredMissionId),
      );
      const inProgress =
        (mission.id === 2 && geolocationHook.isTracking && !completed) ||
        (mission.id === 3 && accelerometerHook.isMonitoring && !completed);

      return {
        ...mission,
        completed,
        locked,
        inProgress,
      };
    });
  }, [accelerometerHook.isMonitoring, geolocationHook.isTracking, progress.missions]);

  const completedCount = progress.missions.filter((mission) => mission.completed).length;
  const totalMissions = progress.missions.length;
  const progressPercentage =
    totalMissions === 0 ? 0 : Math.round((completedCount / totalMissions) * 100);

  return {
    loading,
    saving,
    points: progress.points,
    missions,
    progressPercentage,
    completedCount,
    totalMissions,
    photoEvidenceUri,
    cameraError,
    geolocation: {
      initialPosition: geolocationHook.initialPosition,
      currentPosition: geolocationHook.currentPosition,
      distanceMeters: geolocationHook.distanceMeters,
      hasReachedDistance: geolocationHook.hasReachedDistance,
      isTracking: geolocationHook.isTracking,
      error: geolocationHook.error,
    },
    accelerometer: {
      isMonitoring: accelerometerHook.isMonitoring,
      stationarySeconds: accelerometerHook.stationarySeconds,
      goalReached: accelerometerHook.goalReached,
      lastMagnitude: accelerometerHook.lastMagnitude,
    },
    ranking,
    rankingLoading,
    completePhotoMission,
    startMovementMission,
    stopMovementMission,
    startStationaryMission,
    stopStationaryMission,
    refreshRanking,
  };
};
