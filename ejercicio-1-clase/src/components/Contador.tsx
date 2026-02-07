import { useState } from "react";

const Contador = () => {
  const [contador, setContador] = useState(0);

  return (
    <>
      <div>Contador: {contador}</div>
      <button onClick={() => setContador(contador + 1)}>Incrementar</button>
      <button onClick={() => setContador(contador - 1)}>Decrementar</button>
    </>
  );
};

export default Contador;
