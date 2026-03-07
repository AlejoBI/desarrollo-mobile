import type { Medico, Visita, Paciente, Receta } from "../types";

const STORAGE_KEYS = {
  MEDICO: "medicare_medico",
  VISITAS: "medicare_visitas",
  PACIENTES: "medicare_pacientes",
  RECETAS: "medicare_recetas",
};

export const storageService = {
  guardarMedico(medico: Medico) {
    localStorage.setItem(STORAGE_KEYS.MEDICO, JSON.stringify(medico));
  },

  obtenerMedico(): Medico | null {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICO);
    return data ? JSON.parse(data) : null;
  },

  limpiarMedico() {
    localStorage.removeItem(STORAGE_KEYS.MEDICO);
  },

  guardarVisitas(visitas: Visita[]) {
    localStorage.setItem(STORAGE_KEYS.VISITAS, JSON.stringify(visitas));
  },

  obtenerVisitas(): Visita[] {
    const data = localStorage.getItem(STORAGE_KEYS.VISITAS);
    return data ? JSON.parse(data) : [];
  },

  guardarPacientes(pacientes: Paciente[]) {
    localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(pacientes));
  },

  obtenerPacientes(): Paciente[] {
    const data = localStorage.getItem(STORAGE_KEYS.PACIENTES);
    return data ? JSON.parse(data) : [];
  },

  guardarRecetas(recetas: Receta[]) {
    localStorage.setItem(STORAGE_KEYS.RECETAS, JSON.stringify(recetas));
  },

  obtenerRecetas(): Receta[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECETAS);
    return data ? JSON.parse(data) : [];
  },
};
