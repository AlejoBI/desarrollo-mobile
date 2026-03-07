import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonImg,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import type { Medico } from "../types";

interface Props {
  medico: Medico;
  onLogout: () => void;
}

const PerfilMedicoPage: React.FC<Props> = ({ medico, onLogout }) => {
  const history = useHistory();

  const obtenerIniciales = () => {
    const partes = medico.nombre.split(" ");
    return partes
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    onLogout();
    history.push("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              {medico.avatar ? (
                <IonAvatar
                  style={{ width: "100px", height: "100px", margin: "0 auto" }}
                >
                  <IonImg src={medico.avatar} alt="avatar" />
                </IonAvatar>
              ) : (
                <IonAvatar
                  style={{ width: "100px", height: "100px", margin: "0 auto" }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#0C2340",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "2rem",
                    }}
                  >
                    {obtenerIniciales()}
                  </div>
                </IonAvatar>
              )}
            </div>
            <IonCardTitle style={{ textAlign: "center" }}>
              {medico.nombre}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>
                <h3>Email</h3>
                <p>{medico.email}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Especialidad</h3>
                <p>{medico.especialidad}</p>
              </IonLabel>
            </IonItem>

            <IonButton
              expand="block"
              color="danger"
              onClick={handleLogout}
              className="ion-margin-top"
            >
              Cerrar Sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PerfilMedicoPage;
