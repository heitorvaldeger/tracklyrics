import { GameModesHash } from '#enums/game-modes-hash'

export abstract class IGameService {
  abstract getModes(videoUuid: string): Promise<IGameService.ModesResponse>
  abstract getGame(videoUuid: string, mode: GameModesHash): Promise<IGameService.GameResponse>
  abstract play(videoUuid: string): Promise<void>
}

export namespace IGameService {
  export type ModesResponse = {
    totalWords: number
    beginner: {
      percent: number
      gaps: number
    }
    intermediate: {
      percent: number
      gaps: number
    }
    advanced: {
      percent: number
      gaps: number
    }
    specialist: {
      percent: number
      gaps: number
    }
  }

  export type GameResponse = {
    gaps: number
    lyrics: {
      seq: number
      startTimeMs: number
      endTimeMs: number
      words:
        | {
            word: string
            isGap: boolean
          }[]
        | null
    }[]
  }
}
