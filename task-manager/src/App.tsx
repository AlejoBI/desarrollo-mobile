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
import { TasksProvider } from "./contexts/TasksContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskFormPage from "./pages/TaskFormPage";
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
    return <Redirect to="/tasks" />;
  }

  return <>{children}</>;
};

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return <Redirect to={user ? "/tasks" : "/login"} />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <TasksProvider>
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

            <ProtectedRoute exact path="/tasks/new">
              <TaskFormPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/tasks/:id/edit">
              <TaskFormPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/tasks/detail/:id">
              <TaskDetailPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/tasks">
              <TasksListPage />
            </ProtectedRoute>

            <Route exact path="/">
              <HomeRedirect />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </TasksProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
