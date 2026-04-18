import { useEffect, useState } from 'react';
import { Network, type ConnectionStatus } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

export interface NetworkStatusState {
  isOnline: boolean;
  connectionType: string;
}

const initialStatus: NetworkStatusState = {
  isOnline: true,
  connectionType: 'unknown',
};

export const useNetworkStatus = (): NetworkStatusState => {
  const [status, setStatus] = useState<NetworkStatusState>(initialStatus);

  useEffect(() => {
    let networkListener: PluginListenerHandle | null = null;

    const applyStatus = (next: ConnectionStatus) => {
      setStatus({
        isOnline: next.connected,
        connectionType: next.connectionType,
      });
    };

    const initialize = async () => {
      try {
        const current = await Network.getStatus();
        applyStatus(current);

        networkListener = await Network.addListener('networkStatusChange', applyStatus);
      } catch {
        setStatus({
          isOnline: navigator.onLine,
          connectionType: navigator.onLine ? 'wifi' : 'none',
        });
      }
    };

    const handleOnline = () => {
      setStatus((previous) => ({
        ...previous,
        isOnline: true,
      }));
    };

    const handleOffline = () => {
      setStatus((previous) => ({
        ...previous,
        isOnline: false,
        connectionType: 'none',
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    void initialize();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (networkListener) {
        void networkListener.remove();
      }
    };
  }, []);

  return status;
};
