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
    gaps: number;
    id: GameModesHash.BEGINNER;
  };
  intermediate: {
    percent: number;
    gaps: number;
    id: GameModesHash.INTERMEDIATE;
  };
  advanced: {
    percent: number;
    gaps: number;
    id: GameModesHash.ADVANCED;
  };
  specialist: {
    percent: number;
    gaps: number;
    id: GameModesHash.SPECIALIST;
  };
}
