export type Rol = "recepcionista" | "medico";

export interface Usuario {
  email: string;
  password: string;
  nombre: string;
  rol: Rol;
  avatar?: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
}
