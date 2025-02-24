import useSWR from "swr"
import { ENDPOINTS } from "@/constants/endpoints"
import { useAPI } from "@/hooks/use-api"
import { UserFullInfo } from "@/models/user-full-info"
import { API_METHODS } from "@/constants/api-methods"

export const useMyProfile = () => {
  const { request } = useAPI()
  const { data: userFullInfo } =
    useSWR([ENDPOINTS.USER, API_METHODS.GET], ([url, method]) => request<UserFullInfo>(method, url))

  const userNameInitials = `${userFullInfo?.firstName.at(0)}${userFullInfo?.lastName.at(0)}`

  return {
    userFullInfo,
    userNameInitials
  }
}