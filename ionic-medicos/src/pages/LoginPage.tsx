import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonToast,
  IonLoading,
  IonIcon,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { eye, eyeOff } from "ionicons/icons";
import type { Medico } from "../types";

interface Props {
  onLogin: (medico: Medico) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const medicosMock: Medico[] = [
    {
      id: "1",
      nombre: "Dr Carlos Mendez",
      email: "medico@medicare.com",
      password: "1234",
      especialidad: "Medicina General",
    },
    {
      id: "2",
      nombre: "Dra Ana Garcia",
      email: "carlos@medicare.com",
      password: "1234",
      especialidad: "Cardiología",
    },
  ];

  const handleLogin = () => {
    setShowLoading(true);

    setTimeout(() => {
      const medico = medicosMock.find(
        (m) => m.email === email && m.password === password,
      );

      setShowLoading(false);

      if (!medico) {
        setShowError(true);
        return;
      }

      onLogin(medico);
      history.push("/tabs");
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediCare+ Médicos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h2>Iniciar Sesión</h2>

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput
              type={showPassword ? "text" : "password"}
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowPassword(!showPassword)}
            >
              <IonIcon icon={showPassword ? eyeOff : eye} />
            </IonButton>
          </IonItem>

          <IonButton
            expand="block"
            onClick={handleLogin}
            className="ion-margin-top"
          >
            Ingresar
          </IonButton>
        </div>

        <IonToast
          isOpen={showError}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          onDidDismiss={() => setShowError(false)}
        />

        <IonLoading
          isOpen={showLoading}
          message="Verificando credenciales..."
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
