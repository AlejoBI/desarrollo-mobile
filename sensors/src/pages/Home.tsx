import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  cameraOutline,
  documentTextOutline,
  locateOutline,
  notificationsCircleOutline,
  phonePortraitOutline,
  pulseOutline,
} from "ionicons/icons";
import { APP_ROUTES } from "../constants/routes";
import "./Home.css";

const sensorLinks = [
  {
    title: "Geolocation",
    route: APP_ROUTES.GEOLOCATION,
    icon: locateOutline,
  },
  {
    title: "Camera",
    route: APP_ROUTES.CAMERA,
    icon: cameraOutline,
  },
  {
    title: "Motion",
    route: APP_ROUTES.MOTION,
    icon: pulseOutline,
  },
  {
    title: "Device",
    route: APP_ROUTES.DEVICE,
    icon: phonePortraitOutline,
  },
  {
    title: "Haptics",
    route: APP_ROUTES.HAPTICS,
    icon: phonePortraitOutline,
  },
  {
    title: "Filesystem",
    route: APP_ROUTES.FILESYSTEM,
    icon: documentTextOutline,
  },
  {
    title: "Local Notifications",
    route: APP_ROUTES.LOCAL_NOTIFICATIONS,
    icon: notificationsCircleOutline,
  },
  {
    title: "Push Notifications",
    route: APP_ROUTES.PUSH_NOTIFICATIONS,
    icon: notificationsCircleOutline,
  },
];

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
            <h2>Ionic + React + Capacitor</h2>
            <p>
              Selecciona un sensor para abrir su pantalla y ejecutar la
              funcionalidad.
            </p>
          </IonCardContent>
        </IonCard>

        <div className="home-grid">
          {sensorLinks.map((sensor) => (
            <IonButton
              key={sensor.route}
              routerLink={sensor.route}
              expand="block"
              fill="outline"
              className="home-sensor-button"
            >
              <IonIcon slot="start" icon={sensor.icon} />
              {sensor.title}
            </IonButton>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
