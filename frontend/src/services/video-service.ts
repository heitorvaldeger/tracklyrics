import { API } from "./api";
import { Video } from "@/models/video";

export const VideoService = {
  getVideosByQueryParam: async (url: string): Promise<Video[]> => {
    const response = await API.get(url);
    return response.data;
  }
}