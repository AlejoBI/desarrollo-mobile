import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { formatDateLabel, toDecimal } from "../../services/trackingUtils";

interface TrackingLocationCardProps {
  latitude: number | undefined;
  longitude: number | undefined;
  accuracy: number | undefined;
  speed: number | null | undefined;
  timestamp: number | undefined;
  address: string | null;
}

const TrackingLocationCard: React.FC<TrackingLocationCardProps> = ({
  latitude,
  longitude,
  accuracy,
  speed,
  timestamp,
  address,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Ubicacion actual</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          Latitud: <strong>{toDecimal(latitude)}</strong>
        </p>
        <p>
          Longitud: <strong>{toDecimal(longitude)}</strong>
        </p>
        <p>
          Precision: <strong>{toDecimal(accuracy, 2)}</strong>
        </p>
        <p>
          Velocidad: <strong>{toDecimal(speed, 2)} m/s</strong>
        </p>
        <p>
          Timestamp:{" "}
          <strong>{timestamp ? formatDateLabel(timestamp) : "-"}</strong>
        </p>
        <p>
          Direccion: <strong>{address ?? "No disponible"}</strong>
        </p>
      </IonCardContent>
    </IonCard>
  );
};

export default TrackingLocationCard;
