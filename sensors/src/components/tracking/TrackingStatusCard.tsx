import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { formatDateLabel, toPercent } from "../../services/trackingUtils";

interface TrackingStatusCardProps {
  trackingEnabled: boolean;
  isWatching: boolean;
  isConnected: boolean;
  isMoving: boolean;
  isBatteryLow: boolean;
  batteryLevel: number | null;
  connectionType: string;
  movementDelta: number;
  lastMovementAt: number;
  historyMessage: string | null;
  errors: string[];
}

const TrackingStatusCard: React.FC<TrackingStatusCardProps> = ({
  trackingEnabled,
  isWatching,
  isConnected,
  isMoving,
  isBatteryLow,
  batteryLevel,
  connectionType,
  movementDelta,
  lastMovementAt,
  historyMessage,
  errors,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Estado de tracking</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="tracking-badges">
          <IonBadge color={trackingEnabled ? "success" : "medium"}>
            Auto tracking: {trackingEnabled ? "Activado" : "Desactivado"}
          </IonBadge>
          <IonBadge color={isWatching ? "success" : "medium"}>
            Tracking: {isWatching ? "Activo" : "Detenido"}
          </IonBadge>
          <IonBadge color={isConnected ? "success" : "danger"}>
            Red: {isConnected ? "Conectado" : "Offline"}
          </IonBadge>
          <IonBadge color={isMoving ? "success" : "warning"}>
            Movimiento: {isMoving ? "Detectado" : "Sin movimiento"}
          </IonBadge>
          <IonBadge color={isBatteryLow ? "danger" : "tertiary"}>
            Bateria: {toPercent(batteryLevel)}
          </IonBadge>
        </div>

        <p>
          Tipo de red: <strong>{connectionType}</strong>
        </p>
        <p>
          Delta de movimiento: <strong>{movementDelta.toFixed(3)}</strong>
        </p>
        <p>
          Ultimo movimiento: <strong>{formatDateLabel(lastMovementAt)}</strong>
        </p>

        {historyMessage ? (
          <IonText color="success">
            <p>{historyMessage}</p>
          </IonText>
        ) : null}

        {errors.map((errorText) => (
          <IonText color="danger" key={errorText}>
            <p>{errorText}</p>
          </IonText>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default TrackingStatusCard;
