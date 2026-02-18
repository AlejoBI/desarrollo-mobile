import { useState } from "react";
import type { Contact } from "../hooks/useContacts";

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (name: string, phone: string) => void;
  onDeleteContact: (id: number) => void;
}

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
    <main className="app-container">
      <header className="app-header">
        <h1>Contact Manager</h1>
        <p className="sub">Pequeño challenge: añade y elimina contactos</p>
      </header>

      <section className="panel">
        <h2 className="section-title">Agregar contacto</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              className="input"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              type="tel"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit">
              Agregar
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2 className="section-title">Contactos ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p className="muted">Sin contactos — agrega tu primero arriba.</p>
        ) : (
          <ul className="contacts-list">
            {contacts.map((contact) => (
              <li key={contact.id} className="contact-card">
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                </div>
                <div>
                  <button
                    className="btn danger small"
                    onClick={() => onDeleteContact(contact.id)}
                    aria-label={`Eliminar ${contact.name}`}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Contacts;
