import { AxiosRequestConfig } from "axios";
import { API } from "./api";
import { Language } from "@/models/language";
import { APIPaths } from "@/constants/api-paths";

export const languageService = async (params?: AxiosRequestConfig): Promise<Language[]> => {
  const response = await API.get(APIPaths.GET_ALL_LANGUAGES, params);
  return response.data;
}
