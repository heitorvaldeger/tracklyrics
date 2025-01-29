import { createSuccessResponse } from '#helpers/method-response'
import { GameProtocolService } from '#services/protocols/game-protocol-service'

export const mockGameModesData = {
  beginnerPercent: 15,
  intermediatePercent: 30,
  advancedPercent: 60,
  specialistPercent: 100,
  stub: {
    totalWords: 100,
    beginner: {
      percent: 0,
      totalFillWords: Number(((100 * 0) / 100).toFixed()),
    },
    intermediate: {
      percent: 0,
      totalFillWords: Number(((100 * 0) / 100).toFixed()),
    },
    advanced: {
      percent: 0,
      totalFillWords: Number(((100 * 0) / 100).toFixed()),
    },
    specialist: {
      percent: 0,
      totalFillWords: Number(((100 * 0) / 100).toFixed()),
    },
  },
}

export const mockGameServiceStub = (): GameProtocolService => ({
  play: (videoUuid: string) => Promise.resolve(createSuccessResponse()),
  getModes: (videoUuid: string) => Promise.resolve(createSuccessResponse(mockGameModesData.stub)),
})
