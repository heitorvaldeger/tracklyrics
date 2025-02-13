import { APIPaths } from "@/constants/api-paths";
import { API } from "./api";
import { getUserTokenFromLocalStorage } from "@/lib/utils";
import { AxiosRequestConfig } from "axios";
import { Video } from "@/models/video";

export const favoriteService = async (config?: AxiosRequestConfig): Promise<Video[]> => {
  const response = await API.get(APIPaths.FAVORITES, {
    headers: {
      Authorization: `Bearer ${getUserTokenFromLocalStorage()}`
    },
    ...config
  });
  return response.data;
}

export const FavoriteService = {
  getAll: async (url: string, token: string): Promise<Video[]> => {
    const response = await API.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  },
  removeVideoFromFavorite: async (url: string, token: string) => {
    const response = await API.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  }
}