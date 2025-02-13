import { Genre } from "@/models/genre";
import { API } from "./api";

export const GenreService = {
  getAll: async (url: string): Promise<Genre[]> => {
    const response = await API.get(url);
  return response.data;
  }
}
