import { useState, useEffect } from "react";

const EjemploDependencia = () => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    console.log("El componente se ha montado o 'nombre' ha cambiado:", nombre);
  }, [nombre]);

  return (
    <>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribe tu nombre"
      />
      <div>Hola, {nombre}</div>
    </>
  );
};

export default EjemploDependencia;
