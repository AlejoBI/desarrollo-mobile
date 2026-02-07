import { useEffect } from "react";

const EjemploMontaje = () => {
  useEffect(() => {
    console.log("El componente se ha montado");
  }, []);

  return <div>EjemploMontaje</div>;
};

export default EjemploMontaje;
