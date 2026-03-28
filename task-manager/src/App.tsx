import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ContactsProvider } from "./contexts/ContactsContext";
import { FruitsProvider } from "./contexts/FruitsContext";
import { NetworkProvider, useNetwork } from "./contexts/NetworkContext";
import { TasksProvider } from "./contexts/TasksContext";
import ContactsPage from "./pages/ContactsPage";
import DashboardPage from "./pages/DashboardPage";
import FruitsPage from "./pages/FruitsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksListPage from "./pages/TasksListPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const AuthLoading: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding ion-text-center">
      <IonSpinner name="crescent" />
    </IonContent>
  </IonPage>
);

interface GuestOnlyProps {
  children: React.ReactNode;
}

const GuestOnly: React.FC<GuestOnlyProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
};

interface OnlineOnlyProps {
  children: React.ReactNode;
}

const OnlineOnly: React.FC<OnlineOnlyProps> = ({ children }) => {
  const { isOnline } = useNetwork();

  if (!isOnline) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
};

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return <Redirect to={user ? "/dashboard" : "/login"} />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <NetworkProvider>
        <TasksProvider>
          <ContactsProvider>
            <FruitsProvider>
              <IonReactRouter>
                <IonRouterOutlet>
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <GuestOnly>
                        <LoginPage />
                      </GuestOnly>
                    )}
                  />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <GuestOnly>
                        <RegisterPage />
                      </GuestOnly>
                    )}
                  />

                  <ProtectedRoute exact path="/dashboard">
                    <DashboardPage />
                  </ProtectedRoute>
                  <ProtectedRoute exact path="/contacts">
                    <OnlineOnly>
                      <ContactsPage />
                    </OnlineOnly>
                  </ProtectedRoute>
                  <ProtectedRoute exact path="/tasks">
                    <OnlineOnly>
                      <TasksListPage />
                    </OnlineOnly>
                  </ProtectedRoute>
                  <ProtectedRoute exact path="/fruits">
                    <FruitsPage />
                  </ProtectedRoute>

                  <Route exact path="/">
                    <HomeRedirect />
                  </Route>
                  <Route>
                    <Redirect to="/" />
                  </Route>
                </IonRouterOutlet>
              </IonReactRouter>
            </FruitsProvider>
          </ContactsProvider>
        </TasksProvider>
      </NetworkProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
