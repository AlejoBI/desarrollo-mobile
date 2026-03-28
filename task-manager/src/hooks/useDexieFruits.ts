import { useCallback, useEffect, useState } from "react";
import { fruitsDb, newFunction } from "../config/fruitsDb";
import { Fruit, FruitPayload } from "../types/fruit";

export const useDexieFruits = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFruits = useCallback(async () => {
    const data = await fruitsDb.fruits.orderBy("createdAt").reverse().toArray();
    setFruits(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadFruits();
  }, [loadFruits]);

  const addFruit = useCallback(
    async (payload: FruitPayload) => {
      const fruit = newFunction(payload);
      await fruitsDb.fruits.add(fruit);
      await loadFruits();
    },
    [loadFruits],
  );

  const deleteFruit = useCallback(
    async (fruitId: number) => {
      await fruitsDb.fruits.delete(fruitId);
      await loadFruits();
    },
    [loadFruits],
  );

  return {
    fruits,
    loading,
    addFruit,
    deleteFruit,
  };
};
