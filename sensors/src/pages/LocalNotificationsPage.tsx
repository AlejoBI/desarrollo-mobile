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
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useLocalNotifications } from "../hooks";
import "./SensorPage.css";

const LocalNotificationsPage: React.FC = () => {
  const { permission, lastNotification, error, requestPermission, schedule } =
    useLocalNotifications();

  const [title, setTitle] = useState("Notificacion local");
  const [body, setBody] = useState("Mensaje de prueba desde Ionic + Capacitor");
  const [delay, setDelay] = useState("3");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSchedule = async () => {
    const parsedDelay = Number(delay);
    const delayInSeconds = Number.isNaN(parsedDelay) ? 3 : parsedDelay;
    const notificationId = await schedule(title, body, delayInSeconds);

    if (notificationId !== null) {
      setStatusMessage(`Notificacion programada con id ${notificationId}.`);
    }
  };

  return (
    <SensorPageLayout title="Local Notifications">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Programar notificacion</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Titulo</IonLabel>
            <IonInput
              value={title}
              onIonChange={(event) => setTitle(event.detail.value ?? "")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Mensaje</IonLabel>
            <IonInput
              value={body}
              onIonChange={(event) => setBody(event.detail.value ?? "")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Delay (segundos)</IonLabel>
            <IonInput
              type="number"
              value={delay}
              onIonChange={(event) => setDelay(event.detail.value ?? "3")}
            />
          </IonItem>

          <div className="sensor-actions">
            <IonButton expand="block" onClick={() => void requestPermission()}>
              Solicitar permisos
            </IonButton>
            <IonButton
              expand="block"
              color="success"
              onClick={() => void handleSchedule()}
            >
              Programar notificacion
            </IonButton>
          </div>

          <p>
            Permiso:{" "}
            <span className="sensor-value">
              {permission?.display ?? "desconocido"}
            </span>
          </p>

          {statusMessage ? (
            <IonText color="success">
              <p>{statusMessage}</p>
            </IonText>
          ) : null}

          {error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : null}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Ultima notificacion recibida</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify(lastNotification, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default LocalNotificationsPage;
