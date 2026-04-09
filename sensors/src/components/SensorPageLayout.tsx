import { ReactNode } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { APP_ROUTES } from "../constants/routes";

interface SensorPageLayoutProps {
  title: string;
  children: ReactNode;
}

const SensorPageLayout: React.FC<SensorPageLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={APP_ROUTES.HOME} />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {children}
      </IonContent>
    </IonPage>
  );
};

export default SensorPageLayout;
