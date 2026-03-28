import React, { useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useFruits } from "../contexts/FruitsContext";
import { useNetwork } from "../contexts/NetworkContext";

const FruitsPage: React.FC = () => {
  const { fruits, loading, addFruit, deleteFruit } = useFruits();
  const { isOnline } = useNetwork();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      return;
    }

    await addFruit({ name, color });
    setName("");
    setColor("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Fruits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color={isOnline ? "success" : "warning"}>
          <p>
            {isOnline ? "Online mode" : "Offline mode"} - Fruits is always
            available
          </p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Fruit name</IonLabel>
          <IonInput
            value={name}
            onIonInput={(e) => setName(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Color (optional)</IonLabel>
          <IonInput
            value={color}
            onIonInput={(e) => setColor(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleAdd}>
          Add Fruit
        </IonButton>

        {loading ? (
          <IonSpinner />
        ) : fruits.length === 0 ? (
          <IonText color="medium">
            <p>No fruits yet.</p>
          </IonText>
        ) : (
          <IonList>
            {fruits.map((fruit) => (
              <IonItem key={fruit.id}>
                <IonLabel>
                  <h3>{fruit.name}</h3>
                  <p>{fruit.color}</p>
                </IonLabel>
                <IonButton
                  color="danger"
                  fill="clear"
                  onClick={() => fruit.id && deleteFruit(fruit.id)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FruitsPage;
