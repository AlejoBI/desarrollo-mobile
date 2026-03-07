import type { Usuario } from "../types";

export const usuariosMock: Usuario[] = [
  {
    email: "recepcion@medicare.com",
    password: "1234",
    nombre: "Laura Perez",
    rol: "recepcionista",
    avatar: "/nina.png",
  },
  {
    email: "medico@medicare.com",
    password: "1234",
    nombre: "Dr Juan Lopez",
    rol: "medico",
  },
];

export function login(email: string, password: string): Usuario | null {
  const user = usuariosMock.find(
    (u) => u.email === email && u.password === password,
  );

  return user ?? null;
}
