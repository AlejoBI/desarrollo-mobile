import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonReorderGroup,
  IonReorder,
  IonSegment,
  IonSegmentButton,
  IonAlert,
  ItemReorderEventDetail,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useVisitas } from "../hooks/useVisitas";
import type { Visita } from "../types";

interface Props {
  visitas: Visita[];
  onActualizarVisitas: (visitas: Visita[]) => void;
}

const VisitasPage: React.FC<Props> = ({ visitas, onActualizarVisitas }) => {
  const history = useHistory();
  const [showCancelarAlert, setShowCancelarAlert] = useState(false);
  const [visitaACancelar, setVisitaACancelar] = useState<Visita | null>(null);

  const {
    filtroEstado,
    setFiltroEstado,
    visitasPendientes,
    visitasOtras,
    cambiarEstado,
    cancelarVisita,
    reordenarVisitas,
    obtenerColorEstado,
    obtenerTextoEstado,
  } = useVisitas(visitas, onActualizarVisitas);

  const abrirCancelar = (visita: Visita) => {
    setVisitaACancelar(visita);
    setShowCancelarAlert(true);
  };

  const confirmarCancelacion = (motivo: string) => {
    if (visitaACancelar) {
      cancelarVisita(visitaACancelar.id, motivo);
    }
    setVisitaACancelar(null);
  };

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    const pendientes = visitas.filter((v) => v.estado === "pendiente");
    const otras = visitas.filter((v) => v.estado !== "pendiente");
    const reordenadas = event.detail.complete(pendientes);
    reordenarVisitas(reordenadas, otras);
  };

  const verDetalle = (visitaId: string) => {
    history.push(`/tabs/visitas/${visitaId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Visitas</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={filtroEstado}
            onIonChange={(e) => setFiltroEstado(e.detail.value as string)}
          >
            <IonSegmentButton value="todas">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pendientes">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="en_curso">
              <IonLabel>En curso</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finalizadas">
              <IonLabel>Finalizadas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {visitasPendientes.map((visita) => (
              <IonItemSliding key={visita.id}>
                <IonItemOptions side="start">
                  <IonItemOption
                    color="secondary"
                    onClick={() => verDetalle(visita.id)}
                  >
                    Ver detalle
                  </IonItemOption>
                </IonItemOptions>

                <IonItem>
                  <IonLabel>
                    <h2>{visita.pacienteNombre}</h2>
                    <p>{visita.direccion}</p>
                    <p>Hora: {visita.hora}</p>
                  </IonLabel>
                  <IonBadge
                    color={obtenerColorEstado(visita.estado)}
                    slot="end"
                  >
                    {obtenerTextoEstado(visita.estado)}
                  </IonBadge>
                  <IonReorder slot="end" />
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption
                    color="primary"
                    onClick={() => cambiarEstado(visita.id, "en_camino")}
                  >
                    En camino
                  </IonItemOption>
                  <IonItemOption
                    color="danger"
                    onClick={() => abrirCancelar(visita)}
                  >
                    Cancelar
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonReorderGroup>

          {visitasOtras.map((visita) => (
            <IonItemSliding key={visita.id}>
              <IonItemOptions side="start">
                <IonItemOption
                  color="secondary"
                  onClick={() => verDetalle(visita.id)}
                >
                  Ver detalle
                </IonItemOption>
              </IonItemOptions>

              <IonItem>
                <IonLabel>
                  <h2>{visita.pacienteNombre}</h2>
                  <p>{visita.direccion}</p>
                  <p>Hora: {visita.hora}</p>
                </IonLabel>
                <IonBadge color={obtenerColorEstado(visita.estado)} slot="end">
                  {obtenerTextoEstado(visita.estado)}
                </IonBadge>
              </IonItem>

              {visita.estado !== "finalizada" &&
                visita.estado !== "cancelada" && (
                  <IonItemOptions side="end">
                    {visita.estado === "en_camino" && (
                      <IonItemOption
                        color="primary"
                        onClick={() => cambiarEstado(visita.id, "en_curso")}
                      >
                        Iniciar
                      </IonItemOption>
                    )}
                    <IonItemOption
                      color="danger"
                      onClick={() => abrirCancelar(visita)}
                    >
                      Cancelar
                    </IonItemOption>
                  </IonItemOptions>
                )}
            </IonItemSliding>
          ))}
        </IonList>

        <IonAlert
          isOpen={showCancelarAlert}
          onDidDismiss={() => setShowCancelarAlert(false)}
          header="Cancelar visita"
          message={`¿Está seguro que desea cancelar la visita a ${visitaACancelar?.pacienteNombre}?`}
          inputs={[
            {
              name: "motivo",
              type: "textarea",
              placeholder: "Motivo de cancelación",
            },
          ]}
          buttons={[
            {
              text: "No",
              role: "cancel",
            },
            {
              text: "Sí, cancelar",
              handler: (data) => {
                confirmarCancelacion(data.motivo || "Sin motivo especificado");
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default VisitasPage;
