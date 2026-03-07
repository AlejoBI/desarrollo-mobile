import "./BuscadorPacientes.css";

interface Props {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export default function BuscadorPacientes({ busqueda, setBusqueda }: Props) {
  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar paciente por nombre o DNI..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}
