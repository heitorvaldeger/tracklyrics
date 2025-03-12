import { API_METHODS } from "@/constants/api-methods";
import { ENDPOINTS } from "@/constants/endpoints";
import { useAPI } from "@/hooks/use-api";
import { Genre } from "@/models/genre";
import { createContext, PropsWithChildren, useContext } from "react";
import useSWRImmutable from "swr/immutable";

interface GenreContextType {
  genres: Genre[]
}

const GenreContext = createContext({} as GenreContextType)
export const GenreProvider = ({ children }: PropsWithChildren) => {
  const { request } = useAPI()
  const { data: genres } =
    useSWRImmutable([ENDPOINTS.GENRES, API_METHODS.GET], ([url, method]) => request<Genre[]>(method, url))

  return (
    <GenreContext.Provider value={{
      genres: genres ?? [],
    }}>
      {children}
    </GenreContext.Provider>
  )
}

export const useGenre = () => {
  const context = useContext(GenreContext);

  if (!context) {
    throw new Error("useGenre must be used within a GenreProvider");
  }

  return context;
}