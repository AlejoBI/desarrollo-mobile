import { useEffect, useState } from "react";
import type { Paciente, Usuario } from "../types";
import { storageService } from "../services/localSAtorageService";
import BuscadorPacientes from "../components/BuscadorPacientes";
import FormularioPaciente from "../components/FormularioPaciente";

interface Props {
  usuario: Usuario;
}

export default function Dashboard({ usuario }: Props) {
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

  const listaFiltrada = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Bienvenid@ {usuario.nombre}</p>

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
    </div>
  );
}
