export abstract class IGameService {
  abstract getModes(videoUuid: string): Promise<IGameService.ModesResponse>
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
}
