import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import type { NearbyPlace } from "../../services/opencageService";

interface TrackingMapCardProps {
  isConnected: boolean;
  placesLoading: boolean;
  placesError: string | null;
  mapUrl: string | null;
  mapEmbedUrl: string | null;
  nearbyPlaces: NearbyPlace[];
}

const TrackingMapCard: React.FC<TrackingMapCardProps> = ({
  isConnected,
  placesLoading,
  placesError,
  mapUrl,
  mapEmbedUrl,
  nearbyPlaces,
}) => {
  const [mapLoadError, setMapLoadError] = useState(false);

  useEffect(() => {
    setMapLoadError(false);
  }, [mapUrl]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Lugares cercanos y mapa</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {!isConnected ? (
          <IonText color="warning">
            <p>Sin conexion. No se carga direccion, lugares ni mapa.</p>
          </IonText>
        ) : null}

        {placesError ? (
          <IonText color="danger">
            <p>{placesError}</p>
          </IonText>
        ) : null}

        {mapUrl && !mapLoadError ? (
          <img
            src={mapUrl}
            alt="Mapa de ubicacion y lugares cercanos"
            className="tracking-map-image"
            loading="lazy"
            onError={() => setMapLoadError(true)}
          />
        ) : mapEmbedUrl ? (
          <iframe
            src={mapEmbedUrl}
            title="Mapa embebido de ubicacion actual"
            className="tracking-map-iframe"
            loading="lazy"
          />
        ) : (
          <IonNote>
            Obtiene ubicacion y luego carga lugares para ver el mapa.
          </IonNote>
        )}

        {mapLoadError && mapEmbedUrl ? (
          <IonText color="warning">
            <p>Mapa estatico no disponible. Mostrando mapa embebido.</p>
          </IonText>
        ) : null}

        {mapLoadError && !mapEmbedUrl ? (
          <IonText color="danger">
            <p>No fue posible cargar el mapa para esta ubicacion.</p>
          </IonText>
        ) : null}

        <IonList>
          {nearbyPlaces.map((place) => (
            <IonItem key={place.id}>
              <IonLabel>
                <h3>{place.name}</h3>
                <p>{place.formatted}</p>
                <p>{place.distanceKm.toFixed(2)} km</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {!nearbyPlaces.length && isConnected && !placesLoading ? (
          <IonNote>No hay lugares cargados todavia.</IonNote>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
};

export default TrackingMapCard;
