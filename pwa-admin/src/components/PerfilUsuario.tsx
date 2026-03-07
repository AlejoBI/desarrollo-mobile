import type { Usuario } from "../types";

interface Props {
  usuario: Usuario;
}

export default function PerfilUsuario({ usuario }: Props) {
  const obtenerIniciales = () => {
    const partes = usuario.nombre.split(" ");

    const iniciales = partes
      .slice(0, 2) // Tomar solo las primeras 2 partes del nombre
      .map((p) => p[0]) // Obtener la primera letra de cada parte
      .join(""); // Unir las letras para formar las iniciales

    return iniciales.toUpperCase();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {usuario.avatar ? (
        <img
          src={usuario.avatar}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#0C2340",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {obtenerIniciales()}
        </div>
      )}

      <span>{usuario.nombre}</span>
    </div>
  );
}
