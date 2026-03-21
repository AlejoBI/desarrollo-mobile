import React, { useEffect, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { useTasks } from "../contexts/TasksContext";

interface RouteParams {
  id?: string;
}

const TaskFormPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const isEditMode = Boolean(id);
  const history = useHistory();
  const { addTask, updateTask, getTaskById } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingTask, setLoadingTask] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        return;
      }

      setLoadingTask(true);
      setError("");
      const task = await getTaskById(id);

      if (!task) {
        setError("Task not found.");
      } else {
        setTitle(task.title);
        setDescription(task.description);
      }

      setLoadingTask(false);
    };

    void loadTask();
  }, [getTaskById, id]);

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (isEditMode && id) {
      await updateTask(id, {
        title: title.trim(),
        description: description.trim(),
      });
      history.replace(`/tasks/detail/${id}`);
      return;
    }

    await addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
    });
    history.replace("/tasks");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>{isEditMode ? "Edit Task" : "Add Task"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loadingTask ? (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                value={title}
                onIonInput={(event) => setTitle(event.detail.value ?? "")}
                placeholder="Task title"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                value={description}
                onIonInput={(event) => setDescription(event.detail.value ?? "")}
                placeholder="Task details"
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={handleSubmit}>
              {isEditMode ? "Save changes" : "Create task"}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskFormPage;
