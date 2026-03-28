import { useEffect, useState } from "react";
import {
  ConnectionStatus,
  Network as CapacitorNetwork,
} from "@capacitor/network";

interface NetworkState {
  isOnline: boolean;
  connectionType: ConnectionStatus["connectionType"];
}

export const useNetworkStatus = () => {
  const [network, setNetwork] = useState<NetworkState>({
    isOnline: navigator.onLine,
    connectionType: "unknown",
  });

  useEffect(() => {
    let removed = false;
    let listenerHandle: { remove: () => Promise<void> } | null = null;

    const syncInitialStatus = async () => {
      const status = await CapacitorNetwork.getStatus();
      if (removed) {
        return;
      }

      setNetwork({
        isOnline: status.connected,
        connectionType: status.connectionType,
      });

      listenerHandle = await CapacitorNetwork.addListener(
        "networkStatusChange",
        (nextStatus) => {
          setNetwork({
            isOnline: nextStatus.connected,
            connectionType: nextStatus.connectionType,
          });
        },
      );
    };

    void syncInitialStatus();

    const handleOnline = () =>
      setNetwork((prev) => ({
        ...prev,
        isOnline: true,
      }));

    const handleOffline = () =>
      setNetwork((prev) => ({
        ...prev,
        isOnline: false,
      }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      removed = true;
      if (listenerHandle) {
        void listenerHandle.remove();
      }

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return network;
};
