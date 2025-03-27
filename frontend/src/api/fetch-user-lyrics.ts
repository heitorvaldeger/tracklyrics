import { api } from "@/lib/axios";
import { Video } from "@/models/video";

export const fetchUserLyrics = async () => {
  return (await api.get<Video[]>("/user/my-lyrics")).data;
};
