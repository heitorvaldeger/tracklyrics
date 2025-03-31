import { api } from "@/lib/axios";
import { GameModes } from "@/models/game-modes";

interface FetchGameModesParams {
  videoUuid: string;
}

export const fetchGameModes = async ({ videoUuid }: FetchGameModesParams) => {
  return (await api.get<GameModes>(`/game/${videoUuid}/modes`)).data;
};
