import { Genre } from "@/models/genre";
import { Language } from "@/models/language";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface AppContextType {
  genres: Genre[]
  languages: Language[] 
  currentLanguage?: Language
  setGenresList: (genres: Genre[]) => void
  setLanguagesList: (languages: Language[]) => void
  setLanguageSelected: (languageId: number) => void
}

const AppContext = createContext({} as AppContextType)
export const AppProvider = ({ children }: PropsWithChildren) => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<Language>()

  const setGenresList = (genres: Genre[]) => {
    setGenres(genres)
  }

  const setLanguagesList = (languages: Language[]) => {
    setLanguages(languages)
  }

  const setLanguageSelected = (languageId: number) => {
    const language = languages.find(language => language.id === languageId)
    setCurrentLanguage(language)
  }

  return (
    <AppContext.Provider value={{
      genres,
      languages,
      currentLanguage,
      setGenresList,
      setLanguagesList,
      setLanguageSelected,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("app must be used within a AppProvider");
  }

  return context;
}