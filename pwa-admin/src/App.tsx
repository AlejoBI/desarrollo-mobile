import { useEffect, useState } from "react";
import type { Usuario } from "./types";
import { storageService } from "./services/localSAtorageService";
import LoginForm from "./components/LoginForm";

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
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Bienvenido {usuario.nombre}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
