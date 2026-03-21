import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  ...rest
}) => {
  const { user, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (loading) {
          return (
            <IonPage>
              <IonContent className="ion-padding ion-text-center">
                <IonSpinner name="crescent" />
              </IonContent>
            </IonPage>
          );
        }

        if (!user) {
          return <Redirect to="/login" />;
        }

        return <>{children}</>;
      }}
    />
  );
};

export default ProtectedRoute;
