import useSWR from "swr"
import { useParams } from "react-router"
import { ENDPOINTS } from "@/constants/endpoints"
import { useAPI } from "@/hooks/use-api"
import { Video } from "@/models/video"
import { API_METHODS } from "@/constants/api-methods"
import { useGenre } from "@/contexts/GenreContext"
import { useLanguage } from "@/contexts/LanguageContext"

export const useVideoSearch = () => {
  const { request } = useAPI()
  const { genreId } = useParams()
  const { genres } = useGenre()
  const { currentLanguage } = useLanguage()

  const searchParams = new URLSearchParams()
  if (genreId) {
    searchParams.append("genreId", genreId)
  }

  if (currentLanguage?.id) {
    searchParams.append("languageId", currentLanguage.id.toString())
  }

  const url = [ENDPOINTS.VIDEOS, "?", searchParams.toString()].join("")
  const { data: videos } = useSWR([url, API_METHODS.GET], ([ url, method ]) => request<Video[]>(method, url))
  const genreSelected = genres.find(genre => genre.id.toString() === genreId)

  return {
    videos,
    genreSelected
  }
}