import { APIPaths } from "@/constants/api-paths";
import { API } from "./api";
import { getUserTokenFromLocalStorage } from "@/lib/utils";
import { AxiosRequestConfig } from "axios";
import { UserFullInfo } from "@/models/user-full-info";

export const userService = async (config?: AxiosRequestConfig): Promise<UserFullInfo> => {
  const response = await API.get(APIPaths.GET_USER_FULL_INFO, {
    headers: {
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`
    },
    ...config
  });
  return response.data;
}