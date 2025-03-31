import { api } from "@/lib/axios";
import { Video } from "@/models/video";

export interface CreateVideoParams {
  videoUuid: string;
}
export const addFavorite = async ({ videoUuid }: CreateVideoParams) => {
  return (await api.post<Video>(`/favorites/${videoUuid}`)).data;
};
