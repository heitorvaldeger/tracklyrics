import useSWR from "swr"
import { useParams } from "react-router"
import { VideoService } from "@/services/video-service"
import { useApp } from "@/contexts/AppContext"
import { APIPaths } from "@/constants/api-paths"

export const useVideoSearchViewModel = () => {
  const { genreId } = useParams()
  const { genres, currentLanguage } = useApp()

  const searchParams = new URLSearchParams()
  if (genreId) {
    searchParams.append("genreId", genreId)
  }

  if (currentLanguage) {
    searchParams.append("languageId", currentLanguage.id.toString())
  }

  const { data: videos } = useSWR([APIPaths.GET_VIDEOS, "?", searchParams.toString()].join(""), VideoService.getVideosByQueryParam)
  const genreSelected = genres.find(genre => genre.id.toString() === genreId)

  return {
    videos,
    genreSelected
  }
}