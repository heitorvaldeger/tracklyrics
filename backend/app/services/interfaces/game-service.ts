import { GameModesHash } from '#enums/game-modes-hash'

export abstract class IGameService {
  abstract getModes(videoUuid: string): Promise<IGameService.ModesResponse>
  abstract getGame(videoUuid: string, mode: GameModesHash): Promise<IGameService.GameResponse[]>
  abstract play(videoUuid: string): Promise<void>
}

export namespace IGameService {
  export type ModesResponse = {
    totalWords: number
    beginner: {
      percent: number
      totalFillWords: number
    }
    intermediate: {
      percent: number
      totalFillWords: number
    }
    advanced: {
      percent: number
      totalFillWords: number
    }
    specialist: {
      percent: number
      totalFillWords: number
    }
  }

  export type GameResponse = {
    seq: number
    line: string
    lineMasked: string
    startTimeMs: number
    endTimeMs: number
    words:
      | {
          word: string
          correctWord: string
          isGap: boolean
        }[]
      | null
  }
}
