import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import { calendar, people, person } from "ionicons/icons";
import VisitasPage from "./pages/VisitasPage";
import MisPacientesPage from "./pages/MisPacientesPage";
import PerfilMedicoPage from "./pages/PerfilMedicoPage";
import DetalleVisitaPage from "./pages/DetalleVisitaPage";
import type { Medico, Visita } from "./types";

interface Props {
  medico: Medico;
  visitas: Visita[];
  visitasPendientesCount: number;
  onActualizarVisitas: (visitas: Visita[]) => void;
  onLogout: () => void;
}

const Tabs: React.FC<Props> = ({
  medico,
  visitas,
  visitasPendientesCount,
  onActualizarVisitas,
  onLogout,
}) => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/visitas">
          <VisitasPage
            visitas={visitas}
            onActualizarVisitas={onActualizarVisitas}
          />
        </Route>
        <Route exact path="/tabs/visitas/:id">
          <DetalleVisitaPage
            visitas={visitas}
            onActualizarVisitas={onActualizarVisitas}
          />
        </Route>
        <Route exact path="/tabs/pacientes">
          <MisPacientesPage />
        </Route>
        <Route exact path="/tabs/perfil">
          <PerfilMedicoPage medico={medico} onLogout={onLogout} />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/visitas" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={calendar} />
          <IonLabel>Visitas</IonLabel>
          {visitasPendientesCount > 0 && (
            <IonBadge color="danger">{visitasPendientesCount}</IonBadge>
          )}
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={people} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
