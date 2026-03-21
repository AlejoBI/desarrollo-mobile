import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Task, TaskPayload } from "../types/task";

const TASKS_COLLECTION = "tasks";

export const useFirebaseTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const tasksRef = collection(db, TASKS_COLLECTION);
    const tasksQuery = query(
      tasksRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const nextTasks: Task[] = snapshot.docs.map((item) => {
          const data = item.data() as Omit<Task, "id">;
          return {
            id: item.id,
            ...data,
          };
        });

        setTasks(nextTasks);
        setLoading(false);
      },
      (snapshotError) => {
        const message =
          snapshotError instanceof Error
            ? snapshotError.message
            : "Failed to load tasks.";

        setError(message);
        setTasks([]);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const addTask = useCallback(
    async (payload: TaskPayload) => {
      if (!userId) {
        throw new Error("No authenticated user.");
      }

      await addDoc(collection(db, TASKS_COLLECTION), {
        title: payload.title,
        description: payload.description,
        completed: payload.completed ?? false,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [userId],
  );

  const updateTask = useCallback(
    async (taskId: string, payload: Partial<TaskPayload>) => {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    },
    [],
  );

  const deleteTask = useCallback(async (taskId: string) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  }, []);

  const getTaskById = useCallback(
    async (taskId: string) => {
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      const snapshot = await getDoc(taskRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data() as Omit<Task, "id">;
      if (!userId || data.userId !== userId) {
        return null;
      }

      return {
        id: snapshot.id,
        ...data,
      } as Task;
    },
    [userId],
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };
};
