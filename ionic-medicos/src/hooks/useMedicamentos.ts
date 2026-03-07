import { useState } from "react";
import type { Medicamento } from "../types";

export function useMedicamentos() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [nombreMed, setNombreMed] = useState("");
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");

  const agregarMedicamento = () => {
    if (!nombreMed || !dosis || !frecuencia) return false;

    const nuevoMed: Medicamento = {
      id: Date.now().toString(),
      nombre: nombreMed,
      dosis,
      frecuencia,
    };

    setMedicamentos([...medicamentos, nuevoMed]);
    setNombreMed("");
    setDosis("");
    setFrecuencia("");
    return true;
  };

  const eliminarMedicamento = (id: string) => {
    setMedicamentos(medicamentos.filter((m) => m.id !== id));
  };

  const limpiarFormulario = () => {
    setNombreMed("");
    setDosis("");
    setFrecuencia("");
  };

  const limpiarCarrito = () => {
    setMedicamentos([]);
    limpiarFormulario();
  };

  return {
    medicamentos,
    nombreMed,
    setNombreMed,
    dosis,
    setDosis,
    frecuencia,
    setFrecuencia,
    agregarMedicamento,
    eliminarMedicamento,
    limpiarFormulario,
    limpiarCarrito,
  };
}
