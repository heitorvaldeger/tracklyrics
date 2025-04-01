import { ILyricRepository } from '#infra/db/repository/interfaces/lyric-repository'
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

export const mockLyricRepository: ILyricRepository = {
  save: (params: ILyricRepository.LyricParamsToInsert[]) =>
    Promise.resolve({
      countLyricsInserted: 2,
    }),
  find: (videoId: number) => Promise.resolve(mockLyricFindResponseData),
}
