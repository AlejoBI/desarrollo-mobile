import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';
import { useMissionContext } from '../hooks/useMissionContext';

const ResultsPage: React.FC = () => {
  const { points, missions, completedCount, totalMissions, progressPercentage } =
    useMissionContext();

  const overallStatus =
    completedCount === totalMissions ? 'Desafio completado' : 'Desafio en progreso';

  return (
    <IonPage>
      <AppHeader title="Resultados" />
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText>
              <h2>Puntaje total: {points}</h2>
            </IonText>
            <IonText>
              <p>
                Misiones completadas: {completedCount}/{totalMissions}
              </p>
            </IonText>
            <IonText>
              <p>Estado general: {overallStatus}</p>
            </IonText>
            <IonText>
              <p>Avance global: {progressPercentage}%</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonList>
          {missions.map((mission) => (
            <IonItem key={mission.id}>
              <IonLabel>
                <h3>
                  Mision {mission.id}: {mission.title}
                </h3>
                <p>{mission.completed ? 'Completada' : 'Pendiente'}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ResultsPage;
