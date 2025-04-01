import { IGameService } from '#services/interfaces/game-service'

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

export const mockGameServiceStub = (): IGameService => ({
  play: (_: string) => Promise.resolve(),
  getModes: (_: string) => Promise.resolve(mockGameModesData.stub),
})
