import { AxiosRequestConfig } from "axios";
import { API } from "./api";
import { Language } from "@/models/language";

export const languageService = async (params?: AxiosRequestConfig): Promise<Language[]> => {
  const response = await API.get("/languages", params);
  return response.data;
}
