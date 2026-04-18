import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const { user, loading, login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return <Redirect to="/home" />;
  }

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo iniciar sesion');
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      await register(email.trim(), password);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo registrar');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText>
              <h2>Missions Challenge</h2>
              <p>Inicia sesion o registrate para guardar tu progreso real en Firebase.</p>
            </IonText>

            <IonItem>
              <IonLabel position="stacked">Correo</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(event) => setEmail(String(event.detail.value || ''))}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contrasena</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(event) => setPassword(String(event.detail.value || ''))}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={() => void handleLogin()}
              disabled={!email || !password}
            >
              Iniciar sesion
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => void handleRegister()}
              disabled={!email || !password}
            >
              Registrarse
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
