import { useState } from "react";
import { login } from "../utils/auth";
import type { Usuario } from "../types";
import "./LoginForm.css";

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
    <form className="login-form" onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
      <h2>MediCare+ Admin</h2>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: "red", margin: "0.5rem 0" }}>{error}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
