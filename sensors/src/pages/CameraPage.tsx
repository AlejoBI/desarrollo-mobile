import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useCamera } from "../hooks";
import "./SensorPage.css";

const CameraPage: React.FC = () => {
  const { photoDataUrl, loading, error, getPhoto } = useCamera();

  return (
    <SensorPageLayout title="Camara">
      <div className="sensor-actions">
        <IonButton expand="block" onClick={() => void getPhoto()}>
          Tomar o seleccionar foto
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
          <IonCardTitle>Preview</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {photoDataUrl ? (
            <IonImg src={photoDataUrl} alt="Foto capturada" />
          ) : (
            <p>No hay imagen seleccionada.</p>
          )}
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default CameraPage;
