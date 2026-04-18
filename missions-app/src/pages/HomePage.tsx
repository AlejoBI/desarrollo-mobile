import React, { useCallback } from 'react';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { useMissionContext } from '../hooks/useMissionContext';
import type { MissionId } from '../models/types';

const statusColor = (isCompleted: boolean, isLocked: boolean, inProgress: boolean): string => {
  if (isCompleted) {
    return 'success';
  }

  if (isLocked) {
    return 'medium';
  }

  if (inProgress) {
    return 'warning';
  }

  return 'primary';
};

const statusLabel = (isCompleted: boolean, isLocked: boolean, inProgress: boolean): string => {
  if (isCompleted) {
    return 'Completada';
  }

  if (isLocked) {
    return 'Bloqueada';
  }

  if (inProgress) {
    return 'En progreso';
  }

  return 'Pendiente';
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isOnline, connectionType } = useNetwork();
  const {
    loading,
    saving,
    missions,
    points,
    completedCount,
    totalMissions,
    progressPercentage,
    geolocation,
    accelerometer,
    photoEvidenceUri,
    cameraError,
    completePhotoMission,
    startMovementMission,
    stopMovementMission,
    startStationaryMission,
    stopStationaryMission,
  } = useMissionContext();

  const handleMissionAction = useCallback(
    async (missionId: MissionId, inProgress: boolean) => {
      if (missionId === 1) {
        await completePhotoMission();
        return;
      }

      if (missionId === 2) {
        if (inProgress) {
          await stopMovementMission();
          return;
        }

        await startMovementMission();
        return;
      }

      if (missionId === 3) {
        if (inProgress) {
          await stopStationaryMission();
          return;
        }

        await startStationaryMission();
      }
    },
    [
      completePhotoMission,
      startMovementMission,
      startStationaryMission,
      stopMovementMission,
      stopStationaryMission,
    ],
  );

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Missions Challenge" />
        <IonContent className="ion-padding">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="Missions Challenge" />
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText>
              <h2>{user?.displayName || 'Jugador'}</h2>
            </IonText>
            <IonText>
              <p>Puntos acumulados: {points}</p>
            </IonText>
            <IonText color={isOnline ? 'success' : 'warning'}>
              <p>
                Conexion: {isOnline ? `Online (${connectionType})` : 'Offline (guardando en Dexie)'}
              </p>
            </IonText>
            <IonText>
              <p>
                Progreso: {progressPercentage}% ({completedCount}/{totalMissions})
              </p>
            </IonText>
            <IonProgressBar value={progressPercentage / 100} />
            {saving && <IonNote color="medium">Sincronizando progreso...</IonNote>}
          </IonCardContent>
        </IonCard>

        <IonList>
          {missions.map((mission) => (
            <IonItem key={mission.id} lines="full">
              <IonLabel>
                <h2>{mission.title}</h2>
                <p>{mission.description}</p>
                <p>Puntos: {mission.points}</p>
                {mission.id === 2 && (
                  <p>Distancia maxima desde inicio: {geolocation.distanceMeters.toFixed(2)} m</p>
                )}
                {mission.id === 3 && <p>Tiempo quieto: {accelerometer.stationarySeconds}s / 10s</p>}
                {mission.id === 3 && (
                  <p>Se completa al mantener el telefono quieto por 10 segundos.</p>
                )}
              </IonLabel>
              <IonBadge color={statusColor(mission.completed, mission.locked, mission.inProgress)}>
                {statusLabel(mission.completed, mission.locked, mission.inProgress)}
              </IonBadge>
              <IonButton
                slot="end"
                size="small"
                disabled={mission.completed || mission.locked}
                onClick={() => {
                  void handleMissionAction(mission.id, mission.inProgress);
                }}
              >
                {mission.inProgress ? 'Detener' : mission.actionLabel}
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {geolocation.error && (
          <IonText color="danger">
            <p>{geolocation.error}</p>
          </IonText>
        )}

        {cameraError && (
          <IonText color="danger">
            <p>{cameraError}</p>
          </IonText>
        )}

        {photoEvidenceUri && (
          <IonCard>
            <IonCardContent>
              <IonText>
                <p>Evidencia fotografica guardada</p>
              </IonText>
              <IonImg src={photoEvidenceUri} alt="Evidencia de la mision" />
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
