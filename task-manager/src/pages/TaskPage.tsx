import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
} from "@ionic/react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Aprender React", completed: true },
    { id: 2, title: "Crear un task manager", completed: false },
    { id: 3, title: "Desplegar la app", completed: false },
  ]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        // Si el id de la tarea coincide, se crea una nueva tarea con el estado completado alternado
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TaskForm onAdd={addTask} />
        <IonList>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TaskPage;
