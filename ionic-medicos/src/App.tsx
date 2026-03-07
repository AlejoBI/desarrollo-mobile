import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Tabs from "./Tabs";
import { storageService } from "./services/storageService";
import { useAuth } from "./hooks/useAuth";
import type { Visita, Paciente } from "./types";

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

const visitasMock: Visita[] = [
  {
    id: "1",
    pacienteId: "p1",
    pacienteNombre: "Juan Pérez",
    medicoId: "1",
    fecha: new Date().toISOString().split("T")[0],
    hora: "09:00",
    motivo: "Control de presión arterial",
    direccion: "Calle 10 #20-30, Apto 501",
    estado: "pendiente",
  },
  {
    id: "2",
    pacienteId: "p2",
    pacienteNombre: "María González",
    medicoId: "1",
    fecha: new Date().toISOString().split("T")[0],
    hora: "10:30",
    motivo: "Revisión post-operatoria",
    direccion: "Carrera 5 #15-20",
    estado: "pendiente",
  },
  {
    id: "3",
    pacienteId: "p3",
    pacienteNombre: "Carlos Rodríguez",
    medicoId: "1",
    fecha: new Date().toISOString().split("T")[0],
    hora: "14:00",
    motivo: "Consulta general",
    direccion: "Av. Principal #45-67",
    estado: "pendiente",
  },
  {
    id: "4",
    pacienteId: "p4",
    pacienteNombre: "Ana Martínez",
    medicoId: "1",
    fecha: new Date().toISOString().split("T")[0],
    hora: "16:00",
    motivo: "Control de diabetes",
    direccion: "Calle 25 #10-15, Casa 3",
    estado: "pendiente",
  },
];

const pacientesMock: Paciente[] = [
  {
    id: "p1",
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    telefono: "3001234567",
    direccion: "Calle 10 #20-30, Apto 501",
  },
  {
    id: "p2",
    nombre: "María",
    apellido: "González",
    dni: "87654321",
    telefono: "3009876543",
    direccion: "Carrera 5 #15-20",
  },
  {
    id: "p3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    dni: "45678912",
    telefono: "3004567891",
    direccion: "Av. Principal #45-67",
  },
  {
    id: "p4",
    nombre: "Ana",
    apellido: "Martínez",
    dni: "78912345",
    telefono: "3007891234",
    direccion: "Calle 25 #10-15, Casa 3",
  },
];

const App: React.FC = () => {
  const { medico, login, logout } = useAuth();
  const [visitas, setVisitas] = useState<Visita[]>([]);

  useEffect(() => {
    const visitasGuardadas = storageService.obtenerVisitas();
    if (visitasGuardadas.length === 0) {
      storageService.guardarVisitas(visitasMock);
      setVisitas(visitasMock);
    } else {
      setVisitas(visitasGuardadas);
    }

    const pacientesGuardados = storageService.obtenerPacientes();
    if (pacientesGuardados.length === 0) {
      storageService.guardarPacientes(pacientesMock);
    }
  }, []);

  const handleActualizarVisitas = (visitasActualizadas: Visita[]) => {
    setVisitas(visitasActualizadas);
    storageService.guardarVisitas(visitasActualizadas);
  };

  const visitasPendientesCount = visitas.filter(
    (v) => v.estado === "pendiente",
  ).length;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <LoginPage onLogin={login} />
          </Route>
          <Route path="/tabs">
            {medico ? (
              <Tabs
                medico={medico}
                visitas={visitas}
                visitasPendientesCount={visitasPendientesCount}
                onActualizarVisitas={handleActualizarVisitas}
                onLogout={logout}
              />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/">
            <Redirect to={medico ? "/tabs" : "/login"} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
