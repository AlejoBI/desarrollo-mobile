import { IonSpinner, IonText } from "@ionic/react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <IonSpinner
        name="crescent"
        color="primary"
        className="custom-spinner"
        aria-hidden="true"
      />
      <IonText color="medium">
        <div className="loader-text">Cargando contactos...</div>
      </IonText>
    </div>
  );
};

export default Loader;
