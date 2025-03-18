import { api } from "@/lib/axios";
import { Language } from "@/models/language";

export const fetchLanguages = async () => {
  return (await api.get<Language[]>("/languages")).data;
};
