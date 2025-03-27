import { api } from "@/lib/axios";
import { Video } from "@/models/video";

export interface CreateVideoBody {
  title: string;
  artist: string;
  releaseYear: string;
  linkYoutube: string;
  languageId: number | string;
  genreId: number | string;
}
export const createVideo = async (body: CreateVideoBody) => {
  return (await api.post<Video>(`/videos`, body)).data;
};
