import { api } from "@/lib/axios";
import { GameModesHash } from "@/models/game-modes";

interface FetchGameModesParams {
  videoUuid: string;
  mode: GameModesHash;
}

interface GameResponse {
  gaps: number;
  lyrics: {
    seq: number;
    line: string;
    lineMasked: string;
    startTimeMs: number;
    endTimeMs: number;
    words:
      | {
          word: string;
          correctWord: string;
          isGap: boolean;
        }[]
      | null;
  }[];
}

export const fetchGame = async ({ videoUuid, mode }: FetchGameModesParams) => {
  return (await api.get<GameResponse>(`/game/${videoUuid}/play/${mode}`)).data;
};
