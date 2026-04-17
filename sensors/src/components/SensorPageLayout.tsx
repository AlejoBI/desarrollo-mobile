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
  showBackButton?: boolean;
}

const SensorPageLayout: React.FC<SensorPageLayoutProps> = ({
  title,
  children,
  showBackButton = true,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {showBackButton ? (
            <IonButtons slot="start">
              <IonBackButton defaultHref={APP_ROUTES.HOME} />
            </IonButtons>
          ) : null}
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
