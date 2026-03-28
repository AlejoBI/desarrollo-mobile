import React, { createContext, useContext } from "react";
import { useFirebaseTasks } from "../hooks/useFirebaseTasks";
import { Task, TaskPayload } from "../types/task";
import { useAuth } from "./AuthContext";

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (payload: TaskPayload) => Promise<void>;
  updateTask: (taskId: string, payload: Partial<TaskPayload>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Promise<Task | null>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

interface TasksProviderProps {
  children: React.ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const tasks = useFirebaseTasks(user?.uid);

  return (
    <TasksContext.Provider value={tasks}>{children}</TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used inside TasksProvider");
  }

  return context;
};
