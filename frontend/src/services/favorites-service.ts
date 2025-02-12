import { APIPaths } from "@/constants/api-paths";
import { API } from "./api";
import { getUserTokenFromLocalStorage } from "@/lib/utils";
import { AxiosRequestConfig } from "axios";
import { Video } from "@/models/video";

export const favoriteService = async (config?: AxiosRequestConfig): Promise<Video[]> => {
  const response = await API.get(APIPaths.GET_FAVORITES_BY_USER_LOGGED, {
    headers: {
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`
    },
    ...config
  });
  return response.data;
}