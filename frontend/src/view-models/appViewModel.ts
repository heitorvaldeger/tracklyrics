import useSWRImmutable from "swr/immutable"
import { GenreService } from "@/services/genre-service"
import { LanguageService } from "@/services/language-service"
import { APIPaths } from "@/constants/api-paths"
import { useEffect } from "react"
import { useApp } from "@/contexts/AppContext"

export const useAppViewModel = () => {
  const { data: genres } =
    useSWRImmutable(APIPaths.GET_ALL_GENRES, GenreService.getAll)
  const { data: languages } =
    useSWRImmutable(APIPaths.GET_ALL_LANGUAGES, LanguageService.getAll)
  const { setGenresList, setLanguagesList, setLanguageSelected } = useApp()

  useEffect(() => {
    if (genres) {
      setGenresList(genres)
    }
  }, [genres, setGenresList])

  useEffect(() => {
    if (languages) {
      setLanguagesList(languages)
    }
  }, [languages, setLanguagesList])

  const handleSetLanguageClick = (languageId: number) => {
    setLanguageSelected(languageId)
  }
  
  return {
    genres,
    languages,
    handleSetLanguageClick
  }
}