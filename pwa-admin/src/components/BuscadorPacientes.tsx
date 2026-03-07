interface Props {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export default function BuscadorPacientes({ busqueda, setBusqueda }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}
