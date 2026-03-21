export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  completed?: boolean;
}
