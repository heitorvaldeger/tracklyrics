import { api } from "@/lib/axios";

export interface CreateVideoBody {
  title: string;
  artist: string;
  releaseYear: string;
  linkYoutube: string;
  languageId: number | string;
  genreId: number | string;
}
export const createVideo = async (body: CreateVideoBody) => {
  await api.post(`/videos`, body);
};
