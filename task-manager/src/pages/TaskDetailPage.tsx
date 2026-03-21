import React, { useEffect, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { useTasks } from "../contexts/TasksContext";
import { Task } from "../types/task";

interface RouteParams {
  id: string;
}

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const { getTaskById, deleteTask } = useTasks();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      const selectedTask = await getTaskById(id);
      setTask(selectedTask);
      setLoading(false);
    };

    void loadTask();
  }, [getTaskById, id]);

  const handleDelete = async () => {
    await deleteTask(id);
    history.replace("/tasks");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>Task Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        ) : !task ? (
          <IonText color="danger">
            <p>Task not found.</p>
          </IonText>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{task.title}</IonCardTitle>
              <IonCardSubtitle>
                {task.completed ? "Completed" : "Pending"}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{task.description || "No description"}</p>
              <IonButton expand="block" routerLink={`/tasks/${task.id}/edit`}>
                Edit
              </IonButton>
              <IonButton expand="block" color="danger" onClick={handleDelete}>
                Delete
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskDetailPage;
