import {
  ILyricRepository,
  LyricResponseWithoutIds,
  LyricToInsert,
} from '#infra/db/repository/interfaces/lyric-repository'

export const mockLyricFindResponseData: LyricResponseWithoutIds[] = [
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
  save: (_: LyricToInsert[]) =>
    Promise.resolve({
      countLyricsInserted: 2,
    }),
  find: (videoId: number) => Promise.resolve(mockLyricFindResponseData),
}
