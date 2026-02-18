import { useState, useEffect } from "react";

export interface Contact {
  id: number;
  name: string;
  phone: string;
}

const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialContacts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const initialContacts: Contact[] = [
        { id: 1, name: "John Bravo", phone: "+1234567890" },
        { id: 2, name: "Sebastian Bautista", phone: "+0987654321" },
        { id: 3, name: "Carlos Manjarrez", phone: "+1122334455" },
      ];

      setContacts(initialContacts);
      setLoading(false);
    };

    loadInitialContacts();
  }, []);

  const addContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now(),
      name,
      phone,
    };
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const deleteContact = (id: number) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id),
    );
  };

  return {
    contacts,
    loading,
    addContact,
    deleteContact,
  };
};

export default useContacts;
