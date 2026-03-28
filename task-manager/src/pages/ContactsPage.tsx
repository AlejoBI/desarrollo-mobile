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
import { useContacts } from "../contexts/ContactsContext";
import { useNetwork } from "../contexts/NetworkContext";

const ContactsPage: React.FC = () => {
  const { contacts, loading, error, addContact, deleteContact } = useContacts();
  const { isOnline } = useNetwork();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim() || !isOnline) {
      return;
    }

    await addContact({ name, phone });
    setName("");
    setPhone("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color={isOnline ? "success" : "warning"}>
          <p>
            {isOnline
              ? "Online: Contacts enabled"
              : "Offline: Contacts disabled"}
          </p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={name}
            onIonInput={(e) => setName(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Phone</IonLabel>
          <IonInput
            value={phone}
            onIonInput={(e) => setPhone(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleAdd} disabled={!isOnline}>
          Add Contact
        </IonButton>

        {loading ? (
          <IonSpinner />
        ) : error ? (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        ) : contacts.length === 0 ? (
          <IonText color="medium">
            <p>No contacts found.</p>
          </IonText>
        ) : (
          <IonList>
            {contacts.map((contact) => (
              <IonItem key={contact.id}>
                <IonLabel>
                  <h3>{contact.name}</h3>
                  <p>{contact.phone}</p>
                </IonLabel>
                <IonButton
                  color="danger"
                  fill="clear"
                  disabled={!isOnline}
                  onClick={() => deleteContact(contact.id)}
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

export default ContactsPage;
