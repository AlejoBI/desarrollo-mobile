import type { AppUser, RankingEntry, UserProgress } from '../models/types';

export interface ProgressService {
  getProgress(userId: string): Promise<UserProgress>;
  saveProgress(user: AppUser, progress: UserProgress): Promise<void>;
  getRanking(currentUser: AppUser, currentPoints: number): Promise<RankingEntry[]>;
}
