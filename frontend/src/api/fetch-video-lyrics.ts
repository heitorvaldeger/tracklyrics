import { api } from "@/lib/axios";
import { Lyric } from "@/models/lyric";

export interface FetchVideoLyricsParams {
  uuid: string;
}
export const fetchVideoLyrics = async ({ uuid }: FetchVideoLyricsParams) => {
  return (await api.get<Lyric[]>(`/videos/${uuid}/lyrics`)).data;
};
