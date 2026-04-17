import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonNote,
} from "@ionic/react";

interface TrackingPhotoCardProps {
  photoDataUrl: string | null;
}

const TrackingPhotoCard: React.FC<TrackingPhotoCardProps> = ({
  photoDataUrl,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Foto con watermark de ubicacion</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {photoDataUrl ? (
          <IonImg src={photoDataUrl} alt="Foto con watermark" />
        ) : (
          <IonNote>Aun no has tomado una foto para watermark.</IonNote>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TrackingPhotoCard;
