import { ApplicationError } from '#helpers/types/application-error'
import { MethodResponse } from '#helpers/types/method-response'

export abstract class GameProtocolService {
  abstract getModes(
    videoUuid: string
  ): Promise<MethodResponse<GameProtocolService.ModesResponse | ApplicationError>>
  abstract play(videoUuid: string): Promise<MethodResponse<void | ApplicationError>>
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
