import React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";
import { useNetwork } from "../contexts/NetworkContext";

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const { isOnline } = useNetwork();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Contacts Dexie</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => logout()}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color={isOnline ? "success" : "warning"}>
          <p>
            {isOnline
              ? "Online: all features enabled"
              : "Offline: only Fruits is enabled"}
          </p>
        </IonText>

        <IonCard>
          <IonCardContent>
            <h2>Contacts (Firebase Firestore)</h2>
            <p>Cloud synced. Requires connection.</p>
            <IonButton
              expand="block"
              routerLink="/contacts"
              disabled={!isOnline}
            >
              Open Contacts
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Tasks (Firebase Realtime DB)</h2>
            <p>Live updates. Requires connection.</p>
            <IonButton expand="block" routerLink="/tasks" disabled={!isOnline}>
              Open Tasks
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Fruits (Dexie IndexedDB)</h2>
            <p>Local-first. Works online/offline.</p>
            <IonButton expand="block" routerLink="/fruits">
              Open Fruits
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
