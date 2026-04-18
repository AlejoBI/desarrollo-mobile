import React, { useEffect, useMemo } from 'react';
import { isFirebaseConfigured } from '../firebase/config';
import { firebaseService } from '../services/firebaseService';
import type { AppUser } from '../models/types';
import type { ProgressService } from '../services/progressService';
import { dexieProgressService } from '../services/dexieProgressService';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';
import { useMissions } from '../hooks/useMissions';
import { MissionContext } from './mission-context';
import { areProgressEqual, isProgressAhead, normalizeUserProgress } from '../utils/progressUtils';

export const MissionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { isOnline } = useNetwork();

  const appUser = useMemo<AppUser | null>(() => {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      displayName: user.displayName || user.email || 'Usuario',
      email: user.email,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
    };
  }, [user]);

  const canUseFirebase = isOnline && isFirebaseConfigured;

  // Primary service follows connectivity; Dexie always keeps an offline source of truth.
  const primaryService = useMemo<ProgressService>(() => {
    if (canUseFirebase) {
      return firebaseService;
    }

    return dexieProgressService;
  }, [canUseFirebase]);

  useEffect(() => {
    if (!appUser || !canUseFirebase) {
      return;
    }

    let mounted = true;

    const synchronizeProgress = async () => {
      try {
        const [remoteRaw, localRaw] = await Promise.all([
          firebaseService.getProgress(appUser.uid),
          dexieProgressService.getProgress(appUser.uid),
        ]);

        if (!mounted) {
          return;
        }

        const remote = normalizeUserProgress(remoteRaw);
        const local = normalizeUserProgress(localRaw);

        if (areProgressEqual(local, remote)) {
          return;
        }

        if (isProgressAhead(local, remote)) {
          await firebaseService.saveProgress(appUser, local);
          return;
        }

        await dexieProgressService.saveProgress(appUser, remote);
      } catch {
        // Sync failures are non-blocking; mission flow continues with local data.
      }
    };

    void synchronizeProgress();

    return () => {
      mounted = false;
    };
  }, [appUser, canUseFirebase]);

  const missionsState = useMissions({
    user: appUser,
    primaryService,
    backupService: dexieProgressService,
  });

  return <MissionContext.Provider value={missionsState}>{children}</MissionContext.Provider>;
};
