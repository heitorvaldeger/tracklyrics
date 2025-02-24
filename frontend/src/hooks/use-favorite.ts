import useSWR, { mutate } from "swr"
import { ENDPOINTS } from "@/constants/endpoints"
import toast from "react-hot-toast";
import { useAPI } from "@/hooks/use-api";
import { Video } from "@/models/video";
import { API_METHODS } from "@/constants/api-methods";

export const useFavorite = () => {
  const { request } = useAPI()

  const keySWR = ENDPOINTS.FAVORITES
  const { data: favorites } =
    useSWR([keySWR, API_METHODS.GET], ([url, method]) => request<Video[]>(method, url))

  const removeVideoFromFavorites = async (videoUuid: string) => {
    await request(API_METHODS.DELETE, ENDPOINTS.FAVORITES_WITH_UUID(videoUuid))
    mutate(keySWR)
    toast.success("Removed with success!")
  }

  return {
    favorites,
    removeVideoFromFavorites
  }
}