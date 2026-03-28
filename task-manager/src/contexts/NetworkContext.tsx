import React, { createContext, useContext } from "react";
import { ConnectionStatus } from "@capacitor/network";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

interface NetworkContextValue {
  isOnline: boolean;
  connectionType: ConnectionStatus["connectionType"];
}

const NetworkContext = createContext<NetworkContextValue | undefined>(
  undefined,
);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const value = useNetworkStatus();

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used inside NetworkProvider");
  }

  return context;
};
