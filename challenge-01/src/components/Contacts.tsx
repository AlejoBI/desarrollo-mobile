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
    <div>
      <h1>Challenge 01 - Contact Manager</h1>

      <div>
        <h2>Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit">Add Contact</button>
        </form>
      </div>

      <div>
        <h2>Contacts ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p>No contacts yet. Add your first contact above!</p>
        ) : (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <div>
                  <div>{contact.name}</div>
                  <div>{contact.phone}</div>
                </div>
                <button onClick={() => onDeleteContact(contact.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Contacts;
