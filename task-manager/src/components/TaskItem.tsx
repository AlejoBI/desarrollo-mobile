import React from "react";
import { IonItem, IonCheckbox, IonLabel, IonButton } from "@ionic/react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle }) => {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel
        style={{ textDecoration: task.completed ? "line-through" : "none" }}
      >
        {task.title}
      </IonLabel>
      <IonButton slot="end" color="danger" onClick={() => onDelete(task.id)}>
        Eliminar
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
