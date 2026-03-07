import { useState } from "react";
import type { Visita, EstadoVisita } from "../types";

export function useVisitas(
  visitas: Visita[],
  onActualizarVisitas: (visitas: Visita[]) => void,
) {
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");

  const cambiarEstado = (visitaId: string, nuevoEstado: EstadoVisita) => {
    const visitasActualizadas = visitas.map((v) =>
      v.id === visitaId ? { ...v, estado: nuevoEstado } : v,
    );
    onActualizarVisitas(visitasActualizadas);
  };

  const cancelarVisita = (visitaId: string, motivo: string) => {
    const visitasActualizadas = visitas.map((v) =>
      v.id === visitaId
        ? {
            ...v,
            estado: "cancelada" as EstadoVisita,
            motivoCancelacion: motivo,
          }
        : v,
    );
    onActualizarVisitas(visitasActualizadas);
  };

  const reordenarVisitas = (pendientes: Visita[], otras: Visita[]) => {
    onActualizarVisitas([...pendientes, ...otras]);
  };

  const visitasFiltradas = visitas.filter((v) => {
    if (filtroEstado === "todas") return true;
    if (filtroEstado === "pendientes") return v.estado === "pendiente";
    if (filtroEstado === "en_curso")
      return v.estado === "en_camino" || v.estado === "en_curso";
    if (filtroEstado === "finalizadas") return v.estado === "finalizada";
    return true;
  });

  const visitasPendientes = visitasFiltradas.filter(
    (v) => v.estado === "pendiente",
  );
  const visitasOtras = visitasFiltradas.filter((v) => v.estado !== "pendiente");

  const obtenerColorEstado = (estado: EstadoVisita): string => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "en_camino":
        return "secondary";
      case "en_curso":
        return "primary";
      case "finalizada":
        return "success";
      case "cancelada":
        return "danger";
      default:
        return "medium";
    }
  };

  const obtenerTextoEstado = (estado: EstadoVisita): string => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en_camino":
        return "En camino";
      case "en_curso":
        return "En curso";
      case "finalizada":
        return "Finalizada";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  return {
    filtroEstado,
    setFiltroEstado,
    visitasFiltradas,
    visitasPendientes,
    visitasOtras,
    cambiarEstado,
    cancelarVisita,
    reordenarVisitas,
    obtenerColorEstado,
    obtenerTextoEstado,
  };
}
