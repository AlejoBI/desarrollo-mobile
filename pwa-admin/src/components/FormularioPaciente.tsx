import { useEffect, useState } from "react";
import type { Paciente } from "../types";

interface Props {
  pacienteAEditar: Paciente | null;
  onGuardar: (paciente: Paciente) => void;
}

export default function FormularioPaciente({
  pacienteAEditar,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (pacienteAEditar) {
      setNombre(pacienteAEditar.nombre);
      setApellido(pacienteAEditar.apellido);
      setDni(pacienteAEditar.dni);
      setTelefono(pacienteAEditar.telefono || "");
    } else {
      setNombre("");
      setApellido("");
      setDni("");
      setTelefono("");
    }
  }, [pacienteAEditar]);

  const validar = () => {
    if (!nombre.trim()) {
      return "El nombre es obligatorio";
    }

    if (!apellido.trim()) {
      return "El apellido es obligatorio";
    }

    if (!/^\d{7,8}$/.test(dni)) {
      // Solo números, entre 7 y 8 dígitos
      return "El DNI debe tener entre 7 y 8 números";
    }

    return "";
  };

  const generarId = () => {
    return crypto.randomUUID();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorValidacion = validar();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const paciente: Paciente = {
      id: pacienteAEditar ? pacienteAEditar.id : generarId(),
      nombre,
      apellido,
      dni,
      telefono,
    };

    setError("");

    onGuardar(paciente);

    if (!pacienteAEditar) {
      setNombre("");
      setApellido("");
      setDni("");
      setTelefono("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{pacienteAEditar ? "Editar Paciente" : "Nuevo Paciente"}</h3>

      <div>
        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div>
        <label>Apellido</label>
        <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
      </div>

      <div>
        <label>DNI</label>
        <input value={dni} onChange={(e) => setDni(e.target.value)} />
      </div>

      <div>
        <label>Teléfono</label>
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Guardar</button>
    </form>
  );
}
