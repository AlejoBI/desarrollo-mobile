import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTextarea,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useFilesystem } from "../hooks";
import "./SensorPage.css";

const FilesystemPage: React.FC = () => {
  const {
    fileName,
    content,
    fileUri,
    loading,
    error,
    setFileName,
    setContent,
    writeTextFile,
    readTextFile,
  } = useFilesystem();
  const [message, setMessage] = useState<string | null>(null);

  const handleWrite = async () => {
    const uri = await writeTextFile(content, fileName);
    setMessage(uri ? "Archivo guardado correctamente." : null);
  };

  const handleRead = async () => {
    const data = await readTextFile(fileName);
    setMessage(data !== null ? "Archivo leido correctamente." : null);
  };

  return (
    <SensorPageLayout title="Filesystem">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Archivo</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Nombre del archivo</IonLabel>
            <IonInput
              value={fileName}
              placeholder="sensor-note.txt"
              onIonChange={(event) => setFileName(event.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contenido</IonLabel>
            <IonTextarea
              value={content}
              autoGrow
              placeholder="Escribe algo para guardar"
              onIonChange={(event) => setContent(event.detail.value ?? "")}
            />
          </IonItem>

          <div className="sensor-actions">
            <IonButton
              expand="block"
              disabled={loading}
              onClick={() => void handleWrite()}
            >
              Escribir archivo
            </IonButton>
            <IonButton
              expand="block"
              color="tertiary"
              disabled={loading}
              onClick={() => void handleRead()}
            >
              Leer archivo
            </IonButton>
          </div>

          <p>
            Cargando:{" "}
            <span className="sensor-value">{loading ? "Si" : "No"}</span>
          </p>
          {fileUri ? (
            <p>
              URI: <span className="sensor-value">{fileUri}</span>
            </p>
          ) : null}

          {message ? (
            <IonText color="success">
              <p>{message}</p>
            </IonText>
          ) : null}

          {error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : null}
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default FilesystemPage;
