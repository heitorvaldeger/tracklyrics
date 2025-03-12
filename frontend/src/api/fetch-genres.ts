import { api } from "@/lib/axios";
import { Genre } from "@/models/genre";

export const fetchGenres = async (): Promise<Genre[]> => {
  return (await api.get("/genres")).data;
};
