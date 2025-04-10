import { api } from "@/lib/axios";
import { GameModesHash } from "@/models/game-modes";

interface FetchGameModesParams {
  videoUuid: string;
  mode: GameModesHash;
}

export const fetchGame = async ({ videoUuid, mode }: FetchGameModesParams) => {
  return (await api.get<any[]>(`/game/${videoUuid}/play/${mode}`)).data;
};
