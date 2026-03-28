import React, { createContext, useContext } from "react";
import { useDexieFruits } from "../hooks/useDexieFruits";
import { Fruit, FruitPayload } from "../types/fruit";

interface FruitsContextValue {
  fruits: Fruit[];
  loading: boolean;
  addFruit: (payload: FruitPayload) => Promise<void>;
  deleteFruit: (fruitId: number) => Promise<void>;
}

const FruitsContext = createContext<FruitsContextValue | undefined>(undefined);

interface FruitsProviderProps {
  children: React.ReactNode;
}

export const FruitsProvider: React.FC<FruitsProviderProps> = ({ children }) => {
  const fruits = useDexieFruits();

  return (
    <FruitsContext.Provider value={fruits}>{children}</FruitsContext.Provider>
  );
};

export const useFruits = () => {
  const context = useContext(FruitsContext);
  if (!context) {
    throw new Error("useFruits must be used inside FruitsProvider");
  }

  return context;
};
