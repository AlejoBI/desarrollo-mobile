import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email, password);
      history.replace("/dashboard");
    } catch (registerError) {
      const message =
        registerError instanceof Error
          ? registerError.message
          : "Unable to register user.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(event) => setEmail(event.detail.value ?? "")}
                placeholder="you@example.com"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(event) => setPassword(event.detail.value ?? "")}
                placeholder="At least 6 characters"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Confirm password</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                onIonInput={(event) =>
                  setConfirmPassword(event.detail.value ?? "")
                }
                placeholder="Repeat your password"
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={handleRegister}
              disabled={isSubmitting}
            >
              Create account
            </IonButton>
            <IonButton expand="block" fill="clear" routerLink="/login">
              Already have an account? Login
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
