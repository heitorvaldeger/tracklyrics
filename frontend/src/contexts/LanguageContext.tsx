import { API_METHODS } from "@/constants/api-methods";
import { ENDPOINTS } from "@/constants/endpoints";
import { useAPI } from "@/hooks/use-api";
import { Language } from "@/models/language";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import useSWRImmutable from "swr/immutable";

interface LanguageContextType {
  languages: Language[] 
  currentLanguage?: Language | null
  handleSetLanguageClick: (languageId: number) => void
  getLanguageImage: (flagCountry?: string) => string
}

const LanguageContext = createContext({} as LanguageContextType)
export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const { request } = useAPI()
  const { data: languages } =
    useSWRImmutable([ENDPOINTS.LANGUAGES, API_METHODS.GET], ([url, method]) => request<Language[]>(method, url))
  const [ currentLanguage, setCurrentLanguage ] = useState<Language>()

  const newLanguages: Language[] = languages?.length ? [
    {
      id: 0,
      name: "All languages"
    },
    ...languages
  ] : []

  const handleSetLanguageClick = (languageId: number) => {
    setCurrentLanguage(newLanguages.find(language => language.id === languageId))
  }

  const getLanguageImage = (flagCountry?: string) => `/assets/images/flags/${flagCountry}.svg`
  
  return (
    <LanguageContext.Provider value={{
      languages: newLanguages,
      currentLanguage,
      handleSetLanguageClick,
      getLanguageImage
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}