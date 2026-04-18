import React from 'react';
import { AuthProvider } from './AuthContext';
import { MissionProvider } from './MissionContext';
import { NetworkProvider } from './NetworkContext';

export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <NetworkProvider>
        <MissionProvider>{children}</MissionProvider>
      </NetworkProvider>
    </AuthProvider>
  );
};
