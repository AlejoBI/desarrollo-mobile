import React from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, createOutline, eyeOutline, trashOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TasksContext";

const TasksListPage: React.FC = () => {
  const { logout } = useAuth();
  const { tasks, loading, error, updateTask, deleteTask } = useTasks();

  const handleToggleTask = async (taskId: string, currentValue: boolean) => {
    await updateTask(taskId, { completed: !currentValue });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => logout()}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
                  onIonChange={() => handleToggleTask(task.id, task.completed)}
                />
                <IonLabel
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </IonLabel>
                <IonButton fill="clear" routerLink={`/tasks/detail/${task.id}`}>
                  <IonIcon slot="icon-only" icon={eyeOutline} />
                </IonButton>
                <IonButton fill="clear" routerLink={`/tasks/${task.id}/edit`}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => deleteTask(task.id)}
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/tasks/new">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TasksListPage;
