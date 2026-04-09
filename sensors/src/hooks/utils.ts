export const getErrorMessage = (
  error: unknown,
  fallback = "Ocurrio un error inesperado.",
): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return fallback;
};
