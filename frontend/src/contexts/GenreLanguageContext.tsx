import { Genre } from "@/models/genre";
import { Language } from "@/models/language";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface GenreLanguageContextType {
  genres: Genre[]
  languages: Language[] 
  currentLanguage?: Language | null
  setGenresList: (genres: Genre[]) => void
  setLanguagesList: (languages: Language[]) => void
  setLanguageSelected: (languageId: number) => void
}

const GenreLanguageContext = createContext({} as GenreLanguageContextType)
export const GenreLanguageProvider = ({ children }: PropsWithChildren) => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null)

  const setGenresList = (genres: Genre[]) => {
    setGenres(genres)
  }

  const setLanguagesList = (languages: Language[]) => {
    setLanguages(languages)
  }

  const setLanguageSelected = (languageId: number) => {
    const language = languages.find(language => language.id === languageId)
    if (language?.id === 0 || !language) {
      setCurrentLanguage(null)
      return;
    }

    setCurrentLanguage(language)
  }

  return (
    <GenreLanguageContext.Provider value={{
      genres,
      languages,
      currentLanguage,
      setGenresList,
      setLanguagesList,
      setLanguageSelected,
    }}>
      {children}
    </GenreLanguageContext.Provider>
  )
}

export const useGenreLanguage = () => {
  const context = useContext(GenreLanguageContext);

  if (!context) {
    throw new Error("useGenreLanguge must be used within a GenreLanguageProvider");
  }

  return context;
}