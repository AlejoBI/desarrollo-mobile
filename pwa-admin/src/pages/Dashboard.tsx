import { useEffect, useState } from "react";
import type { Paciente, Usuario } from "../types";
import { storageService } from "../services/localSAtorageService";
import BuscadorPacientes from "../components/BuscadorPacientes";
import FormularioPaciente from "../components/FormularioPaciente";
import TablaPacientes from "../components/TablaPacientes";
import PerfilUsuario from "../components/PerfilUsuario";
import "./Dashboard.css";

interface Props {
  usuario: Usuario;
  onLogout: () => void;
}

export default function Dashboard({ usuario, onLogout }: Props) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteAEditar, setPacienteAEditar] = useState<Paciente | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const data = storageService.obtenerPacientes();
    setPacientes(data);
  }, []);

  const guardarPacientes = (lista: Paciente[]) => {
    setPacientes(lista);
    storageService.guardarPacientes(lista);
  };

  const agregarPaciente = (paciente: Paciente) => {
    const nuevaLista = [...pacientes, paciente];
    guardarPacientes(nuevaLista);
  };

  const editarPaciente = (paciente: Paciente) => {
    const nuevaLista = pacientes.map((p) =>
      p.id === paciente.id ? paciente : p,
    );

    guardarPacientes(nuevaLista);
    setPacienteAEditar(null);
  };

  const eliminarPaciente = (id: string) => {
    const nuevaLista = pacientes.filter((p) => p.id !== id);
    guardarPacientes(nuevaLista);
  };

  // Estado de búsqueda vive aquí (Dashboard) y no en TablaPacientes porque:
  // - Dashboard es quien tiene la lista completa de pacientes
  // - Permite reutilizar TablaPacientes con diferentes fuentes de datos
  // - Facilita agregar otros componentes que dependan del filtro (ej: contador)
  const listaFiltrada = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <div>
      <header className="dashboard-header">
        <h1>MediCare+ Admin</h1>

        <div className="user-section">
          <PerfilUsuario usuario={usuario} />
          <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <BuscadorPacientes busqueda={busqueda} setBusqueda={setBusqueda} />

      {usuario.rol !== "medico" && (
        <FormularioPaciente
          pacienteAEditar={pacienteAEditar}
          onGuardar={(paciente) => {
            if (pacienteAEditar) {
              editarPaciente(paciente);
            } else {
              agregarPaciente(paciente);
            }
          }}
        />
      )}

      {usuario.rol !== "recepcionista" && (
        <div className="estadisticas">
          <h3>Estadísticas</h3>
          <p>Total de pacientes: {pacientes.length}</p>
          <p>Pacientes filtrados: {listaFiltrada.length}</p>
        </div>
      )}

      <TablaPacientes
        pacientes={listaFiltrada}
        onEditar={(paciente) => setPacienteAEditar(paciente)}
        onEliminar={(id) => eliminarPaciente(id)}
      />
    </div>
  );
}
