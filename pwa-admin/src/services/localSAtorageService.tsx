import type { Paciente, Usuario } from "../types/index";

const PACIENTES_KEY = "medicare_pacientes";
const USER_KEY = "medicare_user";

export const storageService = {
  guardarUsuario(usuario: Usuario) {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  },

  obtenerUsuario(): Usuario | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  limpiarUsuario() {
    localStorage.removeItem(USER_KEY);
  },

  obtenerPacientes(): Paciente[] {
    const data = localStorage.getItem(PACIENTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  guardarPacientes(pacientes: Paciente[]) {
    localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes));
  },
};
