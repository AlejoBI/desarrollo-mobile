import { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonText,
  IonIcon,
} from "@ionic/react";
import { trashOutline, personAddOutline } from "ionicons/icons";
import type { Contact } from "../hooks/useContacts";
import "./Contacts.css";

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (name: string, phone: string) => void;
  onDeleteContact: (id: number) => void;
}

/**
 * Componentes Ionic utilizados:
 * - IonCard: Contenedor con estilo de tarjeta
 * - IonCardHeader/Title/Subtitle: Encabezados de tarjetas
 * - IonItem: Elemento de lista o contenedor de inputs
 * - IonInput: Campo de entrada de datos
 * - IonButton: Botones con estilos de Ionic
 * - IonList: Lista de elementos
 * - IonLabel: Etiquetas de texto
 * - IonIcon: Iconos de ionicons
 */
const Contacts = ({
  contacts,
  onAddContact,
  onDeleteContact,
}: ContactsProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() && phone.trim()) {
      onAddContact(name, phone);
      setName("");
      setPhone("");
    }
  };

  return (
    <div className="contacts-container">
      <div className="page-header">
        <IonText>
          <h1 className="page-title">Contact Manager</h1>
          <p className="page-subtitle">
            Pequeño challenge: añade y elimina contactos usando Ionic
          </p>
        </IonText>
      </div>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={personAddOutline} className="title-icon" />
            Agregar Contacto
          </IonCardTitle>
          <IonCardSubtitle>
            Completa los campos para añadir un nuevo contacto
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput
                value={name}
                onIonInput={(e) => setName(e.detail.value || "")}
                type="text"
                placeholder="Ingresa el nombre"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Teléfono</IonLabel>
              <IonInput
                value={phone}
                onIonInput={(e) => setPhone(e.detail.value || "")}
                type="tel"
                placeholder="Ingresa el teléfono"
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              type="submit"
              className="add-button"
              disabled={!name.trim() || !phone.trim()}
            >
              <IonIcon slot="start" icon={personAddOutline} />
              Agregar Contacto
            </IonButton>
          </form>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Mis Contactos ({contacts.length})</IonCardTitle>
          <IonCardSubtitle>
            {contacts.length === 0
              ? "No hay contactos aún"
              : `Tienes ${contacts.length} contacto${contacts.length !== 1 ? "s" : ""} guardado${contacts.length !== 1 ? "s" : ""}`}
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent className="contacts-list-content">
          {contacts.length === 0 ? (
            <IonText color="medium" className="empty-message">
              <p>Sin contactos — agrega tu primero arriba.</p>
            </IonText>
          ) : (
            <IonList>
              {contacts.map((contact) => (
                <IonItem key={contact.id} className="contact-item">
                  <IonLabel>
                    <h2 className="contact-name">{contact.name}</h2>
                    <p className="contact-phone">{contact.phone}</p>
                  </IonLabel>

                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => onDeleteContact(contact.id)}
                    slot="end"
                    aria-label={`Eliminar ${contact.name}`}
                  >
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default Contacts;
