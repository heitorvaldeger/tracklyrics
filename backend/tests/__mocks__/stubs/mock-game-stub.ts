import { IGameService } from '#services/interfaces/game-service'

export const mockGameModesData = {
  totalWords: 100,
  beginner: {
    percent: 0,
    gaps: Number(((100 * 0) / 100).toFixed()),
  },
  intermediate: {
    percent: 0,
    gaps: Number(((100 * 0) / 100).toFixed()),
  },
  advanced: {
    percent: 0,
    gaps: Number(((100 * 0) / 100).toFixed()),
  },
  specialist: {
    percent: 0,
    gaps: Number(((100 * 0) / 100).toFixed()),
  },
}

export const mockGameServiceStub = (): IGameService => ({
  play: (_: string) => Promise.resolve(),
  getGame: (_, __) =>
    Promise.resolve({
      gaps: 0,
      lyrics: [],
    }),
  getModes: (_: string) => Promise.resolve(mockGameModesData),
})
