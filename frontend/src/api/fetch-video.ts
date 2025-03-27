import { api } from "@/lib/axios";
import { Video } from "@/models/video";

interface FetchVideosParam {
  uuid: string;
}

export const fetchVideo = async ({ uuid }: FetchVideosParam) => {
  return (await api.get<Video>(`/videos/${uuid}`)).data;
};
