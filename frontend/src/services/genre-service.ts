import { Genre } from "@/models/genre";
import { API } from "./api";
import { AxiosRequestConfig } from "axios";
import { APIPaths } from "@/constants/api-paths";

export const genreService = async (params?: AxiosRequestConfig): Promise<Genre[]> => {
  const response = await API.get(APIPaths.GET_ALL_GENRES, params);
  return response.data;
}
