import React, { createContext, useContext } from "react";
import { useFirebaseContacts } from "../hooks/useFirebaseContacts";
import { Contact, ContactPayload } from "../types/contact";
import { useAuth } from "./AuthContext";

interface ContactsContextValue {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addContact: (payload: ContactPayload) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextValue | undefined>(
  undefined,
);

interface ContactsProviderProps {
  children: React.ReactNode;
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const contacts = useFirebaseContacts(user?.uid);

  return (
    <ContactsContext.Provider value={contacts}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used inside ContactsProvider");
  }

  return context;
};
