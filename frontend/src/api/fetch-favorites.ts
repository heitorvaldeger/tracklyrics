import { api } from "@/lib/axios";
import { Video } from "@/models/video";

export const fetchFavorites = async () => {
  return (await api.get<Video[]>("/favorites")).data;
};
