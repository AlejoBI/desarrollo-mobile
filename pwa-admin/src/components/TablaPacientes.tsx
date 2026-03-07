import { useState } from "react";
import type { Paciente } from "../types";
import "./TablaPacientes.css";

interface Props {
  pacientes: Paciente[];
  onEditar: (paciente: Paciente) => void;
  onEliminar: (id: string) => void;
}

export default function TablaPacientes({
  pacientes,
  onEditar,
  onEliminar,
}: Props) {
  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(
    null,
  );

  const confirmarEliminacion = () => {
    if (pacienteAEliminar) {
      onEliminar(pacienteAEliminar.id);
      setPacienteAEliminar(null);
    }
  };

  return (
    <div className="tabla-pacientes">
      <h3>Lista de Pacientes</h3>

      {pacientes.length === 0 ? (
        <p className="mensaje-vacio">
          No hay pacientes registrados
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.nombre} {p.apellido}
                </td>
                <td>{p.dni}</td>
                <td>{p.telefono || "-"}</td>
                <td>
                  <button onClick={() => onEditar(p)}>Editar</button>
                  <button onClick={() => setPacienteAEliminar(p)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pacienteAEliminar && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar a {pacienteAEliminar.nombre}{" "}
              {pacienteAEliminar.apellido}?
            </p>

            <button onClick={confirmarEliminacion}>Confirmar</button>
            <button onClick={() => setPacienteAEliminar(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
