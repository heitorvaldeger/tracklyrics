import { api } from "@/lib/axios";
import { Video } from "@/models/video";

export const fetchLyrics = async () => {
  return (await api.get<Video[]>("/user/my-lyrics")).data;
};
