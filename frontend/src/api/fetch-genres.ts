import { api } from "@/lib/axios";
import { Genre } from "@/models/genre";

export const fetchGenres = async () => {
  return (await api.get<Genre[]>("/genres")).data;
};
