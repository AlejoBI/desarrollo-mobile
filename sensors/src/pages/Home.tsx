import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { APP_ROUTES } from "../constants/routes";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sensors Challenge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding home-content">
        <IonCard>
          <IonCardContent>
            <h2>Challenge 08: Tracking Inteligente</h2>
            <p>
              Seguimiento automatico por movimiento, geolocalizacion en tiempo
              real, historial por dia, foto con watermark, notificaciones
              inteligentes y lugares cercanos con API externa.
            </p>

            <IonButton
              expand="block"
              className="home-main-button"
              routerLink={APP_ROUTES.TRACKING_STATUS}
            >
              Abrir tracking inteligente
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
