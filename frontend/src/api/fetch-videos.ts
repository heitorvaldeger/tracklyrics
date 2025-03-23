import { api } from "@/lib/axios";
import { Video } from "@/models/video";

interface FetchVideosQuery {
  genreId?: string | null;
  languageId?: string | null;
  uuid?: string | null;
}

export const fetchVideos = async ({
  genreId,
  languageId,
  uuid,
}: FetchVideosQuery) => {
  return (
    await api.get<Video[]>("/videos", {
      params: {
        genreId,
        languageId,
        uuid,
      },
    })
  ).data;
};
