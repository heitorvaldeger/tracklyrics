import { api } from "@/lib/axios";
import { Lyric } from "@/models/lyric";

export interface UpdateVideoBody {
  title: string;
  artist: string;
  releaseYear: string;
  linkYoutube: string;
  languageId: number | string;
  genreId: number | string;
  lyrics?: Lyric[];
}

export interface UpdateVideoEntry {
  uuid: string;
  body: UpdateVideoBody;
}

export const updateVideo = async ({ uuid, body }: UpdateVideoEntry) => {
  await api.put(`/videos/${uuid}`, body);
};
