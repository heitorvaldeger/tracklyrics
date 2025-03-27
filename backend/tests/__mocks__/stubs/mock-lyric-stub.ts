import { LyricRepository } from '#infra/db/repository/_protocols/lyric-repository'
import { LyricFindResponse } from '#models/lyric-metadata'

export const mockLyricFindResponseData: LyricFindResponse[] = [
  {
    seq: 1,
    startTime: '00:00.00',
    endTime: '00:00.00',
    line: 'any_line',
  },
  {
    seq: 2,
    startTime: '00:00.00',
    endTime: '00:00.00',
    line: 'any_line',
  },
]

export const mockLyricRepositoryStub = (): LyricRepository => ({
  save: (params: LyricRepository.LyricParamsToInsert[]) =>
    Promise.resolve({
      countLyricsInserted: 2,
    }),
  find: (videoId: number) => Promise.resolve(mockLyricFindResponseData),
})
