export const env = (() => {
  const { VITE_API_URL, VITE_API_DELAY } = import.meta.env;

  if (typeof VITE_API_URL !== "string")
    throw new Error("VITE_API_URL deve ser uma string.");

  let url: URL;
  try {
    url = new URL(VITE_API_URL);
    if (url.hostname !== "localhost") throw 0;
  } catch {
    throw new Error(
      'VITE_API_URL deve ser uma URL válida com host "localhost".',
    );
  }

  const delay =
    VITE_API_DELAY === undefined
      ? false
      : VITE_API_DELAY === true ||
        String(VITE_API_DELAY).toLowerCase() === "true";

  return { VITE_API_URL, VITE_API_DELAY: delay };
})();
