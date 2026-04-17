import {
  IonAccordion,
  IonAccordionGroup,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { useMemo } from "react";
import {
  formatDateLabel,
  groupHistoryByDay,
  toDecimal,
  toPercent,
  type TrackingPoint,
} from "../../services/trackingUtils";

interface TrackingHistoryCardProps {
  fileName: string;
  fileUri: string | null;
  history: TrackingPoint[];
}

const TrackingHistoryCard: React.FC<TrackingHistoryCardProps> = ({
  fileName,
  fileUri,
  history,
}) => {
  const groupedHistory = useMemo(() => groupHistoryByDay(history), [history]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Historial por dia (JSON)</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          Archivo: <strong>{fileName}</strong>
        </p>
        <p>
          URI: <strong>{fileUri ?? "No disponible"}</strong>
        </p>

        <IonAccordionGroup>
          {groupedHistory.map(([day, points]) => (
            <IonAccordion value={day} key={day}>
              <IonItem slot="header" color="light">
                <IonLabel>
                  {day} ({points.length} registros)
                </IonLabel>
              </IonItem>
              <div className="tracking-history-day" slot="content">
                {points.map((point) => (
                  <div
                    className="tracking-history-item"
                    key={`${point.timestamp}-${point.latitude}-${point.longitude}`}
                  >
                    <p>{formatDateLabel(point.timestamp)}</p>
                    <p>
                      {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                    </p>
                    <p>
                      red: {point.connectionType} | bateria:{" "}
                      {toPercent(point.batteryLevel)} | velocidad:{" "}
                      {toDecimal(point.speed, 2)} m/s
                    </p>
                  </div>
                ))}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>

        {!groupedHistory.length ? (
          <IonNote>Sin datos de tracking todavia.</IonNote>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
};

export default TrackingHistoryCard;
