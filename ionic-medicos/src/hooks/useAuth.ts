import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";
import type { Medico } from "../types";

export function useAuth() {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const medicoGuardado = storageService.obtenerMedico();
    if (medicoGuardado) {
      setMedico(medicoGuardado);
    }
    setIsLoading(false);
  }, []);

  const login = (medicoData: Medico) => {
    storageService.guardarMedico(medicoData);
    setMedico(medicoData);
  };

  const logout = () => {
    storageService.limpiarMedico();
    setMedico(null);
  };

  return {
    medico,
    isAuthenticated: !!medico,
    isLoading,
    login,
    logout,
  };
}
