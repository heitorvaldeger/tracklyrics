import { API } from "./api";
import { Language } from "@/models/language";

export const LanguageService = {
  getAll: async (url: string): Promise<Language[]> => {
    const response = await API.get(url);
    return response.data;
  }
}