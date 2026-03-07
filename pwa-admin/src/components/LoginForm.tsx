import { useState } from "react";
import { login } from "../utils/auth";
import type { Usuario } from "../types";

interface Props {
  onLogin: (usuario: Usuario) => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usuario = login(email, password);

    if (!usuario) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    setError("");
    onLogin(usuario);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login MediCare+</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
