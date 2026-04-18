import type { MissionDefinition, MissionId, UserProgress } from '../models/types';

export const TOTAL_MISSIONS = 3;
export const DISTANCE_GOAL_METERS = 30;
export const STATIONARY_SECONDS_GOAL = 10;

export const MISSION_DEFINITIONS: MissionDefinition[] = [
  {
    id: 1,
    title: 'Evidencia fotografica',
    description: 'Captura y guarda una imagen de evidencia.',
    points: 100,
    actionLabel: 'Tomar foto',
  },
  {
    id: 2,
    title: 'Movimiento real',
    description: 'Recorre mas de 30 metros desde la posicion inicial.',
    points: 150,
    actionLabel: 'Iniciar geolocalizacion',
  },
  {
    id: 3,
    title: 'Permanencia activa',
    description: 'Mantente quieto durante 10 segundos para completar.',
    points: 200,
    actionLabel: 'Iniciar modo quietud',
    requiredMissionId: 2,
  },
];

export const buildDefaultProgress = (): UserProgress => ({
  points: 0,
  missions: MISSION_DEFINITIONS.map((mission) => ({
    id: mission.id,
    completed: false,
  })),
});

export const missionPointsById = (missionId: MissionId): number => {
  const mission = MISSION_DEFINITIONS.find((item) => item.id === missionId);
  return mission?.points ?? 0;
};
