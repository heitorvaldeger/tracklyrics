import useSWR, { mutate } from "swr"
import { APIPaths } from "@/constants/api-paths"
import { useUserAuth } from "@/contexts/UserAuthContext"
import { FavoriteService } from "@/services/favorites-service"
import toast from "react-hot-toast";

export const useFavoriteViewModel = () => {
  const { token } = useUserAuth()

  const keySWR = [APIPaths.FAVORITES, token!]
  const { data: favorites } =
    useSWR(keySWR, ([url, token]) => FavoriteService.getAll(url, token!))

  const removeVideoFromFavorites = async (videoUuid: string) => {
    await FavoriteService.removeVideoFromFavorite(`${APIPaths.FAVORITES}/${videoUuid}`, token!)
    mutate(keySWR)
    toast.success("Removed with success!")
  }

  return {
    favorites,
    removeVideoFromFavorites
  }
}