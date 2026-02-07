import { useState } from "react";

const Arreglos = () => {
  const [arreglo, setArreglo] = useState<number[]>([]);
  const addToArray = () => {
    setArreglo([...arreglo, Date.now()]);
  };

  return (
    <>
      <button onClick={addToArray}>Agregar fecha</button>
      {arreglo.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </>
  );
};

export default Arreglos;
