export abstract class GameProtocolService {
  abstract getModes(videoUuid: string): Promise<GameProtocolService.ModesResponse>
  abstract play(videoUuid: string): Promise<void>
}

export namespace GameProtocolService {
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
}
