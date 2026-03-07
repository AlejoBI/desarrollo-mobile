import { useEffect, useState } from "react";
import type { Usuario } from "./types";
import { storageService } from "./services/localSAtorageService";

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const user = storageService.obtenerUsuario();

    if (user) {
      setUsuario(user);
    }
  }, []);

  const handleLogout = () => {
    storageService.limpiarUsuario();
    setUsuario(null);
  };

  if (!usuario) {
    return <div>LoginPage</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Bienvenido {usuario.nombre}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
