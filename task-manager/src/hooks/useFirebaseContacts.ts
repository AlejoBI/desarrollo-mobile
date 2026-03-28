import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Contact, ContactPayload } from "../types/contact";

const CONTACTS_COLLECTION = "contacts";

export const useFirebaseContacts = (userId?: string) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setContacts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const contactsRef = collection(db, CONTACTS_COLLECTION);
    const contactsQuery = query(contactsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      contactsQuery,
      (snapshot) => {
        const nextContacts = snapshot.docs.map((item) => {
          const data = item.data() as Omit<Contact, "id">;
          return {
            id: item.id,
            ...data,
          };
        });

        setContacts(nextContacts);
        setLoading(false);
      },
      (snapshotError) => {
        const message =
          snapshotError instanceof Error
            ? snapshotError.message
            : "Unable to load contacts.";
        setError(message);
        setContacts([]);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const addContact = useCallback(
    async (payload: ContactPayload) => {
      if (!userId) {
        throw new Error("No authenticated user.");
      }

      await addDoc(collection(db, CONTACTS_COLLECTION), {
        userId,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
      });
    },
    [userId],
  );

  const deleteContact = useCallback(async (contactId: string) => {
    const contactRef = doc(db, CONTACTS_COLLECTION, contactId);
    await deleteDoc(contactRef);
  }, []);

  return { contacts, loading, error, addContact, deleteContact };
};
