import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
} from "@ionic/react";
import { useState, useEffect } from "react";
import type { Paciente } from "../types";
import { storageService } from "../services/storageService";

const MisPacientesPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const pacientesGuardados = storageService.obtenerPacientes();
    setPacientes(pacientesGuardados);
  }, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={busqueda}
          onIonInput={(e) => setBusqueda(e.detail.value!)}
          placeholder="Buscar paciente..."
        />

        <IonList>
          {pacientesFiltrados.length === 0 ? (
            <IonItem>
              <IonLabel className="ion-text-center">
                <p>No hay pacientes registrados</p>
              </IonLabel>
            </IonItem>
          ) : (
            pacientesFiltrados.map((paciente) => (
              <IonItem key={paciente.id}>
                <IonLabel>
                  <h2>
                    {paciente.nombre} {paciente.apellido}
                  </h2>
                  <p>DNI: {paciente.dni}</p>
                  {paciente.telefono && <p>Teléfono: {paciente.telefono}</p>}
                  {paciente.direccion && <p>Dirección: {paciente.direccion}</p>}
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;
