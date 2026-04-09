import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useGeolocation } from "../hooks";
import "./SensorPage.css";

const GeolocationPage: React.FC = () => {
  const {
    currentPosition,
    isWatching,
    loading,
    error,
    getCurrentLocation,
    startWatching,
    stopWatching,
  } = useGeolocation();

  const coords = currentPosition?.coords;

  return (
    <SensorPageLayout title="Geolocalizacion">
      <div className="sensor-actions">
        <IonButton expand="block" onClick={() => void getCurrentLocation()}>
          Obtener ubicacion actual
        </IonButton>
        <IonButton
          expand="block"
          color="success"
          disabled={isWatching}
          onClick={() => void startWatching()}
        >
          Iniciar watchPosition
        </IonButton>
        <IonButton
          expand="block"
          color="medium"
          disabled={!isWatching}
          onClick={() => void stopWatching()}
        >
          Detener watchPosition
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
          <p>
            Watch activo:{" "}
            <span className="sensor-value">{isWatching ? "Si" : "No"}</span>
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
          <IonCardTitle>Coordenadas</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Latitud:{" "}
            <span className="sensor-value">{coords?.latitude ?? "-"}</span>
          </p>
          <p>
            Longitud:{" "}
            <span className="sensor-value">{coords?.longitude ?? "-"}</span>
          </p>
          <p>
            Precision:{" "}
            <span className="sensor-value">{coords?.accuracy ?? "-"}</span>
          </p>
          <p>
            Timestamp:{" "}
            <span className="sensor-value">
              {currentPosition
                ? new Date(currentPosition.timestamp).toLocaleString()
                : "-"}
            </span>
          </p>
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default GeolocationPage;
