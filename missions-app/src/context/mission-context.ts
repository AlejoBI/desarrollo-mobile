import { createContext } from 'react';
import type { MissionsState } from '../hooks/useMissions';

export const MissionContext = createContext<MissionsState | undefined>(undefined);
