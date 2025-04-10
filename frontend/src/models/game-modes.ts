export enum GameModesHash {
  BEGINNER = "bm",
  INTERMEDIATE = "im",
  ADVANCED = "am",
  SPECIALIST = "sm",
}
export interface GameModes {
  totalWords: number;
  beginner: {
    percent: number;
    totalFillWords: number;
    id: GameModesHash.BEGINNER;
  };
  intermediate: {
    percent: number;
    totalFillWords: number;
    id: GameModesHash.INTERMEDIATE;
  };
  advanced: {
    percent: number;
    totalFillWords: number;
    id: GameModesHash.ADVANCED;
  };
  specialist: {
    percent: number;
    totalFillWords: number;
    id: GameModesHash.SPECIALIST;
  };
}
