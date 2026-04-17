import { IonButton, IonNote } from "@ionic/react";

interface TrackingActionsProps {
  trackingEnabled: boolean;
  trackingLoading: boolean;
  manualActionsDisabled: boolean;
  isConnected: boolean;
  geolocationLoading: boolean;
  placesLoading: boolean;
  cameraLoading: boolean;
  onToggleTracking: () => void;
  onGetCurrentPosition: () => void;
  onLoadPlaces: () => void;
  onTakePhoto: () => void;
}

const TrackingActions: React.FC<TrackingActionsProps> = ({
  trackingEnabled,
  trackingLoading,
  manualActionsDisabled,
  isConnected,
  geolocationLoading,
  placesLoading,
  cameraLoading,
  onToggleTracking,
  onGetCurrentPosition,
  onLoadPlaces,
  onTakePhoto,
}) => {
  return (
    <div className="tracking-actions">
      <IonButton
        expand="block"
        color={trackingEnabled ? "danger" : "success"}
        disabled={trackingLoading}
        onClick={onToggleTracking}
      >
        {trackingEnabled
          ? "Desactivar tracking automatico"
          : "Activar tracking automatico"}
      </IonButton>

      {manualActionsDisabled ? (
        <IonNote>
          Con auto tracking activo, las acciones manuales quedan bloqueadas para
          evitar cierres de la app.
        </IonNote>
      ) : null}

      <IonButton
        expand="block"
        disabled={
          manualActionsDisabled || geolocationLoading || trackingLoading
        }
        onClick={onGetCurrentPosition}
      >
        Actualizar solo ubicacion
      </IonButton>
      <IonButton
        expand="block"
        color="tertiary"
        disabled={
          manualActionsDisabled ||
          !isConnected ||
          geolocationLoading ||
          placesLoading ||
          trackingLoading
        }
        onClick={onLoadPlaces}
      >
        Cargar direccion y lugares (API)
      </IonButton>
      <IonButton
        expand="block"
        color="secondary"
        disabled={manualActionsDisabled || cameraLoading || trackingLoading}
        onClick={onTakePhoto}
      >
        Tomar foto con watermark
      </IonButton>
    </div>
  );
};

export default TrackingActions;
