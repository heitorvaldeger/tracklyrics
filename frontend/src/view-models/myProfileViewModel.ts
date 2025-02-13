import useSWR from "swr"
import { APIPaths } from "@/constants/api-paths"
import { useUserAuth } from "@/contexts/UserAuthContext"
import { UserService } from "@/services/user-service"

export const useMyProfileViewModel = () => {
  const { token } = useUserAuth()
  const { data: userFullInfo } =
    useSWR([APIPaths.GET_USER_FULL_INFO, token], ([url, token]) => UserService.getUserFullInfo(url, token!))

  const userNameInitials = `${userFullInfo?.firstName.at(0)}${userFullInfo?.lastName.at(0)}`

  return {
    userFullInfo,
    userNameInitials
  }
}