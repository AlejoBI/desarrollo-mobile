import React from 'react';
import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { logout } = useAuth();

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton routerLink="/home">Misiones</IonButton>
          <IonButton routerLink="/results">Resultados</IonButton>
          <IonButton routerLink="/ranking">Ranking</IonButton>
          <IonButton
            onClick={() => {
              void logout();
            }}
          >
            Salir
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
