import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { usePushNotifications } from "../hooks";
import "./SensorPage.css";

const PushNotificationsPage: React.FC = () => {
  const pushEnabled =
    String(import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS ?? "false") ===
    "true";

  const {
    permission,
    token,
    lastNotification,
    lastAction,
    error,
    requestPermission,
    register,
  } = usePushNotifications();

  return (
    <SensorPageLayout title="Push Notifications">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Registro</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="sensor-actions">
            <IonButton expand="block" onClick={() => void requestPermission()}>
              Solicitar permisos
            </IonButton>
            <IonButton
              expand="block"
              color="success"
              disabled={!pushEnabled}
              onClick={() => void register()}
            >
              Registrar dispositivo
            </IonButton>
          </div>

          <p>
            Permiso:{" "}
            <span className="sensor-value">
              {permission?.receive ?? "desconocido"}
            </span>
          </p>
          <p>
            Token FCM/APNS: <span className="sensor-value">{token ?? "-"}</span>
          </p>

          {!pushEnabled ? (
            <IonText color="warning">
              <p>
                Push esta deshabilitado en este build.
                Define VITE_ENABLE_PUSH_NOTIFICATIONS=true y agrega
                google-services.json para habilitar registro.
              </p>
            </IonText>
          ) : (
            <IonText color="medium">
              <p>
                Para entorno real, conecta este token con Firebase Cloud
                Messaging en Android/iOS y tu backend de notificaciones.
              </p>
            </IonText>
          )}

          {error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : null}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Ultima push recibida</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify(lastNotification, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Ultima accion en notificacion</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify(lastAction, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default PushNotificationsPage;
