import type { AppUser, RankingEntry } from '../models/types';

export interface RankingSourceEntry {
  uid: string;
  name: string;
  points: number;
}

export const buildTopRanking = (
  sourceEntries: RankingSourceEntry[],
  currentUser: AppUser,
  currentPoints: number,
): RankingEntry[] => {
  const currentEntry: RankingEntry = {
    uid: currentUser.uid,
    name: currentUser.displayName || 'Jugador actual',
    points: currentPoints,
    isCurrentUser: true,
  };

  return [...sourceEntries.filter((entry) => entry.uid !== currentUser.uid), currentEntry]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map((entry) => ({
      ...entry,
      isCurrentUser: entry.uid === currentUser.uid,
    }));
};
