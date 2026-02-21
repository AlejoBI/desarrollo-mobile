import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Loader from "../components/Loader";
import Contacts from "../components/Contacts";
import useContacts from "../hooks/useContacts";
import "./Home.css";

/**
 * - IonPage: Contenedor principal de la página
 * - IonHeader: Barra superior con el título
 * - IonToolbar: Barra de herramientas dentro del header
 * - IonContent: Área de contenido scrollable de la página
 */
const Home: React.FC = () => {
  const { contacts, loading, addContact, deleteContact } = useContacts();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contact Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Contact Manager</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading ? (
          <Loader />
        ) : (
          <Contacts
            contacts={contacts}
            onAddContact={addContact}
            onDeleteContact={deleteContact}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
