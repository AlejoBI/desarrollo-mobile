import Dexie, { type Table } from 'dexie';
import type { PersistedMissionState } from '../models/types';

export interface ProgressRecord {
  userId: string;
  displayName: string;
  points: number;
  missions: PersistedMissionState[];
  updatedAt: number;
}

class MissionsDexieDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;

  constructor() {
    super('missionsChallengeDb');

    this.version(1).stores({
      progress: 'userId, updatedAt',
    });
  }
}

export const appDb = new MissionsDexieDatabase();
