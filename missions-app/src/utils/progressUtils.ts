import { buildDefaultProgress } from '../constants/missions';
import type { PersistedMissionState, UserProgress } from '../models/types';

const normalizeMissions = (
  missions: PersistedMissionState[] | undefined,
): PersistedMissionState[] => {
  const completionById = new Map(
    (missions || []).map((mission) => [Number(mission.id), Boolean(mission.completed)]),
  );

  return buildDefaultProgress().missions.map((mission) => ({
    id: mission.id,
    completed: completionById.get(mission.id) ?? false,
  }));
};

export const normalizeUserProgress = (
  input: Partial<UserProgress> | null | undefined,
): UserProgress => {
  const fallback = buildDefaultProgress();

  if (!input) {
    return fallback;
  }

  return {
    points: typeof input.points === 'number' ? input.points : fallback.points,
    missions: normalizeMissions(input.missions as PersistedMissionState[] | undefined),
  };
};

export const completedMissionsCount = (progress: UserProgress): number => {
  return progress.missions.filter((mission) => mission.completed).length;
};

export const areProgressEqual = (left: UserProgress, right: UserProgress): boolean => {
  if (left.points !== right.points || left.missions.length !== right.missions.length) {
    return false;
  }

  return left.missions.every((mission, index) => {
    const other = right.missions[index];
    return mission.id === other.id && mission.completed === other.completed;
  });
};

export const isProgressAhead = (candidate: UserProgress, base: UserProgress): boolean => {
  const candidateCompleted = completedMissionsCount(candidate);
  const baseCompleted = completedMissionsCount(base);

  if (candidateCompleted !== baseCompleted) {
    return candidateCompleted > baseCompleted;
  }

  return candidate.points > base.points;
};
