import { useEffect, useState } from "react";
import type { Usuario } from "./types";
import { storageService } from "./services/localSAtorageService";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const App = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const user = storageService.obtenerUsuario();
    if (user) {
      setUsuario(user);
    }
  }, []);

  const handleLogin = (user: Usuario) => {
    storageService.guardarUsuario(user);
    setUsuario(user);
  };

  const handleLogout = () => {
    storageService.limpiarUsuario();
    setUsuario(null);
  };

  if (!usuario) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return <Dashboard usuario={usuario} onLogout={handleLogout} />;
};

export default App;
