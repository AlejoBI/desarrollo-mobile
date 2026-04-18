import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { buildTopRanking } from '../constants/ranking';
import { firestoreDb, isFirebaseConfigured } from '../firebase/config';
import type { AppUser, RankingEntry, UserProgress } from '../models/types';
import { normalizeUserProgress } from '../utils/progressUtils';
import { dexieProgressService } from './dexieProgressService';
import type { ProgressService } from './progressService';

const COLLECTION = 'missionsProgress';

export const firebaseService: ProgressService = {
  async getProgress(userId: string): Promise<UserProgress> {
    if (!isFirebaseConfigured || !firestoreDb) {
      return dexieProgressService.getProgress(userId);
    }

    const progressRef = doc(firestoreDb, COLLECTION, userId);
    const snapshot = await getDoc(progressRef);

    if (!snapshot.exists()) {
      return normalizeUserProgress(null);
    }

    return normalizeUserProgress(snapshot.data() as Partial<UserProgress>);
  },

  async saveProgress(user: AppUser, progress: UserProgress): Promise<void> {
    if (!isFirebaseConfigured || !firestoreDb) {
      await dexieProgressService.saveProgress(user, progress);
      return;
    }

    const progressRef = doc(firestoreDb, COLLECTION, user.uid);
    await setDoc(
      progressRef,
      {
        ...progress,
        displayName: user.displayName,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  },

  async getRanking(currentUser: AppUser, currentPoints: number): Promise<RankingEntry[]> {
    if (!isFirebaseConfigured || !firestoreDb) {
      return dexieProgressService.getRanking(currentUser, currentPoints);
    }

    const rankingQuery = query(
      collection(firestoreDb, COLLECTION),
      orderBy('points', 'desc'),
      limit(5),
    );
    const snapshot = await getDocs(rankingQuery);

    const sourceEntries: RankingEntry[] = snapshot.docs.map((item) => {
      const data = item.data() as Partial<UserProgress> & { displayName?: string };
      return {
        uid: item.id,
        name: data.displayName || item.id,
        points: typeof data.points === 'number' ? data.points : 0,
      };
    });

    return buildTopRanking(sourceEntries, currentUser, currentPoints);
  },
};
