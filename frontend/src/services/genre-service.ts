import { Genre } from "@/models/genre";
import { API } from "./api";
import { AxiosRequestConfig } from "axios";

export const genreService = async (params?: AxiosRequestConfig): Promise<Genre[]> => {
  const response = await API.get("/genres", params);
  return response.data;
}
