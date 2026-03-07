import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonBadge,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMedicamentos } from "../hooks/useMedicamentos";
import type { Visita } from "../types";

interface Props {
  visitas: Visita[];
  onActualizarVisitas: (visitas: Visita[]) => void;
}

const DetalleVisitaPage: React.FC<Props> = ({
  visitas,
  onActualizarVisitas,
}) => {
  const { id } = useParams<{ id: string }>();
  const visita = visitas.find((v) => v.id === id);
  const [notas, setNotas] = useState(visita?.notas || "");

  const {
    medicamentos,
    nombreMed,
    setNombreMed,
    dosis,
    setDosis,
    frecuencia,
    setFrecuencia,
    agregarMedicamento,
    eliminarMedicamento,
  } = useMedicamentos();

  useEffect(() => {
    if (
      visita &&
      visita.estado !== "pendiente" &&
      visita.estado !== "cancelada"
    ) {
      setNotas(visita.notas || "");
    }
  }, [visita]);

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/visitas" />
            </IonButtons>
            <IonTitle>Visita no encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>La visita no existe o fue eliminada.</p>
        </IonContent>
      </IonPage>
    );
  }

  const finalizarVisita = () => {
    const visitasActualizadas = visitas.map((v) =>
      v.id === id ? { ...v, estado: "finalizada" as const, notas } : v,
    );
    onActualizarVisitas(visitasActualizadas);

    // Guardar receta en localStorage
    const recetas = JSON.parse(
      localStorage.getItem("medicare_recetas") || "[]",
    );
    recetas.push({
      visitaId: id,
      medicamentos,
      fecha: new Date().toISOString(),
    });
    localStorage.setItem("medicare_recetas", JSON.stringify(recetas));
  };

  const obtenerColorEstado = (estado: string) => {
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/visitas" />
          </IonButtons>
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{visita.pacienteNombre}</IonCardTitle>
            <IonBadge color={obtenerColorEstado(visita.estado)}>
              {visita.estado}
            </IonBadge>
          </IonCardHeader>
          <IonCardContent>
            <p>
              <strong>Dirección:</strong> {visita.direccion}
            </p>
            <p>
              <strong>Hora:</strong> {visita.hora}
            </p>
            <p>
              <strong>Motivo:</strong> {visita.motivo}
            </p>
            {visita.motivoCancelacion && (
              <p>
                <strong>Motivo cancelación:</strong> {visita.motivoCancelacion}
              </p>
            )}
          </IonCardContent>
        </IonCard>

        {visita.estado !== "finalizada" && visita.estado !== "cancelada" && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Receta Médica</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="stacked">Medicamento</IonLabel>
                  <IonInput
                    value={nombreMed}
                    onIonInput={(e) => setNombreMed(e.detail.value!)}
                    placeholder="Ej: Ibuprofeno"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Dosis</IonLabel>
                  <IonInput
                    value={dosis}
                    onIonInput={(e) => setDosis(e.detail.value!)}
                    placeholder="Ej: 400mg"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Frecuencia</IonLabel>
                  <IonInput
                    value={frecuencia}
                    onIonInput={(e) => setFrecuencia(e.detail.value!)}
                    placeholder="Ej: Cada 8 horas"
                  />
                </IonItem>
                <IonButton
                  expand="block"
                  onClick={agregarMedicamento}
                  className="ion-margin-top"
                >
                  Agregar Medicamento
                </IonButton>

                {medicamentos.length > 0 && (
                  <IonList className="ion-margin-top">
                    <IonItem>
                      <IonLabel>
                        <strong>Medicamentos agregados:</strong>
                      </IonLabel>
                    </IonItem>
                    {medicamentos.map((med) => (
                      <IonItem key={med.id}>
                        <IonLabel>
                          <h3>{med.nombre}</h3>
                          <p>Dosis: {med.dosis}</p>
                          <p>Frecuencia: {med.frecuencia}</p>
                        </IonLabel>
                        <IonButton
                          fill="clear"
                          color="danger"
                          onClick={() => eliminarMedicamento(med.id)}
                        >
                          Eliminar
                        </IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Notas de la Visita</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonTextarea
                  value={notas}
                  onIonInput={(e) => setNotas(e.detail.value!)}
                  placeholder="Observaciones, diagnóstico, indicaciones..."
                  rows={6}
                />
              </IonCardContent>
            </IonCard>

            <IonButton
              expand="block"
              color="success"
              onClick={finalizarVisita}
              className="ion-margin-top"
            >
              Finalizar Visita
            </IonButton>
          </>
        )}

        {visita.estado === "finalizada" && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Notas de la Visita</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{visita.notas || "Sin notas"}</p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetalleVisitaPage;
