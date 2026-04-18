import { useContext } from 'react';
import { MissionContext } from '../context/mission-context';

export const useMissionContext = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissionContext must be used inside MissionProvider');
  }

  return context;
};
