import React, { createContext, useContext } from 'react';
import { useNetworkStatus, type NetworkStatusState } from '../hooks/useNetworkStatus';

const NetworkContext = createContext<NetworkStatusState | undefined>(undefined);

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const status = useNetworkStatus();

  return <NetworkContext.Provider value={status}>{children}</NetworkContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used inside NetworkProvider');
  }

  return context;
};
