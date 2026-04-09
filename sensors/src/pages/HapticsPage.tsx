import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import SensorPageLayout from "../components/SensorPageLayout";
import { useHaptics } from "../hooks";
import "./SensorPage.css";

const HapticsPage: React.FC = () => {
  const { error, impact, notify, vibrate, selection } = useHaptics();

  return (
    <SensorPageLayout title="Haptics">
      <div className="sensor-actions">
        <IonButton expand="block" onClick={() => void impact("LIGHT")}>
          Impacto LIGHT
        </IonButton>
        <IonButton expand="block" onClick={() => void impact("MEDIUM")}>
          Impacto MEDIUM
        </IonButton>
        <IonButton expand="block" onClick={() => void impact("HEAVY")}>
          Impacto HEAVY
        </IonButton>
        <IonButton
          expand="block"
          color="success"
          onClick={() => void notify("SUCCESS")}
        >
          Notification SUCCESS
        </IonButton>
        <IonButton
          expand="block"
          color="warning"
          onClick={() => void notify("WARNING")}
        >
          Notification WARNING
        </IonButton>
        <IonButton
          expand="block"
          color="danger"
          onClick={() => void notify("ERROR")}
        >
          Notification ERROR
        </IonButton>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => void vibrate(350)}
        >
          Vibrar 350ms
        </IonButton>
        <IonButton
          expand="block"
          color="medium"
          onClick={() => void selection()}
        >
          Selection feedback
        </IonButton>
      </div>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Estado</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : (
            <p>Listo para enviar feedback haptico.</p>
          )}
        </IonCardContent>
      </IonCard>
    </SensorPageLayout>
  );
};

export default HapticsPage;
