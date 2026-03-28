import { useCallback, useEffect, useState } from "react";
import {
  get,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { rtdb } from "../config/firebase";
import { Task, TaskPayload } from "../types/task";

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

    const tasksRef = ref(rtdb, `tasks/${userId}`);
    const unsubscribe = onValue(
      tasksRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setTasks([]);
          setLoading(false);
          return;
        }

        const value = snapshot.val() as Record<string, Omit<Task, "id">>;
        const nextTasks: Task[] = Object.entries(value).map(([id, data]) => ({
          id,
          ...data,
        }));

        setTasks(nextTasks);
        setLoading(false);
      },
      (onValueError) => {
        const message =
          onValueError instanceof Error
            ? onValueError.message
            : "Unable to load tasks.";
        setError(message);
        setTasks([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const addTask = useCallback(
    async (payload: TaskPayload) => {
      if (!userId) {
        throw new Error("No authenticated user.");
      }

      const tasksRef = ref(rtdb, `tasks/${userId}`);
      const newTaskRef = push(tasksRef);

      await set(newTaskRef, {
        userId,
        title: payload.title.trim(),
        description: payload.description.trim(),
        completed: payload.completed ?? false,
      });
    },
    [userId],
  );

  const updateTask = useCallback(
    async (taskId: string, payload: Partial<TaskPayload>) => {
      if (!userId) {
        throw new Error("No authenticated user.");
      }

      const taskRef = ref(rtdb, `tasks/${userId}/${taskId}`);
      await update(taskRef, payload);
    },
    [userId],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!userId) {
        throw new Error("No authenticated user.");
      }

      const taskRef = ref(rtdb, `tasks/${userId}/${taskId}`);
      await remove(taskRef);
    },
    [userId],
  );

  const getTaskById = useCallback(
    async (taskId: string) => {
      if (!userId) {
        return null;
      }

      const taskRef = ref(rtdb, `tasks/${userId}/${taskId}`);
      const snapshot = await get(taskRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.val() as Omit<Task, "id">;
      if (data.userId !== userId) {
        return null;
      }

      return {
        id: taskId,
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
