import { api } from "@/lib/axios";
import { Language } from "@/models/language";

export const fetchLanguages = async (): Promise<Language[]> => {
  return (await api.get("/languages")).data;
};
