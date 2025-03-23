import { createContext, PropsWithChildren, useContext } from "react";
import { useQuery } from "react-query";

import { fetchGenres } from "@/api/fetch-genres";
import { fetchLanguages } from "@/api/fetch-languages";
import { Genre } from "@/models/genre";
import { Language } from "@/models/language";

interface GenreLanguageContextType {
  genres: Genre[];
  languages: Language[];
}

const GenreLanguageContext = createContext({} as GenreLanguageContextType);
export const GenreLanguageProvider = ({ children }: PropsWithChildren) => {
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    refetchOnWindowFocus: false,
  });
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    refetchOnWindowFocus: false,
  });

  return (
    <GenreLanguageContext.Provider
      value={{
        genres: genres ?? [],
        languages: languages ?? [],
      }}
    >
      {children}
    </GenreLanguageContext.Provider>
  );
};

export const useGenreLanguage = () => {
  const context = useContext(GenreLanguageContext);

  if (!context) {
    throw new Error(
      "useGenreLanguage must be used within a GenreLanguageProvider",
    );
  }

  return context;
};
