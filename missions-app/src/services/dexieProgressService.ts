import { appDb } from '../config/appDb';
import { buildTopRanking } from '../constants/ranking';
import type { AppUser, RankingEntry, UserProgress } from '../models/types';
import type { ProgressService } from './progressService';
import { normalizeUserProgress } from '../utils/progressUtils';

export const dexieProgressService: ProgressService = {
  async getProgress(userId: string): Promise<UserProgress> {
    const record = await appDb.progress.get(userId);
    return normalizeUserProgress(record || null);
  },

  async saveProgress(user: AppUser, progress: UserProgress): Promise<void> {
    const normalized = normalizeUserProgress(progress);

    await appDb.progress.put({
      userId: user.uid,
      displayName: user.displayName,
      points: normalized.points,
      missions: normalized.missions,
      updatedAt: Date.now(),
    });
  },

  async getRanking(currentUser: AppUser, currentPoints: number): Promise<RankingEntry[]> {
    const records = await appDb.progress.toArray();

    const sourceEntries: RankingEntry[] = records.map((record) => ({
      uid: record.userId,
      name: record.displayName || record.userId,
      points: record.points,
    }));

    return buildTopRanking(sourceEntries, currentUser, currentPoints);
  },
};
