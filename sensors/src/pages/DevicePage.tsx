import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useDevice } from "../hooks";
import "./SensorPage.css";

const DevicePage: React.FC = () => {
  const {
    deviceInfo,
    batteryInfo,
    languageInfo,
    deviceId,
    loading,
    error,
    reload,
  } = useDevice();

  return (
    <SensorPageLayout title="Device">
      <div className="sensor-actions">
        <IonButton expand="block" onClick={() => void reload()}>
          Recargar datos del dispositivo
        </IonButton>
      </div>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Estado</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Cargando:{" "}
            <span className="sensor-value">{loading ? "Si" : "No"}</span>
          </p>
          {error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : null}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Device Info</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify(deviceInfo, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Battery</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify(batteryInfo, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Language y Device ID</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <pre className="sensor-pre">
            {JSON.stringify({ languageInfo, deviceId }, null, 2)}
          </pre>
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default DevicePage;
