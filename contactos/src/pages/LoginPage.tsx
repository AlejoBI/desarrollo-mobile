import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonToast,
  IonItem,
  IonLabel,
} from "@ionic/react";
import "./LoginPage.css";
    
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const emailHarcode = "user@mail.com";
    const passwordHardcode = "123";

    if (email === emailHarcode && password === passwordHardcode) {
      localStorage.setItem("logged", "true");
      // Redirigir a home
      history.push("/home");
    } else {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <h1>Contact Manager</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>

          <form onSubmit={handleLogin} className="login-form">
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonButton expand="block" type="submit" className="login-button">
              Login
            </IonButton>
          </form>

          <div className="login-hint">
            <p>
              <strong>Credenciales de prueba:</strong>
            </p>
            <p>Email: user@mail.com</p>
            <p>Password: 123</p>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Credenciales incorrectas. Inténtalo de nuevo."
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
