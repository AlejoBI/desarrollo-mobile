import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useAccelerometer } from "../hooks";
import "./SensorPage.css";

const MotionPage: React.FC = () => {
  const { acceleration, orientation, isListening, error, start, stop } =
    useAccelerometer();

  return (
    <SensorPageLayout title="Motion">
      <div className="sensor-actions">
        <IonButton
          expand="block"
          color="success"
          disabled={isListening}
          onClick={() => void start()}
        >
          Iniciar listeners
        </IonButton>
        <IonButton
          expand="block"
          color="medium"
          disabled={!isListening}
          onClick={() => void stop()}
        >
          Detener listeners
        </IonButton>
      </div>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Estado</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Escuchando:{" "}
            <span className="sensor-value">{isListening ? "Si" : "No"}</span>
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
          <IonCardTitle>Acelerometro</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            x: <span className="sensor-value">{acceleration?.x ?? "-"}</span>
          </p>
          <p>
            y: <span className="sensor-value">{acceleration?.y ?? "-"}</span>
          </p>
          <p>
            z: <span className="sensor-value">{acceleration?.z ?? "-"}</span>
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Orientacion</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            alpha:{" "}
            <span className="sensor-value">{orientation?.alpha ?? "-"}</span>
          </p>
          <p>
            beta:{" "}
            <span className="sensor-value">{orientation?.beta ?? "-"}</span>
          </p>
          <p>
            gamma:{" "}
            <span className="sensor-value">{orientation?.gamma ?? "-"}</span>
          </p>
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default MotionPage;
