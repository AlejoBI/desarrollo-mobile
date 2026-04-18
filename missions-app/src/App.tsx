import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppProviders } from './context/AppProviders';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import ResultsPage from './pages/ResultsPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth">
          <AuthPage />
        </Route>
        <Route exact path="/home">
          {user ? <HomePage /> : <Redirect to="/auth" />}
        </Route>
        <Route exact path="/results">
          {user ? <ResultsPage /> : <Redirect to="/auth" />}
        </Route>
        <Route exact path="/ranking">
          {user ? <RankingPage /> : <Redirect to="/auth" />}
        </Route>
        <Route exact path="/">
          <Redirect to={user ? '/home' : '/auth'} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </IonApp>
);

export default App;
