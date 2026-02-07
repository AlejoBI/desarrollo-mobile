import "./App.css";
import Loader from "./components/Loader";
import Contacts from "./components/Contacts";
import useContacts from "./hooks/useContacts";

const App = () => {
  const { contacts, loading, addContact, deleteContact } = useContacts();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Contacts
        contacts={contacts}
        onAddContact={addContact}
        onDeleteContact={deleteContact}
      />
    </>
  );
};

export default App;
