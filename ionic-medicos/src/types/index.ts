export interface Medico {
  id: string;
  nombre: string;
  email: string;
  password: string;
  especialidad: string;
  avatar?: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
}

export type EstadoVisita =
  | "pendiente"
  | "en_camino"
  | "en_curso"
  | "finalizada"
  | "cancelada";

export interface Visita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  fecha: string;
  hora: string;
  motivo: string;
  direccion: string;
  estado: EstadoVisita;
  notas?: string;
  motivoCancelacion?: string;
}

export interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
}

export interface Receta {
  visitaId: string;
  medicamentos: Medicamento[];
}
