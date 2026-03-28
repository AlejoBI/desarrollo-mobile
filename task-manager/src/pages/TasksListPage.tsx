import React, { useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useNetwork } from "../contexts/NetworkContext";
import { useTasks } from "../contexts/TasksContext";

const TasksListPage: React.FC = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const { isOnline } = useNetwork();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!title.trim() || !isOnline) {
      return;
    }

    await addTask({
      title,
      description,
      completed: false,
    });

    setTitle("");
    setDescription("");
  };

  const handleToggleTask = async (taskId: string, currentValue: boolean) => {
    await updateTask(taskId, { completed: !currentValue });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color={isOnline ? "success" : "warning"}>
          <p>
            {isOnline ? "Online: Tasks enabled" : "Offline: Tasks disabled"}
          </p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput
            value={title}
            onIonInput={(e) => setTitle(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonInput
            value={description}
            onIonInput={(e) => setDescription(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleAdd} disabled={!isOnline}>
          Add Task
        </IonButton>

        {loading ? (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        ) : tasks.length === 0 ? (
          <IonText color="medium">
            <p>No tasks yet. Create your first task with the + button.</p>
          </IonText>
        ) : (
          <IonList>
            {tasks.map((task) => (
              <IonItem key={task.id}>
                <IonCheckbox
                  slot="start"
                  checked={task.completed}
                  disabled={!isOnline}
                  onIonChange={() => handleToggleTask(task.id, task.completed)}
                />
                <IonLabel
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </IonLabel>
                <IonButton
                  fill="clear"
                  color="danger"
                  disabled={!isOnline}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TasksListPage;
