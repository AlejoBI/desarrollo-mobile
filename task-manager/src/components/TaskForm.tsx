import React, { useState } from "react";
import { IonItem, IonInput, IonButton } from "@ionic/react";

interface TaskFormProps {
  onAdd: (title: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => { 
    if (!title.trim()) return; // Si el título no es solo espacios, se agrega la tarea
    onAdd(title.trim()); // Agregar la tarea
    setTitle(""); // Limpiar el campo de entrada después de agregar la tarea
  };

  return (
    <IonItem>
      <IonInput
        value={title}
        placeholder="Nueva tarea..."
        onIonInput={(e) => setTitle(e.detail.value ?? "")}
      />
      <IonButton slot="end" onClick={handleSubmit}>
        Agregar
      </IonButton>
    </IonItem>
  );
};

export default TaskForm;
