import React from 'react';
import {
  IonBadge,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { AppHeader } from '../components/AppHeader';
import { useMissionContext } from '../hooks/useMissionContext';

const RankingPage: React.FC = () => {
  const { ranking, rankingLoading } = useMissionContext();

  return (
    <IonPage>
      <AppHeader title="Ranking" />
      <IonContent fullscreen className="ion-padding">
        <IonText>
          <h2>Top 5 de jugadores</h2>
        </IonText>

        {rankingLoading && <IonSpinner name="dots" />}

        {!rankingLoading && (
          <IonList>
            {ranking.map((entry, index) => (
              <IonItem key={entry.uid} color={entry.isCurrentUser ? 'light' : undefined}>
                <IonLabel>
                  <h3>
                    #{index + 1} - {entry.name}
                  </h3>
                  <p>{entry.points} puntos</p>
                </IonLabel>
                {entry.isCurrentUser && <IonBadge color="primary">Tu posicion</IonBadge>}
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RankingPage;
